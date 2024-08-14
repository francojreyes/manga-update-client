import { useInstancesContext } from "@/app/instance/InstancesProvider";
import ModeToggle from "@/components/ModeToggle";
import { headerHeight } from "@/components/PageHeader";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import { SvgIconComponent } from "@mui/icons-material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import WebhookIcon from "@mui/icons-material/Webhook";
import AspectRatio from "@mui/joy/AspectRatio";
import Avatar from "@mui/joy/Avatar";
import Card from "@mui/joy/Card";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Sheet from "@mui/joy/Sheet";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import { signOut, useSession } from "next-auth/react";
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
}

const Sidebar: React.FC<SidebarProps> = ({ navOpen, setNavOpen }) => {
  const instances = useInstancesContext();
  const selectedInstance = useSelectedInstance();

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const currentPage = pathSegments[pathSegments.length - 1];
  const instanceIdx = +pathSegments[pathSegments.length - 2];

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
        <Stack width={80} direction="column" alignItems="center" py={2} gap={1}>
          {instances.map((instance) => (
            <InstanceNavItem
              key={instance.id}
              instance={instance}
              selected={instance.idx === instanceIdx}
              currentPage={currentPage}
            />
          ))}
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
              <Skeleton variant="rectangular" width="100%" loading={!selectedInstance}>
                {selectedInstance?.name ?? "Placeholder Instance"}
              </Skeleton>
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
                  href={`/instance/${selectedInstance?.idx ?? 0}${href}`}
                  selected={pathname.endsWith(href)}
                  onClick={() => setNavOpen(false)}
                />
              ))}
            </List>
          </Stack>
        </Stack>
      </Stack>
      <Divider/>
      <UserProfile/>
    </Sheet>
    <Divider orientation="vertical"/>
  </>;
};

interface InstanceNavItemProps {
  instance: Instance;
  selected: boolean;
  currentPage: string;
}

const InstanceNavItem: React.FC<InstanceNavItemProps> = ({ instance, selected, currentPage }) => {
  return (
    <Tooltip title={instance.name} arrow placement="right" sx={{ fontWeight: 500 }}>
      <Card
        component={Link}
        href={`/instance/${instance.idx}/${currentPage}`}
        variant="soft"
        sx={(theme) => ({
          width: 50,
          height: 50,
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "none",
          transition: "0.1s all",
          "--Card-padding": "0px",
          "--Card-radius": selected ? theme.radius.lg : "50%",
          "&::before": {
            content: `""`,
            display: "block",
            width: 14,
            height: selected ? 40 : 0,
            background: "var(--joy-palette-text-primary)",
            position: "absolute",
            left: -25,
            top: 25,
            transform: "translateY(-50%)",
            borderRadius: theme.radius.xs,
            transition: "0.1s all",
          },
          "&:hover": {
            "--Card-radius": theme.radius.lg,
            "&::before": {
              height: { xs: 40, md: selected ? 40 : 25 },
            },
          }
        })}
      >
        {instance.imgSrc
          ? <AspectRatio ratio="1" sx={{ width: 50 }}>
            <Image
              fill
              src={instance.imgSrc}
              alt={`image for ${instance.name}`}
            />
          </AspectRatio>
          : <Typography color="neutral" level="body-lg">
            {instance.name.split(/\s+/).map((word) => word[0].toUpperCase()).join("")}
          </Typography>
        }
      </Card>
    </Tooltip>
  );
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

const UserProfile = () => {
  const session = useSession();
  const userData = session.data?.user;

  return (
    <Stack height={70} width={navWidth} p={2} direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" alignItems="center" spacing={1} width={180} overflow="hidden">
        <Avatar src={userData?.image ?? ""}>
          <Skeleton loading={!userData?.image}/>
        </Avatar>
        <Stack direction="column" spacing={userData ? -0.5 : 0}>
          <Typography fontWeight="bold" level="title-sm">
            <Skeleton loading={!userData?.name} animation="wave">
              {userData?.name ?? "dummy name"}
            </Skeleton>
          </Typography>
          <Typography level="body-xs">
            <Skeleton loading={!userData?.username} animation="wave">
              {userData?.username ?? "placeholder username"}
            </Skeleton>
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <ModeToggle/>
        <Tooltip title="Sign out" arrow placement="top" sx={{ fontWeight: 500 }}>
          <IconButton variant="outlined" color="danger" onClick={() => signOut()}>
            <LogoutIcon/>
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default Sidebar;