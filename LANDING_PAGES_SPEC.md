# אפיון תכונת דפי נחיתה (Landing Pages)

## 📋 סקירה כללית

הוספת תכונה מתקדמת לבניית דפי נחיתה עם טופס יצירת קשר ומאגר לידים, זמינה למנויי פרימיום בלבד.

---

## 💰 מבנה מנויים

### חבילה בסיסית - $10/חודש
- דף לינקים אישי
- לינקים ללא הגבלה
- אנליטיקס מתקדם
- עיצוב מותאם אישית
- קופונים חכמים
- QR Code
- תזמון לינקים

### חבילה פרימיום - $20/חודש (חדש!)
כל התכונות של החבילה הבסיסית +:
- **דפי נחיתה ללא הגבלה**
- **בניית דפי נחיתה מותאמים אישית**
- **טופס יצירת קשר מותאם**
- **מאגר לידים מתקדם**
- **ניהול לידים בלוח בקרה**
- **ייצוא לידים ל-CSV**
- **אנליטיקס לדפי נחיתה**

---

## 🏗️ מבנה דף נחיתה

### 1. מידע בסיסי
- **שם הדף** (כותרת)
- **Slug** (URL: `domain.com/landing/slug`)
- **תיאור** (לשימוש פנימי)
- **סטטוס** (פרסם/טיוטה)

### 2. סקשנים (Sections) - Builder Style

כל דף נחיתה מורכב מסקשנים שניתן להוסיף, למחוק, ולשנות את הסדר שלהם:

#### סקשן Hero (חובה)
- כותרת ראשית
- תת-כותרת
- כפתור CTA (Call to Action)
- תמונה/וידאו רקע (אופציונלי)
- עיצוב: צבעים, פונטים, גודל

#### סקשן Features (תכונות)
- כותרת סקשן
- רשימת תכונות (3-6 תכונות)
- כל תכונה: אייקון, כותרת, תיאור
- עיצוב: grid layout (2-3 עמודות)

#### סקשן Testimonials (המלצות)
- כותרת סקשן
- רשימת המלצות (3-6 המלצות)
- כל המלצה: תמונה, שם, תפקיד, טקסט
- עיצוב: carousel או grid

#### סקשן About (אודות)
- כותרת
- תוכן טקסטואלי (Rich Text Editor)
- תמונה (אופציונלי)
- עיצוב: תמונה משמאל/מימין

#### סקשן CTA (Call to Action)
- כותרת
- תיאור קצר
- כפתור CTA
- עיצוב: צבעים, גודל

#### סקשן Contact Form (טופס יצירת קשר)
- כותרת סקשן
- תיאור קצר
- טופס (ראה פרטים למטה)

#### סקשן FAQ (שאלות נפוצות)
- כותרת סקשן
- רשימת שאלות ותשובות
- Accordion design

#### סקשן Custom HTML
- אפשרות להוסיף HTML מותאם אישית
- CSS מותאם

### 3. עיצוב גלובלי
- צבעי מותג (רקע, טקסט, כפתורים)
- פונטים
- סגנון כפתורים
- אפקטי רקע

---

## 📝 טופס יצירת קשר

### שדות סטנדרטיים (ניתן להפעיל/לכבות)
- **שם** (חובה)
- **אימייל** (חובה)
- **טלפון** (אופציונלי)
- **הודעה** (אופציונלי)

### שדות מותאמים אישית
- אפשרות להוסיף שדות נוספים:
  - טקסט
  - מספר
  - תאריך
  - בחירה (select)
  - checkbox
  - radio buttons

### הגדרות טופס
- כותרת טופס
- תיאור
- טקסט כפתור שליחה
- הודעת הצלחה
- הודעת שגיאה
- אימות reCAPTCHA (אופציונלי)
- הודעת אימייל אוטומטית למשתמש (אופציונלי)

---

## 📊 מאגר לידים

### שמירת לידים
כל ליד שנשלח דרך טופס נשמר עם:
- **ID ייחודי**
- **דף נחיתה** (איזה דף)
- **תאריך ושעה**
- **כל השדות מהטופס**
- **IP Address** (לניתוח)
- **User Agent** (דפדפן/מכשיר)
- **Referrer** (מאיפה הגיע)

