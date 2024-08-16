"use client";

import MangaTable from "@/components/MangaTable";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const instance = useSelectedInstance();

  const { data } = useQuery<{ manga: Manga[] }>({
    queryKey: ["instance", instance!.id, "manga"],
    queryFn: () => fetch(`/api/instance/${instance!.id}/manga`).then((res) => res.json()),
    enabled: !!instance,
  });

  return (
    <Stack direction="column" p={{ xs: 2, md: 4 }} spacing={2} width="100%" height="100%">
      <Stack direction="row" alignItems="flex-end" width="100%" spacing={1}>
        <Input
          sx={{ flexGrow: 1 }}
          placeholder="Search for manga"
          startDecorator={<SearchIcon/>}
        />
        <Button
          sx={(theme) => ({
            [theme.breakpoints.down("md")]: { display: "none" },
          })}
          startDecorator={<AddIcon/>}
        >
          Add Manga
        </Button>
        <IconButton
          variant="solid"
          color="primary"
          sx={{ display: { md: "none" } }}
        >
          <AddIcon/>
        </IconButton>
      </Stack>
      <MangaTable mangaData={data?.manga}/>
    </Stack>
  );
};

export default Page;
