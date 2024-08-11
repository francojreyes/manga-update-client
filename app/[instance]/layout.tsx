import ClientLayout from "@/app/[instance]/ClientLayout";
import PageHeader from "@/components/PageHeader";
import Sidebar from "@/components/Sidebar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Stack from "@mui/joy/Stack";
import { notFound } from "next/navigation";
import React from "react";

const Layout = ({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { instance: string }
}) => {
  const instances: Instance[] = [
    {
      id: "1",
      name: "marshdapro's Instance",
      imgSrc: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&h=80",
    },
    {
      id: "2",
      name: "Other Instance",
    },
  ];

  const instanceIdx = parseInt(params.instance);
  if (isNaN(instanceIdx) || instanceIdx >= instances.length) {
    return notFound();
  }

  return (
    <ClientLayout instances={instances} selectedInstance={instances[instanceIdx]}>
      {children}
    </ClientLayout>
  );
};

export default Layout;
