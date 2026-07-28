import { Redis } from "@upstash/redis";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const { cart, customer } = req.body;
    const orderId = `WIG-${Date.now()}`;

    const orderData = {
        id: orderId,
        customer,
        cart,
        status: "sent",
        createdAt: new Date().toISOString(),
    };

    // Save the full order
    await redis.set(`order:${orderId}`, JSON.stringify(orderData));

    // Add to the list of "pending" (sent but unviewed) orders
    await redis.lpush("orders:pending", orderId);

    // Build WhatsApp link for +233242683892
    const itemLines = cart.map(item => `- ${item.name} (Qty: ${item.qty}) - GHS ${item.price * item.qty}`).join("\n");
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const message = `New Wig Order!🇬🇭\n\nOrder ID: ${orderId}\nName: ${customer.name}\nPhone: ${customer.phone}\nLocation: ${customer.location}\n\nItems:\n${itemLines}\n\nTotal: GHS ${total}`;

    const waLink = `https://wa.me/233242683892?text=${encodeURIComponent(message)}`;

    res.status(200).json({ orderId, waLink });
}