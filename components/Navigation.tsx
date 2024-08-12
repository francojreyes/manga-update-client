"use client";

import PageHeader from "@/components/PageHeader";
import Sidebar from "@/components/Sidebar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Stack from "@mui/joy/Stack";
import React from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const Navigation: React.FC<ClientLayoutProps> = ({ children }) => {
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <Stack direction="row" height="100%" overflow="hidden">
      <Sidebar navOpen={navOpen} setNavOpen={setNavOpen}/>
      <Stack direction="column" width={{ xs: "100vw", md: "100%" }} onClick={() => setNavOpen(false)}>
        <PageHeader setNavOpen={setNavOpen}/>
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
};

export default Navigation;
