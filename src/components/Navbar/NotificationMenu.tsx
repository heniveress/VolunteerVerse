/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import {
  Box,
  Menu,
  Typography,
  Tabs,
  Tab,
  List,
  Button,
  Stack,
  Skeleton,
} from '@mui/material';
import * as React from 'react';
import NotificationListItem from './NotificationListItem';
import { Notification } from '../../models/notification';
import { changeAllNotificationToSeenPatch } from '../../service/api/notification';
import {
  useFetchAllNotifications,
  useFetchUnseenNotifications,
} from '../../service/api/profile';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface NotificationMenuProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateNumOfNotificaitons: () => Promise<void>;
}

function NotificationMenu({
  anchorEl,
  setAnchorEl,
  open,
  setIsOpen,
  mutateNumOfNotificaitons,
}: NotificationMenuProps) {
  const [value, setValue] = React.useState(0);

  const {
    data: allNotifications,
    mutate: mutateAllNotifications,
    isLoading: isLoadingAllNotifications,
  } = useFetchAllNotifications();
  const {
    data: unseenNotifications,
    mutate: mutateUnseenNotifications,
    isLoading: isLoadingUnseenNotifications,
  } = useFetchUnseenNotifications();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  const handleAllRead = () => {
    changeAllNotificationToSeenPatch()
      .then(() => {
        void mutateAllNotifications();
        void mutateUnseenNotifications();
        void mutateNumOfNotificaitons();
      })
      .catch(() => {});
  };

  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6" sx={{ pl: '16px', pr: '16px' }}>
          Notifications
        </Typography>
        <Button onClick={() => handleAllRead()}>
          <Typography variant="body2" sx={{ textTransform: 'none' }}>
            Mark all as read
          </Typography>
        </Button>
      </Stack>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="All" />
            <Tab label="Unread" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {!isLoadingAllNotifications ? (
            <List
              sx={{
                width: { xs: 327, sm: 400 },
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                height: 350,
                cursor: 'default',
              }}
            >
              {allNotifications?.map((notification: Notification) => (
                <NotificationListItem
                  key={notification.id}
                  notification={notification}
                  mutate={mutateAllNotifications}
                  mutateNumOfNotificaitons={mutateNumOfNotificaitons}
                />
              ))}
            </List>
          ) : (
            <Stack spacing={1} sx={{ p: 1 }}>
              <Skeleton
                variant="rounded"
                height={100}
                animation="wave"
                sx={{
                  width: { xs: 327, sm: 400 },
                }}
              />
              <Skeleton
                variant="rounded"
                height={100}
                animation="wave"
                sx={{
                  width: { xs: 327, sm: 400 },
                }}
              />
              <Skeleton
                variant="rounded"
                height={100}
                animation="wave"
                sx={{
                  width: { xs: 327, sm: 400 },
                }}
              />
            </Stack>
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {!isLoadingUnseenNotifications && (
            <List
              sx={{
                width: { xs: 327, sm: 400 },
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 350,
                cursor: 'default',
              }}
            >
              {unseenNotifications !== undefined &&
              unseenNotifications.length > 0 ? (
                unseenNotifications.map((notification: Notification) => (
                  <NotificationListItem
                    key={notification.id}
                    notification={notification}
                    mutate={mutateUnseenNotifications}
                    mutateNumOfNotificaitons={mutateNumOfNotificaitons}
                  />
                ))
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography variant="body2" color="#646365">
                    <i>No unread messages!</i>
                  </Typography>
                </Box>
              )}
            </List>
          )}
        </TabPanel>
      </Box>
    </Menu>
  );
}

export default NotificationMenu;
