import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

interface RemoveWebhookModalProps {
  instanceId: number,
  webhookToRemove?: Webhook,
  onClose: () => void,
}

const RemoveWebhookModal: React.FC<RemoveWebhookModalProps> = ({
  instanceId,
  webhookToRemove,
  onClose
}) => {
  const open = !!webhookToRemove;

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => fetch(
      `/api/instance/${instanceId}/webhooks`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: webhookToRemove!.id }),
      }
    ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["instance", instanceId, "webhooks"]
      });
      onClose();
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        aria-labelledby="remove-webhook-modal-title"
        aria-describedby="remove-webhook-modal-description"
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
        <Typography id="remove-webhook-modal-title" level="h2">
          Removing a Webhook
        </Typography>
        <Typography id="remove-webhook-modal-description" textColor="text.tertiary">
          Remove <i>{webhookToRemove?.name}</i> {
            webhookToRemove?.guild?.name ? ["of ", <i key={null}>{webhookToRemove.guild.name }</i>] : ""
          } from this instance? Updates will no longer be sent to this webhook.
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

export default RemoveWebhookModal;
