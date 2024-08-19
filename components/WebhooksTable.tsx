import RemoveWebhookModal from "@/components/RemoveWebhookModal";
import StyledTable from "@/components/StyledTable";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import getInitials from "@/utils/getInitials";
import snowflakeCreatedAt from "@/utils/snowflakeCreatedAt";
import { calculateUserDefaultAvatarIndex, CDN } from "@discordjs/rest";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Avatar from "@mui/joy/Avatar";
import IconButton from "@mui/joy/IconButton";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { format } from "date-fns";
import React from "react";

const cdn = new CDN();

interface WebhooksTableProps {
  webhooks: Webhook[] | undefined;
}

const WebhooksTable: React.FC<WebhooksTableProps> = ({ webhooks }) => {
  const instance = useSelectedInstance();
  const [webhookToRemove, setWebhookToRemove] = React.useState<Webhook>();

  const renderRows = () => {
    if (!webhooks) {
      return Array.from({ length: 5 }, (_, idx) => <SkeletonRow key={idx}/>);
    }

    if (!webhooks.length) {
      return (
        <tr>
          <td colSpan={4}>
            <Typography width="100%" textAlign="center" py={2}>
              No webhooks found
            </Typography>
          </td>
        </tr>
      );
    }

    return webhooks.map((webhook) => (
      <tr key={webhook.id}>
        <td>
          <Stack direction="row" alignItems="center" spacing={2} width="100%" my={0.5}>
            <Avatar
              src={webhook.avatar
                ? cdn.avatar(webhook.id, webhook.avatar)
                : cdn.defaultAvatar(calculateUserDefaultAvatarIndex(webhook.id))
              }
            />
            <Typography
              level="title-sm"
              width="100%"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {webhook.name}
            </Typography>
          </Stack>
        </td>
        <td>
          <Stack direction="row" alignItems="center" spacing={2} width="100%">
            <Avatar src={webhook.guild.icon ? cdn.icon(webhook.guild.id, webhook.guild.icon) : undefined}>
              {getInitials(webhook.guild.name ?? "")}
            </Avatar>
            <Typography
              level="title-sm"
              width="100%"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {webhook.guild.name ?? "Unknown server"}
            </Typography>
          </Stack>
        </td>
        <td>
          <Typography>
            {format(snowflakeCreatedAt(webhook.id), "d MMM yyyy, p")}
          </Typography>
        </td>
        <td>
          <IconButton variant="plain" color="danger" onClick={() => setWebhookToRemove(webhook)}>
            <RemoveCircleOutlineIcon/>
          </IconButton>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <StyledTable>
        <thead>
        <tr>
          <th style={{ padding: "12px 6px" }}>Webhook</th>
          <th style={{ padding: "12px 6px" }}>Server</th>
          <th style={{ padding: "12px 6px" }}>Created</th>
          <th style={{ width: 60, padding: "12px 6px" }}/>
        </tr>
        </thead>
        <tbody>
        {renderRows()}
        </tbody>
      </StyledTable>
      <RemoveWebhookModal
        instanceId={instance.id}
        webhookToRemove={webhookToRemove}
        onClose={() => setWebhookToRemove(undefined)}
      />
    </>
  );
};

const SkeletonRow: React.FC = () => {
  return (
    <tr>
      <td>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar>
            <Skeleton/>
          </Avatar>
          <Typography>
            <Skeleton>
              This is a webhook name
            </Skeleton>
          </Typography>
        </Stack>
      </td>
      <td>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar>
            <Skeleton/>
          </Avatar>
          <Typography>
            <Skeleton>
              This is a webhook name
            </Skeleton>
          </Typography>
        </Stack>
      </td>
      <td>
        <Typography>
          <Skeleton>
            26/05/2003, 12:45 PM
          </Skeleton>
        </Typography>
      </td>
      <td>
        <IconButton variant="plain" color="danger">
          <RemoveCircleOutlineIcon/>
          <Skeleton/>
        </IconButton>
      </td>
    </tr>
  );
};

export default WebhooksTable;
