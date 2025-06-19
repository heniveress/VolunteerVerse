import {
  Container,
  Box,
  Grid,
  Avatar,
  Typography,
  Stack,
  Chip,
  Rating,
  CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import BikeIcon from '@mui/icons-material/DirectionsBike';
import RatingIcon from '@mui/icons-material/Grade';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFetchVolunteerProfileInfo } from '../../service/api/volunteer';
import { Interest, Skill } from '../../models/skill';
import { useFetchVolunteerRating } from '../../service/api/review';

function VolunteerProfilePage() {
  const params = useParams();
  const volunteerId = parseInt(params.volunteerId || '', 10);
  const { data: volunteer, isLoading } =
    useFetchVolunteerProfileInfo(volunteerId);
  const { data: volunteerRatingValue } = useFetchVolunteerRating(volunteerId);

  const [scrolledToTop, setScrolledToTop] = useState(false);

  useEffect(() => {
    if (!scrolledToTop) {
      window.scrollTo(0, 0);
      setScrolledToTop(true);
    }
  }, [scrolledToTop]);

  return (
    <Container maxWidth="lg">
      {!isLoading ? (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              backdropFilter: 'blur(100px)',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: '15px',
              padding: '20px',
              alignItems: 'center',
              marginBottom: '20px',
              marginTop: '30px',
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Stack
                  direction="column"
                  sx={{ m: 4 }}
                  gap={2}
                  alignItems="center"
                >
                  <Avatar
                    sx={{
                      width: { xs: 130, sm: 200 },
                      height: { xs: 130, sm: 200 },
                      border: '2px solid #1C2732',
                    }}
                    src={volunteer?.account.profilePicture}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h5">
                      <b>
                        {volunteer?.account.firstName}
                        &nbsp;
                        {volunteer?.account.lastName}
                      </b>
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="column" sx={{ m: 4 }} gap={1}>
                  <Stack direction="row" gap={1}>
                    <RatingIcon />
                    <Typography>
                      <b>Rating:&nbsp;</b>
                    </Typography>
                    <Rating
                      name="read-only"
                      value={volunteerRatingValue?.rating}
                      readOnly
                    />
                    <Typography>{volunteerRatingValue?.rating} / 5</Typography>
                  </Stack>
                  <Stack direction="row" gap={1}>
                    <EmailIcon />
                    <Typography>
                      <b>Email: &nbsp;</b>
                      {volunteer?.account.email}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  backdropFilter: 'blur(100px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: '15px',
                  padding: '20px',
                  alignItems: 'center',
                  marginBottom: '20px',
                  marginTop: '20px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Stack direction="row" gap={1} alignItems="center">
                    <EngineeringIcon />
                    <Typography variant="h6">Skills</Typography>
                  </Stack>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {volunteer?.volunteer?.skills?.map((skill: Skill) => (
                    <Chip key={skill.id} label={skill.name} />
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  backdropFilter: 'blur(100px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: '15px',
                  padding: '20px',
                  alignItems: 'center',
                  marginBottom: '20px',
                  marginTop: { xs: 0, sm: '20px' },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Stack direction="row" gap={1} alignItems="center">
                    <BikeIcon />
                    <Typography variant="h6">Interests</Typography>
                  </Stack>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {volunteer?.volunteer?.interests?.map(
                    (interest: Interest) => (
                      <Chip key={interest.id} label={interest.name} />
                    ),
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
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

export default VolunteerProfilePage;
