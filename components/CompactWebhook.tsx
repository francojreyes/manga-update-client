import getInitials from "@/utils/getInitials";
import { calculateUserDefaultAvatarIndex, CDN } from "@discordjs/rest";
import { Box } from "@mui/joy";
import Avatar from "@mui/joy/Avatar";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import * as React from "react";

const CompactWebhook: React.FC<{ webhook: Webhook }> = ({ webhook }) => {
  return (
    <Stack direction="column" alignItems="flex-start" width="100%" height="100%" spacing={0.5}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        width="100%"
      >
        <Avatar
          variant="solid"
          src={webhook.guild.icon ? new CDN().icon(webhook.guild.id, webhook.guild.icon) : undefined}
        >
          {getInitials(webhook.guild.name ?? "")}
        </Avatar>
        <Typography
          level="title-md"
          width="100%"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {webhook.guild.name ?? "Unknown server"}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} width="100%" pl="20px">
        <Box
          position="relative"
          top={-5}
          height={15}
          width={30}
          borderLeft={1.5}
          borderBottom={1.5}
          borderColor="var(--joy-palette-text-icon)"
          sx={{ borderBottomLeftRadius: 2 }}
        />
        <Avatar
          size="sm"
          src={webhook.avatar
            ? new CDN().avatar(webhook.id, webhook.avatar)
            : new CDN().defaultAvatar(calculateUserDefaultAvatarIndex(webhook.id))
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
    </Stack>
  );
};

export default CompactWebhook;