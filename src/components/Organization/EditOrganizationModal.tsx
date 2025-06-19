import {
  Box,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import React from 'react';
import { DetailedOrganization } from '../../models/organization';
import {
  editOrganizationPatch,
  useFetchOrganizationById,
} from '../../service/api/organization';
import { ErrorResponse } from '../../models/error';

interface EditOrganizationModalProps {
  orgId: number;
  organization: DetailedOrganization | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditOrganizationModal({
  orgId,
  organization,
  isOpen,
  setIsOpen,
}: EditOrganizationModalProps) {
  const { mutate } = useFetchOrganizationById(orgId);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('First name is required'),
  });

  const initialValues = {
    name: organization?.name,
    description: organization?.description,
    availability: organization?.availability,
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
            const orgFieldsChanged =
              values.name !== initialValues.name ||
              values.description !== initialValues.description ||
              values.availability !== initialValues.availability;

            if (orgFieldsChanged) {
              editOrganizationPatch(orgId, {
                name: values.name,
                description: values.description,
                availability: values.availability,
              } as DetailedOrganization)
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
                <EditIcon fontSize="large" />
                <DialogTitle variant="h5">Edit Organization</DialogTitle>
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
                    inputProps={{ maxLength: 2000 }}
                    multiline
                    minRows={3}
                    maxRows={8}
                  />
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

export default EditOrganizationModal;
