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
import {
  leaveOrganizationDelete,
  organizationDelete,
} from '../../service/api/organization';
import useStyles from '../../styles/custom-styles';
import { OrganizationMember } from '../../models/organization';

interface LeaveOrganizationModalProps {
  orgId: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  orgMembers: OrganizationMember[] | undefined;
}
function LeaveOrganizationModal({
  orgId,
  isOpen,
  setIsOpen,
  orgMembers,
}: LeaveOrganizationModalProps) {
  const navigate = useNavigate();
  const classes = useStyles();
  const isLastMember = orgMembers?.length === 1;

  const handleLeave = () => {
    if (isLastMember) {
      organizationDelete(orgId)
        .then(() => {
          setIsOpen(false);
          navigate(-1);
        })
        .catch(() => {
          setIsOpen(false);
        });
    } else {
      leaveOrganizationDelete(orgId)
        .then(() => {
          setIsOpen(false);
          navigate(-1);
        })
        .catch(() => {
          setIsOpen(false);
        });
    }
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
          {isLastMember
            ? 'You are the LAST member in this organization.'
            : 'Are you sure you want to leave this organization?'}
        </DialogTitle>
        {isLastMember && (
          <DialogContent>
            <DialogContentText>
              Leaving will <b>DELETE</b> the organization.
              <br />
              <b>Are you sure you want to leave this organization?</b>
            </DialogContentText>
          </DialogContent>
        )}

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

export default LeaveOrganizationModal;
