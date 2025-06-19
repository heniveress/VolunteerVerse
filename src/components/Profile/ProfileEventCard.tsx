import { Box, Button, Collapse, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import ReviewsIcon from '@mui/icons-material/Reviews';
import { ProfileEvent } from '../../models/event';
import BackgroundBox from '../../styles/StyledComponents';
import { formatDateTime } from '../../utils/dateFormat';
import ReviewFormEvent from '../Review/ReviewFormEvent';
import { eventImagePlaceholder } from '../../utils/helpers';

interface ProfileEventCardProps {
  event: ProfileEvent | undefined;
  volunteerId: number | undefined;
}

function ProfileEventCard({ event, volunteerId }: ProfileEventCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const imageSrc = event?.imageUri || eventImagePlaceholder;
  const formattedStartDate: string = event?.startTime
    ? formatDateTime(new Date(event.startTime))
    : '';
  const formattedEndDate: string = event?.endTime
    ? formatDateTime(new Date(event.endTime))
    : '';

  return (
    <Grid item xs={12} sm={12} md={12}>
      <BackgroundBox sx={{ width: '800px' }}>
        <Grid container spacing={2}>
          <Grid
            item
            display="flex"
            justifyContent={{ xs: 'center', lg: 'flex-start' }}
            xs={12}
            sm={4}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: 160,
              }}
            >
              <img
                alt="complex"
                src={imageSrc}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  borderRadius: '15px',
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} container>
            <Grid item xs container direction="column" spacing={1}>
              <Grid item xs>
                <Typography gutterBottom variant="h5" component="div">
                  {event?.name}
                </Typography>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mb: '10px',
                  }}
                >
                  <BusinessOutlinedIcon />
                  <Typography
                    variant="subtitle1"
                    component={Link}
                    sx={{ textDecoration: 'none' }}
                    to={`/organizations/${event?.organization?.id || ''}`}
                  >
                    <b>Organizer:</b> {event?.organization?.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mb: '10px',
                  }}
                >
                  <AccessTimeIcon />
                  <Typography variant="subtitle1">
                    <b>Start time:</b> {formattedStartDate}
                  </Typography>
                </Box>
                {event?.endTime && (
                  <Grid item>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      <AccessTimeIcon />
                      <Typography variant="subtitle1">
                        <b>End time:</b> {formattedEndDate}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Grid
                item
                container
                justifyContent={event?.hasEnded ? 'space-between' : 'flex-end'}
              >
                {event?.hasEnded && (
                  <Grid item sx={{ mt: '15px', mr: '15px' }}>
                    <Button
                      size="small"
                      startIcon={<ReviewsIcon />}
                      onClick={() => setIsReviewModalOpen(true)}
                    >
                      <Typography sx={{ fontWeight: 'bold' }}>
                        Give review
                      </Typography>
                    </Button>
                    <ReviewFormEvent
                      volunteerId={volunteerId}
                      eventId={event?.id}
                      eventName={event?.name}
                      imageUri={event?.imageUri}
                      isOpen={isReviewModalOpen}
                      setIsOpen={setIsReviewModalOpen}
                    />
                  </Grid>
                )}

                <Box sx={{ display: 'flex', alignContent: 'center' }}>
                  {event?.tasks && event?.tasks?.length > 0 && (
                    <Grid item sx={{ mt: '15px', mr: '15px' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleExpandClick}
                      >
                        <Typography>My tasks</Typography>
                      </Button>
                    </Grid>
                  )}
                  <Grid item sx={{ mt: '15px' }}>
                    <Button
                      size="small"
                      variant="contained"
                      component={Link}
                      to={`/events/${event?.id || ''}/details`}
                    >
                      <Typography>Details</Typography>
                    </Button>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container xs={12} sm={12}>
            <Collapse in={expanded} timeout="auto">
              {event?.tasks[0] ? (
                event?.tasks?.map((task) => (
                  <Grid
                    item
                    xs={12}
                    key={task.name}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <AssignmentOutlinedIcon fontSize="large" />
                    <Typography>&nbsp; {task.name}</Typography>
                  </Grid>
                ))
              ) : (
                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                  <AssignmentOutlinedIcon fontSize="large" />
                  <Typography>&nbsp; PlaceHolder</Typography>
                </Grid>
              )}
            </Collapse>
          </Grid>
        </Grid>
      </BackgroundBox>
    </Grid>
  );
}

export default ProfileEventCard;
