/* eslint-disable @typescript-eslint/no-shadow */
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
import WavingHandIcon from '@mui/icons-material/WavingHand';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { loginPost } from '../service/api/login';
import { UserContext } from '../UserContext';
import { ErrorResponse } from '../models/error';
import { Credentials } from '../models/credentials';
import GoogleAuth from '../components/GoogleAuth';
import { User } from '../models/user';

function Login() {
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const initialValues: Credentials = {
    email: '',
    password: '',
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters'),
  });

  return (
    <Container
      component="main"
      maxWidth="xs"
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
          <WavingHandIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          <b>Welcome back!</b>
        </Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            loginPost(values)
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
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    size="medium"
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    inputProps={{ maxLength: 320 }}
                    error={!!errors.email && touched.email}
                    helperText={touched.email ? errors.email : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    id="password"
                    name="password"
                    label="Password"
                    size="medium"
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
                <Grid item xs={12}>
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
                    <Typography>Log In</Typography>
                  </Button>
                </Grid>
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
        <GoogleAuth isSignUp={false} />
        <Grid container>
          <Grid
            item
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <small>Don&apos;t have an account?</small>&nbsp;
            <Link to="/signup" component={RouterLink} variant="body2">
              Register here
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Login;
