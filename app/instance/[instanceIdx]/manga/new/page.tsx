"use client";

import { theme } from "@/app/ProviderRegistry";
import { useDebounceValue } from "@/hooks/useDebouncedValue";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import mangadex from "@/services/mangadex";
import AddIcon from "@mui/icons-material/Add";
import AspectRatio from "@mui/joy/AspectRatio";
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
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

const Page = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [input, debounceInput, setInput] = useDebounceValue("", 500);
  const mangaId = debounceInput.match(UUID_REGEX)?.[0];

  const { data: manga, isPending, error } = useQuery<Manga | null>({
    queryKey: ["manga", mangaId],
    queryFn: () => mangadex.getManga(mangaId!),
    enabled: !!mangaId,
  });

  const queryClient = useQueryClient();
  const selectedInstance = useSelectedInstance();
  const addMangaMutation = useMutation({
    mutationFn: () => fetch(
      `/api/instance/${selectedInstance.id}/manga`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mangaId }),
      }
    ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['instance', selectedInstance.id, "manga"]
      });
      router.back();
    },
  });

  const renderMangaPreview = () => {
    if (error) return (
      <Typography width="100%" textAlign="center" my={2}>
        {`Error: ${error}`}
      </Typography>
    );
    if (isPending) return (
      <Stack direction="row" justifyContent="center" width="100%" py={2}>
        <CircularProgress/>
      </Stack>
    );
    if (manga == null) return (
      <Typography width="100%" textAlign="center" my={2}>
        No manga found
      </Typography>
    );

    return (
      <Stack direction="row" alignItems="center" spacing={2} width="100%" height="100%">
        <AspectRatio ratio="1/1.425" sx={{ width: 70, borderRadius: theme => theme.radius.sm }}>
          <Image fill src={manga.cover} alt={`Cover art of ${manga.title}`}/>
        </AspectRatio>
        <Typography level="title-sm" maxWidth="100%" whiteSpace="wrap">
          {manga.title}
        </Typography>
      </Stack>
    );
  };

  return (
    <Modal open={true} onClose={() => router.back()}>
      <ModalDialog layout={isMobile ? "fullscreen" : "center"} sx={{ width: { xs: "100%", md: 400 } }}>
        <ModalClose/>
        <DialogTitle>Add Manga</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5}>
            <FormControl>
              <FormLabel>Manga URL</FormLabel>
              <Input
                placeholder="https://mangadex.org/title/..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </FormControl>
            {mangaId && (
              <Sheet
                variant="outlined" sx={{
                display: "flex",
                direction: "column",
                justifyContent: "center",
                borderRadius: "sm",
                width: "100%",
                p: 1,
              }}
              >
                {renderMangaPreview()}
              </Sheet>
            )}
            <Button
              disabled={!manga}
              startDecorator={<AddIcon/>}
              loading={addMangaMutation.isPending}
              onClick={() => addMangaMutation.mutate()}
            >
              Add Manga
            </Button>
          </Stack>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default Page;
