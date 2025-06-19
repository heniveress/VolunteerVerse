/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkAsReadIcon from '@mui/icons-material/MarkEmailRead';
import CircleIcon from '@mui/icons-material/Circle';
import InfoIcon from '@mui/icons-material/Info';
import * as React from 'react';
import { Notification } from '../../models/notification';
import { formatter } from '../../utils/dateFormat';
import {
  deleteVolunteerNotification,
  changeOneNotificationToSeenPatch,
} from '../../service/api/notification';

interface NotificationListItemProps {
  notification: Notification;
  mutate: () => Promise<void>;
  mutateNumOfNotificaitons: () => Promise<void>;
}

function NotificationListItem({
  notification,
  mutate,
  mutateNumOfNotificaitons,
}: NotificationListItemProps) {
  const avatarBgColor = 'info.main';

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (notificationId: number) => {
    deleteVolunteerNotification(notificationId)
      .then(() => {
        void mutate();
        void mutateNumOfNotificaitons();
      })
      .catch(() => {});
  };

  const handleRead = (notificationId: number) => {
    changeOneNotificationToSeenPatch(notificationId)
      .then(() => {
        void mutate();
        void mutateNumOfNotificaitons();
      })
      .catch(() => {});
  };

  const formattedNotificationTime = formatter(
    new Date(notification.notificationTime),
    new Date(),
  ).value;

  return (
    <>
      <ListItem
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          backgroundColor: !notification.isSeen
            ? '#f5f0eb'
            : 'background.paper',
          '&:hover': {
            backgroundColor: '#f5f0eb',
          },
          display: 'flex',
          alignItems: 'center',
        }}
        secondaryAction={
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                direction: 'column',
              }}
            >
              {isHovered && (
                <IconButton
                  aria-label="more"
                  aria-controls="notification-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                >
                  <MoreHorizIcon />
                </IconButton>
              )}
              {!notification.isSeen && (
                <CircleIcon fontSize="small" color="primary" />
              )}
            </Box>
            <Menu
              id="notification-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {!notification.isSeen && (
                <MenuItem onClick={() => handleRead(notification.id)}>
                  <MarkAsReadIcon fontSize="small" sx={{ marginRight: 1 }} />
                  <Typography>Mark as read</Typography>
                </MenuItem>
              )}

              <MenuItem onClick={() => handleDelete(notification.id)}>
                <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} />
                <Typography>Delete</Typography>
              </MenuItem>
            </Menu>
          </>
        }
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: avatarBgColor }}>
            <InfoIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={notification.message}
          secondary={formattedNotificationTime}
          sx={{ whiteSpace: 'pre-wrap' }}
        />
      </ListItem>
      <Divider />
    </>
  );
}

export default NotificationListItem;
