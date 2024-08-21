"use client";

import { theme } from "@/app/ProviderRegistry";
import CompactWebhook from "@/components/CompactWebhook";
import { useDebounceValue } from "@/hooks/useDebouncedValue";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import parseWebhookURL from "@/utils/parseWebhookURL";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { useMediaQuery } from "@mui/system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

const Page = () => {
  const router = useRouter();
  const params = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [input, debounceInput, setInput] = useDebounceValue(params.get("url") ?? "", 500);
  const parsedWebhook = parseWebhookURL(debounceInput);

  const { data: webhook, isPending, error } = useQuery<Webhook>({
    queryKey: ["webhook", parsedWebhook?.id],
    queryFn: () => fetch(`/api/webhook/${parsedWebhook?.id}/${parsedWebhook?.token}`)
      .then(res => {
        if (!res.ok) throw new Error("Unknown webhook")
        return res.json();
      }),
    enabled: !!parsedWebhook,
    retry: false,
  });

  const queryClient = useQueryClient();
  const selectedInstance = useSelectedInstance();
  const addWebhookMutation = useMutation({
    mutationFn: () => fetch(
      `/api/instance/${selectedInstance.id}/webhooks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedWebhook),
      }
    ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["instance", selectedInstance.id, "webhooks"]
      });
      router.back();
    },
  });

  const renderWebhookPreview = () => {
    if (error) return (
      <Typography width="100%" textAlign="center" my={2}>
        {`${error}`}
      </Typography>
    );
    if (isPending) return (
      <Stack direction="row" justifyContent="center" width="100%" py={2}>
        <CircularProgress/>
      </Stack>
    );

    return (
      <CompactWebhook webhook={webhook}/>
    );
  };

  return (
    <Modal open={true} onClose={() => router.back()}>
      <ModalDialog layout={isMobile ? "fullscreen" : "center"} sx={{ width: { xs: "100%", md: 400 } }}>
        <ModalClose/>
        <DialogTitle>Add Webhook</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5}>
            <FormControl>
              <FormLabel>Webhook URL</FormLabel>
              <Input
                placeholder="https://discord.com/api/webhooks/"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </FormControl>
            {parsedWebhook && (
              <Sheet
                variant="outlined" sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: "sm",
                width: "100%",
                p: 1,
              }}
              >
                {renderWebhookPreview()}
              </Sheet>
            )}
            <Button
              disabled={!webhook}
              startDecorator={<AddIcon/>}
              loading={addWebhookMutation.isPending}
              onClick={() => addWebhookMutation.mutate()}
            >
              Add Webhook
            </Button>
          </Stack>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default Page;
