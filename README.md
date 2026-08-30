# أكاديمية ميديا ستارز | Media Stars Academy

موقع ولوحة تحكم لأكاديمية ميديا ستارز — أكاديمية متخصصة في الإعلام، الصحة النفسية، الإرشاد الأسري، والتعليم والتطوير.

**اللغة:** عربي بالكامل (RTL)
**الحالة الحالية:** Phase 1 مكتملة (البنية الأساسية والتصميم والراوتينج والموديلز)

---

## 1. هيكل المشروع (Project Structure)

```
media-stars-academy/
├── client/                          # React + Vite frontend
│   ├── src/
│   │   ├── api/                     # axios client + endpoint functions
│   │   ├── assets/images/           # الشعار وصور الأكاديمية
│   │   ├── components/
│   │   │   ├── layout/              # Header, Footer, MainLayout, AdminLayout
│   │   │   ├── ui/                  # Button, Card, Badge, SectionHeading, PillarIcons
│   │   │   ├── sections/            # أقسام الصفحة الرئيسية (Hero, FourPillars...)
│   │   │   ├── programs/            # ProgramCard, ProgramFilterBar
│   │   │   ├── trainers/            # TrainerCard
│   │   │   ├── media/               # ArticleCard
│   │   │   └── forms/               # RegistrationForm, ContactForm, WhatsAppButton
│   │   ├── context/                 # AdminAuthContext
│   │   ├── hooks/                   # useSubmitForm
│   │   ├── lib/                     # constants.js, placeholderData.js
│   │   ├── pages/                   # كل صفحات الموقع العامة + admin/
│   │   ├── routes/                  # ProtectedRoute
│   │   ├── styles/                  # index.css (design tokens)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── server/                          # Node.js + Express + MongoDB backend
│   ├── src/
│   │   ├── config/                  # db.js, cloudinary.js
│   │   ├── models/                  # Program, Trainer, MediaPost, Testimonial,
│   │   │                             Registration, ContactMessage, Admin, SiteSettings
│   │   ├── controllers/             # auth, contact, settings, generic CRUD/public factories
│   │   ├── services/                # auth.service.js
│   │   ├── routes/
│   │   │   ├── public/              # programs, trainers, media, testimonials, contact, settings
│   │   │   └── admin/                # auth + CRUD routes (protected)
│   │   ├── middleware/               # auth, error handling, validation, rate limiting
│   │   ├── utils/                    # apiResponse, token, validationSchemas
│   │   ├── seed/                     # seed.js (placeholder data only)
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 2. المتطلبات (Requirements)

- **Node.js** v18 أو أحدث (تم التطوير والاختبار على v22)
- **npm** v10 أو أحدث
- **MongoDB** — قاعدة بيانات MongoDB Atlas (أو MongoDB محلي)
- حساب **Cloudinary** (لرفع الصور — مطلوب لاحقًا في Phase 3، اختياري الآن)

---

## 3. أوامر التثبيت (Installation)

```bash
# من جذر المشروع
cd client && npm install
cd ../server && npm install
```

---

## 4. تشغيل الفرونت إند (Frontend)

```bash
cd client
cp .env.example .env     # ثم عدّل القيم إذا لزم
npm run dev              # تشغيل بيئة التطوير على http://localhost:5173
npm run build             # بناء نسخة الإنتاج
npm run preview           # معاينة نسخة الإنتاج المبنية
```

---

## 5. تشغيل الباك إند (Backend)

```bash
cd server
cp .env.example .env     # ثم عدّل القيم الحقيقية (MongoDB URI, JWT secret...)
npm run dev               # تشغيل بيئة التطوير (nodemon) على http://localhost:5000
npm run start              # تشغيل عادي (إنتاج)
npm run seed                # تعبئة قاعدة البيانات ببيانات تجريبية (placeholder) + حساب أدمن أولي
```

> **ملاحظة:** تشغيل السيرفر يتطلب اتصالًا فعليًا بقاعدة بيانات MongoDB عبر `MONGODB_URI` في ملف `.env`. بدون هذا المتغير سيتوقف السيرفر برسالة خطأ واضحة عمدًا (fail-fast) بدل التعليق أو الانهيار العشوائي.

---

## 6. متغيرات البيئة المطلوبة (Environment Variables)

### `client/.env`
| المتغير | الوصف |
|---|---|
| `VITE_API_URL` | رابط الـ API الخاص بالباك إند (مثال: `http://localhost:5000/api`) |

