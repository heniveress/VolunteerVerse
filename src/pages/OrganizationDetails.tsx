/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/no-array-index-key */
import {
  Container,
  Box,
  Grid,
  Typography,
  Avatar,
  Tooltip,
  Button,
  Rating,
  IconButton,
  useMediaQuery,
  AlertColor,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { useContext, useEffect, useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { useFetchOrganizationById } from '../service/api/organization';
import EventTable from '../components/Event/EventTable';
import EditOrganizationModal from '../components/Organization/EditOrganizationModal';
import useStyles from '../styles/custom-styles';
import AddOrganizationMemberModal from '../components/Organization/AddOrganizationMemberModal';
import LeaveOrganizationModal from '../components/Organization/LeaveOrganizationModal';
import CreateEventModal from '../components/Event/CreateEventModal';
import BackgroundBox from '../styles/StyledComponents';
import { UserContext } from '../UserContext';
import UploadImage from '../components/ImageUpload';
import { getOrganizationImageUploadEndpoint } from '../utils/endpointBuilder';
import DeleteOrgConfirmationModal from '../components/Organization/DeleteOrgConfirmationModal';
import { orgLogoPlaceholder, roundNumber } from '../utils/helpers';
import { useFetchOrganizationReviews } from '../service/api/review';
import { EventReviewForOrg } from '../models/review';
import OrgEventReviewCard from '../components/Review/OrgEventReviewCard';
import {
  isMaxEventAdmin,
  isMinOrgAdmin,
  isMinOrgMember,
  isOwner,
} from '../utils/roles';
import OrganizationMembersTable from '../components/Organization/OrganizationMembersTable';
import ManageMembersTable from '../components/Organization/ManageMembersTable';
import { useFetchNumberOfNewNotifications } from '../service/api/profile';

function OrganizationDetails() {
  const params = useParams();
  const orgId = parseInt(params.orgId || '', 10);
  const classes = useStyles();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [scrolledToTop, setScrolledToTop] = useState(false);

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [alertType, setAlertType] = useState<AlertColor>('success');
  const [snackbarText, setSnackbarText] = useState('');

  const { mutate: mutateNumOfNotifications } =
    useFetchNumberOfNewNotifications();

  const {
    data: organization,
    mutate,
    isLoading,
  } = useFetchOrganizationById(orgId);

  const { data: eventInfos, isLoading: isLoadingReviews } =
    useFetchOrganizationReviews(orgId);

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!scrolledToTop) {
      window.scrollTo(0, 0);
      setScrolledToTop(true);
    }
  }, [scrolledToTop]);

  const roundedRating = roundNumber(organization?.rating);

  const isSmScreen: boolean = useMediaQuery('(max-width:900px)');
  const isXsScreen: boolean = useMediaQuery('(max-width:600px)');

  return (
    <Container maxWidth="lg">
      {!isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            marginBottom: '20px',
            marginTop: '60px',
          }}
        >
          <Grid container spacing={4}>
            <Grid container spacing={4} alignItems="center" sx={{ pl: '32px' }}>
              <Grid item xs={12} md={4}>
                <Grid container justifyContent="center" alignItems="center">
                  <Tooltip
                    title={
                      isMinOrgAdmin(organization?.roleInOrganization)
                        ? 'Change logo'
                        : ''
                    }
                  >
                    <Avatar
                      sx={{
                        width: { xs: 100, md: 150 },
                        height: { xs: 100, md: 150 },
                        cursor: isMinOrgAdmin(organization?.roleInOrganization)
                          ? 'pointer'
                          : 'default',
                      }}
                      src={organization?.imageUri || orgLogoPlaceholder}
                      onClick={() =>
                        isMinOrgAdmin(organization?.roleInOrganization) &&
                        setIsImageUploadOpen(true)
                      }
                    />
                  </Tooltip>
                  <UploadImage
                    endpoint={getOrganizationImageUploadEndpoint(orgId)}
                    isOpen={isImageUploadOpen}
                    setIsOpen={setIsImageUploadOpen}
                    mutate={mutate}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h3" align="center">
                  {organization?.name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid
                  container
                  sx={{
                    flexDirection: { xs: 'row', md: 'column' },
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  {isMinOrgAdmin(organization?.roleInOrganization) &&
                    (isSmScreen ? (
                      <Button
                        variant="outlined"
                        onClick={() => setIsEditOpen(true)}
                        startIcon={<EditIcon />}
                      >
                        <Typography>Edit</Typography>
                      </Button>
                    ) : (
                      <Tooltip title="Edit organization">
                        <IconButton onClick={() => setIsEditOpen(true)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    ))}

                  <EditOrganizationModal
                    orgId={orgId}
                    organization={organization}
                    isOpen={isEditOpen}
                    setIsOpen={setIsEditOpen}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      flexDirection: 'column',
                      mt: { md: 8 },
                    }}
                  >
                    <Typography>{roundedRating} / 5</Typography>
                    <Rating
                      name="read-only"
                      defaultValue={0}
                      value={organization?.rating}
                      readOnly
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={4} xs={12}>
              <BackgroundBox
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6">
                  <b>Availability</b>
                </Typography>
                {organization?.availability ? (
                  organization.availability
                    .split('\n')
                    .map((availabilityItem, index) => (
                      <Typography key={index}>{availabilityItem}</Typography>
                    ))
                ) : (
                  <Typography>
                    <i>No availability</i>
                  </Typography>
                )}
              </BackgroundBox>
            </Grid>
            <Grid item sm={8} xs={12}>
              <BackgroundBox
                sx={{
                  borderRadius: '15px',
                  backdropFilter: 'blur(100px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <Typography variant="h6">
                  <b>Description</b>
                </Typography>
                {organization?.description ? (
                  organization?.description
                ) : (
                  <Typography>
                    <i>No description</i>
                  </Typography>
                )}
              </BackgroundBox>
            </Grid>
          </Grid>
          <Grid container spacing={{ xs: 2, sm: 4 }}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: '20px',
                  mt: '50px',
                }}
              >
                <Typography variant="h4">
                  <b>Events</b>
                </Typography>

                {isMinOrgMember(organization?.roleInOrganization) &&
                  (isXsScreen ? (
                    <Tooltip title="Add event">
                      <IconButton onClick={() => setIsCreateEventOpen(true)}>
                        <AddCircleIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<AddCircleIcon />}
                      onClick={() => {
                        setIsCreateEventOpen(true);
                      }}
                    >
                      <Typography>Add event</Typography>
                    </Button>
                  ))}
                <CreateEventModal
                  organizationId={orgId}
                  isOpen={isCreateEventOpen}
                  setIsOpen={setIsCreateEventOpen}
                  mutate={mutate}
                />
              </Box>

              <EventTable
                events={organization?.events}
                currentUserRole={organization?.roleInOrganization}
                mutate={mutate}
              />
            </Grid>
            {user && !isLoading && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: '20px',
                    mt: '30px',
                  }}
                >
                  <Typography variant="h4">
                    <b>Members</b>
                  </Typography>
                  {isMinOrgAdmin(organization?.roleInOrganization) &&
                    (isXsScreen ? (
                      <Tooltip title="Add member">
                        <IconButton onClick={() => setIsAddMemberOpen(true)}>
                          <AddCircleIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        size="medium"
                        onClick={() => setIsAddMemberOpen(true)}
                      >
                        <Typography>Add member</Typography>
                      </Button>
                    ))}
                </Box>
                <AddOrganizationMemberModal
                  orgId={orgId}
                  isOpen={isAddMemberOpen}
                  setIsOpen={setIsAddMemberOpen}
                  mutate={mutate}
                />

                {isMinOrgAdmin(organization?.roleInOrganization) && (
                  <ManageMembersTable
                    orgId={orgId}
                    orgName={organization?.name}
                    currentUserRole={organization?.roleInOrganization}
                    organizationMembers={organization?.members}
                    mutate={mutate}
                    mutateNumOfNotifications={mutateNumOfNotifications}
                    setAlertType={setAlertType}
                    setSnackOpen={setOpenSnackBar}
                    setSnackText={setSnackbarText}
                  />
                )}

                {isMaxEventAdmin(organization?.roleInOrganization) && (
                  <OrganizationMembersTable
                    organizationMembers={organization?.members}
                  />
                )}
              </Grid>
            )}
            {!isLoadingReviews && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    mb: '20px',
                    mt: '30px',
                  }}
                >
                  <Typography variant="h4">
                    <b>Event reviews</b>
                  </Typography>
                </Box>
                {eventInfos?.length === 0 && (
                  <Typography sx={{ ml: '20px' }}>
                    <i>No reviews yet</i>{' '}
                  </Typography>
                )}
                <Grid item xs={12}>
                  {eventInfos?.map((eventInfo: EventReviewForOrg) => (
                    <OrgEventReviewCard
                      key={eventInfo.id}
                      eventInfo={eventInfo}
                    />
                  ))}
                </Grid>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                {isOwner(organization?.roleInOrganization) && (
                  <>
                    <Button
                      variant="contained"
                      className={classes.deleteButton}
                      startIcon={<DeleteForeverRoundedIcon />}
                      size="medium"
                      onClick={() => setIsDeleteOpen(true)}
                    >
                      <Typography>Delete Organization</Typography>
                    </Button>
                    <DeleteOrgConfirmationModal
                      orgId={orgId}
                      isOpen={isDeleteOpen}
                      setIsOpen={setIsDeleteOpen}
                    />
                  </>
                )}
                {isMinOrgMember(organization?.roleInOrganization) && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<LogoutIcon />}
                      size="medium"
                      className={classes.leaveButton}
                      onClick={() => setIsLeaveOpen(true)}
                    >
                      <Typography>Leave Organization</Typography>
                    </Button>
                    <LeaveOrganizationModal
                      orgId={orgId}
                      isOpen={isLeaveOpen}
                      setIsOpen={setIsLeaveOpen}
                      orgMembers={organization?.members}
                    />
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box
          sx={{
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

export default OrganizationDetails;
