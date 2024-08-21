import CompactWebhook from "@/components/CompactWebhook";
import RemoveWebhookModal from "@/components/RemoveWebhookModal";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Box } from "@mui/joy";
import Avatar from "@mui/joy/Avatar";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import Sheet from "@mui/joy/Sheet";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import React from "react";

interface WebhookListProps {
  webhooks: Webhook[] | undefined;
}

const WebhookList: React.FC<WebhookListProps> = ({ webhooks }) => {
  const instance = useSelectedInstance();
  const [webhookToRemove, setWebhookToRemove] = React.useState<Webhook>();

  const renderItems = () => {
    if (!webhooks) {
      return Array.from({ length: 10 }, (_, idx) => <SkeletonItem key={idx}/>);
    }

    if (!webhooks.length) {
      return <Typography key="none" width="100%" py={2} textAlign="center">No webhook found</Typography>;
    }

    return webhooks.flatMap((webhook) => ([
      <ListItem key={webhook.id}>
        <ListItemContent sx={{ p: 0.5}}>
          <CompactWebhook webhook={webhook}/>
        </ListItemContent>
        <IconButton variant="plain" color="danger" onClick={() => setWebhookToRemove(webhook)}>
          <RemoveCircleOutlineIcon/>
        </IconButton>
      </ListItem>,
      <ListDivider key={"divider-" + webhook.id}/>
    ]));
  };

  return (
    <>
      <List size="sm" sx={{ display: { md: "none" }, overflow: !webhooks ? "hidden" : "auto" }}>
        <ListDivider key="divider-0"/>
        {renderItems()}
      </List>
      <RemoveWebhookModal
        instanceId={instance.id}
        webhookToRemove={webhookToRemove}
        onClose={() => setWebhookToRemove(undefined)}
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
                  Shorter webhook name
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


export default WebhookList;
