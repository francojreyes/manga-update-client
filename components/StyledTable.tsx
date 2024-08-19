import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import React from "react";

const StyledTable: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Sheet
      variant="outlined"
      sx={(theme) => ({
        display: "initial",
        maxHeight: "100%",
        width: "100%",
        borderRadius: "sm",
        flexShrink: 1,
        overflow: "auto",
        minHeight: 0,
        [theme.breakpoints.down("md")]: { display: "none" },
      })}
    >
      <Table
        stickyHeader
        sx={{
          "--TableCell-headBackground": "var(--joy-palette-background-level1)",
          "--Table-headerUnderlineThickness": "1px",
          "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
          "--TableCell-paddingY": "4px",
          "--TableCell-paddingX": "8px",
        }}
      >
        {children}
      </Table>
    </Sheet>
  );
};

export default StyledTable;
