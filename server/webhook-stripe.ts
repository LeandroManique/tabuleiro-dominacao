import type { Request, Response } from "express";
import { constructWebhookEvent, handleCheckoutCompleted } from "./stripe";
import * as db from "./db";

/**
 * Handler para o webhook do Stripe
 * Este endpoint deve ser registrado no Stripe Dashboard
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];

  if (!signature || Array.isArray(signature)) {
    console.error("[Webhook] Missing or invalid stripe-signature header");
    return res.status(400).send("Missing signature");
  }

  try {
    // Verifica a assinatura do webhook
    const event = constructWebhookEvent(req.body, signature);

    console.log("[Webhook] Received event:", event.type);

    // Processa o evento
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const result = await handleCheckoutCompleted(session);

        // Ativa o usuário se temos o userId
        if (result.userId) {
          await db.activateUser(result.userId);
          console.log(`[Webhook] User ${result.userId} activated`);
        }

        // Se temos o customerId, atualiza no banco
        if (result.userId && result.customerId) {
          await db.updateStripeCustomerId(result.userId, result.customerId);
          console.log(`[Webhook] Updated Stripe customer ID for user ${result.userId}`);
        }

        // TODO: Se não temos userId, enviar Magic Link para o email
        if (!result.userId && result.customerEmail) {
          console.log(`[Webhook] TODO: Send magic link to ${result.customerEmail}`);
          // Implementar envio de Magic Link via Supabase
        }

        break;
      }

      case "payment_intent.succeeded": {
        console.log("[Webhook] Payment succeeded:", event.data.object.id);
        break;
      }

      case "payment_intent.payment_failed": {
        console.log("[Webhook] Payment failed:", event.data.object.id);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error);
    res.status(400).send(`Webhook Error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
