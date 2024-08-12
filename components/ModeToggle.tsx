import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/joy/IconButton";
import { useColorScheme } from "@mui/joy/styles";
import Tooltip from "@mui/joy/Tooltip";
import React from "react";

const ModeToggle = () => {
  const { mode, setMode } = useColorScheme();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <IconButton variant="outlined" color="neutral" size="sm" loading/>;
  }

  return (
    <Tooltip
      title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
      arrow
      placement="top"
      sx={{ fontWeight: 500 }}
    >
      <IconButton
        variant="outlined"
        color="neutral"
        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      >
        {mode === "dark" ? <LightModeIcon/> : <DarkModeIcon/>}
      </IconButton>
    </Tooltip>
  );
};

export default ModeToggle;
