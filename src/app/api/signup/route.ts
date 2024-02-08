import {
  generateEmailVerificationCode,
  lucia,
  sendVerificationCode,
} from "@/auth";
import { prisma } from "@/db";
import { isValidEmail } from "@/utils";
import { generateId } from "lucia";
import { NextResponse } from "next/server";
import argon2 from "argon2";

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();
    if (!username || typeof username !== "string" || username.length < 3) {
      return new NextResponse("Invalid username", {
        status: 400,
      });
    }
    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return new NextResponse("Invalid email", {
        status: 400,
      });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return new NextResponse("Invalid password", {
        status: 400,
      });
    }

    const hashedPassword = await argon2.hash(password);
    const userId = generateId(15);

    try {
      await prisma.user.create({
        data: {
          id: userId,
          username,
          email,
          hashedPassword: hashedPassword,
        },
      });

      const verificationCode = await generateEmailVerificationCode(
        userId,
        email
      );
      await sendVerificationCode(email, verificationCode);

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      return new NextResponse(null, {
        status: 302,
        headers: {
          Location: "/",
          "Set-Cookie": sessionCookie.serialize(),
        },
      });
    } catch (e) {
      // db error, email taken, etc
      return new NextResponse("Email already used", {
        status: 400,
      });
    }
  } catch (e) {
    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}
