import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { EventPreview } from '../../models/event';
import BackgroundBox from '../../styles/StyledComponents';
import { formatDateTime } from '../../utils/dateFormat';
import { eventImagePlaceholder } from '../../utils/helpers';

interface EventCardProps {
  event: EventPreview | undefined;
}

function EventCard({ event }: EventCardProps) {
  const imageSrc = event?.imageUri || eventImagePlaceholder;

  const formattedDate = event?.startTime
    ? formatDateTime(new Date(event.startTime))
    : '';

  return (
    <BackgroundBox>
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
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={1}>
            <Grid item xs>
              <Typography gutterBottom variant="h5" component="div">
                {event?.name}
              </Typography>
            </Grid>
            <Grid item>
              <Box display="flex" alignItems="center" gap={0.5}>
                <BusinessOutlinedIcon fontSize="small" />
                <Typography variant="subtitle1">
                  <b>Organizer:</b> {event?.organization?.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box display="flex" alignItems="center" gap={0.5}>
                <LocationOnOutlinedIcon fontSize="small" />
                <Typography variant="subtitle1">
                  <b>Location:</b> {event?.location}
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box display="flex" alignItems="center" gap={0.5}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="subtitle1">
                  <b>Start time:</b> {formattedDate}
                </Typography>
              </Box>
            </Grid>

            <Grid item container justifyContent="flex-end">
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
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </BackgroundBox>
  );
}

export default EventCard;
