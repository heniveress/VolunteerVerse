import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { EventDetails } from '../../models/event';
import EditEventModal from './EditEventModal';
import DeleteEventConfirmationModal from './DeleteEventConfirmationModal';

interface MoreOptionsButtonProps {
  eventId: number;
  eventDetails: EventDetails | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: () => Promise<void>;
}

function MoreOptionsButton({
  eventId,
  eventDetails,
  isOpen,
  setIsOpen,
  mutate,
}: MoreOptionsButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const open = Boolean(anchorEl);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="More options">
          <IconButton
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              setAnchorEl(event.currentTarget);
            }}
            size="small"
            aria-controls={open ? 'more-options-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MoreHorizIcon
              color="secondary"
              sx={{ border: '2px solid', borderRadius: '50%' }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="more-options-menu"
        open={open}
        onClick={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setIsOpen(true)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Edit</Typography>
        </MenuItem>

        <Divider light />

        <MenuItem component={Link} to={`/events/${eventId}/admin`}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Manage</Typography>
        </MenuItem>

        <Divider light />

        <MenuItem onClick={() => setIsDeleteOpen(true)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>

      <EditEventModal
        eventId={eventId}
        eventDetails={eventDetails}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        mutate={mutate}
      />

      <DeleteEventConfirmationModal
        eventId={eventId}
        mutate={mutate}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
      />
    </>
  );
}

export default MoreOptionsButton;
