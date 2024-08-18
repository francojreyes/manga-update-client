import { Chip, ColorPaletteProp } from "@mui/joy";
import React from "react";

const StatusPill: React.FC<{
  status: MangaStatus,
  size: "sm" | "md" | "lg",
}> = ({ status, size }) => {
  let text: string;
  let color: ColorPaletteProp;
  switch (status) {
    case "cancelled":
      text = "Cancelled";
      color = "danger";
      break;
    case "hiatus":
      text = "Hiatus";
      color = "warning";
      break;
    case "completed":
      text = "Completed";
      color = "primary";
      break;
    case "ongoing":
      text = "Ongoing";
      color = "success";
      break;
  }

  return <Chip variant="soft" size={size} color={color}>{text}</Chip>;
};

export default StatusPill;