// Seed script — populates the database with clearly-marked PLACEHOLDER content only.
// No real trainer credentials, academy statistics, partnerships, or accreditations
// are invented here. Run with: npm run seed

import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { connectDB } from '../config/db.js'

import Program from '../models/Program.js'
import Trainer from '../models/Trainer.js'
import MediaPost from '../models/MediaPost.js'
import Testimonial from '../models/Testimonial.js'
import Admin from '../models/Admin.js'
import SiteSettings from '../models/SiteSettings.js'

async function seed() {
  await connectDB()

  console.log('🌱 Seeding database with placeholder content...')

  // --- Trainers (placeholder) ---
  await Trainer.deleteMany({})
  const trainers = await Trainer.insertMany([
    {
      name: 'اسم المدرب (تجريبي)',
      slug: 'trainer-one',
      specialty: 'مجال الإعلام',
      bio: 'نبذة تجريبية عن المدرب — سيتم استبدالها ببيانات حقيقية من لوحة التحكم.',
      pillars: ['media'],
      credentials: [],
      isPlaceholder: true,
      status: 'published',
    },
    {
      name: 'اسم المدرب (تجريبي)',
      slug: 'trainer-two',
      specialty: 'الصحة النفسية',
      bio: 'نبذة تجريبية عن المدرب — سيتم استبدالها ببيانات حقيقية من لوحة التحكم.',
      pillars: ['mental_health'],
      credentials: [],
      isPlaceholder: true,
      status: 'published',
    },
    {
      name: 'اسم المدرب (تجريبي)',
      slug: 'trainer-three',
      specialty: 'الإرشاد الأسري',
      bio: 'نبذة تجريبية عن المدرب — سيتم استبدالها ببيانات حقيقية من لوحة التحكم.',
      pillars: ['family_counseling'],
      credentials: [],
      isPlaceholder: true,
      status: 'published',
    },
  ])
  console.log(`✅ Seeded ${trainers.length} placeholder trainers`)

  // --- Programs (placeholder) ---
  await Program.deleteMany({})
  const programs = await Program.insertMany([
    {
      title: 'أساسيات التقديم الإعلامي',
      slug: 'program-media-presenting',
      pillar: 'media',
      shortDescription: 'برنامج تدريبي تجريبي حول مهارات التقديم أمام الكاميرا والميكروفون.',
      duration: 'مدة تجريبية',
      level: 'جميع المستويات',
      trainerRef: trainers[0]._id,
      isFeatured: true,
      isPlaceholder: true,
      status: 'published',
    },
    {
      title: 'برنامج التوازن النفسي',
      slug: 'program-mental-wellbeing',
      pillar: 'mental_health',
      shortDescription: 'محتوى تجريبي لبرنامج توعوي في مجال الصحة النفسية.',
      duration: 'مدة تجريبية',
      level: 'جميع المستويات',
      trainerRef: trainers[1]._id,
      isFeatured: true,
      isPlaceholder: true,
      status: 'published',
    },
    {
      title: 'مهارات الإرشاد الأسري',
      slug: 'program-family-counseling',
      pillar: 'family_counseling',
      shortDescription: 'محتوى تجريبي لبرنامج في التواصل الأسري الفعال.',
      duration: 'مدة تجريبية',
      level: 'جميع المستويات',
      trainerRef: trainers[2]._id,
      isFeatured: true,
      isPlaceholder: true,
      status: 'published',
    },
    {
      title: 'مهارات التطوير الذاتي',
      slug: 'program-personal-development',
      pillar: 'education',
      shortDescription: 'محتوى تجريبي لبرنامج في التعليم والتطوير الشخصي.',
      duration: 'مدة تجريبية',
      level: 'جميع المستويات',
      trainerRef: null,
      isFeatured: true,
      isPlaceholder: true,
      status: 'published',
    },
  ])
  console.log(`✅ Seeded ${programs.length} placeholder programs`)

  // --- Media posts (placeholder) ---
  await MediaPost.deleteMany({})
  const mediaPosts = await MediaPost.insertMany([
    {
      title: 'عنوان خبر تجريبي عن نشاط الأكاديمية',
      slug: 'media-post-one',
      excerpt: 'نص تجريبي مختصر للخبر — سيتم استبداله بمحتوى إعلامي حقيقي.',
      body: 'نص تجريبي كامل للمقال — سيتم استبداله بمحتوى حقيقي عبر لوحة التحكم.',
      category: 'news',
      isPlaceholder: true,
      status: 'published',
    },
    {
      title: 'عنوان خبر تجريبي عن ورشة تدريبية',
      slug: 'media-post-two',
      excerpt: 'نص تجريبي مختصر للخبر — سيتم استبداله بمحتوى إعلامي حقيقي.',
      body: 'نص تجريبي كامل للمقال — سيتم استبداله بمحتوى حقيقي عبر لوحة التحكم.',
      category: 'article',
      isPlaceholder: true,
      status: 'published',
    },
    {
      title: 'عنوان خبر تجريبي عن فعالية إعلامية',
      slug: 'media-post-three',
      excerpt: 'نص تجريبي مختصر للخبر — سيتم استبداله بمحتوى إعلامي حقيقي.',
      body: 'نص تجريبي كامل للمقال — سيتم استبداله بمحتوى حقيقي عبر لوحة التحكم.',
      category: 'press',
      isPlaceholder: true,
      status: 'published',
    },
  ])
  console.log(`✅ Seeded ${mediaPosts.length} placeholder media posts`)

  // --- Testimonials (placeholder) ---
  await Testimonial.deleteMany({})
  const testimonials = await Testimonial.insertMany([
    {
      studentName: 'اسم المتدرب (تجريبي)',
      role: 'برنامج تجريبي',
      quote: 'نص تجريبي لتجربة أحد المتدربين — سيتم استبداله بآراء حقيقية لاحقًا.',
      isPlaceholder: true,
      status: 'published',
      order: 1,
    },
    {
      studentName: 'اسم المتدرب (تجريبي)',
      role: 'برنامج تجريبي',
      quote: 'نص تجريبي لتجربة أحد المتدربين — سيتم استبداله بآراء حقيقية لاحقًا.',
      isPlaceholder: true,
      status: 'published',
      order: 2,
    },
    {
      studentName: 'اسم المتدرب (تجريبي)',
      role: 'برنامج تجريبي',
      quote: 'نص تجريبي لتجربة أحد المتدربين — سيتم استبداله بآراء حقيقية لاحقًا.',
      isPlaceholder: true,
      status: 'published',
      order: 3,
    },
  ])
  console.log(`✅ Seeded ${testimonials.length} placeholder testimonials`)

  // --- Site settings (singleton, real contact info from the logo where confirmed) ---
  await SiteSettings.findOneAndUpdate(
    { key: 'main' },
    {
      key: 'main',
      tagline: 'نصنع نجوم الإعلام... ونبني أجيالاً واعية',
      phone: '01142742918',
      whatsappNumber: '201142742918',
      email: 'info@mediastarsacademy.com', // placeholder — replace with the real academy email
      address: '', // left empty — no real address confirmed yet
      socialLinks: {},
      homepageStats: [], // left empty until real numbers are confirmed
    },
    { upsert: true, new: true }
  )
  console.log('✅ Seeded site settings')

  // --- Admin account (from env, or safe defaults for local development) ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@mediastarsacademy.com'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'

  const existingAdmin = await Admin.findOne({ email: adminEmail })
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10)
    await Admin.create({
      name: 'مدير النظام',
      email: adminEmail,
      passwordHash,
      role: 'admin',
    })
    console.log(`✅ Created admin account: ${adminEmail}`)
    console.log('⚠️  Change this password immediately after first login in production.')
  } else {
    console.log(`ℹ️  Admin account already exists: ${adminEmail}`)
  }

  console.log('🌱 Seeding complete.')
  await mongoose.connection.close()
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
