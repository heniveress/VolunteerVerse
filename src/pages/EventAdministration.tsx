/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Groups2Icon from '@mui/icons-material/Groups2';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ReviewsIcon from '@mui/icons-material/Reviews';
import {
  useFetchEventMembersByTasks,
  useFetchEventMembersByVolunteers,
  useFetchEventPreview,
  useFetchTaskRegistrations,
} from '../service/api/event';
import TaskRegistrationTable from '../components/Task/TaskRegistrationsTable';
import EventMembersTableByTasks from '../components/Event/EventMembersTableByTasks';
import EventMembersTableByVolunteers from '../components/Event/EventMembersTableByVolunteers';
import { useFetchNumberOfNewNotifications } from '../service/api/profile';
import EventMembersReviewTable from '../components/Event/EventMembersReviewTable';
import { useFetchPendingReviewees } from '../service/api/organization';

function EventAdministration() {
  const params = useParams();
  const eventId = parseInt(params.eventId || '', 10);
  const { data: eventMembersByTasks, isLoading: isLoadingMembersByTasks } =
    useFetchEventMembersByTasks(eventId);
  const {
    data: eventMembersByVolunteers,
    isLoading: isLoadingMembersByVolunteers,
  } = useFetchEventMembersByVolunteers(eventId);

  const { data: eventInfo } = useFetchEventPreview(eventId);

  const {
    mutate,
    data: taskRegistrations,
    isLoading: isLoadingTaskRegistrations,
  } = useFetchTaskRegistrations(eventId);

  const { mutate: mutateNumOfNotifications } =
    useFetchNumberOfNewNotifications();

  const {
    data: pendingReviewees,
    mutate: mutatePendingReviewees,
    isLoading: isLoadingPendingReviewees,
  } = useFetchPendingReviewees(0, eventId);

  const [isView, setIsView] = useState(true);

  return (
    <Container maxWidth="xl" sx={{ marginTop: '40px' }}>
      {!isLoadingMembersByTasks ||
      !isLoadingMembersByVolunteers ||
      !isLoadingPendingReviewees ||
      !isLoadingTaskRegistrations ? (
        <Grid container spacing={2} sx={{ pb: 5 }}>
          <Grid item xs={12}>
            <Typography
              variant="h3"
              sx={{
                mb: '35px',
              }}
            >
              Administration page
            </Typography>
          </Grid>
          <Grid item xs={12} lg={6} order={{ xs: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Stack direction="row" gap={1} alignItems="center">
                <Groups2Icon />
                <Typography variant="h6">Members</Typography>
              </Stack>
              <Button onClick={() => setIsView(!isView)}>
                Change table view
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} lg={6} order={{ xs: 3, lg: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Stack direction="row" gap={1} alignItems="center">
                <ManageAccountsIcon />
                <Typography variant="h6">Manage volunteers</Typography>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} lg={6} order={{ xs: 2 }}>
            {isView ? (
              <EventMembersTableByTasks
                eventMembersByTasks={eventMembersByTasks}
              />
            ) : (
              <EventMembersTableByVolunteers
                eventMembersByVolunteers={eventMembersByVolunteers}
              />
            )}
          </Grid>

          <Grid item xs={12} lg={6} order={{ xs: 4 }}>
            <TaskRegistrationTable
              taskRegistrations={taskRegistrations}
              eventId={eventId}
              eventName={eventInfo?.name}
              mutate={mutate}
              mutateNumOfNotifications={mutateNumOfNotifications}
            />
          </Grid>

          <Grid item xs={12} order={{ xs: 5 }} sx={{ mt: 5 }}>
            <Stack direction="row" gap={1} alignItems="center">
              <ReviewsIcon />
              <Typography variant="h5">
                Review and log volunteers activities
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} order={{ xs: 6 }}>
            <EventMembersReviewTable
              eventId={eventInfo?.id}
              eventName={eventInfo?.name}
              pendingReviewees={pendingReviewees}
              mutatePendingReviewees={mutatePendingReviewees}
              mutateNumOfNotifications={mutateNumOfNotifications}
            />
          </Grid>
        </Grid>
      ) : (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            mt: 8,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
    </Container>
  );
}

export default EventAdministration;
