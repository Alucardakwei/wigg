import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET(req) {
    const secret = req.headers.get('x-admin-secret');
    if (secret !== process.env.ADMIN_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const pendingIds = await redis.lrange("orders:pending", 0, -1);
    const orders = await Promise.all(pendingIds.map(id => redis.get(`order:${id}`)));

    return NextResponse.json(orders);
}