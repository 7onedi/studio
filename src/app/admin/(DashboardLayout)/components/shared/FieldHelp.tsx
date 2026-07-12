// components/shared/FieldHelp.tsx
import { useState } from "react";
import { IconButton, Popover, Typography, Box } from "@mui/material";
import { IconHelp } from "@tabler/icons-react"; // Modernize використовує tabler-icons, не lucide

interface FieldHelpProps {
  children: React.ReactNode;
}

export function FieldHelp({ children }: FieldHelpProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        aria-label="Довідка"
        sx={{ p: 0.25, color: "text.secondary" }}
      >
        <IconHelp size={16} />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, maxWidth: 320 }}>{children}</Box>
      </Popover>
    </>
  );
}