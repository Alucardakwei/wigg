import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
    const secret = req.headers.get('x-admin-secret');
    if (secret !== process.env.ADMIN_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId } = await req.json();
    await redis.lrem("orders:pending", 0, orderId);

    const existingOrder = await redis.get(`order:${orderId}`);
    if (existingOrder) {
        await redis.set(`order:${orderId}`, JSON.stringify({ ...existingOrder, status: "viewed" }));
    }

    return NextResponse.json({ success: true });
}