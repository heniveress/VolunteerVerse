/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, Box } from '@mui/material';
import { EventReviewForOrg } from '../../models/review';
import ReviewItemEvent from './ReviewItemEvent';
import { formatDateTime } from '../../utils/dateFormat';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface OrgEventReviewCardProps {
  eventInfo: EventReviewForOrg;
}

function OrgEventReviewCard({ eventInfo }: OrgEventReviewCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const formattedStartTime = eventInfo?.startTime
    ? formatDateTime(new Date(eventInfo?.startTime))
    : '';

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        backdropFilter: 'blur(100px)',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: '15px',
        mb: '20px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', pt: 2, pl: 2 }}>
        <Avatar src={eventInfo.imageUri} sx={{ width: 56, height: 56 }} />
        <CardHeader
          title={eventInfo.name}
          subheader={`${eventInfo.location}, ${formattedStartTime}`}
        />
      </Box>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {eventInfo.reviews?.map((volunteerReviews) => (
            <ReviewItemEvent
              key={volunteerReviews.id}
              review={volunteerReviews}
            />
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default OrgEventReviewCard;
