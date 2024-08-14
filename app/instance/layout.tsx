import { auth, signIn } from "@/auth";
import Navigation from "@/components/Navigation";
import db from "@/services/db";
import React from "react";
import InstancesProvider from "./InstancesProvider";

const Layout = async ({
  children,
}: {
  children: React.ReactNode,
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

  return (
    <InstancesProvider instances={instances}>
      <Navigation>
        {children}
      </Navigation>
    </InstancesProvider>
  );
};

export default Layout;
