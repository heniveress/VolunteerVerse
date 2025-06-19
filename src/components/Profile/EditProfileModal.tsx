import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Box,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { AccountInfo, Password } from '../../models/accountInfo';
import { ErrorResponse } from '../../models/error';
import {
  useFetchProfile,
  editProfilePatch,
  changePasswordPatch,
} from '../../service/api/profile';

interface EditProfileModalProps {
  accountInfo: AccountInfo;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditProfileModal({
  accountInfo,
  isOpen,
  setIsOpen,
}: EditProfileModalProps) {
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate } = useFetchProfile();

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(
        /^[A-ZÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
        'Please enter a valid first name',
      )
      .required('First name is required'),
    lastName: Yup.string()
      .matches(
        /^[A-ZÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
        'Please enter a valid last name',
      )
      .required('Last name is required'),
    phone: Yup.string()
      .matches(/^\+?[0-9][0-9]{7,14}$/, 'Please enter a valid phone number')
      .required('Phone number is required'),
    oldPassword: Yup.lazy((value) => {
      if (value) {
        return Yup.string().required('Old Password is required');
      }
      return Yup.string().notRequired();
    }),
    newPassword: Yup.lazy((value) => {
      if (value) {
        return Yup.string()
          .min(8, 'Password must be at least 8 characters')
          .required('New Password is required');
      }
      return Yup.string().notRequired();
    }),
    confirmPassword: Yup.lazy((value) => {
      if (value) {
        return Yup.string()
          .oneOf([Yup.ref('newPassword'), ''], 'Passwords must match')
          .required('Confirm Password is required');
      }
      return Yup.string().notRequired();
    }),
  });

  const initialValues = {
    firstName: accountInfo.firstName,
    lastName: accountInfo.lastName,
    phone: accountInfo.phone,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  return (
    <Box>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setIsSwitchChecked(false);
        }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting, setErrors }) => {
            const profileFieldsChanged =
              values.firstName !== initialValues.firstName ||
              values.lastName !== initialValues.lastName ||
              values.phone !== initialValues.phone;

            const passwordChanged =
              isSwitchChecked &&
              (!accountInfo.hasPassword || values.oldPassword) &&
              values.newPassword &&
              values.confirmPassword;

            if (profileFieldsChanged) {
              editProfilePatch(accountInfo.id, {
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
              } as AccountInfo)
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

            if (passwordChanged) {
              let passwordData: Password = {
                newPassword: values.newPassword,
              };

              if (accountInfo.hasPassword) {
                passwordData = {
                  ...passwordData,
                  oldPassword: values.oldPassword,
                };
              }

              changePasswordPatch(passwordData)
                .then(() => {
                  setIsOpen(false);
                  setErrors({});
                  void mutate();
                })
                .catch((err) => {
                  err.json().then((errorResponse: ErrorResponse) => {
                    setErrors({ oldPassword: errorResponse.errors[0] });
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
                  justifyContent: 'center',
                  alignItems: 'center',
                  pt: '10px',
                }}
              >
                <AccountCircleRoundedIcon fontSize="large" />
                <DialogTitle variant="h5">Edit Account</DialogTitle>
              </Box>

              <Grid
                container
                spacing={2}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: '5px',
                  mb: '15px',
                }}
              >
                <Grid item xs={8} md={4}>
                  <Field
                    as={TextField}
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    fullWidth
                    inputProps={{ maxLength: 40 }}
                    error={!!errors.firstName && touched.firstName}
                    helperText={
                      touched.firstName && errors.firstName
                        ? errors.firstName
                        : touched.lastName && errors.lastName
                        ? ' '
                        : ''
                    }
                  />
                </Grid>
                <Grid item xs={8} md={4}>
                  <Field
                    as={TextField}
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    inputProps={{ maxLength: 40 }}
                    error={!!errors.lastName && touched.lastName}
                    helperText={
                      touched.lastName && errors.lastName
                        ? errors.lastName
                        : touched.firstName && errors.firstName
                        ? ' '
                        : ''
                    }
                  />
                </Grid>
                <Grid item xs={8}>
                  <Field
                    as={TextField}
                    id="phone"
                    name="phone"
                    label="Phone Number"
                    fullWidth
                    inputProps={{ maxLength: 22 }}
                    error={!!errors.phone && touched.phone}
                    helperText={touched.phone ? errors.phone : ''}
                  />
                </Grid>
                <Grid item xs={8}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isSwitchChecked}
                        onChange={() => setIsSwitchChecked(!isSwitchChecked)}
                      />
                    }
                    label="Change Password"
                  />
                </Grid>
                {isSwitchChecked && (
                  <>
                    {accountInfo.hasPassword ? (
                      <Grid item xs={8}>
                        <Field
                          as={TextField}
                          id="oldPassword"
                          name="oldPassword"
                          label="Old Password"
                          error={!!errors.oldPassword && touched.oldPassword}
                          helperText={
                            touched.oldPassword ? errors.oldPassword : ''
                          }
                          type={showOldPassword ? 'text' : 'password'}
                          fullWidth
                          InputProps={{
                            inputProps: { maxLength: 128 },
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() =>
                                    setShowOldPassword(!showOldPassword)
                                  }
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showOldPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    ) : null}

                    <Grid item xs={8}>
                      <Field
                        as={TextField}
                        id="newPassword"
                        name="newPassword"
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        error={!!errors.newPassword && touched.newPassword}
                        helperText={
                          touched.newPassword ? errors.newPassword : ''
                        }
                        fullWidth
                        InputProps={{
                          inputProps: { maxLength: 128 },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showNewPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <Field
                        as={TextField}
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm New Password"
                        error={
                          !!errors.confirmPassword && touched.confirmPassword
                        }
                        helperText={
                          touched.confirmPassword ? errors.confirmPassword : ''
                        }
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        InputProps={{
                          inputProps: { maxLength: 128 },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showConfirmPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={8}>
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
                      onClick={() => {
                        setIsOpen(false);
                        setIsSwitchChecked(false);
                      }}
                    >
                      <Typography>Cancel</Typography>
                    </Button>
                    <Button type="submit" variant="contained" disabled={!dirty}>
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

export default EditProfileModal;
