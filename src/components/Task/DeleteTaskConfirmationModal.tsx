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
import { deleteTask } from '../../service/api/task';

interface DeleteTaskConfirmationModalProps {
  taskId: number;
  mutate: () => Promise<void>;
  setSnackOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertType: React.Dispatch<React.SetStateAction<AlertColor>>;
  setSnackText: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function DeleteTaskConfirmationModal({
  taskId,
  mutate,
  setSnackOpen,
  setAlertType,
  setSnackText,
  isOpen,
  setIsOpen,
}: DeleteTaskConfirmationModalProps) {
  const classes = useStyles();

  const handleDeleteConfirmed = () => {
    deleteTask(taskId)
      .then(() => {
        setAlertType('success');
        setSnackText('Successfully deleted the task!');
        setSnackOpen(true);

        void mutate();
        setIsOpen(false);
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
        <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting this task is irreversible.
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

export default DeleteTaskConfirmationModal;
