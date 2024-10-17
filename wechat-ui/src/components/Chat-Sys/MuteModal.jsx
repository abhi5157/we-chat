import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

const MuteModal = ({ open, onClose, onMute }) => {
  const [duration, setDuration] = React.useState("15");

  const handleChange = (event) => {
    setDuration(event.target.value);
  };

  const handleMute = () => {
    onMute(duration);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Mute Conversation</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup value={duration} onChange={handleChange}>
            <FormControlLabel
              value="15"
              control={<Radio />}
              label="For 15 Minutes"
            />
            <FormControlLabel
              value="60"
              control={<Radio />}
              label="For 01 Hour"
            />
            <FormControlLabel
              value="1440"
              control={<Radio />}
              label="For 01 Day"
            />
            <FormControlLabel
              value="indefinite"
              control={<Radio />}
              label="Until I turn back on"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="white">
          Cancel
        </Button>
        <Button
          onClick={handleMute}
          color="primary"
          style={{ backgroundColor: "#26A69A" }}
          variant="contained"
        >
          Mute
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MuteModal;
