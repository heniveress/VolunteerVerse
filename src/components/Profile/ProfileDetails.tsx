/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AbilitiesIcon from '@mui/icons-material/Engineering';
import EventIcon from '@mui/icons-material/Event';
import DownloadIcon from '@mui/icons-material/Download';
import ReviewsIcon from '@mui/icons-material/Reviews';
import Box from '@mui/material/Box';
import {
  Button,
  Chip,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { AccountInfo } from '../../models/accountInfo';
import { Interest, Skill } from '../../models/skill';
import ManageAbilitiesModal from './ManageAbilitiesModal';
import { ProfileEvent } from '../../models/event';
import ProfileEventCard from './ProfileEventCard';
import { fetchFileGet } from '../../service/api/file';
import { ErrorResponse } from '../../models/error';
import { ReactComponent as DownloadSvg } from '../../assets/download.svg';
import { useFetchVolunteerReviews } from '../../service/api/review';
import { VolunteerReviewFromEvent } from '../../models/review';
import ReviewItemVolunteer from '../Review/ReviewItemVolunteer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface ProfileDetailsProps {
  accountInfo: AccountInfo | undefined;
  events: ProfileEvent[] | undefined;
  baseSkills: Skill[] | undefined;
  mutateAllSkills: () => Promise<void>;
  baseInterests: Skill[] | undefined;
  mutateAllInterests: () => Promise<void>;
  endpoint: string;
  mutate: () => Promise<void>;
  isLoading: boolean;
}

function ProfileDetails({
  accountInfo,
  events,
  baseSkills,
  mutateAllSkills,
  baseInterests,
  mutateAllInterests,
  endpoint,
  mutate,
  isLoading,
}: ProfileDetailsProps) {
  const [value, setValue] = React.useState(0);
  const [isManageSkillsModalOpen, setIsManageSkillsModalOpen] =
    React.useState(false);
  const [isManageInterestsModalOpen, setIsManageInterestsModalOpen] =
    React.useState(false);

  const { data: myReviews, isLoading: isLoadingMyReviews } =
    useFetchVolunteerReviews(accountInfo?.volunteer?.id || 0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const isSmScreen: boolean = useMediaQuery('(max-width:900px)');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.target = '_blank';
    void fetchFileGet(endpoint)
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileName = `${accountInfo?.firstName || ''}${
          accountInfo?.lastName || ''
        }VolunteerLog${new Date().toISOString().slice(0, 10)}`;

        a.download = `${fileName}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        err.json().then((errorResponse: ErrorResponse) => {
          alert(JSON.stringify(errorResponse.errors[0]));
        });
      });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab
            label={
              isSmScreen ? (
                <AbilitiesIcon />
              ) : (
                <Typography variant="h6">Skills & Interests</Typography>
              )
            }
          />
          <Tab
            label={
              isSmScreen ? (
                <EventIcon />
              ) : (
                <Typography variant="h6">Events</Typography>
              )
            }
          />
          <Tab
            label={
              isSmScreen ? (
                <DownloadIcon />
              ) : (
                <Typography variant="h6">Volunteer log</Typography>
              )
            }
          />
          <Tab
            label={
              isSmScreen ? (
                <ReviewsIcon />
              ) : (
                <Typography variant="h6">My Reviews</Typography>
              )
            }
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Grid container spacing={2} columnSpacing={4}>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">My Skills</Typography>
              <Tooltip title="Edit">
                <IconButton onClick={() => setIsManageSkillsModalOpen(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {accountInfo?.volunteer?.skills?.map((skill: Skill) => (
                <Chip key={skill.id} label={skill.name} />
              ))}
            </Box>
            <ManageAbilitiesModal<Skill>
              volunteerId={accountInfo?.volunteer?.id}
              volunteerAbilities={accountInfo?.volunteer?.skills}
              baseAbilities={baseSkills}
              isOpen={isManageSkillsModalOpen}
              setIsOpen={setIsManageSkillsModalOpen}
              mutateAbilities={mutateAllSkills}
              mutatePage={mutate}
              name="skills"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">My Interests</Typography>
              <Tooltip title="Edit">
                <IconButton onClick={() => setIsManageInterestsModalOpen(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {accountInfo?.volunteer?.interests?.map((interest: Interest) => (
                <Chip key={interest.id} label={interest.name} />
              ))}
            </Box>
            <ManageAbilitiesModal<Interest>
              volunteerId={accountInfo?.volunteer?.id}
              volunteerAbilities={accountInfo?.volunteer?.interests}
              baseAbilities={baseInterests}
              isOpen={isManageInterestsModalOpen}
              setIsOpen={setIsManageInterestsModalOpen}
              mutateAbilities={mutateAllInterests}
              mutatePage={mutate}
              name="interests"
            />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {events?.length !== 0 && !isLoading && (
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginBottom: '20px',
                marginTop: '30px',
                padding: '0px',
              }}
            >
              {events?.map((eve: ProfileEvent) => (
                <Grid
                  item
                  key={eve.name}
                  xs={12}
                  columnSpacing={2}
                  sx={{
                    marginBottom: '30px',
                  }}
                >
                  <ProfileEventCard
                    key={eve.name}
                    event={eve}
                    volunteerId={accountInfo?.volunteer?.id}
                  />
                </Grid>
              ))}
            </Box>
          </Grid>
        )}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: 'flex',
              alignItems: 'center',
              order: { xs: 2, sm: 1 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
              gap={1}
            >
              <Typography variant="h6">Your volunteer log file:</Typography>
              <Button
                variant="contained"
                sx={{ marginLeft: '20px' }}
                onClick={handleDownload}
              >
                <Stack direction="row" gap={1}>
                  <FileDownloadIcon />
                  <Typography>Download</Typography>
                </Stack>
              </Button>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            justifyContent="center"
            sx={{ order: { xs: 1, sm: 2 } }}
          >
            <Box sx={{ maxWidth: '30rem', maxHeight: '25rem' }}>
              <DownloadSvg />
            </Box>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={3}>
        {!isLoadingMyReviews ? (
          <Grid container spacing={2}>
            {myReviews?.map((review: VolunteerReviewFromEvent) => (
              <ReviewItemVolunteer key={review.id} review={review} />
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
            <Grid item>
              <Skeleton
                variant="circular"
                width="50"
                height="50"
                animation="wave"
              />
            </Grid>
            <Grid item xs>
              <Grid container direction="column">
                <Skeleton
                  variant="text"
                  sx={{ fontSize: '1rem' }}
                  animation="wave"
                />

                <Skeleton
                  variant="text"
                  sx={{ fontSize: '1rem' }}
                  width="60%"
                  animation="wave"
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Skeleton
                  variant="rounded"
                  width="90%"
                  height={100}
                  animation="wave"
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </TabPanel>
    </Box>
  );
}

export default ProfileDetails;
