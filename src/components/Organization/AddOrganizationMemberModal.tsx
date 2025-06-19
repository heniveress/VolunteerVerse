import {
  Box,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import React, { useState } from 'react';
import { organizationMemberPost } from '../../service/api/organization';
import { ErrorResponse } from '../../models/error';

interface AddOrganizationModalProps {
  orgId: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: () => Promise<void>;
}

function AddOrganizationMemberModal({
  orgId,
  isOpen,
  setIsOpen,
  mutate,
}: AddOrganizationModalProps) {
  const [error, setError] = useState('');

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email address'),
  });

  const initialValues = {
    email: '',
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
        maxWidth="xs"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setError('');
        }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            organizationMemberPost(orgId, values)
              .then(() => {
                setIsOpen(false);
                setError('');
                void mutate();
              })
              .catch((err) => {
                err.json().then((errorResponse: ErrorResponse) => {
                  setError(errorResponse.errors[0]);
                });
              });

            setSubmitting(false);
          }}
          validationSchema={validationSchema}
        >
          {({ dirty, errors, touched }) => (
            <Form>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: '15px',
                }}
              >
                <PersonAddAltRoundedIcon fontSize="large" />
                <DialogTitle variant="h5">Add member</DialogTitle>
              </Box>
              <Grid
                container
                spacing={2}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Grid item xs={10}>
                  <Field
                    as={TextField}
                    id="email"
                    name="email"
                    label="Email"
                    fullWidth
                    error={errors.email && touched.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={10}>
                  {error && (
                    <Typography color="error" variant="body2" align="center">
                      {error}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={10}>
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
                        setError('');
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
      </Dialog>
    </Box>
  );
}

export default AddOrganizationMemberModal;
