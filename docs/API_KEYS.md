# API keys for test generation

AutoTestGen AI can use **Groq**, **Google Gemini**, or **OpenAI** to generate tests. Choose the provider in **Admin → App settings** and set the matching key in `.env` (or `.env.local`).

---

## Free options (recommended)

### 1. Groq (default, free)

- **Where to get key:** [https://console.groq.com/keys](https://console.groq.com/keys)  
  Sign up → **Create API Key** → copy the key.
- **Env variable:** `GROQ_API_KEY=gsk_...`
- **Free tier:** Generous free limits; fast inference. Good for development and light production use.
- **Docs:** [Groq Cloud](https://groq.com/) · [API docs](https://console.groq.com/docs)

---

### 2. Google Gemini (free tier)

- **Where to get key:** [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)  
  Sign in with Google → **Create API key** (or **Get API key**) → choose or create a project → copy the key.
- **Env variable:** `GEMINI_API_KEY=...`
- **Model:** The app tries current Flash models (`gemini-2.5-flash`, then `gemini-2.0-flash`, etc.). Older IDs like `gemini-1.5-flash` often return 404. To pin a model: `GEMINI_MODEL=gemini-2.5-flash` (see [Gemini models](https://ai.google.dev/gemini-api/docs/models)).
- **Free tier:** Free tier available with rate limits; no credit card required to start. See [Gemini API billing](https://ai.google.dev/gemini-api/docs/billing).
- **Docs:** [Google AI for Developers](https://ai.google.dev/) · [API key](https://ai.google.dev/gemini-api/docs/api-key) · [Node.js](https://ai.google.dev/gemini-api/docs/get-started/node)

---

## Paid option

### 3. OpenAI

- **Where to get key:** [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)  
  Sign up → **Create new secret key** → copy (you won’t see it again).
- **Env variable:** `OPENAI_API_KEY=sk-proj-...`
- **Billing:** Pay-as-you-go; add a payment method in [Billing](https://platform.openai.com/account/billing). Free tier may be limited or expired depending on account.
- **Docs:** [OpenAI Platform](https://platform.openai.com/docs)

---

## Summary

| Provider   | Env variable     | Free tier        | Get key |
|-----------|------------------|------------------|---------|
| **Groq**  | `GROQ_API_KEY`   | Yes              | [console.groq.com/keys](https://console.groq.com/keys) |
| **Gemini**| `GEMINI_API_KEY`| Yes (rate limits)| [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| **OpenAI**| `OPENAI_API_KEY`| Limited / paid   | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |

Use **one** of these keys (for the provider you selected in Admin → App settings). You don’t need all three.
