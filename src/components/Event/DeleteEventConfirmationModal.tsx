import {
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
import { useNavigate } from 'react-router-dom';
import useStyles from '../../styles/custom-styles';
import { deleteEvent } from '../../service/api/event';

interface DeleteEventConfirmationModalProps {
  eventId: number;
  mutate: () => Promise<void>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function DeleteEventConfirmationModal({
  eventId,
  mutate,
  isOpen,
  setIsOpen,
}: DeleteEventConfirmationModalProps) {
  const navigate = useNavigate();
  const classes = useStyles();

  const handleDeleteConfirmed = () => {
    deleteEvent(eventId)
      .then(() => {
        void mutate();
        setIsOpen(false);
        navigate(-1);
      })
      .catch(() => {
        setIsOpen(false);
      });
  };

  return (
    <Box>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <DialogTitle>Are you sure you want to delete this event?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting this event is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)}>
            <Typography>Cancel</Typography>
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirmed}
            className={classes.deleteButton}
          >
            <Typography>Delete</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DeleteEventConfirmationModal;
