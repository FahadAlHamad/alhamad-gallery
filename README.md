# Alhamad Gallery

A private gallery website for 19th-century Orientalist paintings.
Built with Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL.

---

## Deploying to Vercel (step-by-step)

### Step 1 — Add a free database in Vercel

1. Open your project in the [Vercel dashboard](https://vercel.com)
2. Click **Storage** in the left sidebar
3. Click **Create Database** → choose **Postgres** → click **Create**
4. Vercel will automatically add `DATABASE_URL` and `DATABASE_URL_UNPOOLED`
   to your project's environment variables — no copying needed

### Step 2 — Add the session secret

1. In your Vercel project, click **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `SESSION_PASSWORD`
   - **Value:** any long random phrase, e.g. `alhamad-gallery-secret-key-2024-very-long`
3. Click **Save**

### Step 3 — Redeploy

1. Go to **Deployments** in Vercel
2. Click the three dots (`···`) next to the latest deployment → **Redeploy**
3. Wait ~1 minute — it should go green ✅

### Step 4 — Seed the database (add your 7 paintings)

Once the deployment is live, open a terminal on your computer and run:

```bash
cd ~/Desktop/AlhamadGallery
npx vercel env pull .env.local   # downloads your live database credentials
npm run seed                      # adds the 7 paintings and admin user
```

Your gallery will then be fully live with all paintings.

---

## Admin panel

Visit `https://your-domain.vercel.app/admin`

- **Email:** admin@alhamadgallery.com
- **Password:** alhamad2024

*(Change this password immediately after first login via Admin → Password tab)*

---

## Running locally

```bash
npm install
# Create a .env file — see .env.example
# For local dev you can use a free Neon.tech or Supabase database URL
npx prisma db push
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS — Cormorant Garamond + Jost fonts
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** iron-session (cookie-based)
- **Email:** Nodemailer (optional SMTP config)
