import usePageName from "@/hooks/usePageName";
import useSelectedInstance from "@/hooks/useSelectedInstance";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import React from "react";

export const headerHeight = 55;

interface PageHeaderProps {
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const PageHeader: React.FC<PageHeaderProps> = ({ setNavOpen }) => {
  const pageName = usePageName();
  const selectedInstance = useSelectedInstance();

  return <Sheet
    component={Stack}
    width={{ xs: "100vw", md: "100%" }}
    height={headerHeight}
    direction="row"
    alignItems="center"
    spacing={1}
    px={1}
    boxShadow="xs"
  >
    <IconButton
      size="md"
      sx={{
        display: { md: "none" }
      }}
      onClick={(e) => {
        e.stopPropagation();
        setNavOpen((prevOpen) => !prevOpen);
      }}
    >
      <MenuIcon/>
    </IconButton>
    <Stack direction="column" justifyContent="center">
      <Typography level="title-md" fontWeight="bold">
        <Skeleton loading={!pageName}>
          {pageName ?? "Placeholder"}
        </Skeleton>
      </Typography>
      <Typography level="body-xs" display={{ md: "none" }}>
        <Skeleton loading={!selectedInstance}>
          {selectedInstance?.name ?? "Placeholder Instance"}
        </Skeleton>
      </Typography>
    </Stack>
  </Sheet>;
};

export default PageHeader;