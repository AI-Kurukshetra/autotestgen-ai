# AutoTestGen AI

AutoTestGen AI is a Next.js SaaS MVP that scans a webpage URL, extracts interactive DOM targets, and generates automation test scripts for Playwright, Cypress, and Selenium. Authenticated users can generate suites, review the output in-app, download the code, and revisit saved history from Supabase-backed storage.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL
- OpenAI API
- Cheerio DOM parsing
- Playwright test runner for server-side execution

## Features

- Email/password signup, login, and logout
- URL submission flow with framework and language selection
- Server-side DOM scanning for buttons, forms, inputs, links, checkboxes, radios, selects, navigation, and modals
- OpenAI-powered test generation
- Syntax-highlighted result viewer with copy and download actions
- Server-side execution for Playwright JavaScript suites with inline logs
- Saved generation history per authenticated user
- Admin console for user management

## Environment Variables

Copy `.env.example` to `.env.local` and provide your own values:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
CONTACT_EMAIL=support@example.com
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
PLAYWRIGHT_CHROME_PATH=/usr/bin/google-chrome
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. Set the environment variables above with your project URL, anon key, and service role key.
3. Apply the SQL migrations in `supabase/migrations`.
4. Configure Supabase Auth redirect URLs for your local and deployed app domains.

## Auth Email Setup

If you want Supabase signup confirmation and password reset emails to go through your own SMTP provider:

1. Set `NEXT_PUBLIC_APP_URL` to your app URL.
2. In Supabase, configure **Authentication > URL Configuration** with the same site URL.
3. Add redirect URLs for local development and production.
4. Configure **Authentication > SMTP Settings** with your SMTP provider.
5. Ensure your email templates point back to `/auth/confirm` in this app.

Example confirmation template:

```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}">
    Confirm your email
  </a>
</p>
```

Example password reset template:

```html
<h2>Reset your password</h2>
<p>Follow this link to reset your password:</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next={{ .RedirectTo }}">
    Reset password
  </a>
</p>
```

## Admin Console

Admin features require `SUPABASE_SERVICE_ROLE_KEY` on the server. Never expose that key in client-side code.

The admin route is `/admin`. Access is controlled by `public.user_roles` with `role = 'admin'`.

## SQL Schema

```sql
create extension if not exists pgcrypto;

create table if not exists public.test_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  url text not null,
  framework text not null,
  language text not null,
  generated_code text not null,
  created_at timestamptz not null default now()
);

create index if not exists test_generations_user_created_at_idx
  on public.test_generations (user_id, created_at desc);

alter table public.test_generations enable row level security;

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;
```

## How It Works

1. A signed-in user submits a URL, framework, and language from the dashboard.
2. `POST /api/scan` fetches the page HTML and parses the DOM with Cheerio.
3. The app builds a structured JSON summary of interactive elements.
4. `POST /api/generate` sends the DOM summary to OpenAI and requests a framework-specific test suite.
5. The generated code is saved in `test_generations` and exposed on the results page.
6. Supported Playwright JavaScript suites can be executed from the results page and return pass/fail logs inline.

## Useful Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npx tsc --noEmit
```
