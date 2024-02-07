import { lucia } from "@/auth";
import { prisma, redis } from "@/db";
import { getIP } from "@/server";
import { getUser } from "@/server";
import { Ratelimit } from "@upstash/ratelimit";
import { User } from "lucia";
import { NextRequest, NextResponse } from "next/server";
import { isWithinExpirationDate } from "oslo";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "30 s"),
  prefix: "email-verification",
});

export async function POST(req: NextRequest) {
  const { success } = await ratelimit.limit(getIP(req));
  if (!success) return new NextResponse("Rate limit exceeded", { status: 429 });

  const { code } = await req.json();
  const user = await getUser();
  if (!user) {
    return new NextResponse(null, {
      status: 401,
    });
  }

  if (typeof code !== "string") {
    return new NextResponse(null, {
      status: 400,
    });
  }

  const validCode = await verifyVerificationCode(user, code);
  if (!validCode) {
    return new NextResponse(null, {
      status: 400,
    });
  }

  await lucia.invalidateUserSessions(user.id);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: true,
    },
  });

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": sessionCookie.serialize(),
    },
  });
}

async function verifyVerificationCode(
  user: User,
  code: string
): Promise<boolean> {
  const databaseCode = await prisma.emailVerificationCode.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!databaseCode || databaseCode.code !== code) return false;
  // delete here ?
  if (!isWithinExpirationDate(databaseCode.expiresAt)) {
    return false;
  }
  if (databaseCode.email !== user.email) {
    return false;
  }
  await prisma.emailVerificationCode.delete({
    where: {
      id: databaseCode.id,
    },
  });
  return true;
}
