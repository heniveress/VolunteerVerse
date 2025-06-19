import {
  Avatar,
  Divider,
  Grid,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { formatter } from '../../utils/dateFormat';
import { VolunteerReviewFromEvent } from '../../models/review';

interface ReviewItemVolunteerProps {
  review: VolunteerReviewFromEvent;
}

function ReviewItemVolunteer({ review }: ReviewItemVolunteerProps) {
  const formattedReviewTime = formatter(
    new Date(review?.reviewTime),
    new Date(),
  ).value;

  return (
    <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
      <Grid item>
        <Avatar
          src={review.event.imageUri}
          sx={{
            width: 50,
            height: 50,
          }}
        />
      </Grid>
      <Grid item xs>
        <Grid container direction="column">
          <Typography sx={{ pb: 0.5 }}>
            <b>{review.event.name}</b>
            <i> - admin - </i>
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

export default ReviewItemVolunteer;
