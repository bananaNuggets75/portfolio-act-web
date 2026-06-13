# Kenan Ben G. Polgo — Portfolio

A personal portfolio website showcasing my projects, certificates, and tech stack.
Built as a single-page app with a light "lavender" theme, an image-gallery lightbox
for project screenshots, and a live guestbook.

> Software developer based in Iloilo City, Philippines. Building software,
> exploring new tech, repeating.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom CSS
- **Backend:** Supabase (Postgres + Row-Level Security) for the comment guestbook
- **Icons:** react-icons, lucide-react
- **Deploy:** Vercel

## Features

- Single-page layout: Home, About, Portfolio, Contact
- Project cards with badges, an adaptive photo collage, and a modal carousel + lightbox
- Certificates section (with image-less placeholder support)
- Rotating typing animation in the hero
- Live guestbook backed by Supabase

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Add environment variables — create .env.local in the project root:
#    (the guestbook degrades gracefully if these are absent)
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-publishable-key>

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The `comments` table in Supabase needs Row-Level Security enabled with public
> `select` and `insert` policies. The publishable key is safe to expose; the
> secret key is never used in this app.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint |

## Deployment

Deployed on [Vercel](https://vercel.com). Set the two `NEXT_PUBLIC_SUPABASE_*`
environment variables in the Vercel project settings for the guestbook to work
in production.

## Author

**Kenan Ben G. Polgo** · [GitHub](https://github.com/bananaNuggets75) · [LinkedIn](https://www.linkedin.com/in/kenan-ben-polgo/)
