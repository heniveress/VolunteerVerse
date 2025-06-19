import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  AlertColor,
  CircularProgress,
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import { useContext, useEffect, useState } from 'react';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useFetchEventDetails } from '../service/api/event';
import BackgroundBox from '../styles/StyledComponents';
import { formatDateTime } from '../utils/dateFormat';
import { UserContext } from '../UserContext';
import AddTaskModal from '../components/Task/AddTaskModal';
import ImageUpload from '../components/ImageUpload';
import { getEventImageUploadEndpoint } from '../utils/endpointBuilder';
import MoreOptionsButton from '../components/Event/MoreOptionsButton';
import { joinEventPost, resingEventDelete } from '../service/api/volunteer';
import { useFetchBaseSkills } from '../service/api/skill';
import { eventImagePlaceholder } from '../utils/helpers';
import { isMinEventAdmin } from '../utils/roles';
import TaskCard from '../components/Task/TaskCard';

function EventDeatils() {
  const params = useParams();
  const eventId = parseInt(params.eventId || '', 10);
  const { data: event, mutate, isLoading } = useFetchEventDetails(eventId);
  const { data: skills } = useFetchBaseSkills();

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);
  const [isEditEventModalOpen, setEditEventModalOpen] = useState(false);
  const [scrolledToTop, setScrolledToTop] = useState(false);

  const [alertType, setAlertType] = useState<AlertColor>('success');
  const [snackbarText, setSnackbarText] = useState('');

  useEffect(() => {
    if (!scrolledToTop) {
      window.scrollTo(0, 0);
      setScrolledToTop(true);
    }
  }, [scrolledToTop]);

  const formattedStartDate = event?.startTime
    ? formatDateTime(new Date(event.startTime))
    : '';

  const formattedEndDate = event?.endTime
    ? formatDateTime(new Date(event.endTime))
    : '';

  return (
    <Container maxWidth="lg" sx={{ marginTop: '30px', pb: 3 }}>
      {!isLoading ? (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Grid container justifyContent="center" alignItems="center">
              <Tooltip
                title={
                  isMinEventAdmin(event?.roleInEvent) ? 'Change Image' : ''
                }
              >
                <Box
                  sx={{
                    width: { xs: '100%', sm: '350px' },
                    height: '200px',
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: isMinEventAdmin(event?.roleInEvent)
                      ? 'pointer'
                      : 'default',
                  }}
                  onClick={() =>
                    isMinEventAdmin(event?.roleInEvent) &&
                    setIsImageUploadModalOpen(true)
                  }
                >
                  <img
                    src={event?.imageUri || eventImagePlaceholder}
                    alt="event"
                    style={{
                      width: '100%',
                      maxWidth: '350px',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '15px',
                    }}
                  />
                </Box>
              </Tooltip>
              {isMinEventAdmin(event?.roleInEvent) && (
                <ImageUpload
                  endpoint={getEventImageUploadEndpoint(eventId)}
                  isOpen={isImageUploadModalOpen}
                  setIsOpen={setIsImageUploadModalOpen}
                  mutate={mutate}
                />
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} alignContent="center">
            <Typography variant="h4" align="center">
              {event?.name}{' '}
              {event && event.hasEnded && (
                <>
                  <br />
                  <span>
                    <i>( ENDED )</i>
                  </span>
                </>
              )}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            alignContent="center"
            justifyContent="space-between"
          >
            <Grid
              container
              sx={{
                flexDirection: { xs: 'row-reverse', md: 'column' },
                justifyContent: isMinEventAdmin(event?.roleInEvent)
                  ? 'space-between'
                  : 'center',
                alignItems: 'flex-end',
              }}
            >
              {isMinEventAdmin(event?.roleInEvent) && (
                <MoreOptionsButton
                  eventId={eventId}
                  eventDetails={event}
                  isOpen={isEditEventModalOpen}
                  setIsOpen={setEditEventModalOpen}
                  mutate={mutate}
                />
              )}
              {!event?.hasEnded && (
                <Button
                  variant={event?.isJoined ? 'outlined' : 'contained'}
                  startIcon={
                    event?.isJoined ? (
                      <PersonRemoveIcon />
                    ) : (
                      <EventAvailableOutlinedIcon />
                    )
                  }
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                    } else if (!event?.isJoined) {
                      joinEventPost(eventId)
                        .then(() => {
                          setAlertType('success');
                          setSnackbarText('Successfully joined the event!');
                          setOpenSnackBar(true);

                          void mutate();
                        })
                        .catch(() => {
                          setAlertType('error');
                          setSnackbarText('Failed to join the event!');
                          setOpenSnackBar(true);
                        });
                    } else {
                      resingEventDelete(eventId)
                        .then(() => {
                          setAlertType('info');
                          setSnackbarText(
                            'Successfully resigned from the event!',
                          );
                          setOpenSnackBar(true);

                          void mutate();
                        })
                        .catch(() => {
                          setAlertType('error');
                          setSnackbarText('Failed to resign from the event!');
                          setOpenSnackBar(true);
                        });
                    }
                  }}
                  sx={{
                    mt: '0px',
                    '@media (min-width:900px)': {
                      mt: '130px',
                    },
                  }}
                >
                  <Typography>{event?.isJoined ? 'Quit' : 'Join'}</Typography>
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            direction="column"
            sx={{ order: { xs: 2, sm: 1 } }}
          >
            <Grid item xs={12} sx={{ mb: '15px' }}>
              <BackgroundBox>
                <Box>
                  <Typography variant="h6">
                    <b>Description:</b>
                  </Typography>
                  {event?.description}
                </Box>
              </BackgroundBox>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  m: '20px',
                  mt: '30px',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h4">
                  <b>Tasks</b>
                </Typography>

                {isMinEventAdmin(event?.roleInEvent) && !event?.hasEnded && (
                  <>
                    <Tooltip title="Add Task">
                      <IconButton onClick={() => setIsTaskModalOpen(true)}>
                        <AddCircleOutlineOutlinedIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                    <AddTaskModal
                      eventId={eventId}
                      skills={skills}
                      isOpen={isTaskModalOpen}
                      setIsOpen={setIsTaskModalOpen}
                      mutate={mutate}
                    />
                  </>
                )}
              </Box>
            </Grid>

            {event?.tasks.length === 0 && (
              <Typography sx={{ ml: '20px' }}>
                <i>No tasks yet</i>{' '}
              </Typography>
            )}

            <Grid item xs={12} columnSpacing={2}>
              {event?.tasks?.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  skills={skills}
                  eventId={eventId}
                  hasEnded={event.hasEnded}
                  canEdit={isMinEventAdmin(event?.roleInEvent)}
                  isUser={!!user}
                  mutate={mutate}
                  setAlertType={setAlertType}
                  setSnackOpen={setOpenSnackBar}
                  setSnackText={setSnackbarText}
                />
              ))}
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            direction="column"
            sx={{ order: { xs: 1, sm: 2 } }}
          >
            <Grid item xs={12} sx={{ mb: '15px' }}>
              <BackgroundBox>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mb: '10px',
                  }}
                >
                  <AccessTimeIcon />
                  <Typography variant="subtitle1">
                    <b>Event time</b>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography paragraph variant="subtitle1">
                    Starts: {formattedStartDate}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1">
                    Ends: {formattedEndDate}
                  </Typography>
                </Box>
              </BackgroundBox>
            </Grid>
            <Grid item xs={12} sx={{ mb: '15px' }}>
              <BackgroundBox>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mb: '10px',
                  }}
                >
                  <GroupsOutlinedIcon />
                  <Typography variant="subtitle1">
                    <b>Capacity:</b>
                  </Typography>
                  <Typography variant="subtitle1">
                    {event?.applied}/{event?.manpower}
                  </Typography>
                </Box>
              </BackgroundBox>
            </Grid>
            <Grid item xs={12} sx={{ mb: '15px' }}>
              <BackgroundBox>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mb: '10px',
                  }}
                >
                  <LocationOnOutlinedIcon />
                  <Typography variant="subtitle1">
                    <b>Location</b>
                  </Typography>
                </Box>
                <Typography>{event?.location}</Typography>
              </BackgroundBox>
            </Grid>
            <Grid item xs={12} sx={{ mb: '15px' }}>
              <BackgroundBox>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mb: '10px',
                  }}
                >
                  <BusinessOutlinedIcon />
                  <Typography variant="subtitle1">
                    <b>Organizer</b>
                  </Typography>
                </Box>

                <Typography
                  component={Link}
                  to={`/organizations/${event?.organization?.id || ''}`}
                  sx={{ textDecoration: 'none' }}
                >
                  {event?.organization?.name}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mt: '20px',
                  }}
                >
                  <PhoneOutlinedIcon />
                  <Typography variant="subtitle1">{event?.phone}</Typography>
                </Box>
              </BackgroundBox>
            </Grid>
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

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={openSnackBar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackBar(false)}
      >
        <Alert
          variant="filled"
          severity={alertType}
          onClose={() => setOpenSnackBar(false)}
        >
          {snackbarText}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default EventDeatils;