### ניהול לידים בלוח בקרה

#### רשימת לידים
- טבלה עם כל הלידים
- סינון לפי:
  - דף נחיתה
  - תאריך
  - סטטוס (חדש/טופל/ארכיון)
- חיפוש בשדות
- מיון לפי עמודות

#### צפייה בליד
- מודל/דף עם כל פרטי הליד
- אפשרות לסמן כטופל
- אפשרות לארכב
- אפשרות למחוק
- הערות (notes) - הוספת הערות על הליד

#### פעולות
- **ייצוא ל-CSV** - ייצוא כל הלידים או מסוננים
- **ייצוא ל-Excel** - ייצוא מורחב
- **שליחת אימייל** - שליחת אימייל ישירות לליד
- **העתקת פרטים** - העתקת כל הפרטים

### אנליטיקס לידים
- מספר לידים כולל
- מספר לידים לפי דף נחיתה
- גרף לידים לפי תאריך
- שיעור המרה (conversion rate)
- לידים לפי מקור (referrer)

---

## 🗄️ מבנה Database

### טבלה: LandingPage
```prisma
model LandingPage {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Basic Info
  name            String   // שם הדף
  slug            String   // URL slug (unique per user)
  description     String?  // תיאור פנימי
  status          String   @default("draft") // draft, published
  
  // Design
  backgroundColor String   @default("#ffffff")
  textColor       String   @default("#000000")
  buttonColor     String   @default("#6366f1")
  buttonTextColor String   @default("#ffffff")
  fontFamily      String   @default("rubik")
  
  // Sections (stored as JSON)
  sections        String   // JSON array of sections
  
  // SEO
  seoTitle        String?
  seoDescription  String?
  seoImage        String?
  
  // Analytics
  views           Int      @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  leads           Lead[]
  analytics       LandingPageAnalytics[]
  
  @@unique([userId, slug])
  @@index([userId])
  @@index([status])
}
```

### טבלה: Lead
```prisma
model Lead {
  id              String   @id @default(cuid())
  landingPageId   String
  landingPage     LandingPage @relation(fields: [landingPageId], references: [id], onDelete: Cascade)
  
  // Form Data (stored as JSON)
  formData        String   // JSON object with all form fields
  
  // Metadata
  ipAddress       String?
  userAgent       String?
  referrer        String?
  
  // Status
  status          String   @default("new") // new, contacted, archived
  
  // Notes
  notes           String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([landingPageId])
  @@index([status])
  @@index([createdAt])
}
```

### טבלה: LandingPageAnalytics
```prisma
model LandingPageAnalytics {
  id              String   @id @default(cuid())
  landingPageId   String
  landingPage     LandingPage @relation(fields: [landingPageId], references: [id], onDelete: Cascade)
  
  type            String   // "pageview", "scroll", "click"
  
  // Tracking Data
  ipAddress       String?
  userAgent       String?
  referrer        String?
  country         String?
  city            String?
  device          String?
  browser         String?
  
  // Event Data (stored as JSON)
  eventData       String?   // Additional event data
  
  createdAt       DateTime @default(now())
  
  @@index([landingPageId])
  @@index([type])
  @@index([createdAt])
}
```

### עדכון טבלת User
```prisma
model User {
  // ... existing fields ...
  
  subscriptionPlan String  @default("basic") // basic, premium
  
  landingPages     LandingPage[]
}
```

---

## 🎨 Builder Interface

### עורך דף נחיתה
- **Sidebar שמאל**: רשימת סקשנים זמינים (drag & drop)
- **מרכז**: תצוגה מקדימה של הדף (live preview)
- **Sidebar ימין**: הגדרות הסקשן הנבחר

### פונקציונליות Builder
- **Drag & Drop** - גרירת סקשנים לסידור מחדש
- **Live Preview** - תצוגה מקדימה בזמן אמת
- **Undo/Redo** - ביטול/חזרה על פעולות
- **Responsive Preview** - תצוגה למובייל/טאבלט/דסקטופ
- **Save Draft** - שמירת טיוטה
- **Publish** - פרסום הדף

---

