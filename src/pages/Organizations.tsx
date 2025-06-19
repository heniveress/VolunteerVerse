import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useState, useContext } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import OrganizationCard from '../components/Organization/OrganizationCard';
import { useFetchOrganizations } from '../service/api/organization';
import { OrganizationPreview } from '../models/organization';
import CreateOrganizationModal from '../components/Organization/CreateOrganizationModal';
import { UserContext } from '../UserContext';

function Organizations() {
  const { data: organizations, isLoading } = useFetchOrganizations();
  const { user } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: '45px', pb: 5 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: 'center',
            mb: '30px',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: { xs: '20px', sm: '0px' },
            }}
          >
            Organizations
          </Typography>
          {user && (
            <Box>
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => setIsModalOpen(true)}
              >
                <Typography>Create</Typography>
              </Button>

              <CreateOrganizationModal
                userEmail={user.email}
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
              />
            </Box>
          )}
        </Box>
        {!isLoading ? (
          <Grid container spacing={{ xs: 2, sm: 4 }}>
            {organizations?.map((organization: OrganizationPreview) => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
              />
            ))}
          </Grid>
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
      </Box>
    </Container>
  );
}

export default Organizations;
