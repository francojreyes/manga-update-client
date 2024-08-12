import Navigation from "@/components/Navigation";
import db from "@/services/db";
import React from "react";
import InstancesProvider from "./InstancesProvider";

const Layout = async ({
  children,
}: {
  children: React.ReactNode,
}) => {
  const instances = await db.getUserInstances();

  return (
    <InstancesProvider instances={instances}>
      <Navigation>
        {children}
      </Navigation>
    </InstancesProvider>
  );
};

export default Layout;
