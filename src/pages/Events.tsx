import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  Divider,
  Grid,
  useMediaQuery,
} from '@mui/material';
import queryString from 'query-string';
import FilterIcon from '@mui/icons-material/Tune';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import EventCard from '../components/Event/EventCard';
import { useFetchEvents } from '../service/api/event';
import { EventPreview, EventFilterParams } from '../models/event';
import EventFilter from '../components/Event/EventFilters';
import { useFetchBaseSkills } from '../service/api/skill';

function Events() {
  const location = useLocation();

  const queryParams = queryString.parse(
    location.search,
  ) as unknown as EventFilterParams;

  const { data: skills } = useFetchBaseSkills();
  const { data: events, isLoading } = useFetchEvents(queryParams);
  const [isFilterModalOpen, setIsFilterkModalOpen] = useState(false);

  const isSmScreen: boolean = useMediaQuery('(max-width:900px)');

  return (
    <Container maxWidth="xl" sx={{ mt: '30px', pb: 5 }}>
      {!isLoading ? (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            {isSmScreen ? (
              <>
                <Box display="flex" justifyContent="flex-start">
                  <Button
                    onClick={() => setIsFilterkModalOpen(true)}
                    startIcon={<FilterIcon />}
                  >
                    Filter
                  </Button>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Dialog
                      maxWidth="sm"
                      open={isFilterModalOpen}
                      onClose={() => {
                        setIsFilterkModalOpen(false);
                      }}
                    >
                      <EventFilter
                        queryParams={queryParams}
                        skills={skills}
                        setIsOpen={setIsFilterkModalOpen}
                      />
                    </Dialog>
                  </Box>
                </Box>
                <Divider />
              </>
            ) : (
              <EventFilter
                queryParams={queryParams}
                skills={skills}
                setIsOpen={undefined}
              />
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: { md: '20px' },
              }}
            >
              <Grid container spacing={2}>
                {events?.map((event: EventPreview) => (
                  <Grid key={event.id} item xs={12}>
                    <EventCard event={event} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
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
    </Container>
  );
}

export default Events;
