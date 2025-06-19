import {
  AlertColor,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import React from 'react';
import useStyles from '../../styles/custom-styles';
import { resignEventTaskDelete } from '../../service/api/volunteer';

interface LeaveTaskConfirmationModalProps {
  eventId: number;
  taskId: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: () => Promise<void>;
  setSnackOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertType: React.Dispatch<React.SetStateAction<AlertColor>>;
  setSnackText: React.Dispatch<React.SetStateAction<string>>;
}
function LeaveTaskConfirmationModal({
  eventId,
  taskId,
  isOpen,
  setIsOpen,
  mutate,
  setSnackOpen,
  setAlertType,
  setSnackText,
}: LeaveTaskConfirmationModalProps) {
  const classes = useStyles();

  const handleLeave = () => {
    resignEventTaskDelete(eventId, taskId)
      .then(() => {
        setAlertType('info');
        setSnackText('Successfully resigned from this task!');
        setSnackOpen(true);
        void mutate();
      })
      .catch(() => {
        setAlertType('error');
        setSnackText('Failed to resign from this task!');
        setSnackOpen(true);
      });
    setIsOpen(false);
  };

  return (
    <Box>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <DialogTitle>
          Are you sure you want to resign from this task?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Keep in mind that reapplying after resignation will require
            approval, and you might need to wait for the authorization before
            being able to join again.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsOpen(false)}>
            <Typography>Cancel</Typography>
          </Button>
          <Button
            variant="contained"
            onClick={handleLeave}
            className={classes.deleteButton}
          >
            <Typography>Leave</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LeaveTaskConfirmationModal;
