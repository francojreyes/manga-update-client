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
  const instances = await db.getUserInstances();

  const parsedInstanceIdx = parseInt(params.instanceIdx);
  if (isNaN(parsedInstanceIdx) || parsedInstanceIdx >= instances.length) {
    return notFound();
  }

  return children;
};

export default Layout;
