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
import TaskIcon from '@mui/icons-material/AssignmentOutlined';
import { Avatar, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { EventMembersByTasks } from '../../models/event';
import { VolunteerInfo } from '../../models/volunteer';
import { formatDateTime } from '../../utils/dateFormat';
import BackgroundBox from '../../styles/StyledComponents';
import { monogram } from '../../utils/helpers';

interface RowProps {
  row: EventMembersByTasks;
}

function Row({ row }: RowProps) {
  const [open, setOpen] = React.useState(false);

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
                      <Typography>
                        <b>Avatar</b>
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>
                        <b>First Name</b>
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>
                        <b>Last Name</b>
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>
                        <b>Registration time</b>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.volunteers?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" fontStyle="italic">
                          No rows
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    row.volunteers?.map((volunteerRow: VolunteerInfo) => (
                      <TableRow key={volunteerRow.accountId}>
                        <TableCell component="th" scope="row">
                          <Box
                            sx={{ display: 'flex', justifyContent: 'center' }}
                          >
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
                            to={`/profile/${volunteerRow.volunteerId}`}
                            sx={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            {volunteerRow.firstName}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            component={Link}
                            to={`/profile/${volunteerRow.volunteerId}`}
                            sx={{ textDecoration: 'none', color: 'inherit' }}
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
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

interface EventMembersTableProps {
  eventMembersByTasks: EventMembersByTasks[] | undefined;
}

function EventMembersTableByTasks({
  eventMembersByTasks,
}: EventMembersTableProps) {
  return (
    <TableContainer component={BackgroundBox}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <Typography>
                <b>Tasks</b>
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {eventMembersByTasks?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body2" fontStyle="italic">
                  No rows
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            eventMembersByTasks?.map((row: EventMembersByTasks) => (
              <React.Fragment key={row.task.id}>
                <Row row={row} />
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EventMembersTableByTasks;
