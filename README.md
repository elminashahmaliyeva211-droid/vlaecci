# VLAECCI - Hair Care Brand Mini SaaS

Dermatoloq təsdiqli saç baxım məhsulları üçün modern mini SaaS veb saytı. Saç dökülməsi, zəif saç və yavaş böyümə problemi yaşayan qadınlar üçün.

## Xüsusiyyətlər

- **Landing Page** – Hero, nəticələr, üstünlüklər, şəxsi məsləhətlər, Instagram bölməsi
- **Məhsul Sistemi** – Kateqoriyalar, məhsul səhifələri, admin CRUD
- **Saç Diagnostika Quiz** – Suallara cavab verin, məhsul tövsiyələri alın
- **Konsultasiya** – Müraciət formu, əlaqə məlumatları
- **Admin Panel** – Giriş, məhsullar, konsultasiyalar, quiz cavabları, endirim kodları
- **WhatsApp** – Əlaqə düyməsi
- **Endirim kodları** – Admin yaradır, müştərilər tətbiq edə bilər

## Texnologiyalar

- **Frontend:** Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes
- **Database:** SQLite (Prisma) – PostgreSQL-ə asan keçid üçün
- **Auth:** JWT (jose) + cookies

## Quraşdırma

### Tələblər

- Node.js 18+
- npm və ya yarn

### Addımlar

1. **Dependency-ləri yükləyin:**
   ```bash
   npm install
   ```

2. **Environment faylını yaradın:**
   ```bash
   cp .env.example .env
   ```
   `.env` faylında `DATABASE_URL` və `JWT_SECRET` dəyərlərini yoxlayın.

3. **Veritabanını hazırlayın:**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Development serveri işə salın:**
   ```bash
   npm run dev
   ```

5. Brauzerdə açın: [http://localhost:3000](http://localhost:3000)

### Admin girişi (seed sonrası)

- **URL:** `/admin`
- **Email:** admin@vlaecci.com
- **Parol:** admin123

> ⚠️ İlk dəfə deploy edərkən mütləq parolu dəyişin.

### Səhifələr

| URL | Təsvir |
|-----|--------|
| `/` | Ana səhifə (landing) |
| `/mehsullar` | Məhsul siyahısı |
| `/mehsullar/[slug]` | Məhsul səhifəsi |
| `/quiz` | Saç diagnostika quiz |
| `/konsultasiya` | Konsultasiya formu |
| `/admin` | Admin panel (giriş tələb olunur) |

## Layihə strukturu

```
vlaecci/
├── prisma/
│   ├── schema.prisma    # DB sxemi
│   └── seed.ts          # İlkin məlumat
├── src/
│   ├── app/
│   │   ├── api/         # API routes
│   │   │   ├── auth/    # Login, logout
│   │   │   ├── admin/   # Admin API (products, consultations, quiz, discounts)
│   │   │   ├── products/
│   │   │   ├── quiz/
│   │   │   ├── consultation/
│   │   │   └── discount/
│   │   ├── admin/       # Admin panel
│   │   ├── mehsullar/   # Products & detail
│   │   ├── quiz/        # Hair diagnosis quiz
│   │   ├── konsultasiya/
│   │   └── page.tsx     # Landing
│   ├── components/
│   └── lib/             # db, auth, middleware
└── package.json
```

## Environment dəyişənləri

| Dəyişən | Təsvir |
|---------|--------|
| `DATABASE_URL` | SQLite: `file:./dev.db` və ya PostgreSQL connection string |
| `JWT_SECRET` | Admin session üçün gizli açar |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp əlaqə nömrəsi (+994...) |
| `NEXT_PUBLIC_INSTAGRAM_USERNAME` | Instagram istifadəçi adı |

## Production

1. PostgreSQL-ə keçin (opsional, SQLite kiçik trafik üçün kifayətdir):
   ```
   DATABASE_URL="postgresql://user:pass@host:5432/dbname"
   ```

2. Build:
   ```bash
   npm run build
   npm start
   ```

3. Parolu dəyişin və `JWT_SECRET`-i güclü təsadüfi sətrlə əvəz edin.

## Dil

Əsas dil: **Azərbaycan dili**. İngiliscə dəstək üçün `locale` və çeviri faylları əlavə edilə bilər.

---

© VLAECCI – Dermatoloq təsdiqli saç baxımı
