import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  content: React.ReactElement;
};

const Epidemiology = ({ open, onClose, content }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Epidemiology</DialogTitle>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
};

export default Epidemiology;
