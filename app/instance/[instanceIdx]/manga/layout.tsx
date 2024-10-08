"use client";

import MangaList from "@/components/MangaList";
import MangaTable from "@/components/MangaTable";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const instance = useSelectedInstance();
  const { data } = useQuery<{ manga: Manga[] }>({
    queryKey: ["instance", instance.id, "manga"],
    queryFn: () => fetch(`/api/instance/${instance.id}/manga`).then((res) => res.json()),
    staleTime: 60 * 1000,
  });

  const [searchInput, setSearchInput] = React.useState("");
  const displayedData = data?.manga?.filter((manga) => manga.title.toLowerCase().includes(searchInput));

  return (
    <>
      <Stack direction="column" p={{ xs: 0, md: 4 }} spacing={{ xs: 1, md: 2 }} width="100%" height="100%">
        <Stack
          direction="row" alignItems="flex-end" width="100%" spacing={1}
          pt={{ xs: 2, md: 0 }} px={{ xs: 1, md: 0 }}
        >
          <Input
            sx={{ flexGrow: 1 }}
            name="Manga Search"
            placeholder="Search for manga"
            startDecorator={<SearchIcon/>}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value.toLowerCase())}
          />
          <Button
            sx={(theme) => ({
              [theme.breakpoints.down("md")]: { display: "none" },
            })}
            startDecorator={<AddIcon/>}
            onClick={() => router.push(`/instance/${instance!.idx}/manga/new`)}
          >
            Add Manga
          </Button>
          <IconButton
            variant="solid"
            color="primary"
            sx={{ display: { md: "none" } }}
            onClick={() => router.push(`/instance/${instance!.idx}/manga/new`)}
          >
            <AddIcon/>
          </IconButton>
        </Stack>
        <MangaTable mangaData={displayedData}/>
        <MangaList mangaData={displayedData}/>
      </Stack>
      {children}
    </>
  );
};

export default Layout;
