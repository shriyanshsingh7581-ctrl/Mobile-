import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ChatTurn {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface StoredSupportMessage {
  id: string;
  sender: 'user' | 'assistant' | 'admin';
  text: string;
  productId?: string;
  productName?: string;
  timestamp: string;
}

interface StoredSupportSession {
  userId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  productId?: string;
  productName?: string;
  lastMessage: string;
  lastSender: 'user' | 'assistant' | 'admin';
  messageCount: number;
  updatedAt: string;
  messages: StoredSupportMessage[];
}

// In-memory store for real-time guest-to-admin live chat sync alongside Firebase Firestore
const liveSupportChats = new Map<string, StoredSupportSession>();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  // Groq AI Chat Proxy Route
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: 'GROQ_API_KEY is not configured on the server.' });
        return;
      }

      const body = req.body as {
        messages?: ChatTurn[];
        productContext?: {
          id?: string;
          name?: string;
          brand?: string;
          category?: string;
          price?: number;
          mrp?: number;
          warranty?: string;
          exchangeBonus?: number;
          emiStartingAt?: number;
          description?: string;
          specs?: Record<string, string>;
        } | null;
        storeContext?: {
          storeName?: string;
          whatsappNumber?: string;
          address?: string;
          coupons?: { code: string; title: string }[];
          catalogSummary?: string;
        };
      };

      const userMessages = Array.isArray(body.messages) ? body.messages : [];
      const p = body.productContext;
      const s = body.storeContext;

      const systemPromptLines = [
        `You are the luxury AI shopping concierge for "${s?.storeName || 'Charlie Mobile & Accessories'}".`,
        `Always reply warmly, concisely (2-5 short clear sentences unless specs comparison is requested), and in the EXACT same language the customer uses (English, Hindi, Hinglish, Marathi, Tamil, etc.).`,
        `Store Info: Showroom at ${s?.address || 'Raipur, Chhattisgarh'}. Official WhatsApp Order Concierge: ${s?.whatsappNumber || '8818850488'}. Prepaid orders get 5% extra savings + 100% genuine sealed-box GST invoice + 7-day replacement guarantee.`,
        s?.coupons && s.coupons.length > 0
          ? `Active Coupons: ${s.coupons.map((c) => `${c.code} (${c.title})`).join(', ')}.`
          : '',
        p
          ? `Currently Viewed Product: ${p.name} by ${p.brand} (${p.category}). Selling Price: ₹${Number(
              p.price || 0
            ).toLocaleString('en-IN')}, MRP: ₹${Number(p.mrp || 0).toLocaleString(
              'en-IN'
            )}, Warranty: ${p.warranty || '1 Year Official'}, Exchange Bonus up to ₹${Number(
              p.exchangeBonus || 0
            ).toLocaleString('en-IN')}, EMI starting ₹${Number(
              p.emiStartingAt || 0
            ).toLocaleString('en-IN')}/mo. Description: ${p.description || ''}. Specs: ${JSON.stringify(
              p.specs || {}
            )}`
          : '',
        s?.catalogSummary ? `Top Store Highlights: ${s.catalogSummary}` : '',
        `Never invent fake coupon codes or unrelated products. Encourage booking on site or clicking "Order on WhatsApp" for instant same-day dispatch.`,
      ].filter(Boolean);

      const groqPayload = {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPromptLines.join('\n') },
          ...userMessages.slice(-12).map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: String(m.content || '').slice(0, 1500),
          })),
        ],
        temperature: 0.6,
        max_tokens: 450,
      };

      const callGroq = async (model: string) => {
        const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ ...groqPayload, model }),
        });
        return r;
      };

      let groqRes = await callGroq('openai/gpt-oss-20b');
      if (!groqRes.ok) {
        groqRes = await callGroq('qwen/qwen3.8-27b');
      }
      if (!groqRes.ok) {
        groqRes = await callGroq('openai/gpt-oss-120b');
      }

      if (!groqRes.ok) {
        const errText = await groqRes.text();
        res.status(groqRes.status).json({ error: `Groq API error: ${errText}` });
        return;
      }

      const data = (await groqRes.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const rawContent = data.choices?.[0]?.message?.content || '';
      const reply =
        rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim() ||
        'Thank you for reaching out to Charlie Mobile! How can I help you choose your next device?';

      res.json({ reply });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Unexpected server error calling Groq API',
      });
    }
  });

  // Live Support Chats REST Sync (supplements Firebase Firestore for instant Admin monitoring)
  app.get('/api/support-chats', (_req: Request, res: Response) => {
    const sessions = Array.from(liveSupportChats.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    res.json({ sessions });
  });

  app.post('/api/support-chats', (req: Request, res: Response) => {
    const body = req.body as {
      userId?: string;
      customerName?: string;
      customerPhone?: string;
      customerEmail?: string;
      productId?: string;
      productName?: string;
      message?: StoredSupportMessage;
    };

    const userId = String(body.userId || '').trim();
    const message = body.message;
    if (!userId || !message || !message.text) {
      res.status(400).json({ error: 'userId and message are required' });
      return;
    }

    const existing = liveSupportChats.get(userId);
    const prevMessages = existing?.messages || [];
    const alreadyExists = prevMessages.some((m) => m.id === message.id);
    const nextMessages = alreadyExists ? prevMessages : [...prevMessages, message].slice(-80);

    const updatedSession: StoredSupportSession = {
      userId,
      customerName: body.customerName || existing?.customerName || 'Shopper',
      customerPhone: body.customerPhone || existing?.customerPhone,
      customerEmail: body.customerEmail || existing?.customerEmail,
      productId: body.productId || existing?.productId,
      productName: body.productName || existing?.productName,
      lastMessage: message.text.slice(0, 500),
      lastSender: message.sender,
      messageCount: nextMessages.length,
      updatedAt: message.timestamp || new Date().toISOString(),
      messages: nextMessages,
    };

    liveSupportChats.set(userId, updatedSession);
    res.json({ session: updatedSession });
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Charlie Mobile server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
