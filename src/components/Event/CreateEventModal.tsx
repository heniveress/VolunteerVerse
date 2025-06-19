import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { MuiFileInput } from 'mui-file-input';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { GridRowsProp } from '@mui/x-data-grid';
import { RegisterEvent } from '../../models/event';
import AddTasksTable from '../Task/AddTasksTable';
import { ErrorResponse } from '../../models/error';
import { RegisterTask } from '../../models/task';
import { registerEventPost } from '../../service/api/event';
import { useFetchBaseSkills } from '../../service/api/skill';

interface CreateEventModalProps {
  organizationId: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: () => Promise<void>;
}

function CreateEventModal({
  organizationId,
  isOpen,
  setIsOpen,
  mutate,
}: CreateEventModalProps) {
  const [error, setError] = useState('');

  const initalTasks: GridRowsProp = [];

  const [tasks, setTasks] = React.useState(initalTasks);

  const { data: skills } = useFetchBaseSkills();

  const initialValues: RegisterEvent = {
    organizationId,
    name: '',
    location: '',
    phone: '',
    manpower: 0,
    startTime: undefined,
    endTime: undefined,
    description: '',
    imageFile: undefined,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string()
      .matches(/^\+?[0-9][0-9]{7,14}$/, 'Please enter a valid phone number')
      .required('Phone number is required'),
    manpower: Yup.number()
      .min(0, 'Manpower cannot be negative')
      .required('Manpower is required'),
    location: Yup.string().required('Location is required'),
    startTime: Yup.string().required('Start time is required'),
    endTime: Yup.string().required('End time is required'),
  });

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: '15px',
        }}
        variant="h5"
      >
        <EventIcon fontSize="large" />
        Create Event
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const taskModelRequests: RegisterTask[] = [];

              tasks.map((task) => taskModelRequests.push(task as RegisterTask));

              registerEventPost({
                ...values,
                taskModelRequests,
              })
                .then(() => {
                  setIsOpen(false);
                  setTasks([]);
                  void mutate();
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .catch((err: any) => {
                  err.json().then((errorResponse: ErrorResponse) => {
                    setError(errorResponse.errors[0]);
                  });
                });

              setSubmitting(false);
            }}
          >
            {({ dirty, errors, touched, values, setFieldValue }) => (
              <Form>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: '12px',
                    mb: '16px',
                  }}
                >
                  <Grid item xs={6.5} sm={7.5} md={6}>
                    <Field
                      as={TextField}
                      id="name"
                      name="name"
                      label="Name"
                      inputProps={{ maxLength: 100 }}
                      fullWidth
                      error={errors.name && touched.name}
                      helperText={touched.name ? errors.name : ''}
                    />
                  </Grid>
                  <Grid item xs={6.5} sm={7.5} md={6}>
                    <Field
                      as={TextField}
                      id="location"
                      name="location"
                      label="Location"
                      inputProps={{ maxLength: 100 }}
                      fullWidth
                      error={errors.location && touched.location}
                      helperText={touched.location ? errors.location : ''}
                    />
                  </Grid>
                  <Grid item xs={6.5} sm={7.5} md={6}>
                    <Field
                      as={TextField}
                      id="phone"
                      name="phone"
                      label="Phone"
                      inputProps={{ maxLength: 22 }}
                      size="medium"
                      fullWidth
                      error={errors.phone && touched.phone}
                      helperText={touched.phone ? errors.phone : ''}
                    />
                  </Grid>
                  <Grid item xs={6.5} sm={7.5} md={6}>
                    <Field
                      as={TextField}
                      id="manpower"
                      name="manpower"
                      label="Manpower"
                      size="medium"
                      inputProps={{ maxLength: 9 }}
                      number
                      fullWidth
                      error={errors.manpower && touched.manpower}
                      helperText={touched.manpower ? errors.manpower : ''}
                    />
                  </Grid>
                  <Grid item xs={6.5} sm={7.5} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Field
                        as={DateTimePicker}
                        ampm={false}
                        disablePast
                        label="Start Time"
                        name="startTime"
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={async (value: any) => {
                          await setFieldValue(
                            'startTime',
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                            dayjs(value, { utc: true }),
                          );
                        }}
                        error={errors.startTime && touched.startTime}
                        helperText={touched.startTime ? errors.startTime : ''}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6.5} sm={7.5} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Field
                        as={DateTimePicker}
                        ampm={false}
                        minDate={dayjs(values.startTime)}
                        label="End Time"
                        name="endTime"
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={async (value: any) => {
                          await setFieldValue(
                            'endTime',
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                            dayjs(value, { utc: true }),
                          );
                        }}
                        error={errors.endTime && touched.endTime}
                        helperText={touched.endTime ? errors.endTime : ''}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6.5} sm={7.5} md={12}>
                    <Field
                      as={TextField}
                      id="description"
                      name="description"
                      label="Description"
                      inputProps={{ maxLength: 2000 }}
                      fullWidth
                      multiline
                      minRows={3}
                      maxRows={8}
                    />
                  </Grid>
                  <Grid item xs={6.5} sm={7.5} md={12}>
                    <AddTasksTable
                      rows={tasks}
                      setRows={setTasks}
                      skills={skills || []}
                    />
                  </Grid>
                  <Grid item xs={6.5} sm={7.5} md={12}>
                    <Field
                      as={MuiFileInput}
                      id="imageFile"
                      name="imageFile"
                      fullWidth
                      label="Image"
                      inputProps={{ accept: 'image/*' }}
                      onChange={async (value: File) => {
                        await setFieldValue('imageFile', value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={6.5} sm={7.5} md={12}>
                    {error && (
                      <Typography color="error" variant="body2" align="center">
                        {error}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6.5} sm={7.5} md={12}>
                    <DialogActions
                      sx={{
                        mt: '15px',
                        mb: '20px',
                        p: '0px',
                        justifyContent: {
                          xs: 'center',
                          md: 'flex-end',
                        },
                      }}
                    >
                      <Button
                        variant="outlined"
                        type="reset"
                        onClick={() => {
                          setIsOpen(false);
                          setTasks([]);
                        }}
                      >
                        <Typography>Cancel</Typography>
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={
                          !dirty ||
                          Object.values(errors).some((x) => x.length !== 0)
                        }
                      >
                        <Typography>Save</Typography>
                      </Button>
                    </DialogActions>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default CreateEventModal;
