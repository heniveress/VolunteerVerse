/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import RatingIcon from '@mui/icons-material/Grade';
import { useFetchProfile, useFetchProfileEvents } from '../service/api/profile';
import EditProfileModal from '../components/Profile/EditProfileModal';
import UploadImage from '../components/ImageUpload';
import {
  getProfileImageUploadEndpoint,
  getVolunteerLogFileDownloadEndpoint,
} from '../utils/endpointBuilder';
import { useFetchBaseSkills } from '../service/api/skill';
import ProfileDetails from '../components/Profile/ProfileDetails';
import { useFetchBaseInterests } from '../service/api/interest';
import { useFetchVolunteerRating } from '../service/api/review';
import { roundNumber } from '../utils/helpers';

function Profile() {
  const { mutate, data: accountInfo, isLoading } = useFetchProfile();
  const { data: baseSkills } = useFetchBaseSkills();
  const { data: baseInterests } = useFetchBaseInterests();
  const { data: volunteerRatingValue } = useFetchVolunteerRating(
    accountInfo?.volunteer?.id || 0,
  );

  const { data: events, isLoading: isLoadingEventsTab } =
    useFetchProfileEvents();

  const roundedRating = roundNumber(volunteerRatingValue?.rating);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);

  return (
    <Container maxWidth="lg">
      {!isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            backdropFilter: 'blur(100px)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '15px',
            padding: '20px',
            alignItems: 'center',
            marginBottom: '20px',
            marginTop: '30px',
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  gap: '20px',
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  justifyContent: { xs: 'center' },
                }}
              >
                <Tooltip title="Change picture">
                  <Avatar
                    sx={{
                      width: { xs: 130, sm: 200 },
                      height: { xs: 130, sm: 200 },
                      cursor: 'pointer',
                      border: '2px solid #1C2732',
                    }}
                    src={accountInfo?.profilePictureUri}
                    onClick={() => setIsPictureModalOpen(true)}
                  />
                </Tooltip>
                {accountInfo && (
                  <UploadImage
                    endpoint={getProfileImageUploadEndpoint(accountInfo.id)}
                    isOpen={isPictureModalOpen}
                    setIsOpen={setIsPictureModalOpen}
                    mutate={mutate}
                  />
                )}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h5">
                    <b>
                      {accountInfo?.lastName}
                      &nbsp;
                      {accountInfo?.firstName}
                    </b>
                  </Typography>
                </Box>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', sm: 'flex-end' },
                    alignSelf: 'end',
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    size="medium"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Typography>Edit profile</Typography>
                  </Button>
                  {accountInfo && (
                    <EditProfileModal
                      accountInfo={accountInfo}
                      isOpen={isEditOpen}
                      setIsOpen={setIsEditOpen}
                    />
                  )}
                </Grid>
              </Box>

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
                  <Typography>{roundedRating} / 5</Typography>
                </Stack>
                <Stack direction="row" gap={1}>
                  <EmailIcon />
                  <Typography>
                    <b>Email: &nbsp;</b>
                    {accountInfo?.email}
                  </Typography>
                </Stack>
                <Stack direction="row" gap={1}>
                  <PhoneIcon />
                  <Typography>
                    <b>Phone: &nbsp;</b>
                    {accountInfo?.phone}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>
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
      {!isLoading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            backdropFilter: 'blur(100px)',
            backgroundColor: 'rgba(255, 255, 255, 0.37)',
            borderRadius: '15px',
            padding: '10px',
            alignItems: 'center',
            marginBottom: '20px',
            marginTop: '30px',
          }}
        >
          <ProfileDetails
            accountInfo={accountInfo}
            events={events}
            baseSkills={baseSkills}
            mutateAllSkills={mutate}
            baseInterests={baseInterests}
            mutateAllInterests={mutate}
            endpoint={getVolunteerLogFileDownloadEndpoint()}
            mutate={mutate}
            isLoading={isLoadingEventsTab}
          />
        </Box>
      )}
    </Container>
  );
}

export default Profile;
