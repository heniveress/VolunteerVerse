import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { EventDetails } from '../../models/event';
import { ErrorResponse } from '../../models/error';
import { editEventPatch } from '../../service/api/event';

interface EditEventModalProps {
  eventId: number;
  eventDetails: EventDetails | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: () => Promise<void>;
}

export default function EditEventModal({
  eventId,
  eventDetails,
  isOpen,
  setIsOpen,
  mutate,
}: EditEventModalProps) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Event name is required'),
    phone: Yup.string()
      .matches(/^\+?[0-9][0-9]{7,14}$/, 'Please enter a valid phone number')
      .required('Phone number is required'),
    manpower: Yup.number()
      .min(0, 'Number cannot be negative')
      .required('Number is required'),
  });

  const initialValues = {
    name: eventDetails?.name,
    phone: eventDetails?.phone,
    description: eventDetails?.description,
    location: eventDetails?.location,
    startTime: eventDetails?.startTime,
    endTime: eventDetails?.endTime,
    manpower: eventDetails?.manpower,
    hasEnded: eventDetails?.hasEnded,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            const eventFieldsChanged =
              values.name !== initialValues.name ||
              values.phone !== initialValues.phone ||
              values.description !== initialValues.description ||
              values.location !== initialValues.location ||
              values.startTime !== initialValues.startTime ||
              values.endTime !== initialValues.endTime ||
              values.manpower !== initialValues.manpower ||
              values.hasEnded !== initialValues.hasEnded;

            if (eventFieldsChanged) {
              editEventPatch(eventId, {
                name: values.name,
                phone: values.phone,
                description: values.description,
                location: values.location,
                startTime: values.startTime,
                endTime: values.endTime,
                manpower: values.manpower,
                hasEnded: values.hasEnded,
              } as unknown as EventDetails)
                .then(() => {
                  void mutate();
                  setIsOpen(false);
                })
                .catch((err) => {
                  err.json().then((errorResponse: ErrorResponse) => {
                    alert(errorResponse.errors[0]);
                  });
                });
            }
            setSubmitting(false);
          }}
          validationSchema={validationSchema}
        >
          {({ dirty, errors, touched, values, setFieldValue }) => (
            <Form>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: '15px',
                }}
              >
                <EditIcon fontSize="large" />
                <DialogTitle variant="h5">Edit Event</DialogTitle>
              </Box>
              <Grid
                container
                spacing={2}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Grid item xs={7} sm={8} md={11}>
                  <Field
                    as={TextField}
                    id="name"
                    name="name"
                    label="Name"
                    inputProps={{ maxLength: 100 }}
                    fullWidth
                    error={!!errors.name && touched.name}
                    onKeyDown={(
                      event: React.KeyboardEvent<HTMLInputElement>,
                    ) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={7} sm={8} md={11}>
                  <Field
                    as={TextField}
                    id="location"
                    name="location"
                    label="Location"
                    inputProps={{ maxLength: 100 }}
                    fullWidth
                    error={!!errors.location && touched.location}
                    onKeyDown={(
                      event: React.KeyboardEvent<HTMLInputElement>,
                    ) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={7} sm={8} md={5.5}>
                  <Field
                    as={TextField}
                    id="phone"
                    name="phone"
                    label="Phone"
                    size="medium"
                    inputProps={{ maxLength: 22 }}
                    fullWidth
                    error={errors.phone && touched.phone}
                    helperText={
                      touched.phone && errors.phone
                        ? errors.phone
                        : touched.manpower && errors.manpower
                        ? ' '
                        : ''
                    }
                  />
                </Grid>

                <Grid item xs={7} sm={8} md={5.5}>
                  <Field
                    as={TextField}
                    id="manpower"
                    name="manpower"
                    label="Manpower"
                    inputProps={{ maxLength: 9 }}
                    size="medium"
                    number
                    fullWidth
                    error={errors.manpower && touched.manpower}
                    helperText={
                      touched.manpower && errors.manpower
                        ? errors.manpower
                        : touched.phone && errors.phone
                        ? ' '
                        : ''
                    }
                  />
                </Grid>

                <Grid item xs={7} sm={8} md={5.5}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Field
                      as={DateTimePicker}
                      ampm={false}
                      value={dayjs(values.startTime)}
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
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={7} sm={8} md={5.5}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Field
                      as={DateTimePicker}
                      ampm={false}
                      minDate={dayjs(values.startTime)}
                      value={dayjs(values.endTime)}
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
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={7} sm={8} md={11}>
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

                <Grid item xs={7} sm={8} md={11}>
                  <Field
                    as={FormControlLabel}
                    control={<Checkbox checked={initialValues.hasEnded} />}
                    id="hasEnded"
                    name="hasEnded"
                    label="Has ended"
                    labelPlacement="start"
                  />
                </Grid>

                <Grid item xs={11}>
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
                      }}
                    >
                      <Typography>Cancel</Typography>
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        !dirty ||
                        Object.values(errors).some(
                          (x) => typeof x === 'string' && x.length !== 0,
                        )
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
      </Dialog>
    </Box>
  );
}
