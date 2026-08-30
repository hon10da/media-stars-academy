// One-time migration: populate Program.departmentRef and Trainer.departmentRefs
// from the existing pillar/pillars values. Does NOT touch pillar/pillars.
// Does NOT assign serviceRefs — service-level assignment requires manual curation
// and cannot be safely inferred from the old pillar enum.
// Safe to re-run: skips any document whose departmentRef(s) are already correct.
// Run with: node src/seed/migratePillarsToRefs.js

import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'

import Program from '../models/Program.js'
import Trainer from '../models/Trainer.js'
import Department from '../models/Department.js'

// Mapping from the old pillar enum to the new Department slugs (see chat for rationale).
const PILLAR_TO_DEPARTMENT_SLUG = {
  media: 'media',
  mental_health: 'mental-health',
  family_counseling: 'mental-health',
  education: 'human-development',
}

async function migratePillarsToDepartmentRefs() {
  await connectDB()

  console.log('🌱 Migrating Program.pillar / Trainer.pillars → departmentRef(s)...')
  console.log('ℹ️  pillar/pillars will NOT be modified. serviceRefs will NOT be assigned.')

  const departments = await Department.find({})
  const departmentBySlug = {}
  departments.forEach((d) => {
    departmentBySlug[d.slug] = d
  })

  const missingMappings = new Set()

  // --- Programs ---
  const programs = await Program.find({})
  let programsUpdated = 0
  let programsSkipped = 0

  for (const program of programs) {
    const targetSlug = PILLAR_TO_DEPARTMENT_SLUG[program.pillar]
    const department = targetSlug ? departmentBySlug[targetSlug] : null

    if (!department) {
      missingMappings.add(`pillar="${program.pillar}" (program: ${program.slug})`)
      programsSkipped += 1
      continue
    }

    if (program.departmentRef && program.departmentRef.equals(department._id)) {
      continue // already correct — safe no-op on re-run
    }

    program.departmentRef = department._id
    await program.save()
    programsUpdated += 1
    console.log(`✅ Program "${program.title}" (${program.slug}): pillar="${program.pillar}" → ${department.name}`)
  }

  // --- Trainers ---
  const trainers = await Trainer.find({})
  let trainersUpdated = 0
  let trainersSkipped = 0

  for (const trainer of trainers) {
    const resolvedIds = []
    const resolvedNames = []

    for (const pillarValue of trainer.pillars || []) {
      const targetSlug = PILLAR_TO_DEPARTMENT_SLUG[pillarValue]
      const department = targetSlug ? departmentBySlug[targetSlug] : null

      if (!department) {
        missingMappings.add(`pillar="${pillarValue}" (trainer: ${trainer.slug})`)
        continue
      }

      if (!resolvedIds.some((id) => id.equals(department._id))) {
        resolvedIds.push(department._id)
        resolvedNames.push(department.name)
      }
    }

    if (resolvedIds.length === 0) {
      trainersSkipped += 1
      continue
    }

    const alreadySet =
      trainer.departmentRefs.length === resolvedIds.length &&
      trainer.departmentRefs.every((id) => resolvedIds.some((r) => r.equals(id)))

    if (alreadySet) {
      continue
    }

    trainer.departmentRefs = resolvedIds
    await trainer.save()
    trainersUpdated += 1
    console.log(`✅ Trainer "${trainer.name}" (${trainer.slug}): pillars=[${trainer.pillars.join(', ')}] → [${resolvedNames.join(', ')}]`)
  }

  if (missingMappings.size > 0) {
    console.log('⚠️  These pillar values could not be mapped and were skipped:')
    missingMappings.forEach((entry) => console.log(`   - ${entry}`))
  }

  console.log(`🌱 Done. Programs updated: ${programsUpdated}, skipped: ${programsSkipped}. Trainers updated: ${trainersUpdated}, skipped: ${trainersSkipped}.`)
  console.log('ℹ️  pillar/pillars untouched. serviceRefs not assigned (requires manual curation).')

  await mongoose.connection.close()
  process.exit(0)
}

migratePillarsToDepartmentRefs().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})