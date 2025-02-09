import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { prisma } from "@repo/database";

import { auth } from "~/auth";
import { SessionUser } from "~/types/user";

export const verifyUser = cache(async (): Promise<SessionUser> => {
  const session = await auth();

  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      email: true,
      name: true,
      image: true
    }
  });

  if (!user) {
    redirect("/login");
  }

  return user;
});
