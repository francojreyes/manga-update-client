"use client";

import PageHeader from "@/components/PageHeader";
import Sidebar from "@/components/Sidebar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Stack from "@mui/joy/Stack";
import { usePathname } from "next/navigation";
import React from "react";

interface ClientLayoutProps {
  instances: Instance[];
  selectedInstance: Instance;
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ instances, selectedInstance, children }) => {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = React.useState(!!pathname.match(/\/\d+/));

  return (
    <Stack direction="row" height="100%" overflow="hidden">
      <Sidebar navOpen={navOpen} setNavOpen={setNavOpen} instances={instances} selectedInstance={selectedInstance}/>
      <Stack direction="column" width={{ xs: "100vw", md: "100%" }} onClick={() => setNavOpen(false)}>
        <PageHeader selectedInstance={selectedInstance} setNavOpen={setNavOpen}/>
        <Divider/>
        <Box
          component="main"
          width={{ xs: "100vw", md: "100%" }}
          height="100%"
          overflow="hidden auto"
          textOverflow="clip"
        >
          {children}
        </Box>
      </Stack>
    </Stack>
  );
}

export default ClientLayout;
