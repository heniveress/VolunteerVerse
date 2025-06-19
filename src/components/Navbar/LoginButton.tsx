import { NavLink } from 'react-router-dom';
import { Button, Link, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import NavRoutes from '../../models/Routes';
import useStyles from '../../styles/custom-styles';

function LoginButton() {
  const classes = useStyles();

  return (
    <>
      <Button
        variant="contained"
        to={NavRoutes[NavRoutes.length - 1].path}
        component={NavLink}
        endIcon={<LoginIcon />}
        sx={{ display: { xs: 'none', md: 'flex' } }}
      >
        <Typography color="common.white">
          {NavRoutes[NavRoutes.length - 1].title}
        </Typography>
      </Button>

      <Link
        to={NavRoutes[NavRoutes.length - 1].path}
        className={classes.icons}
        component={NavLink}
      >
        <LoginIcon sx={{ display: { md: 'none', xs: 'flex' } }} />
      </Link>
    </>
  );
}

export default LoginButton;
