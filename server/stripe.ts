import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export interface CheckoutSessionOptions {
  email?: string;
  userId?: number;
}

/**
 * Cria uma sessão de checkout do Stripe
 */
export async function createCheckoutSession(options: CheckoutSessionOptions): Promise<string> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "O Tabuleiro da Dominação",
              description: "Acesso vitalício ao sistema completo de dominação do TikTok",
              images: ["https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400"],
            },
            unit_amount: 19700, // R$ 197,00 em centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/tabuleiro?success=true`,
      cancel_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}?canceled=true`,
      customer_email: options.email,
      metadata: {
        userId: options.userId?.toString() || "",
      },
    });

    return session.url || "";
  } catch (error) {
    console.error("[Stripe] Error creating checkout session:", error);
    throw new Error("Falha ao criar sessão de pagamento");
  }
}

/**
 * Verifica a assinatura do webhook do Stripe
 */
export function constructWebhookEvent(payload: string, signature: string): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET não configurado");
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("[Stripe] Webhook signature verification failed:", error);
    throw new Error("Falha na verificação da assinatura do webhook");
  }
}

/**
 * Processa o evento de checkout completado
 */
export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_email;
  const customerId = session.customer as string;
  const userId = session.metadata?.userId;

  console.log("[Stripe] Checkout completed:", {
    customerEmail,
    customerId,
    userId,
  });

  return {
    customerEmail,
    customerId,
    userId: userId ? parseInt(userId) : undefined,
  };
}
