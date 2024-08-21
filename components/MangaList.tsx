import RemoveMangaModal from "@/components/RemoveMangaModal";
import StatusPill from "@/components/StatusPill";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import MoreVert from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AspectRatio from "@mui/joy/AspectRatio";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import React from "react";


interface MangaListProps {
  mangaData: Manga[] | undefined;
}

const MangaList: React.FC<MangaListProps> = ({ mangaData }) => {
  const instance = useSelectedInstance();
  const [mangaToRemove, setMangaToRemove] = React.useState<Manga>();

  const renderItems = () => {
    if (!mangaData) {
      return Array.from({ length: 10 }, (_, idx) => <SkeletonItem key={idx}/>);
    }

    if (!mangaData.length) {
      return <Typography key="none" width="100%" py={2} textAlign="center">No manga found</Typography>;
    }

    return mangaData.flatMap((manga) => ([
      <ListItem key={manga.id}>
        <ListItemContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <ListItemDecorator sx={{ minWidth: 45 }}>
            <AspectRatio ratio="1/1.425" sx={{ minWidth: 45, borderRadius: theme => theme.radius.sm }}>
              <Image fill sizes="45px" src={manga.cover} alt={`Cover art of ${manga.title}`}/>
            </AspectRatio>
          </ListItemDecorator>
          <Stack spacing={0.5}>
            <Typography level="title-sm">
              {manga.title}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <StatusPill size="sm" status={manga.status}/>
              <LatestUpdate chapter={manga.latestChapter} mangaId={manga.id}/>
            </Stack>
          </Stack>
        </ListItemContent>
        <Dropdown>
          <MenuButton
            slots={{ root: IconButton }}
            slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
          >
            <MoreVert/>
          </MenuButton>
          <Menu size="sm" placement="bottom-end">
            <MenuItem
              component={Link} underline="none"
              href={`https://mangadex.org/title/${manga.id}`}
              target="_blank"
              rel="noopener"
            >
              <ListItemDecorator sx={{ color: "inherit" }}>
                <OpenInNewIcon/>
              </ListItemDecorator>
              MangaDex
            </MenuItem>
            <ListDivider/>
            <MenuItem color="danger" onClick={() => setMangaToRemove(manga)}>
              <ListItemDecorator sx={{ color: "inherit" }}>
                <RemoveCircleOutlineIcon/>
              </ListItemDecorator>
              Remove
            </MenuItem>
          </Menu>
        </Dropdown>
      </ListItem>,
      <ListDivider key={"divider-" + manga.id}/>
    ]));
  };

  return (
    <>
      <List size="sm" sx={{ display: { md: "none" }, overflow: !mangaData ? "hidden" : "auto" }}>
        <ListDivider key="divider-0"/>
        {renderItems()}
      </List>
      <RemoveMangaModal
        instanceId={instance.id}
        mangaToRemove={mangaToRemove}
        onClose={() => setMangaToRemove(undefined)}
      />
    </>
  );
};

const LatestUpdate: React.FC<{
  chapter?: Chapter,
  mangaId: string,
  language?: string,
}> = (props) => {
  const { data: chapter, isPending, error } = useQuery<Chapter | null>({
    queryKey: ["manga", props.mangaId, "latest"],
    queryFn: async () => {
      const res = await fetch(`/api/manga/${props.mangaId}/latest?language=${props.language ?? "en"}`);
      if (!res.ok) return null;
      return res.json();
    },
    initialData: props.chapter,
    enabled: !props.chapter,
    gcTime: Infinity,
    staleTime: Infinity,
  });

  if (error || chapter === null) return (
    <Typography level="body-xs">
      No updates
    </Typography>
  );

  return (
    <Typography level="body-xs">
      <Skeleton loading={isPending}>
        Updated {!isPending
        ? formatDistanceToNowStrict(new Date(chapter.readableAt), { addSuffix: true })
        : "X days ago"
      }
      </Skeleton>
    </Typography>
  );
};

const SkeletonItem: React.FC = () => {
  return (
    <>
      <ListItem>
        <ListItemContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <ListItemDecorator sx={{ minWidth: 45 }}>
            <AspectRatio ratio="1/1.425" sx={{ minWidth: 45, borderRadius: theme => theme.radius.sm }}>
              <Skeleton/>
            </AspectRatio>
          </ListItemDecorator>
          <Stack spacing={0.5}>
            <Typography level="title-sm">
              <Skeleton>
                This is a relatively long manga title
              </Skeleton>
            </Typography>
            <Typography level="body-xs">
              <Skeleton>
                Completed, updated 4 months ago
              </Skeleton>
            </Typography>
          </Stack>
        </ListItemContent>
      </ListItem>
      <ListDivider/>
    </>
  );
};


export default MangaList;