## 🔗 Routes & Pages

### Dashboard Routes
- `/dashboard/landing-pages` - רשימת דפי נחיתה
- `/dashboard/landing-pages/new` - יצירת דף נחיתה חדש
- `/dashboard/landing-pages/[id]` - עריכת דף נחיתה
- `/dashboard/leads` - מאגר לידים
- `/dashboard/leads/[id]` - צפייה בליד ספציפי

### Public Routes
- `/landing/[slug]` - דף נחיתה ציבורי

---

## 🔐 הרשאות

### בדיקת מנוי פרימיום
- כל פעולה הקשורה לדפי נחיתה תבדוק שהמשתמש במנוי פרימיום
- אם לא במנוי פרימיום - הפניה לעמוד שדרוג

---

## 📧 Email Notifications

### הודעות אימייל אוטומטיות
- **לליד**: הודעת תודה אוטומטית (אופציונלי)
- **לבעל הדף**: התראה על ליד חדש (אופציונלי)

---

## 🚀 שלבי פיתוח

### שלב 1: תשתית בסיסית
- [ ] עדכון סכמת Database
- [ ] הוספת שדה subscriptionPlan ל-User
- [ ] עדכון מערכת המנויים לתמוך ב-2 חבילות
- [ ] בדיקת הרשאות מנוי פרימיום

### שלב 2: Builder בסיסי
- [ ] יצירת דף נחיתה חדש
- [ ] עורך סקשנים בסיסי
- [ ] שמירה וטעינה של דפי נחיתה
- [ ] תצוגה מקדימה

### שלב 3: סקשנים
- [ ] Hero Section
- [ ] Features Section
- [ ] Testimonials Section
- [ ] About Section
- [ ] CTA Section
- [ ] Contact Form Section
- [ ] FAQ Section

### שלב 4: טופס יצירת קשר
- [ ] Builder טופס
- [ ] שדות מותאמים
- [ ] אימות שדות
- [ ] שליחת טופס
- [ ] הודעות הצלחה/שגיאה

### שלב 5: מאגר לידים
- [ ] שמירת לידים
- [ ] רשימת לידים
- [ ] צפייה בליד
- [ ] ניהול סטטוס
- [ ] הערות

### שלב 6: אנליטיקס
- [ ] מעקב צפיות
- [ ] מעקב המרות
- [ ] דשבורד אנליטיקס

### שלב 7: תכונות מתקדמות
- [ ] ייצוא ל-CSV
- [ ] Email notifications
- [ ] Custom HTML sections
- [ ] SEO optimization

---

## 💡 הערות נוספות

1. **ביצועים**: דפי נחיתה צריכים להיות מהירים מאוד (SSR/SSG)
2. **SEO**: תמיכה מלאה ב-SEO לכל דף נחיתה
3. **Mobile**: עיצוב responsive מלא
4. **Accessibility**: תמיכה ב-WCAG 2.1
5. **Security**: אימות טופסים, הגנה מפני spam

---

## 📝 דוגמאות JSON

### LandingPage.sections
```json
[
  {
    "type": "hero",
    "id": "hero-1",
    "data": {
      "title": "ברוכים הבאים",
      "subtitle": "הפתרון המושלם עבורך",
      "ctaText": "התחל עכשיו",
      "ctaUrl": "#contact",
      "backgroundImage": "https://..."
    },
    "style": {
      "backgroundColor": "#ffffff",
      "textColor": "#000000"
    }
  },
  {
    "type": "features",
    "id": "features-1",
    "data": {
      "title": "התכונות שלנו",
      "items": [
        {
          "icon": "FiZap",
          "title": "מהיר",
          "description": "מהירות גבוהה"
        }
      ]
    }
  },
  {
    "type": "contact-form",
    "id": "form-1",
    "data": {
      "formId": "form-123",
      "title": "צור קשר",
      "description": "נשמח לשמוע ממך"
    }
  }
]
```

### Lead.formData
```json
{
  "name": "יוסי כהן",
  "email": "yossi@example.com",
  "phone": "050-1234567",
  "message": "אני מעוניין במידע נוסף",
  "customField1": "ערך מותאם"
}
```

---

סוף האפיון

