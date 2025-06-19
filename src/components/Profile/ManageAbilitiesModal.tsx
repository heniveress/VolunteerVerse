/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import FaceIcon from '@mui/icons-material/Face';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import * as React from 'react';
import { Field, Form, Formik } from 'formik';
import { createVolunteerSkillPost } from '../../service/api/skill';
import { Ability } from '../../models/skill';
import { createVolunteerInterestPost } from '../../service/api/interest';
import {
  resetVolunteerInterestsPost,
  resetVolunteerSkillsPost,
} from '../../service/api/volunteer';
import {
  OneVolunteersInterests,
  OneVolunteersSkills,
} from '../../models/volunteer';
import { ErrorResponse } from '../../models/error';
import { getOwnAbilities } from '../../utils/helpers';

interface ManageAbilitiesModalProps<T> {
  volunteerId: number | undefined;
  volunteerAbilities: T[] | undefined;
  baseAbilities: T[] | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAbilities: () => Promise<void>;
  mutatePage: () => Promise<void>;
  name: string;
}

function ManageAbilitiesModal<T extends Ability>({
  volunteerId,
  volunteerAbilities,
  baseAbilities,
  isOpen,
  setIsOpen,
  mutateAbilities,
  mutatePage,
  name,
}: ManageAbilitiesModalProps<T>) {
  const initialValues1 = {
    volunteerAbilities:
      volunteerAbilities?.map((ability: T) => ability.id) || [],
  };

  const initialValues2 = {
    newAbilityName: '',
  };

  const ownAbilities = getOwnAbilities<T>(baseAbilities, volunteerAbilities);

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
        maxWidth="sm"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: '15px',
          }}
        >
          <ConstructionIcon fontSize="large" />
          <DialogTitle variant="h5" sx={{ textTransform: 'capitalize' }}>
            Manage {name}
          </DialogTitle>
        </Box>
        <Formik
          initialValues={initialValues1}
          enableReinitialize
          onSubmit={(values, { setSubmitting }) => {
            if (name === 'skills') {
              const skills: OneVolunteersSkills = {
                volunteerId,
                skillIds: values.volunteerAbilities,
              };

              resetVolunteerSkillsPost(skills)
                .then(() => {
                  void mutateAbilities();
                  void mutatePage();
                  setIsOpen(false);
                })
                .catch((err) => {
                  err.json().then((errorResponse: ErrorResponse) => {
                    alert(JSON.stringify(errorResponse));
                  });
                });
            } else {
              const interests: OneVolunteersInterests = {
                volunteerId,
                interestIds: values.volunteerAbilities,
              };

              resetVolunteerInterestsPost(interests)
                .then(() => {
                  void mutateAbilities();
                  void mutatePage();
                  setIsOpen(false);
                })
                .catch((err) => {
                  err.json().then((errorResponse: ErrorResponse) => {
                    alert(JSON.stringify(errorResponse));
                  });
                });
            }

            setSubmitting(false);
          }}
        >
          {({ values, dirty, setFieldValue }) => (
            <Form>
              <Grid container spacing={2} sx={{ padding: '16px' }}>
                <Grid item xs={6}>
                  <Stack direction="row" gap={1}>
                    <LibraryAddCheckIcon />
                    <Typography variant="h6">Select your {name}</Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  {baseAbilities?.map((ability: T) => (
                    <Chip
                      key={ability.id}
                      label={ability.name}
                      color={
                        values.volunteerAbilities.includes(ability.id)
                          ? 'primary'
                          : 'default'
                      }
                      onClick={() => {
                        void setFieldValue(
                          'volunteerAbilities',
                          values.volunteerAbilities.includes(ability.id)
                            ? values.volunteerAbilities.filter(
                                (id) => id !== ability.id,
                              )
                            : [...values.volunteerAbilities, ability.id],
                        );
                      }}
                      sx={{ m: '5px' }}
                    />
                  ))}
                  {ownAbilities?.map((ability: T) => (
                    <Chip
                      key={ability.id}
                      label={ability.name}
                      icon={<FaceIcon />}
                      color={
                        values.volunteerAbilities.includes(ability.id)
                          ? 'primary'
                          : 'default'
                      }
                      onClick={() => {
                        void setFieldValue(
                          'volunteerAbilities',
                          values.volunteerAbilities.includes(ability.id)
                            ? values.volunteerAbilities.filter(
                                (id) => id !== ability.id,
                              )
                            : [...values.volunteerAbilities, ability.id],
                        );
                      }}
                      sx={{ m: '5px' }}
                    />
                  ))}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    justifyContent: {
                      xs: 'center',
                      md: 'flex-end',
                    },
                  }}
                >
                  <Button type="submit" variant="contained" disabled={!dirty}>
                    <Typography>Save</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        <Formik
          initialValues={initialValues2}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            if (values.newAbilityName !== '') {
              if (name === 'skills') {
                createVolunteerSkillPost(values.newAbilityName)
                  .then(() => {
                    resetForm();
                    void mutateAbilities();
                  })
                  .catch(() => {});
              } else {
                createVolunteerInterestPost(values.newAbilityName)
                  .then(() => {
                    resetForm();
                    void mutateAbilities();
                  })
                  .catch(() => {});
              }
            }
            setSubmitting(false);
          }}
        >
          {({ dirty }) => (
            <Form>
              <Grid container spacing={2} sx={{ padding: '16px' }}>
                <Grid item xs={12}>
                  <Stack direction="row" gap={1}>
                    <LibraryAddIcon />
                    <Typography variant="h6">Or add a new one:</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    id="newAbilityName"
                    name="newAbilityName"
                    label="Enter name"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: '10px' }}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Button variant="contained" type="submit" disabled={!dirty}>
                    <Typography>Add</Typography>
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <DialogActions
                    sx={{
                      mt: '10px',
                      mb: '10px',
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
                      onClick={() => setIsOpen(false)}
                    >
                      <Typography>Close</Typography>
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

export default ManageAbilitiesModal;
