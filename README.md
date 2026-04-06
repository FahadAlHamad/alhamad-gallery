# Alhamad Gallery

A private gallery website for 19th-century Orientalist paintings. Built with Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, and SQLite.

## Setup

### Prerequisites
- Node.js 18+ (installed via nvm)

### Install

```bash
npm install
```

### Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### Database Setup

Run the migration and seed:

```bash
npx prisma migrate dev
npm run seed
```

This creates the SQLite database and seeds it with 7 paintings and an admin user.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin Panel

Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).

**Default credentials:**
- Email: `admin@alhamadgallery.com`
- Password: `alhamad2024`

### Admin features:
- View, edit, and delete paintings
- Upload new painting images
- Toggle featured/sold status
- View and manage enquiries
- Change admin password

## Email Notifications

Configure SMTP settings in `.env` to receive email notifications when enquiry forms are submitted. If SMTP is not configured, enquiries are saved to the database only.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite via Prisma ORM
- **Auth:** iron-session (cookie-based)
- **Email:** Nodemailer
