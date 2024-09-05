import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

interface RemoveMemberModalProps {
  instanceId: number,
  memberToRemove?: Member,
  onClose: () => void,
}

const RemoveMemberModal: React.FC<RemoveMemberModalProps> = ({
  instanceId,
  memberToRemove,
  onClose
}) => {
  const open = !!memberToRemove;

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => fetch(
      `/api/instance/${instanceId}/members`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: memberToRemove!.id }),
      }
    ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["instance", instanceId, "members"]
      });
      onClose();
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        aria-labelledby="remove-member-modal-title"
        aria-describedby="remove-member-modal-description"
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
        <Typography id="remove-member-modal-title" level="h2">
          Removing a Member
        </Typography>
        <Typography id="remove-member-modal-description" textColor="text.tertiary">
          Remove <i>{memberToRemove?.global_name}</i> (<i>{memberToRemove?.username}</i>) from this instance?
          They will no longer be able to manage this instance&apos;s manga and webhooks.
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
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
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

export default RemoveMemberModal;
