# HealthIQ

**HealthIQ** is an AI-powered health assistant web application built with [Next.js](https://nextjs.org/) and the [Google Gemini API](https://ai.google.dev/) via [Google AI Studio](https://aistudio.google.com/). Ask questions about symptoms, nutrition, fitness, mental health, and general wellness.

> ⚠️ **Disclaimer:** HealthIQ provides general health information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.

## Features

- 💬 Multi-turn health chat powered by **Google Gemini 2.0 Flash**
- 🩺 Health-focused system prompt for accurate, empathetic responses
- 🚀 Built on **Next.js 16** with the App Router
- 🎨 Clean, responsive UI styled with **Tailwind CSS**
- 🔐 API key managed securely via environment variables

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/idigitalpro1/HealthIQ.git
   cd HealthIQ
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Open `.env.local` and add your Gemini API key:

   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    api/
      chat/
        route.ts     # Gemini API backend route
    globals.css      # Global styles
    layout.tsx       # Root layout with metadata
    page.tsx         # Main chat interface
```

## Deployment

The easiest way to deploy HealthIQ is to use the [Vercel Platform](https://vercel.com/). Set the `GEMINI_API_KEY` environment variable in your Vercel project settings.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework (App Router) |
| Google Gemini 2.0 Flash | AI language model |
| @google/generative-ai | Gemini SDK |
| Tailwind CSS 4 | Styling |
| TypeScript | Type safety |

## License

[MIT](./LICENSE)
