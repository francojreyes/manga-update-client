"use client";

import WebhooksTable from "@/components/WebhooksTable";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

const Layout = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  const router = useRouter();
  const instance = useSelectedInstance();
  const { data } = useQuery<{ webhooks: Webhook[] }>({
    queryKey: ["instance", instance.id, "webhooks"],
    queryFn: () => fetch(`/api/instance/${instance.id}/webhooks`).then((res) => res.json()),
    staleTime: 60 * 1000,
  });

  const queryClient = useQueryClient();
  const refB = React.useRef<HTMLInputElement>(null);
  const add = useMutation({
    mutationFn: () => {
      const parts = (refB.current?.value ?? "//").split("/").filter(Boolean);
      return fetch(
        `/api/instance/${instance.id}/webhooks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: parts[parts.length - 2], token: parts[parts.length - 1] }),
        }
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["instance", instance.id, "webhooks"]
      });
    },
  });


  return (
    <>
      <Stack direction="column" p={{ xs: 0, md: 4 }} spacing={{ xs: 1, md: 2 }} width="100%" height="100%">
        <Stack
          direction="row" alignItems="flex-end" width="100%" spacing={1}
          pt={{ xs: 2, md: 0 }} px={{ xs: 1, md: 0 }}
        >
          <Input
            sx={{ flexGrow: 1 }}
            placeholder="Search for webhook or server"
            slotProps={{ input: { ref: refB } }}
            startDecorator={<SearchIcon/>}
          />
          <Button
            sx={(theme) => ({
              [theme.breakpoints.down("md")]: { display: "none" },
            })}
            startDecorator={<AddIcon/>}
            onClick={() => add.mutate()}
            // onClick={() => router.push(`/instance/${instance!.idx}/webhooks/new`)}
          >
            Add Webhook
          </Button>
          <IconButton
            variant="solid"
            color="primary"
            sx={{ display: { md: "none" } }}
            onClick={() => router.push(`/instance/${instance!.idx}/webhooks/new`)}
          >
            <AddIcon/>
          </IconButton>
        </Stack>
        <WebhooksTable webhooks={data?.webhooks}/>
      </Stack>
      {children}
    </>
  )
}

export default Layout;
