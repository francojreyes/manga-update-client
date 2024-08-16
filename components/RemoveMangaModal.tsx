import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

interface RemoveMangaModalProps {
  instanceId: number,
  mangaToRemove?: Manga,
  onClose: () => void,
}

const RemoveMangaModal: React.FC<RemoveMangaModalProps> = ({
  instanceId,
  mangaToRemove,
  onClose
}) => {
  const open = !!mangaToRemove;

  const queryClient = useQueryClient();
  const removeMangaMutation = useMutation({
    mutationFn: () => fetch(
      `/api/instance/${instanceId}/manga`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mangaId: mangaToRemove?.id }),
      }
    ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["instance", instanceId, "manga"]
      });
      onClose();
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        aria-labelledby="remove-manga-modal-title"
        aria-describedby="remove-manga-modal-description"
        sx={(theme) => ({
          maxWidth: 500,
          [theme.breakpoints.only("xs")]: {
            top: "unset",
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 0,
            transform: "none",
            maxWidth: "unset",
          },
        })}
      >
        <Typography id="remove-manga-modal-title" level="h2">
          Removing a Manga
        </Typography>
        <Typography id="remove-manga-modal-description" textColor="text.tertiary">
          Remove <i>{mangaToRemove?.title}</i> from this instance? You will no longer receive updates from this manga.
        </Typography>
        <Box
          sx={{
            mt: 1,
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row-reverse" },
          }}
        >
          <Button
            variant="solid"
            color="danger"
            onClick={() => removeMangaMutation.mutate()}
            loading={removeMangaMutation.isPending}
          >
            Remove
          </Button>
          <Button
            variant="outlined"
            color="neutral"
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default RemoveMangaModal;
