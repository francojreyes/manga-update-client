import { headerHeight } from "@/components/PageHeader";
import { SvgIconComponent } from "@mui/icons-material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import WebhookIcon from "@mui/icons-material/Webhook";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const navWidth = 300;

const navItems = [
  {
    Icon: AutoStoriesIcon,
    title: "Manga List",
    href: "/manga",
  },
  {
    Icon: WebhookIcon,
    title: "Webhook List",
    href: "/webhooks",
  },
  {
    Icon: PeopleAltIcon,
    title: "Members",
    href: "/members",
  },
  {
    Icon: SettingsIcon,
    title: "Settings",
    href: "/settings",
  },
];

interface SidebarProps {
  navOpen: boolean,
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>,
  selectedInstance: Instance
}

const Sidebar: React.FC<SidebarProps> = ({ navOpen, setNavOpen, selectedInstance }) => {
  const pathname = usePathname();
  const baseUrl = pathname.substring(0, pathname.lastIndexOf("/"));

  return <>
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
        <Stack
          width={80} direction="column" alignItems="center" py={2} gap={1} sx={(theme) => ({
          "& > div": {
            boxShadow: "none",
            transition: "0.1s all",
            "--Card-padding": "0px",
            "--Card-radius": "50%",
            "&:hover": {
              "--Card-radius": theme.radius.lg,
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
            sx={{ width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
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
              {selectedInstance.name}
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
                "--List-nestedInsetStart": "30px",
                "--ListItem-radius": (theme) => theme.vars.radius.sm,
              }}
            >
              {navItems.map(({ Icon, title, href }) => (
                <PageNavItem
                  key={href}
                  Icon={Icon}
                  title={title}
                  href={baseUrl + href}
                  selected={pathname.endsWith(href)}
                  onClick={() => setNavOpen(false)}
                />
              ))}
            </List>
          </Stack>
        </Stack>
      </Stack>
      <Divider/>
      <Stack height={70}/>
    </Sheet>
    <Divider orientation="vertical"/>
  </>;
};

interface PageNavItemProps {
  Icon: SvgIconComponent;
  title: string;
  href: string;
  selected: boolean;
  onClick: () => void;
}

const PageNavItem: React.FC<PageNavItemProps> = ({ Icon, title, href, selected, onClick }) => {
  return (
    <ListItem>
      <ListItemButton selected={selected} component={Link} href={href} onClick={onClick}>
        <Icon/>
        <ListItemContent>
          <Typography level="title-sm">{title}</Typography>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  );
};

export default Sidebar;