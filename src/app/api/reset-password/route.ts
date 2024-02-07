import { createPasswordResetToken, sendPasswordResetToken } from "@/auth";
import { prisma, redis } from "@/db";
import { env } from "@/env";
import { getIP } from "@/server";
import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest, NextResponse } from "next/server";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "30 s"),
  prefix: "reset-password",
});

export async function POST(req: NextRequest) {
  const { success } = await ratelimit.limit(getIP(req));
  if (!success) return new NextResponse("Rate limit exceeded", { status: 429 });

  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return new NextResponse("Invalid email", {
      status: 400,
    });
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user || !user.emailVerified) {
    return new NextResponse("Invalid email", {
      status: 400,
    });
  }

  const verificationToken = await createPasswordResetToken(user.id);
  const baseUrl = env.BASE_URL;
  const verificationLink = `${baseUrl}/reset-password/${verificationToken}`;

  await sendPasswordResetToken(email, verificationLink);
  return new NextResponse(null, {
    status: 200,
  });
}
