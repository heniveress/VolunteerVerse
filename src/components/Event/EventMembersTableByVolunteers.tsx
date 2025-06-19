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
import { Link } from 'react-router-dom';
import { Avatar, Stack } from '@mui/material';
import { EventMembersByVolunteers } from '../../models/event';
import { formatDateTime } from '../../utils/dateFormat';
import BackgroundBox from '../../styles/StyledComponents';
import { TaskPreview } from '../../models/task';
import { monogram } from '../../utils/helpers';

interface RowProps {
  row: EventMembersByVolunteers;
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
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              component={Link}
              src={row.volunteer.profilePicture}
              to={`/profile/${row.volunteer.volunteerId}`}
              sx={{
                textDecoration: 'none',
              }}
            >
              {monogram(row.volunteer.firstName, row.volunteer.lastName)}
            </Avatar>
          </Box>
        </TableCell>
        <TableCell align="center">
          <Typography
            component={Link}
            to={`/profile/${row.volunteer.volunteerId}`}
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            {row.volunteer.firstName}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography
            component={Link}
            to={`/profile/${row.volunteer.volunteerId}`}
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            {row.volunteer.lastName}
          </Typography>
        </TableCell>
        <TableCell align="center">
          {formatDateTime(new Date(row.volunteer.registrationTime))}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <Typography variant="h6" gutterBottom component="div">
                      Tasks
                    </Typography>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.tasks?.map((taskRow: TaskPreview) => (
                    <TableRow key={taskRow.id}>
                      <Stack direction="row" gap={2}>
                        <TaskIcon />
                        <Typography>{taskRow.name}</Typography>
                      </Stack>
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

interface EventMembersTableProps {
  eventMembersByVolunteers: EventMembersByVolunteers[] | undefined;
}

function EventMembersTableByVolunteers({
  eventMembersByVolunteers,
}: EventMembersTableProps) {
  return (
    <TableContainer component={BackgroundBox}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
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
          </TableRow>
        </TableHead>
        <TableBody>
          {eventMembersByVolunteers?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body2" fontStyle="italic">
                  No rows
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            eventMembersByVolunteers?.map((row: EventMembersByVolunteers) => (
              <React.Fragment key={row.volunteer.volunteerId}>
                <Row row={row} />
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EventMembersTableByVolunteers;
