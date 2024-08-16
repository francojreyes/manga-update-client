import RemoveMangaModal from "@/components/RemoveMangaModal";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import displayChapter from "@/utils/displayChapter";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Chip, ColorPaletteProp } from "@mui/joy";
import AspectRatio from "@mui/joy/AspectRatio";
import IconButton from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import Sheet from "@mui/joy/Sheet";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import React from "react";

interface MangaTableProps {
  mangaData: Manga[] | undefined;
}

const MangaTable: React.FC<MangaTableProps> = ({ mangaData }) => {
  const instance = useSelectedInstance();
  const [mangaToRemove, setMangaToRemove] = React.useState<Manga>();

  const renderRows = () => {
    if (!mangaData) {
      return Array.from({ length: 5 }, (_, idx) => <SkeletonRow key={idx}/>);
    }

    if (!mangaData.length) {
      return (
        <tr>
          <td colSpan={4}>
            <Typography width="100%" textAlign="center" py={2}>
              No manga found
            </Typography>
          </td>
        </tr>
      );
    }

    return mangaData.map((manga) => (
      <tr key={manga.id}>
        <td>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AspectRatio ratio="1/1.425" sx={{ minWidth: 45, borderRadius: theme => theme.radius.sm }}>
              <Image fill src={manga.cover} alt={`Cover art of ${manga.title}`}/>
            </AspectRatio>
            <Link
              level="title-sm"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              href={`https://mangadex.org/title/${manga.id}`}
              color="neutral"
              sx={{ color: "var(--joy-palette-text-primary)" }}
              target="_blank"
              rel="noopener"
              endDecorator={<OpenInNewIcon/>}
            >
              {manga.title}
            </Link>
          </Stack>
        </td>
        <td>
          <StatusPill status={manga.status}/>
        </td>
        <td>
          <LatestUpdate
            chapter={manga.latestChapter}
            mangaId={manga.id}
          />
        </td>
        <td>
          <IconButton variant="plain" color="danger" onClick={() => setMangaToRemove(manga)}>
            <RemoveCircleOutlineIcon/>
          </IconButton>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Sheet
        variant="outlined"
        sx={{
          display: "initial",
          maxHeight: "100%",
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          stickyHeader
          sx={{
            "--TableCell-headBackground": "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
          <tr>
            <th style={{ padding: "12px 6px" }}>Title</th>
            <th style={{ width: 120, padding: "12px 6px" }}>Status</th>
            <th style={{ width: 200, padding: "12px 6px" }}>Latest Update</th>
            <th style={{ width: 60, padding: "12px 6px" }}></th>
          </tr>
          </thead>
          <tbody>
          {renderRows()}
          </tbody>
        </Table>
      </Sheet>
      <RemoveMangaModal
        instanceId={instance.id}
        mangaToRemove={mangaToRemove}
        onClose={() => setMangaToRemove(undefined)}
      />
    </>
  );
};

const StatusPill: React.FC<{ status: MangaStatus }> = ({ status }) => {
  let text: string;
  let color: ColorPaletteProp;
  switch (status) {
    case "cancelled":
      text = "Cancelled";
      color = "danger";
      break;
    case "hiatus":
      text = "Hiatus";
      color = "warning";
      break;
    case "completed":
      text = "Completed";
      color = "primary";
      break;
    case "ongoing":
      text = "Ongoing";
      color = "success";
      break;
  }

  return <Chip variant="soft" color={color}>{text}</Chip>;
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
    <Typography level="title-sm">
      No chapters found
    </Typography>
  );

  return (
    <Stack direction="column" spacing={chapter ? -0.5 : 0}>
      <Typography level="title-sm">
        <Skeleton loading={isPending}>
          {!isPending
            ? displayChapter(chapter.volume, chapter.chapter)
            : "Volume X, Chapter XX"
          }
        </Skeleton>
      </Typography>
      <Typography level="body-xs">
        <Skeleton loading={isPending}>
          {!isPending
            ? formatDistanceToNowStrict(new Date(chapter.readableAt), { addSuffix: true })
            : "X hours ago"
          }
        </Skeleton>
      </Typography>
    </Stack>
  );
};

const SkeletonRow: React.FC = () => {
  return (
    <tr>
      <td>
        <Stack direction="row" alignItems="center" spacing={2}>
          <AspectRatio ratio="1/1.425" sx={{ minWidth: 45, borderRadius: theme => theme.radius.sm }}>
            <Skeleton/>
          </AspectRatio>
          <Typography level="title-sm">
            <Skeleton>
              This is a relatively long manga title
            </Skeleton>
          </Typography>
        </Stack>
      </td>
      <td>
        <Typography level="title-sm">
          <Skeleton>
            Completed Pill
          </Skeleton>
        </Typography>
      </td>
      <td>
        <Stack direction="column">
          <Typography level="title-sm">
            <Skeleton>
              Volume X, Chapter XX
            </Skeleton>
          </Typography>
          <Typography level="body-xs">
            <Skeleton>
              X hours ago
            </Skeleton>
          </Typography>
        </Stack>
      </td>
      <td>
        <IconButton variant="plain" color="danger">
          <RemoveCircleOutlineIcon/>
          <Skeleton/>
        </IconButton>
      </td>
    </tr>
  );
};

export default MangaTable;
