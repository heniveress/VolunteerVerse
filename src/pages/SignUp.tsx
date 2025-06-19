/* eslint-disable @typescript-eslint/no-unused-vars */
import { Divider, IconButton, InputAdornment, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { UserContext } from '../UserContext';
import { ErrorResponse } from '../models/error';
import { User } from '../models/user';
import { RegisterUser } from '../models/registerUser';
import { registerFetch } from '../service/api/register';
import GoogleAuth from '../components/GoogleAuth';

function SignUp() {
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState('');

  const initialValues: RegisterUser = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  };

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
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email address is required'),
    phone: Yup.string()
      .matches(/^\+?[0-9][0-9]{7,14}$/, 'Please enter a valid phone number')
      .required('Phone number is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Please repeat the password'),
  });

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(100px)',
          backgroundColor: 'rgba(255, 255, 255, 1.9)',
          borderRadius: '10px',
          padding: '20px',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddAlt1Icon />
        </Avatar>
        <Typography component="h1" variant="h5">
          <b>Create Account</b>
        </Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            const { confirmPassword, ...dataToSend } = values;

            registerFetch(dataToSend)
              .then((response) => response as unknown as User)
              .then((response) => {
                window.localStorage.setItem('token', response.token);
                window.localStorage.setItem(
                  'firstName',
                  response.firstName || '',
                );
                window.localStorage.setItem(
                  'lastName',
                  response.lastName || '',
                );
                window.localStorage.setItem('email', response.email || '');
                setUser(response);

                navigate('/');
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
              <Grid
                container
                spacing={2}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: '12px',
                  mb: '15px',
                }}
              >
                <Grid item sm={6} xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    size="medium"
                    id="firstName"
                    required
                    label="First Name"
                    name="firstName"
                    autoComplete="firstName"
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
                <Grid item sm={6} xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    size="medium"
                    id="lastName"
                    required
                    label="Last Name"
                    name="lastName"
                    inputProps={{ maxLength: 40 }}
                    autoComplete="lastName"
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
                <Grid item sm={12} xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    size="medium"
                    id="email"
                    required
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    inputProps={{ maxLength: 320 }}
                    error={!!errors.email && touched.email}
                    helperText={touched.email ? errors.email : ''}
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    size="medium"
                    id="phone"
                    required
                    label="Phone Number"
                    name="phone"
                    inputProps={{ maxLength: 22 }}
                    autoComplete="phone"
                    error={!!errors.phone && touched.phone}
                    helperText={touched.phone ? errors.phone : ''}
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Field
                    as={TextField}
                    id="password"
                    name="password"
                    label="Password"
                    size="medium"
                    required
                    error={!!errors.password && touched.password}
                    helperText={touched.password ? errors.password : ''}
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    InputProps={{
                      inputProps: { maxLength: 128 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item sm={12} xs={12}>
                  <Field
                    as={TextField}
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    size="medium"
                    required
                    error={!!errors.confirmPassword && touched.confirmPassword}
                    helperText={
                      touched.confirmPassword ? errors.confirmPassword : ''
                    }
                    type={showRepeatPassword ? 'text' : 'password'}
                    fullWidth
                    InputProps={{
                      inputProps: { maxLength: 128 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() =>
                              setShowRepeatPassword(!showRepeatPassword)
                            }
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showRepeatPassword ? (
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
                <Grid item sm={12} xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                    disabled={
                      !dirty ||
                      Object.values(errors).some((x) => x.length !== 0)
                    }
                  >
                    <Typography>Sign Up</Typography>
                  </Button>
                </Grid>
                <Grid />
                {error && (
                  <Typography color="error" variant="body2" align="center">
                    {error}
                  </Typography>
                )}
              </Grid>
            </Form>
          )}
        </Formik>
        <Divider>
          <small>OR</small>
        </Divider>
        <GoogleAuth isSignUp />
        <Grid container>
          <Grid
            item
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <small>Already have an account?</small>&nbsp;
            <Link to="/login" component={RouterLink} variant="body2">
              Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default SignUp;
