import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { UserContext } from '../UserContext';
import { googleLoginPost } from '../service/api/login';
import { ErrorResponse } from '../models/error';
import { User } from '../models/user';

interface GoogleAuthProps {
  isSignUp: boolean;
}

function GoogleAuth({ isSignUp }: GoogleAuthProps) {
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', mt: '20px', mb: '20px' }}
    >
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          googleLoginPost(credentialResponse.credential || '')
            .then((response) => response as unknown as User)
            .then((response) => {
              window.localStorage.setItem('token', response.token);
              window.localStorage.setItem(
                'firstName',
                response.firstName || '',
              );
              window.localStorage.setItem('lastName', response.lastName || '');
              window.localStorage.setItem('email', response.email || '');

              setUser({
                token: response.token,
                firstName: response.firstName,
                lastName: response.lastName,
                email: response.email,
              });
              navigate('/');
            })
            .catch((err) => {
              err.json().then((errorResponse: ErrorResponse) => {
                const errorMessage = JSON.stringify(errorResponse.errors);
                alert(errorMessage);
              });
            });
        }}
        onError={() => {
          alert('Login Failed');
        }}
        size="large"
        text={isSignUp ? 'signup_with' : 'signin_with'}
        shape="pill"
      />
    </Box>
  );
}

export default GoogleAuth;
