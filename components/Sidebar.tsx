import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';
import AspectRatio from '@mui/joy/AspectRatio';
import Image from 'next/image';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ListItemContent from '@mui/joy/ListItemContent';
import WebhookIcon from '@mui/icons-material/Webhook';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import React from 'react';
import { headerHeight } from '@/components/PageHeader';

export const navWidth = 300;

interface SidebarProps {
  navOpen: boolean,
  instanceName: string
}

const Sidebar: React.FC<SidebarProps> = ({ navOpen, instanceName }) => {
  return <>
    <Sheet
      component="nav"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ml: { xs: navOpen ? 0 : `-${navWidth + 2}px`, md: 0 },
        transition: '0.1s all',
      }}
    >
      <Stack direction="row" flexGrow={1}>
        <Stack
          width={80} direction="column" alignItems="center" py={2} gap={1} sx={(theme) => ({
          '& > div': {
            boxShadow: 'none',
            transition: '0.1s all',
            '--Card-padding': '0px',
            '--Card-radius': "50%",
            '&:hover': {
              '--Card-radius': theme.radius.lg,
            }
          },
        })}
        >
          <Card variant="outlined" sx={{ width: 50 }}>
            <AspectRatio ratio="1" sx={{ width: 50 }}>
              <Image
                fill
                src="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&h=80"
                alt="Yosemite National Park"
              />
            </AspectRatio>
          </Card>
          <Card
            variant="soft"
            sx={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Typography color="neutral" level="body-lg">I1</Typography>
          </Card>
        </Stack>
        <Divider orientation="vertical"/>
        <Stack direction="column" width={navWidth - 80}>
          <Stack width={navWidth - 80} direction="row" height={headerHeight} alignItems="center" px={1.5}>
            <Typography
              level="title-md"
              fontWeight="bold"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {instanceName}
            </Typography>
          </Stack>
          <Divider/>
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
                  <AutoStoriesIcon/>
                  <ListItemContent>
                    <Typography level="title-sm">Manga List</Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton>
                  <WebhookIcon/>
                  <ListItemContent>
                    <Typography level="title-sm">Webhook List</Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton>
                  <PeopleAltIcon/>
                  <ListItemContent>
                    <Typography level="title-sm">Members</Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton>
                  <SettingsIcon/>
                  <ListItemContent>
                    <Typography level="title-sm">Settings</Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
            </List>
          </Stack>
        </Stack>
      </Stack>
      <Divider/>
      <Stack height={70}/>
    </Sheet>
    <Divider orientation="vertical"/>
  </>;
}

export default Sidebar;