import { Router, Request, Response } from 'express';
import { handleIncomingMessage } from '../services/whatsappService';

const router = Router();
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'sujalam-verify-token';

// Webhook Verification
router.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Incoming Messages
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    
    // Check if it's a WhatsApp API message
    if (body.object) {
      if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
        const message = body.entry[0].changes[0].value.messages[0];
        const phoneNumber = message.from;
        
        let text = null;
        let mediaId = null;

        if (message.type === 'text') {
          text = message.text.body;
        } else if (message.type === 'image') {
          mediaId = message.image.id;
        }

        const reply = await handleIncomingMessage(phoneNumber, text, mediaId);
        
        if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
          try {
            await fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "text",
                text: { body: reply }
              })
            });
          } catch (e) {
            console.error('WhatsApp API Error:', e);
          }
        } else {
          // Fallback to MOCK: Print the reply to console instead of calling WhatsApp API
          console.log(`\n[WHATSAPP MOCK] To ${phoneNumber}: \n${reply}\n`);
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    res.sendStatus(500);
  }
});

export default router;
