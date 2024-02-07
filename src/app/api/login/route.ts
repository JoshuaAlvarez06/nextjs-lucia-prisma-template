import { lucia } from "@/auth";
import { prisma, redis } from "@/db";
import { getIP } from "@/server";
import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  prefix: "login",
});

export async function POST(req: NextRequest) {
  try {
    const { success } = await ratelimit.limit(getIP(req));
    if (!success)
      return new NextResponse("Rate limit exceeded", { status: 429 });

    const { email, password } = await req.json();
    if (!email || typeof email !== "string") {
      return new NextResponse("Invalid email", {
        status: 400,
      });
    }
    if (!password || typeof password !== "string") {
      return new NextResponse(null, {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      // TODO:
      // Returning immediately allows malicious actors to figure out valid emails from response times,
      // allowing them to only focus on guessing passwords in brute-force attacks.
      // As a preventive measure, you may want to hash passwords even for invalid emails.
      // However, valid emails can be already be revealed with the signup page
      // and a similar timing issue can likely be found in password reset implementation.
      // It will also be much more resource intensive.
      // Since protecting against this is none-trivial,
      // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
      // If emails/usernames are public, you may outright tell the user that the username is invalid.
      return new NextResponse("Invalid email or password", {
        status: 400,
      });
    }

    const validPassword = await argon2.verify(user.hashedPassword, password);
    if (!validPassword) {
      return new NextResponse("Invalid email or password", {
        status: 400,
      });
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: "/",
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  } catch (error) {
    return new NextResponse("INTERNAL SERVER ERROR", {
      status: 500,
    });
  }
}
