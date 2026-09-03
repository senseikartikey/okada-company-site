# Okada & Company – marketing site + leasing chat widget

Front-end for **Okada & Company**, a (demo) NYC commercial real-estate firm: a
single-page marketing site with an embedded **AI leasing-assistant chat widget**.

Part of the Okada Leasing Agent project family – the widget talks to a backend
like [`okada-leasing-agent-fullstack`](https://github.com/senseikartikey/okada-leasing-agent-fullstack)
or [`okada-leasing-agent`](https://github.com/senseikartikey/okada-leasing-agent).

## Features

- Hero / landing section for the firm.
- Floating chat button that expands into an assistant panel
  (`Okada & Company` branding, typing spinner, message history).
- Chat calls `POST /api/chat` with `{ message }` and renders the reply – point
  this at your leasing-agent backend (dev proxy or deployment rewrite).

## Stack

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Framer Motion** (panel + message animation)
- **lucide-react** icons

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Configure the `/api/chat` proxy in `vite.config.ts` to reach your backend, then:

```bash
npm run build      # -> dist/
npm run preview
```
