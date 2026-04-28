# AI-Powered Code Reviewer

An AI-powered code review app with a React frontend and Node.js backend. It sends code to Gemini first, then falls back to Groq if Gemini is rate-limited or unavailable.

## Features

- Code review feedback for quality, readability, performance, and security.
- Gemini as the primary model.
- Groq fallback when Gemini fails or hits quota.
- Frontend toast notifications for API errors and quota issues.
- Configurable backend URL for local development and deployment.

## Project Structure

- `Backend/` - Express API that talks to Gemini and Groq.
- `Frontend/` - Vite + React UI for pasting code and viewing the review.

## Prerequisites

- Node.js 20 or later
- npm
- A Google Gemini API key
- A Groq API key for fallback use

## Setup

### Backend

1. Install dependencies:
```bash
cd Backend
npm install
```

2. Create `Backend/.env`:
```env
GOOGLE_GEMINI_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key
PORT=3000
```

3. Start the backend:
```bash
npm run dev
```

### Frontend

1. Install dependencies:
```bash
cd Frontend
npm install
```

2. Create `Frontend/.env` if you need a custom backend URL:
```env
VITE_BACKEND_URL=http://localhost:3000
```

3. Start the frontend:
```bash
npm run dev
```

## API Endpoint

The backend exposes a single review endpoint:

- `POST /ai/get-review`

### Request Body

```json
{
    "code": "function sum(a, b) { return a + b; }"
}
```

### Success Response

```json
{
    "success": true,
    "review": "..."
}
```

### Error Response

```json
{
    "success": false,
    "error": "..."
}
```

## Postman Test

Use these settings in Postman:

- Method: `POST`
- URL: `http://localhost:3000/ai/get-review`
- Headers: `Content-Type: application/json`
- Body: raw JSON

Example body:

```json
{
    "code": "function fetchData() { return fetch('/api/data').then(r => r.json()); }"
}
```

## Environment Variables

Backend:

- `GOOGLE_GEMINI_KEY` - Gemini API key
- `GROQ_API_KEY` - Groq API key used as fallback
- `PORT` - backend port

Frontend:

- `VITE_BACKEND_URL` - backend base URL used by the React app

## Notes

- Gemini is tried first.
- If Gemini returns a quota or rate-limit error, the backend logs the fallback and tries Groq.
- The frontend shows a toast if the backend returns a quota or AI failure message.
- Do not place API keys in the frontend `.env`; keep them in `Backend/.env`.

## License

This project is licensed under the MIT License.
