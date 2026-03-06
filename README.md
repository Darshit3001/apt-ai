# MatchMyAI Tool

> Discover the perfect AI tool for any task. Compare, review, and decide with confidence.

MatchMyAI Tool is a community-driven AI tool directory and discovery platform. I built this because finding the right AI tool for a specific job is genuinely painful — there are hundreds of options and most directories are just SEO link farms. This one is different.

---

## What it does

- **Browse & filter** 46,600+ AI tools by category, pricing, rating, and release date
- **Timeline view** — filter the feed by year so you can see what launched when
- **Collections** — curated lists of tools for specific use-cases (best free tools, best for writing, etc.)
- **Community reviews** — real ratings and comments from users
- **Neural Map** — an interactive visual map of the entire AI ecosystem by category
- **Save tools** — bookmark your favourites and build personal collections
- **Submit a tool** — anyone can submit a new tool for review

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Turso (LibSQL on the edge) |
| ORM | Prisma |
| Auth | NextAuth.js |
| State | Zustand |
| Animations | Framer Motion |
| Hosting | Vercel |

---

## Getting started locally

```bash
# Clone the repo
git clone https://github.com/Darshit3001/MatchMyAI-Tool.git
cd MatchMyAI-Tool

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Turso DB URL + auth token, NextAuth secret, etc.

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it.

---

## Environment variables

```
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

## Roadmap

- [ ] AI-powered tool recommendations based on your use-case description
- [ ] Browser extension for quick tool lookup
- [ ] Comparison table (side-by-side tool specs)
- [ ] Weekly "What's new in AI" digest email
- [ ] Mobile app

---

## Contributing

PRs and issues are welcome. If you know of a tool that's missing, use the Submit Tool button on the site or open a GitHub issue.

---

## License

MIT
