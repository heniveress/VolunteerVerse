import {
  Box,
  Button,
  Chip,
  DialogActions,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import * as Yup from 'yup';
import {
  registerOrganizationPost,
  useFetchOrganizations,
} from '../../service/api/organization';
import { ErrorResponse } from '../../models/error';

interface CreateOrganizationModalProps {
  userEmail: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateOrganizationModal({
  userEmail,
  isOpen,
  setIsOpen,
}: CreateOrganizationModalProps) {
  const [emails, setEmails] = useState<string[]>([userEmail]);
  const [error, setError] = useState('');

  const { mutate } = useFetchOrganizations();

  const initialValues = {
    name: '',
    description: '',
    availability: '',
    emails: '',
  };

  const validationSchema = Yup.object().shape({
    emails: Yup.string().email('Please enter a valid email address'),
  });

  const handleDeleteEmail = (index: number) => {
    setEmails((prevEmails) => {
      const updatedEmails = [...prevEmails];
      updatedEmails.splice(index, 1);
      return updatedEmails;
    });
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
          setEmails([userEmail]);
          setError('');
          setIsOpen(false);
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            registerOrganizationPost({ ...values, emails })
              .then(() => {
                setEmails([userEmail]);
                setError('');
                setIsOpen(false);
                void mutate();
              })
              .catch((err) => {
                err.json().then((errorResponse: ErrorResponse) => {
                  setError(errorResponse.errors[0]);
                });
              });
            setSubmitting(false);
          }}
        >
          {({
            values,
            setFieldValue,
            dirty,
            errors,
            touched,
            setFieldError,
          }) => (
            <Form>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: '15px',
                }}
              >
                <AddHomeWorkIcon fontSize="large" />
                <DialogTitle variant="h5">Create Organization</DialogTitle>
              </Box>
              <Grid
                container
                spacing={2}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Grid item xs={8}>
                  <Field
                    as={TextField}
                    id="name"
                    name="name"
                    label="Name"
                    fullWidth
                    inputProps={{ maxLength: 100 }}
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

                <Grid item xs={8}>
                  <Field
                    as={TextField}
                    id="availability"
                    name="availability"
                    label="Availability"
                    multiline
                    fullWidth
                    minRows={3}
                    maxRows={8}
                    InputProps={{
                      inputProps: { maxLength: 250 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip
                            title={
                              <span>
                                {[
                                  'Example:',
                                  <br key={1} />,
                                  'Monday: 8:00 - 16:00',
                                  <br key={2} />,
                                  'Wednesday: 8:00 - 12:00',
                                  <br key={3} />,
                                  'Sunday: 12:35 - 14:00',
                                ]}
                              </span>
                            }
                          >
                            <IconButton>
                              <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={8}>
                  <Field
                    as={TextField}
                    id="description"
                    name="description"
                    label="Description"
                    fullWidth
                    multiline
                    inputProps={{ maxLength: 2000 }}
                    minRows={3}
                    maxRows={8}
                  />
                </Grid>

                <Grid item xs={8}>
                  <Field
                    as={TextField}
                    id="emails"
                    name="emails"
                    label="Email Adresses"
                    fullWidth
                    placeholder="Enter email and press Space or Enter"
                    error={errors.emails}
                    helperText={errors.emails}
                    onBlur={async () => {
                      if (values.emails.trim() !== '' && !errors.emails) {
                        if (
                          !emails.some(
                            (existingEmail) => existingEmail === values.emails,
                          )
                        ) {
                          emails.push(values.emails);
                          await setFieldValue('emails', '');
                        } else {
                          setFieldError('emails', 'Email is already added');
                        }
                      }
                    }}
                    onKeyDown={async (
                      event: React.KeyboardEvent<HTMLInputElement>,
                    ) => {
                      if (event.key === ' ' || event.key === 'Enter')
                        if (values.emails.trim() !== '' && !errors.emails) {
                          event.preventDefault();
                          if (
                            !emails.some(
                              (existingEmail) =>
                                existingEmail === values.emails,
                            )
                          ) {
                            emails.push(values.emails);
                            await setFieldValue('emails', '');
                          } else {
                            setFieldError('emails', 'Email is already added');
                          }
                        }
                    }}
                  />
                  <Box sx={{ pt: '5px' }}>
                    {emails.map((email, index) => (
                      <Chip
                        label={email}
                        key={email}
                        sx={{ mt: 1, mr: 1 }}
                        onDelete={() => handleDeleteEmail(index)}
                        color="primary"
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  {error && (
                    <Typography color="error" variant="body2" align="center">
                      {error}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={8}>
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
                        setEmails([userEmail]);
                        setError('');
                        setIsOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        !dirty ||
                        Object.values(errors).some((x) => x.length !== 0)
                      }
                    >
                      Save
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

export default CreateOrganizationModal;
