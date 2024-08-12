import ClientLayout from "./ClientLayout";
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
      idx: 0,
      name: "marshdapro's Instance",
      imgSrc: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&h=80",
    },
    {
      id: "2",
      idx: 1,
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
