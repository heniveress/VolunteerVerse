import React from 'react';
import { Formik, Form, Field } from 'formik';
import dayjs from 'dayjs';
import queryString from 'query-string';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { EventFilterParams } from '../../models/event';
import { Skill } from '../../models/skill';
import SkillSelect from '../Skill/SkillSelect';
import BackgroundBox from '../../styles/StyledComponents';

interface EventFilterProps {
  queryParams: EventFilterParams;
  skills: Skill[] | undefined;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}

function EventFilter({ queryParams, skills, setIsOpen }: EventFilterProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        name: queryParams.name || '',
        organizationName: queryParams.organizationName || '',
        location: queryParams.location || '',
        startDate: queryParams.startDate
          ? dayjs(queryParams.startDate)
          : undefined,
        endDate: queryParams.endDate ? dayjs(queryParams.endDate) : undefined,
        skills: queryParams.skills
          ? Array.isArray(queryParams.skills)
            ? queryParams.skills.map((skill) => Number(skill))
            : [Number(queryParams.skills)]
          : [],
      }}
      onSubmit={(values) => {
        navigate({
          pathname: location.pathname,
          search: queryString.stringify(values, {
            skipEmptyString: true,
          }),
        });
      }}
    >
      {({ values, handleChange, setFieldValue, resetForm }) => (
        <Form>
          <BackgroundBox
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <Typography variant="h6" sx={{ mb: '15px' }}>
              Filter by:
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  label="Event name"
                  name="name"
                  variant="outlined"
                  size="medium"
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  label="Organization Name"
                  variant="outlined"
                  name="organizationName"
                  size="medium"
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  label="Location"
                  variant="outlined"
                  name="location"
                  size="medium"
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={12} lg={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Field
                    as={DatePicker}
                    label="Start Date"
                    disablePast
                    value={values.startDate}
                    onChange={(
                      date:
                        | string
                        | number
                        | Date
                        | dayjs.Dayjs
                        | null
                        | undefined,
                    ) => {
                      try {
                        handleChange('startDate')(
                          dayjs(date).toDate().toISOString(),
                        );
                      } catch (error) {
                        handleChange('startDate')('');
                      }
                    }}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={12} lg={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Field
                    as={DatePicker}
                    label="End Date"
                    minDate={dayjs(values.startDate)}
                    value={values.endDate}
                    onChange={(
                      date:
                        | string
                        | number
                        | Date
                        | dayjs.Dayjs
                        | null
                        | undefined,
                    ) => {
                      try {
                        handleChange('endDate')(
                          dayjs(date).toDate().toISOString(),
                        );
                      } catch (error) {
                        handleChange('endDate')('');
                      }
                    }}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <SkillSelect
                  skills={skills || []}
                  selectedSkills={values.skills}
                  setSelectedSkills={(selectedSkills) => {
                    void setFieldValue('skills', selectedSkills);
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="center"
                gap="10px"
              >
                <Button
                  variant="outlined"
                  type="reset"
                  onClick={() => {
                    resetForm();
                    setIsOpen?.(false);
                    navigate({
                      pathname: location.pathname,
                      search: '',
                    });
                  }}
                >
                  <Typography>Reset</Typography>
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={() => {
                    setIsOpen?.(false);
                  }}
                >
                  <Typography>Apply</Typography>
                </Button>
              </Grid>
            </Grid>
          </BackgroundBox>
        </Form>
      )}
    </Formik>
  );
}

export default EventFilter;
