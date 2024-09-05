import Avatar from "@mui/joy/Avatar";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import React from "react";

interface DiscordUserProps {
  image?: string | null;
  name?: string | null;
  username?: string;
}

const DiscordUser: React.FC<DiscordUserProps> = ({ image, name, username }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1} width={180} overflow="hidden">
      <Avatar src={image ?? ""}>
        <Skeleton loading={!image}/>
      </Avatar>
      <Stack direction="column" spacing={name && username ? -0.5 : 0}>
        <Typography fontWeight="bold" level="title-sm">
          <Skeleton loading={!name} animation="wave">
            {name ?? username ?? "dummy name"}
          </Skeleton>
        </Typography>
        <Typography level="body-xs">
          <Skeleton loading={!username} animation="wave">
            {username ?? "placeholder username"}
          </Skeleton>
        </Typography>
      </Stack>
    </Stack>
  );
};

export default DiscordUser;