### `server/.env`
| المتغير | الوصف |
|---|---|
| `PORT` | منفذ تشغيل السيرفر (افتراضي 5000) |
| `NODE_ENV` | `development` أو `production` |
| `CLIENT_URL` | نطاق (أو نطاقات مفصولة بفاصلة) الفرونت إند المسموح بها في CORS |
| `MONGODB_URI` | رابط الاتصال بقاعدة بيانات MongoDB Atlas |
| `JWT_SECRET` | سر توقيع الـ JWT الخاص بجلسات الأدمن |
| `JWT_EXPIRES_IN` | مدة صلاحية التوكن (افتراضي `7d`) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | بيانات حساب Cloudinary لرفع الصور |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | بيانات حساب الأدمن الأول الذي ينشئه سكريبت الـ seed |

⚠️ **لا يحتوي هذا المشروع على أي أسرار أو بيانات اتصال حقيقية.** كل ملفات `.env.example` تحتوي على قيم توضيحية فقط، ويجب إنشاء ملفات `.env` فعلية بقيم حقيقية قبل التشغيل الفعلي، ويجب عدم رفعها إلى أي مستودع عام.

---

## 7. حالة Phase 1 الحالية

تم تنفيذ واختبار كل ما يلي بنجاح:

- ✅ بنية مشروع كاملة (client + server) قابلة للتوسع
- ✅ React + Vite + Tailwind CSS v4 + React Router + Framer Motion
- ✅ نظام تصميم كامل مبني على هوية اللوجو (Navy `#0F1F3D` + Metallic Gold + Off-white)
- ✅ خطوط عربية (Amiri للعناوين، Tajawal للنصوص) مع دعم RTL كامل على مستوى الموقع
- ✅ أيقونات مخصصة للمجالات الأربعة (مرسومة يدويًا بنفس روح اللوجو)
- ✅ Header (sticky + قائمة موبايل) و Footer كاملين
- ✅ جميع الصفحات العامة: الرئيسية، من نحن، البرامج (+التفاصيل)، المدربون (+التفاصيل)، الإعلام والأخبار (+التفاصيل)، تواصل معنا، سياسة الخصوصية، 404
- ✅ نماذج التسجيل والتواصل (واجهة أمامية جاهزة، متصلة ببنية الـ API)
- ✅ زر واتساب عائم بالرقم الرسمي للأكاديمية
- ✅ Admin: صفحة تسجيل الدخول، ProtectedRoute، AdminLayout بقائمة جانبية RTL، Dashboard بهيكل أساسي
- ✅ Backend: Express + MongoDB (Mongoose) + كل الـ Models السبعة + Controllers + Routes (عامة ومحمية) + Middleware (auth, error handling, validation, rate limiting)
- ✅ Seed script يحتوي على محتوى تجريبي فقط، معلّم بوضوح (`isPlaceholder: true`) — لا توجد أي بيانات حقيقية مخترعة عن الأكاديمية أو المدربين أو البرامج أو الإحصائيات
- ✅ تم التحقق من: نجاح بناء الفرونت إند (`npm run build`)، صحة استيراد كل ملفات الباك إند، عمل السيرفر واستجابة `/api/health` بنجاح، وفشل واضح ومقصود عند غياب `MONGODB_URI`

---

## 8. ما تم تأجيله عمدًا لمراحل لاحقة

### Phase 2 — الموقع العام الكامل
- ربط صفحات العرض (البرامج، المدربون، الإعلام) بالـ API الفعلي بدل البيانات المحلية المؤقتة في `lib/placeholderData.js`
- محتوى حقيقي كامل (نصوص، صور، بيانات مدربين وبرامج فعلية) يستبدل المحتوى التجريبي
- تفاصيل مناهج البرامج الكاملة، صور حقيقية للمدربين، مقالات إعلامية فعلية

### Phase 3 — لوحة تحكم كاملة
- شاشات إدارة (CRUD) كاملة من واجهة المستخدم لكل مورد: البرامج، المدربون، الإعلام، آراء المتدربين، طلبات التسجيل، رسائل التواصل، إعدادات الموقع
  (الـ API الخاص بها جاهز بالفعل على الباك إند عبر route factories عامة؛ الناقص هو واجهات الإدارة الفعلية في الفرونت إند)
- رفع الصور الفعلي عبر Cloudinary من لوحة التحكم
- تفعيل حساب الأدمن الحقيقي وتغيير كلمة المرور الافتراضية من سكريبت الـ seed

### غير مدرج بعد (يحتاج قرارًا أو معلومات منك)
- نشر فعلي على استضافة (Vercel للفرونت إند، Render/Railway أو غيرها للباك إند)
- عنوان فعلي/خريطة للأكاديمية إن وجد مقر مادي
- حسابات التواصل الاجتماعي الحقيقية (روابط placeholder حاليًا `#`)
- بريد إلكتروني رسمي حقيقي للأكاديمية (حاليًا placeholder)
