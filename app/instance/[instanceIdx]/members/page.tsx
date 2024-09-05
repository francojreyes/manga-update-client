"use client";

import MemberList from "@/components/MemberList";
import MembersTable from "@/components/MembersTable";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const instance = useSelectedInstance();
  const { data } = useQuery<{ members: Member[] }>({
    queryKey: ["instance", instance.id, "members"],
    queryFn: () => fetch(`/api/instance/${instance.id}/members`).then((res) => res.json()),
    staleTime: 60 * 1000,
  });

  const [searchInput, setSearchInput] = React.useState("");
  const displayedData = data?.members?.filter((member) =>
    member.global_name.toLowerCase().includes(searchInput) ||
    member.username.toLowerCase()?.includes(searchInput)
  );

  return (
    <>
      <Stack direction="column" p={{ xs: 0, md: 4 }} spacing={{ xs: 1, md: 2 }} width="100%" height="100%">
        <Stack
          direction="row" alignItems="flex-end" width="100%" spacing={1}
          pt={{ xs: 2, md: 0 }} px={{ xs: 1, md: 0 }}
        >
          <Input
            name="Member search"
            sx={{ flexGrow: 1 }}
            placeholder="Search for member"
            startDecorator={<SearchIcon/>}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value.toLowerCase())}
          />
          <Button
            sx={(theme) => ({
              [theme.breakpoints.down("md")]: { display: "none" },
            })}
            startDecorator={<PersonAddIcon/>}
          >
            Invite
          </Button>
          <IconButton
            variant="solid"
            color="primary"
            sx={{ display: { md: "none" } }}
          >
            <PersonAddIcon/>
          </IconButton>
        </Stack>
        <MembersTable members={displayedData}/>
        <MemberList members={displayedData}/>
      </Stack>
    </>
  );
};

export default Page;
