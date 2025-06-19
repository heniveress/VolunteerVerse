import {
  Avatar,
  Divider,
  Grid,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { formatter } from '../../utils/dateFormat';
import { EventReviewFromVolunteer } from '../../models/review';
import { monogram } from '../../utils/helpers';

interface ReviewItemEventProps {
  review: EventReviewFromVolunteer;
}

function ReviewItemEvent({ review }: ReviewItemEventProps) {
  const formattedReviewTime = formatter(
    new Date(review?.reviewTime),
    new Date(),
  ).value;

  const initials = monogram(
    review.Volunteer.firstName,
    review.Volunteer.lastName,
  );

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item>
        <Avatar
          src={review.Volunteer.profilePictureUri}
          sx={{
            width: 50,
            height: 50,
          }}
        >
          {initials}
        </Avatar>
      </Grid>
      <Grid item xs>
        <Grid container direction="column">
          <Typography sx={{ pb: 0.5 }}>
            <b>{`${review.Volunteer.firstName} ${review.Volunteer.lastName}`}</b>
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Rating
              name="read-only"
              value={review.rating}
              readOnly
              size="small"
            />
            <Typography variant="body2">{formattedReviewTime}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Typography variant="body1">{review.comment}</Typography>
        </Grid>
        <Divider sx={{ mt: 1 }} />
      </Grid>
    </Grid>
  );
}

export default ReviewItemEvent;
