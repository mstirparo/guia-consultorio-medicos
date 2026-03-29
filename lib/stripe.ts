import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2024-06-20",
});

export async function hasFullAccess(email: string): Promise<boolean> {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith("sk_test_placeholder")) {
    // Stripe no configurado → acceso libre (modo desarrollo)
    return true;
  }
  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (!customers.data.length) return false;

    // Verificar pagos únicos (one-time purchase)
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customers.data[0].id,
      limit: 10,
    });
    const hasPaid = paymentIntents.data.some(
      (pi) => pi.status === "succeeded"
    );
    if (hasPaid) return true;

    // Verificar suscripciones activas
    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: "active",
      limit: 1,
    });
    return subscriptions.data.length > 0;
  } catch {
    return false;
  }
}
