"use client";

import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import React from 'react';

import Sidebar from '@/components/Sidebar';
import PageHeader from '@/components/PageHeader';

const Layout = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  const [navOpen, setNavOpen] = React.useState(false);

  const pageName = "Manga List";
  const instanceName = "marshdapro's Fav Instance";

  return (
    <Stack direction="row" height="100%" overflow="hidden">
      <Sidebar navOpen={navOpen} instanceName={instanceName}/>
      <Stack direction="column" width={{ xs: "100vw", md: "100%" }} onClick={() => setNavOpen(false)}>
        <PageHeader pageName={pageName} instanceName={instanceName} setNavOpen={setNavOpen}/>
        <Divider/>
        <Box
          component="main"
          width={{ xs: "100vw", md: "100%" }}
          height="100%"
          p={6}
          overflow="hidden auto"
          textOverflow="clip"
        >
          {children}
        </Box>
      </Stack>
    </Stack>
  )
}

export default Layout;
