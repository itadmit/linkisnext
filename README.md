# 🔗 LinkHub - מערכת ניהול לינקים

מערכת SaaS לניהול לינקים בסגנון Linktree, בנויה עם Next.js 14.

## ✨ תכונות

- 🔐 **הרשמה והתחברות** - מערכת אימות מאובטחת
- 🔗 **ניהול לינקים** - הוסף, ערוך ומחק לינקים בקלות
- 🎁 **קופונים חכמים** - העתקה אוטומטית של קוד הקופון לפני מעבר לאתר
- 📊 **אנליטיקס** - עקוב אחר קליקים ומכשירים
- 🎨 **עיצוב מותאם** - צבעים, רקעים וערכות נושא
- ⏰ **תזמון לינקים** - הצג לינקים רק בתאריכים מסוימים
- 📱 **QR Code** - הורד QR לשיתוף קל
- ↕️ **Drag & Drop** - סדר לינקים בגרירה
- 💳 **תשלום PayPal** - מנוי חודשי $10 עם 7 ימי ניסיון

## 🚀 התקנה

### דרישות מקדימות

- Node.js 18+
- PostgreSQL
- חשבון PayPal Business (לתשלומים)

### שלבים

1. **שכפל את הפרויקט**
\`\`\`bash
git clone <repo-url>
cd linkhub
\`\`\`

2. **התקן תלויות**
\`\`\`bash
npm install
\`\`\`

3. **הגדר משתני סביבה**
\`\`\`bash
cp .env.example .env
\`\`\`
ערוך את `.env` עם הפרטים שלך:
- `DATABASE_URL` - כתובת PostgreSQL
- `NEXTAUTH_SECRET` - מפתח סודי (צור עם `openssl rand -base64 32`)
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - מזהה PayPal Client
- `PAYPAL_CLIENT_SECRET` - סוד PayPal

4. **הרץ מיגרציות**
\`\`\`bash
npx prisma migrate dev
\`\`\`

5. **הפעל את השרת**
\`\`\`bash
npm run dev
\`\`\`

גלוש ל-[http://localhost:3000](http://localhost:3000)

## 📁 מבנה הפרויקט

\`\`\`
src/
├── app/
│   ├── (auth)/           # דפי התחברות והרשמה
│   ├── [slug]/           # דף ציבורי של משתמש
│   ├── api/              # API Routes
│   └── dashboard/        # לוח בקרה
├── components/
│   ├── dashboard/        # קומפוננטות לוח בקרה
│   ├── providers/        # React Providers
│   └── ui/               # קומפוננטות UI בסיסיות
├── lib/                  # utilities
└── types/                # TypeScript types
\`\`\`

## 🔧 הגדרת PayPal

1. צור חשבון PayPal Business
2. גש ל-[PayPal Developer](https://developer.paypal.com/)
3. צור Application חדש
4. צור Subscription Plan עם:
   - מחיר: $10/חודש
   - Trial: 7 ימים
5. העתק את ה-Plan ID לקוד (בקובץ subscription/page.tsx)

## 📜 סקריפטים

- `npm run dev` - שרת פיתוח
- `npm run build` - בנייה לייצור
- `npm run start` - הפעלת שרת ייצור
- `npm run lint` - בדיקת קוד
- `npx prisma studio` - ממשק לצפייה בדאטהבייס

## 🛠 טכנולוגיות

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js
- **Payments**: PayPal Subscriptions
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📄 רישיון

MIT License
