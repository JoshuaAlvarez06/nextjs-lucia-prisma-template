import { generateEmailVerificationCode, sendVerificationCode } from "@/auth";
import { redis } from "@/db";
import { getIP, getUser } from "@/server";
import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest, NextResponse } from "next/server";
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "10 s"),
  prefix: "resend-email-verification",
});

export async function POST(req: NextRequest) {
  const { success } = await ratelimit.limit(getIP(req));
  if (!success) return new NextResponse("Rate limit exceeded", { status: 429 });

  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse(null, {
        status: 401,
      });
    }

    const verificationCode = await generateEmailVerificationCode(
      user.id,
      user.email
    );
    await sendVerificationCode(user.email, verificationCode);

    return new NextResponse(null, {
      status: 200,
    });
  } catch (e) {
    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}
