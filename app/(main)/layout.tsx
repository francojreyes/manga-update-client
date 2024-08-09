"use client";

import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import React from 'react';
import Sheet from '@mui/joy/Sheet';
import IconButton from '@mui/joy/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import defaultTheme from '@mui/joy/styles/defaultTheme';

const navWidth = 280;

const Layout = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <Stack direction="row" height="100%" overflow="hidden">
      <Stack component="nav" direction="column" ml={{ xs: navOpen ? 0 : "-280px", md: 0 }} sx={{ transition: "0.2s all" }}>
        <Stack direction="row" flexGrow={1}>
          <Sheet sx={{ width: 80 }}/>
          <Divider orientation="vertical"/>
          <Stack direction="column" width={200}>
            <Sheet sx={{ width: "100%", height: 50, boxShadow: "md" }}/>
            <Divider />
            <Sheet sx={{ width: "100%", height: "100%" }}/>
          </Stack>
        </Stack>
        <Divider />
        <Sheet sx={{ height: 70 }}/>
      </Stack>
      <Divider orientation="vertical"/>
      <Stack component="main" direction="column" width={{ xs: "100vw", md: "100%" }} onClick={() => setNavOpen(false)}>
        <Sheet
          component={Stack}
          width={{ xs: "100vw", md: "100%" }}
          height={50}
          justifyContent="flex-start"
          direction="row"
          alignItems="center"
          px={1}
          boxShadow="md"
        >
          <IconButton
            size="md"
            sx={{ [defaultTheme.breakpoints.up('md')]: { display: "none" } }}
            onClick={(e) => {
              e.stopPropagation();
              setNavOpen((prevOpen) => !prevOpen)
            }}
          >
            <MenuIcon/>
          </IconButton>
        </Sheet>
        <Divider/>
        <Box
          width={{ xs: "100vw", md: "100%" }}
          height="100%"
          p={5}
          textOverflow="clip"
          sx={{
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Stack>
    </Stack>
  )
}

export default Layout;
