import usePageName from "@/hooks/usePageName";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import React from "react";

export const headerHeight = 55;

interface PageHeaderProps {
  selectedInstance: Instance,
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const PageHeader: React.FC<PageHeaderProps> = ({ selectedInstance, setNavOpen }) => {
  const pageName = usePageName();

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
    <Stack direction="column" spacing={-0.5} justifyContent="center">
      <Typography level="title-md" fontWeight="bold">{pageName}</Typography>
      <Typography level="body-xs" display={{ md: "none" }}>{selectedInstance.name}</Typography>
    </Stack>
  </Sheet>;
};

export default PageHeader;