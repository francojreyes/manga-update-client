import { auth, signIn } from "@/auth";
import db from "@/services/db";
import { notFound } from "next/navigation";
import React from "react";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { instanceIdx: string },
}) => {
  const session = await auth();
  if (!session) {
    await signIn();
    return;
  }

  const instances = await db.getUserInstances(
    session.user.discordId,
    session.user.name ?? undefined,
  );

  const parsedInstanceIdx = parseInt(params.instanceIdx);
  if (isNaN(parsedInstanceIdx) || parsedInstanceIdx >= instances.length) {
    return notFound();
  }

  return children;
};

export default Layout;
