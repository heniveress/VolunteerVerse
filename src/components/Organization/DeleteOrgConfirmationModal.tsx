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
import { organizationDelete } from '../../service/api/organization';
import useStyles from '../../styles/custom-styles';

interface DeleteOrgConfirmationModalProps {
  orgId: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function DeleteOrgConfirmationModal({
  orgId,
  isOpen,
  setIsOpen,
}: DeleteOrgConfirmationModalProps) {
  const navigate = useNavigate();
  const classes = useStyles();

  const handleDeleteConfirmed = () => {
    organizationDelete(orgId)
      .then(() => {
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
        <DialogTitle>
          Are you sure you want to delete this organization?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting this organization is irreversible.
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

export default DeleteOrgConfirmationModal;
