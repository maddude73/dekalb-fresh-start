import { SignJWT, jwtVerify } from 'jose';

interface JwtPayload {
  userId: string;
  username: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any; // Add index signature
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken(payload: JwtPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayload;
  } catch {
    return null;
  }
}