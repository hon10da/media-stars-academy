// Dedicated setup script for real Department and Service data.
// Safe to run multiple times: uses slug-based upsert, never duplicates or deletes.
// Run with: npm run seed:departments

import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'

import Department from '../models/Department.js'
import Service from '../models/Service.js'

// Real department names as provided by the academy. Do not rename.
const DEPARTMENTS_DATA = [
  { name: 'قسم الصحة النفسية', slug: 'mental-health', order: 1 },
  { name: 'قسم الإعلام', slug: 'media', order: 2 },
  { name: 'قسم التنمية البشرية', slug: 'human-development', order: 3 },
]

// Real service names as provided by the academy, grouped by department slug.
const SERVICES_DATA = [
  // قسم الصحة النفسية
  {
    name: 'إرشاد أسري',
    slug: 'family-counseling',
    departmentSlug: 'mental-health',
    order: 1,
  },
  {
    name: 'تنمية مهارات',
    slug: 'skills-development',
    departmentSlug: 'mental-health',
    order: 2,
  },
  {
    name: 'تعديل سلوك',
    slug: 'behavior-modification',
    departmentSlug: 'mental-health',
    order: 3,
  },
  {
    name: 'كورسات صحة نفسية',
    slug: 'mental-health-courses',
    departmentSlug: 'mental-health',
    order: 4,
  },
  {
    name: 'تخاطب',
    slug: 'speech-therapy',
    departmentSlug: 'mental-health',
    order: 5,
  },
  {
    name: 'صعوبات تعلم',
    slug: 'learning-difficulties',
    departmentSlug: 'mental-health',
    order: 6,
  },
  {
    name: 'التربية الخاصة',
    slug: 'special-education',
    departmentSlug: 'mental-health',
    order: 7,
  },
  {
    name: 'المقاييس النفسية والتشخيص',
    slug: 'psychological-assessment',
    departmentSlug: 'mental-health',
    order: 8,
  },
  {
    name: 'برنامج التوحد',
    slug: 'autism-program',
    departmentSlug: 'mental-health',
    order: 9,
  },
  {
    name: 'مرشد نفسي',
    slug: 'psychological-counselor',
    departmentSlug: 'mental-health',
    order: 10,
  },
  {
    name: 'لايف كوتش',
    slug: 'life-coach',
    departmentSlug: 'mental-health',
    order: 11,
  },

  // قسم الإعلام
  {
    name: 'صحافة وإعلام',
    slug: 'journalism-media',
    departmentSlug: 'media',
    order: 1,
  },
  {
    name: 'كورسات إذاعة',
    slug: 'broadcasting-courses',
    departmentSlug: 'media',
    order: 2,
  },
  {
    name: 'كورسات تسويق',
    slug: 'marketing-courses',
    departmentSlug: 'media',
    order: 3,
  },
  {
    name: 'كورسات مونتاج',
    slug: 'editing-courses',
    departmentSlug: 'media',
    order: 4,
  },
  {
    name: 'ورش تمثيل للأطفال والكبار',
    slug: 'acting-workshops',
    departmentSlug: 'media',
    order: 5,
  },
  {
    name: 'ورش إخراج',
    slug: 'directing-workshops',
    departmentSlug: 'media',
    order: 6,
  },
  {
    name: 'كورس المذيع الصغير',
    slug: 'young-announcer-course',
    departmentSlug: 'media',
    order: 7,
  },

  // قسم التنمية البشرية
  {
    name: 'القيادة وإعداد القادة',
    slug: 'leadership-development',
    departmentSlug: 'human-development',
    order: 1,
  },
  {
    name: 'دبلومة TOT إعداد المدربين',
    slug: 'tot-trainers-diploma',
    departmentSlug: 'human-development',
    order: 2,
  },
  {
    name: 'برنامج القيادات الإدارية',
    slug: 'administrative-leadership-program',
    departmentSlug: 'human-development',
    order: 3,
  },
]

async function seedDepartmentsAndServices() {
  await connectDB()

  console.log('🌱 Seeding Departments and Services (safe to re-run)...')

  // Departments
  const departmentBySlug = {}

  for (const dept of DEPARTMENTS_DATA) {
    const doc = await Department.findOneAndUpdate(
      { slug: dept.slug },
      {
        name: dept.name,
        slug: dept.slug,
        order: dept.order,
        isPlaceholder: false,
        status: 'published',
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    )

    departmentBySlug[dept.slug] = doc

    console.log(`✅ Department ready: ${doc.name} (${doc.slug})`)
  }

  // Services
  let serviceCount = 0

  for (const svc of SERVICES_DATA) {
    const department = departmentBySlug[svc.departmentSlug]

    if (!department) {
      console.error(
        `❌ Skipping service "${svc.name}" — department slug "${svc.departmentSlug}" not found.`
      )
      continue
    }

    const doc = await Service.findOneAndUpdate(
      { slug: svc.slug },
      {
        name: svc.name,
        slug: svc.slug,
        departmentRef: department._id,
        order: svc.order,
        isPlaceholder: false,
        status: 'published',
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    )

    serviceCount += 1

    console.log(
      `✅ Service ready: ${doc.name} (${doc.slug}) → ${department.name}`
    )
  }

  console.log(
    `🌱 Done. ${Object.keys(departmentBySlug).length} departments, ${serviceCount} services processed.`
  )

  await mongoose.connection.close()
  process.exit(0)
}

seedDepartmentsAndServices().catch((err) => {
  console.error('❌ Department/Service seeding failed:', err)
  process.exit(1)
})