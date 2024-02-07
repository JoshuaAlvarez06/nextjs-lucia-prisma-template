import { lucia } from "@/auth";
import { prisma, redis } from "@/db";
import { getIP } from "@/server";
import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest, NextResponse } from "next/server";
import { isWithinExpirationDate } from "oslo";
import argon2 from "argon2";

const ratelimit = new Ratelimit({
  redis: redis,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(1, "5 s"),
  prefix: "reset-password-token",
});

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { success } = await ratelimit.limit(getIP(req));
  if (!success) return new NextResponse("Rate limit exceeded", { status: 429 });

  const { password } = await req.json();
  if (typeof password !== "string" || password.length < 8) {
    return new NextResponse(null, {
      status: 400,
    });
  }

  const verificationToken = params.token;

  const token = await prisma.passwordResetToken.findUnique({
    where: {
      id: verificationToken,
    },
  });
  if (token) {
    await prisma.passwordResetToken.delete({
      where: {
        id: token.id,
      },
    });
  }

  if (!token || !isWithinExpirationDate(token.expiresAt)) {
    return new NextResponse(null, {
      status: 400,
    });
  }

  await lucia.invalidateUserSessions(token.userId);
  const hashedPassword = await argon2.hash(password);
  await prisma.user.update({
    where: {
      id: token.userId,
    },
    data: {
      hashedPassword,
    },
  });

  const session = await lucia.createSession(token.userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": sessionCookie.serialize(),
    },
  });
}
