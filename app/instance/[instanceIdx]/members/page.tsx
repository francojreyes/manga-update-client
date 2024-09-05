"use client";

import MemberList from "@/components/MemberList";
import MembersTable from "@/components/MembersTable";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/joy/Button";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const instance = useSelectedInstance();
  const { data } = useQuery<{ members: Member[] }>({
    queryKey: ["instance", instance.id, "members"],
    queryFn: () => fetch(`/api/instance/${instance.id}/members`).then((res) => res.json()),
    staleTime: 60 * 1000,
  });

  const { data: invite } = useQuery<{ inviteCode: string }>({
    queryKey: ["instance", instance.id, "invite"],
    queryFn: () => fetch(`/api/instance/${instance.id}/invite`).then((res) => res.json()),
    staleTime: Infinity,
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
          <InviteButton
            button={
              <MenuButton
                color="primary"
                variant="solid"
                startDecorator={<PersonAddIcon/>}
                sx={(theme) => ({
                  [theme.breakpoints.down("md")]: { display: "none" },
                })}
              >
                Invite
              </MenuButton>
            }
            inviteCode={invite?.inviteCode}
          />
          <InviteButton
            button={
              <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: "solid", color: "primary" } }}
                sx={{ display: { md: "none" } }}
              >
                <PersonAddIcon/>
              </MenuButton>
            }
            inviteCode={invite?.inviteCode}
          />
        </Stack>
        <MembersTable members={displayedData}/>
        <MemberList members={displayedData}/>
      </Stack>
    </>
  );
};

const InviteButton = ({ button, inviteCode }: { button: React.ReactNode, inviteCode?: string }) => {
  return (
    <Dropdown>
      {button}
      <Menu placement="bottom-end" variant="soft">
        <Stack direction="row" spacing={1} alignItems="center" px={1} py={0.5}>
          <Typography level="title-lg">Invite Code:</Typography>
          <Button
            variant="outlined"
            color="primary"
            size="lg"
            endDecorator={inviteCode && <ContentCopyIcon color="primary"/>}
            loading={!inviteCode}
            sx={{
              p: 1,
              letterSpacing: 2,
            }}
          >
            {inviteCode ?? "ABC123 456"}
          </Button>
        </Stack>
      </Menu>
    </Dropdown>
  )
}

export default Page;
