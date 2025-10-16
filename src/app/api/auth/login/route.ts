import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/jwt';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  try {
    const client = await clientPromise;
    const db = client.db("demo");
    const user = await db.collection("users").findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = await createToken({ userId: user._id.toString(), username: user.username });
      const cookieStore = await cookies();
      cookieStore.set('token', token, { httpOnly: true, path: '/', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 });
      return NextResponse.json({ message: 'Login successful' });
    } else {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error authenticating user" }, { status: 500 });
  }
}