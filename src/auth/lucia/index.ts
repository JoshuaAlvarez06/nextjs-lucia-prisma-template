import { Lucia, generateId } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "@/db";
import { User } from "@prisma/client";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { sendMail } from "@/server";
import {
  VERIFICATION_CODE_LENGTH,
  renderResetPasswordEmail,
  renderVerificationCodeEmail,
} from "@/constants";
import { env } from "@/env";

export const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (user) => {
    const _user = {
      ...user,
      hashedPassword: undefined,
    };
    return _user as Omit<User, "hashedPassword">;
  },
});

export async function generateEmailVerificationCode(
  userId: string,
  email: string
): Promise<string> {
  await prisma.emailVerificationCode.deleteMany({
    where: {
      userId,
    },
  });
  const code = generateRandomString(VERIFICATION_CODE_LENGTH, alphabet("0-9"));
  await prisma.emailVerificationCode.create({
    data: {
      userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(5, "m")),
    },
  });
  return code;
}

export async function sendVerificationCode(email: string, code: string) {
  return await sendMail({
    to: email,
    subject: "Verify your email",
    body: renderVerificationCodeEmail({ code }),
  });
}

export async function createPasswordResetToken(
  userId: string
): Promise<string> {
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId,
    },
  });
  const tokenId = generateId(40);
  await prisma.passwordResetToken.create({
    data: {
      id: tokenId,
      userId,
      expiresAt: createDate(new TimeSpan(2, "h")),
    },
  });
  return tokenId;
}

export async function sendPasswordResetToken(email: string, link: string) {
  console.log(link);
  return await sendMail({
    to: email,
    subject: "Reset your password",
    body: renderResetPasswordEmail({ link }),
  });
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}
