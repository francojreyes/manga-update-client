// import RemoveMemberModal from "@/components/RemoveMemberModal";
import DiscordUser from "@/components/DiscordUser";
import RemoveMemberModal from "@/components/RemoveMemberModal";
import StyledTable from "@/components/StyledTable";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import { calculateUserDefaultAvatarIndex, CDN } from "@discordjs/rest";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Chip } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import Skeleton from "@mui/joy/Skeleton";
import Typography from "@mui/joy/Typography";
import { useSession } from "next-auth/react";
import React from "react";

interface MembersTableProps {
  members: Member[] | undefined;
}

const MembersTable: React.FC<MembersTableProps> = ({ members }) => {
  const instance = useSelectedInstance();
  const session = useSession();
  const user = session.data?.user;
  const [memberToRemove, setMemberToRemove] = React.useState<Member>();

  const renderRows = () => {
    if (!members) {
      return Array.from({ length: 5 }, (_, idx) => <SkeletonRow key={idx}/>);
    }

    if (!members.length) {
      return (
        <tr>
          <td colSpan={4}>
            <Typography width="100%" textAlign="center" py={2}>
              No members found
            </Typography>
          </td>
        </tr>
      );
    }

    return members.map((member) => (
      <tr key={member.id}>
        <td style={{ height: 60 }}>
          <DiscordUser
            name={member.global_name}
            username={member.username}
            image={member.avatar
              ? new CDN().avatar(member.id, member.avatar)
              : new CDN().defaultAvatar(calculateUserDefaultAvatarIndex(member.id))
            }
          />
        </td>
        <td>
          <Chip variant="soft" size="md" color={member.is_owner ? "primary" : "neutral"}>
            {member.is_owner ? "Owner" : "Member"}
          </Chip>
        </td>
        <td>
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

        </td>
      </tr>
    ));
  };

  return (
    <>
      <StyledTable>
        <thead>
        <tr>
          <th style={{ padding: "12px 8px" }}>Member</th>
          <th style={{ width: 120, padding: "12px 6px" }}>Role</th>
          <th style={{ width: 60, padding: "12px 6px" }}/>
        </tr>
        </thead>
        <tbody>
        {renderRows()}
        </tbody>
      </StyledTable>
      <RemoveMemberModal
        instanceId={instance.id}
        memberToRemove={memberToRemove}
        onClose={() => setMemberToRemove(undefined)}
      />
    </>
  );
};

const SkeletonRow: React.FC = () => {
  return (
    <tr>
      <td>
        <DiscordUser/>
      </td>
      <td>
        <Typography level="title-sm">
          <Skeleton>
            Member Pill
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

export default MembersTable;
