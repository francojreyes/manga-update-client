import DiscordUser from "@/components/DiscordUser";
import RemoveMemberModal from "@/components/RemoveMemberModal";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import { calculateUserDefaultAvatarIndex, CDN } from "@discordjs/rest";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Box, Chip } from "@mui/joy";
import Avatar from "@mui/joy/Avatar";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { useSession } from "next-auth/react";
import React from "react";

interface MemberListProps {
  members: Member[] | undefined;
}

const MemberList: React.FC<MemberListProps> = ({ members }) => {
  const instance = useSelectedInstance();
  const session = useSession();
  const user = session.data?.user;
  const [memberToRemove, setMemberToRemove] = React.useState<Member>();

  const renderItems = () => {
    if (!members) {
      return Array.from({ length: 10 }, (_, idx) => <SkeletonItem key={idx}/>);
    }

    if (!members.length) {
      return <Typography key="none" width="100%" py={2} textAlign="center">No member found</Typography>;
    }

    return members.flatMap((member) => ([
      <ListItem key={member.id}>
        <ListItemContent sx={{ p: 0.5 }}>
          <DiscordUser
            name={member.global_name}
            username={member.username}
            image={member.avatar
              ? new CDN().avatar(member.id, member.avatar)
              : new CDN().defaultAvatar(calculateUserDefaultAvatarIndex(member.id))
            }
          />
        </ListItemContent>
        <Chip variant="soft" size="md" color={member.is_owner ? "primary" : "neutral"}>
          {member.is_owner ? "Owner" : "Member"}
        </Chip>
        {user?.discordId === instance.ownerId && (
          <IconButton
            disabled={member.is_owner}
            variant="plain"
            color="danger"
            onClick={() => setMemberToRemove(member)}
          >
            <RemoveCircleOutlineIcon/>
          </IconButton>
        )}
      </ListItem>,
      <ListDivider key={"divider-" + member.id}/>
    ]));
  };

  return (
    <>
      <List size="sm" sx={{ display: { md: "none" }, overflow: !members ? "hidden" : "auto" }}>
        <ListDivider key="divider-0"/>
        {renderItems()}
      </List>
      <RemoveMemberModal
        instanceId={instance.id}
        memberToRemove={memberToRemove}
        onClose={() => setMemberToRemove(undefined)}
      />
    </>
  );
};

const SkeletonItem: React.FC = () => {
  return (
    <>
      <ListItem>
        <ListItemContent>
          <Stack direction="column" alignItems="flex-start" spacing={0.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar variant="solid">
                <Skeleton/>
              </Avatar>
              <Typography level="title-md">
                <Skeleton>
                  Slightly longer guild name
                </Skeleton>
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} width="100%" pl="20px">
              <Box position="relative" top={-5} height={15} width={30}/>
              <Avatar size="sm">
                <Skeleton/>
              </Avatar>
              <Typography level="title-sm">
                <Skeleton>
                  Shorter member name
                </Skeleton>
              </Typography>
            </Stack>
          </Stack>
        </ListItemContent>
        <IconButton variant="plain">
          <RemoveCircleOutlineIcon/>
          <Skeleton/>
        </IconButton>
      </ListItem>
      <ListDivider/>
    </>
  );
};


export default MemberList;
