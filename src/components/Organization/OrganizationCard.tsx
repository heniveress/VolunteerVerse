import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { OrganizationPreview } from '../../models/organization';

interface OrganizationCardProps {
  organization: OrganizationPreview;
}

function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        key={organization.id}
        sx={{
          mb: '20px',
          height: '100%',
          backdropFilter: 'blur(100px)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '15px',
        }}
      >
        <CardActionArea
          component={Link}
          to={`/organizations/${organization.id}`}
        >
          <CardMedia
            component="img"
            height="140"
            image={
              organization?.imageUri ||
              'https://assets-global.website-files.com/619dc793cd0b4873e0825490/61ae20883d652b27b6ef3f39_org-design-second-edition.svg'
            }
            alt="organization logo"
          />
          <CardContent
            sx={{ minHeight: 100, maxHeight: 100, overflow: 'hidden' }}
          >
            <Typography gutterBottom variant="h5" component="div">
              {organization.name}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="small"
            component={Link}
            to={`/organizations/${organization.id}`}
          >
            <Typography>Details</Typography>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default OrganizationCard;
