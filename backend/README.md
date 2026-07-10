# AWLO Advertising — Backend (Supabase)

This project uses **Supabase** as the backend. No server to run or maintain.

## Stack

- **Database** — PostgreSQL (via Supabase)
- **Auth** — Supabase Auth (for future admin dashboard)
- **Storage** — Supabase Storage (for ad uploads: MP4, PNG, JPG)
- **API** — Auto-generated REST API via Supabase

## Structure

```
backend/
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql   ← Run this first in Supabase SQL Editor
```

## Setup

### 1. Run the database migration

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open `supabase/migrations/001_initial_schema.sql`
5. Copy the entire contents and paste into the editor
6. Click **Run**

This creates:
- `contacts` table — stores contact form submissions
- `quotes` table — stores quote request submissions
- Row Level Security policies — anon users can INSERT, authenticated users can SELECT/UPDATE

### 2. Tables overview

#### `contacts`
| Column     | Type        | Description                        |
|------------|-------------|-------------------------------------|
| id         | uuid        | Primary key                         |
| created_at | timestamptz | Auto-set on insert                  |
| name       | text        | Sender's full name                  |
| email      | text        | Sender's email                      |
| phone      | text        | Sender's phone number               |
| company    | text        | Optional company name               |
| message    | text        | Message body                        |
| status     | text        | new / read / replied                |

#### `quotes`
| Column     | Type        | Description                        |
|------------|-------------|-------------------------------------|
| id         | uuid        | Primary key                         |
| created_at | timestamptz | Auto-set on insert                  |
| name       | text        | Requester's full name               |
| email      | text        | Requester's email                   |
| phone      | text        | Requester's phone number            |
| company    | text        | Optional company name               |
| package    | text        | 1_week / 1_month / 3_months etc.    |
| start_date | date        | Optional preferred start date       |
| notes      | text        | Optional additional notes           |
| status     | text        | new / contacted / confirmed / rejected |

## Environment Variables

The frontend `.env.local` holds all Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Future Plans

- [ ] Admin dashboard (Supabase Auth + protected routes)
- [ ] Supabase Storage for advertisement file uploads
- [ ] Email notifications via Supabase Edge Functions
- [ ] Real-time dashboard for viewing new submissions
