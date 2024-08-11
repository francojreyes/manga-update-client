"use client";

import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import React from 'react';
import Sheet from '@mui/joy/Sheet';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import WebhookIcon from '@mui/icons-material/Webhook';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import Image from 'next/image';

const navWidth = 300;
const topHeight = 55;

const Layout = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  const [navOpen, setNavOpen] = React.useState(false);

  const pageName = "Manga List";
  const instanceName = "marshdapro's Instance";

  return (
    <Stack direction="row" height="100%" overflow="hidden">
      <Sheet
        component="nav"
        sx={{
          display: "flex",
          flexDirection: "column",
          ml: { xs: navOpen ? 0 : `-${navWidth + 2}px`, md: 0 },
          transition: "0.1s all",
        }}
      >
        <Stack direction="row" flexGrow={1}>
          <Stack width={80} direction="column" alignItems="center" py={2} gap={1} sx={(theme) => ({
            '& > div': {
              boxShadow: 'none',
              transition: '0.1s all',
              '--Card-padding': '0px',
              '--Card-radius': "50%",
              '&:hover': {
                '--Card-radius': theme.radius.lg,
              }
            },
          })}>
            <Card variant="outlined" sx={{ width: 50 }}>
              <AspectRatio ratio="1" sx={{ width: 50 }} >
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&h=80"
                  alt="Yosemite National Park"
                />
              </AspectRatio>
            </Card>
            <Card variant="soft" sx={{ width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography color="neutral" level="body-lg">I1</Typography>
            </Card>
          </Stack>
          <Divider orientation="vertical"/>
          <Stack direction="column" width={navWidth - 80}>
            <Stack width="100%" direction="row" height={topHeight} alignItems="center" pl={1.5}>
              <Typography level="title-md" fontWeight="bold">{instanceName}</Typography>
            </Stack>
            <Divider />
            <Stack
              width="100%"
              height="100%"
              overflow="hidden auto"
              p={1}
              sx={{
                [`& .${listItemButtonClasses.root}`]: {
                  gap: 1.5,
                }
              }}
            >
              <List
                size="sm"
                sx={{
                  gap: 1,
                  '--List-nestedInsetStart': '30px',
                  '--ListItem-radius': (theme) => theme.vars.radius.sm,
                }}
              >
                <ListItem>
                  <ListItemButton selected>
                    <AutoStoriesIcon />
                    <ListItemContent>
                      <Typography level="title-sm">Manga List</Typography>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <WebhookIcon />
                    <ListItemContent>
                      <Typography level="title-sm">Webhook List</Typography>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <PeopleAltIcon />
                    <ListItemContent>
                      <Typography level="title-sm">Members</Typography>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <SettingsIcon />
                    <ListItemContent>
                      <Typography level="title-sm">Settings</Typography>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
              </List>
            </Stack>
          </Stack>
        </Stack>
        <Divider />
        <Stack height={70} />
      </Sheet>
      <Divider orientation="vertical" />
      <Stack component="main" direction="column" width={{ xs: "100vw", md: "100%" }} onClick={() => setNavOpen(false)}>
        <Sheet
          component={Stack}
          width={{ xs: "100vw", md: "100%" }}
          height={topHeight}
          direction="row"
          alignItems="center"
          spacing={1}
          px={1}
          boxShadow="xs"
        >
          <IconButton
            size="md"
            sx={{
              display: { md: "none" }
            }}
            onClick={(e) => {
              e.stopPropagation();
              setNavOpen((prevOpen) => !prevOpen)
            }}
          >
            <MenuIcon/>
          </IconButton>
          <Stack direction="column" spacing={-0.5} justifyContent="center">
            <Typography level="title-md" fontWeight="bold">{pageName}</Typography>
            <Typography level="body-xs" display={{ md: "none" }}>{instanceName}</Typography>
          </Stack>
        </Sheet>
        <Divider/>
        <Box
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
