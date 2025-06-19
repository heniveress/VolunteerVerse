/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AcceptIcon from '@mui/icons-material/Check';
import DeclineIcon from '@mui/icons-material/Clear';
import TaskIcon from '@mui/icons-material/AssignmentOutlined';
import { Avatar, Stack, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { EventMembersByTasks } from '../../models/event';
import { VolunteerInfo } from '../../models/volunteer';
import { formatDateTime } from '../../utils/dateFormat';
import BackgroundBox from '../../styles/StyledComponents';
import {
  acceptTaskRegistrationPost,
  declineTaskRegistrationkDelete,
} from '../../service/api/event';
import { sendNotificationMessagePost } from '../../service/api/notification';
import { NotificationMessage } from '../../models/notification';
import { monogram } from '../../utils/helpers';
import {
  acceptanceMessage,
  rejectionMessage,
} from '../../utils/notificationMessages';

interface RowProps {
  row: EventMembersByTasks;
  eventId: number;
  eventName: string | undefined;
  mutate: () => Promise<void>;
  mutateNumOfNotifications: () => Promise<void>;
}

function Row({
  row,
  eventId,
  eventName,
  mutate,
  mutateNumOfNotifications,
}: RowProps) {
  const [open, setOpen] = React.useState(true);

  const handleAccept = (registrationId: number, volunteerId: number) => {
    const notificationMessage: NotificationMessage = {
      volunteerId,
      message: acceptanceMessage(eventName || '', row.task.name),
    };
    acceptTaskRegistrationPost(eventId, registrationId)
      .then(() => {
        sendNotificationMessagePost(notificationMessage)
          .then(() => {
            void mutateNumOfNotifications();
          })
          .catch(() => {});
        void mutate();
      })
      .catch(() => {});
  };

  const handleDecline = (registrationId: number, volunteerId: number) => {
    const notificationMessage: NotificationMessage = {
      volunteerId,
      message: rejectionMessage(eventName || '', row.task.name),
    };
    declineTaskRegistrationkDelete(eventId, registrationId)
      .then(() => {
        sendNotificationMessagePost(notificationMessage)
          .then(() => {
            void mutateNumOfNotifications();
          })
          .catch(() => {});
        void mutate();
      })
      .catch(() => {});
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Stack direction="row" gap={2}>
            <TaskIcon />
            <Typography>{row.task.name}</Typography>
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <b>Avatar</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>First Name</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>Last Name</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>Registration time</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>Action</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.volunteers?.map((volunteerRow: VolunteerInfo) => (
                    <TableRow key={volunteerRow.accountId}>
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Avatar
                            component={Link}
                            to={`/profile/${volunteerRow.volunteerId}`}
                            src={volunteerRow.profilePicture}
                            sx={{
                              textDecoration: 'none',
                            }}
                          >
                            {monogram(
                              volunteerRow.firstName,
                              volunteerRow.lastName,
                            )}
                          </Avatar>
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <Typography
                          component={Link}
                          sx={{ textDecoration: 'none', color: 'inherit' }}
                          to={`/profile/${volunteerRow.volunteerId}`}
                        >
                          {volunteerRow.firstName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          component={Link}
                          sx={{ textDecoration: 'none', color: 'inherit' }}
                          to={`/profile/${volunteerRow.volunteerId}`}
                        >
                          {volunteerRow.lastName}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography>
                          {formatDateTime(
                            new Date(volunteerRow.registrationTime),
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Accept">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleAccept(
                                volunteerRow.registrationId || 0,
                                volunteerRow.volunteerId || 0,
                              )
                            }
                          >
                            <AcceptIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Decline">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDecline(
                                volunteerRow.registrationId || 0,
                                volunteerRow.volunteerId || 0,
                              )
                            }
                          >
                            <DeclineIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

interface TaskRegistrationTableProps {
  taskRegistrations: EventMembersByTasks[] | undefined;
  eventId: number;
  eventName: string | undefined;
  mutate: () => Promise<void>;
  mutateNumOfNotifications: () => Promise<void>;
}

function TaskRegistrationTable({
  taskRegistrations,
  eventId,
  eventName,
  mutate,
  mutateNumOfNotifications,
}: TaskRegistrationTableProps) {
  return (
    <TableContainer component={BackgroundBox}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <Typography gutterBottom component="div">
                <b>Applied Volunteers</b>
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {taskRegistrations?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body2" fontStyle="italic">
                  No rows
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            taskRegistrations?.map((row: EventMembersByTasks) => (
              <React.Fragment key={row.task.id}>
                <Row
                  row={row}
                  eventId={eventId}
                  eventName={eventName}
                  mutate={mutate}
                  mutateNumOfNotifications={mutateNumOfNotifications}
                />
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TaskRegistrationTable;
