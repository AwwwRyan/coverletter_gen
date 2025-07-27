# Cover Letter Generator

This is a Next.js web app that generates professional cover letters using a large language model (LLM) API (e.g., OpenAI or Cohere). Features:

- Paste a job description to generate a tailored cover letter.
- Fetches your profile from a local JSON file.
- Uses LLM API to generate concise, engaging letters.
- Copy or download the generated letter.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

- Place your profile in `public/myProfile.json` (see example in the app).
- Configure your LLM API key in the backend API route (see `/src/app/api/generate/route.ts`).

## Features (Planned)

- Edit profile via UI
- Tone customization
- Save previous letters

---

Built with Next.js, TypeScript, Tailwind CSS.
