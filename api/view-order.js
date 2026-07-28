import { Redis } from "@upstash/redis";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
    if (req.headers["x-admin-secret"] !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const { orderId } = req.body;

    // Remove from the "pending" list
    await redis.lrem("orders:pending", 0, orderId);

    // Update the order's status to viewed
    const existingOrder = await redis.get(`order:${orderId}`);
    if (existingOrder) {
        const updatedOrder = { ...existingOrder, status: "viewed" };
        await redis.set(`order:${orderId}`, JSON.stringify(updatedOrder));
    }

    res.status(200).json({ success: true });
}