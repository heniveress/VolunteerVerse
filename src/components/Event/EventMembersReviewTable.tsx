import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Avatar, IconButton, Tooltip, Typography } from '@mui/material';
import AddReviewIcon from '@mui/icons-material/PostAdd';
import { useState } from 'react';
import BackgroundBox from '../../styles/StyledComponents';
import { VolunteerInfoForReview } from '../../models/volunteer';
import ReviewFormVolunteer from '../Review/ReviewFormVolunteer';
import { monogram } from '../../utils/helpers';

interface EventMembersReviewTableProps {
  eventId: number | undefined;
  eventName: string | undefined;
  pendingReviewees: VolunteerInfoForReview[] | undefined;
  mutatePendingReviewees: () => Promise<void>;
  mutateNumOfNotifications: () => Promise<void>;
}

function EventMembersReviewTable({
  eventId,
  eventName,
  pendingReviewees,
  mutatePendingReviewees,
  mutateNumOfNotifications,
}: EventMembersReviewTableProps) {
  const [isOpenArray, setIsOpenArray] = useState<boolean[]>(
    Array(pendingReviewees?.length).fill(false),
  );

  const handleOpenModal = (index: number) => {
    const newIsOpenArray = [...isOpenArray];
    newIsOpenArray[index] = true;
    setIsOpenArray(newIsOpenArray);
  };

  const handleCloseModal = (index: number) => {
    const newIsOpenArray = [...isOpenArray];
    newIsOpenArray[index] = false;
    setIsOpenArray(newIsOpenArray);
  };

  return (
    <TableContainer component={BackgroundBox}>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <b>Avatar</b>
            </TableCell>
            <TableCell align="left">
              <b>First Name</b>
            </TableCell>
            <TableCell align="left">
              <b>Last Name</b>
            </TableCell>
            <TableCell align="center">
              <b>Action</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingReviewees?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography variant="body2" fontStyle="italic">
                  No rows
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            pendingReviewees?.map((row, index) => (
              <>
                <TableRow
                  key={row.volunteerId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Avatar src={row.profilePictureUri || undefined}>
                      {monogram(row.firstName, row.lastName)}
                    </Avatar>
                  </TableCell>
                  <TableCell align="left">{row.firstName}</TableCell>
                  <TableCell align="left">{row.lastName}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Add review">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenModal(index)}
                      >
                        <AddReviewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                <ReviewFormVolunteer
                  volunteerId={row.volunteerId}
                  firstName={row.firstName}
                  lastName={row.lastName}
                  profilePictureUri={row.profilePictureUri || undefined}
                  eventId={eventId}
                  eventName={eventName}
                  isOpen={isOpenArray[index]}
                  setIsOpen={() => handleCloseModal(index)}
                  mutatePendingReviewees={mutatePendingReviewees}
                  mutateNumOfNotifications={mutateNumOfNotifications}
                />
              </>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EventMembersReviewTable;
