import React, { useContext } from 'react';
import {
  Box,
  Container,
  Link,
  IconButton,
  Menu,
  Toolbar,
  Typography,
  MenuItem,
  Stack,
  Badge,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NavLink, useLocation } from 'react-router-dom';
import useStyles from '../../styles/custom-styles';
import NavRoutes from '../../models/Routes';
import LoginButton from './LoginButton';
import { UserContext } from '../../UserContext';
import NavAvatar from './NavAvatar';
import NotificationMenu from './NotificationMenu';
import { useFetchNumberOfNewNotifications } from '../../service/api/profile';

function Navbar() {
  const { user } = useContext(UserContext);
  const [anchorElNav, setAnchorElNav] = React.useState<HTMLElement | null>(
    null,
  );
  const location = useLocation();
  const classes = useStyles();

  const [anchorElNotification, setAnchorElNotification] =
    React.useState<null | HTMLElement>(null);

  const [isOpen, setIsOpen] = React.useState(false);

  const { data: numOfNewNotifications, mutate: mutateNumOfNotificaitons } =
    useFetchNumberOfNewNotifications();

  const handleNotificationButtonClick = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setAnchorElNotification(event.currentTarget);
    setIsOpen(true);
  };

  const open = Boolean(anchorElNotification);

  const handleOpenNavMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        backgroundColor: '#F4EFE9',
        borderRadius: '0 0 50px 50px',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            className={classes.logoTypography}
            sx={{
              display: { xs: 'none', md: 'flex' },
              color: 'secondary.light',
            }}
          >
            VolunteerVerse
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {NavRoutes.slice(0, NavRoutes.length - 1).map((page) => (
                <MenuItem
                  onClick={handleCloseNavMenu}
                  key={page.key}
                  to={page.path}
                  component={NavLink}
                >
                  <Typography
                    textAlign="center"
                    sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                  >
                    {page.title}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="div"
            className={classes.logoTypography}
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              color: 'secondary.light',
              pl: { xs: 3 },
            }}
          >
            VolunteerVerse
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {NavRoutes.slice(0, NavRoutes.length - 1).map((page) => (
              <Link
                key={page.key}
                component={NavLink}
                to={page.path}
                className={`${classes.hoverEffect} ${
                  location.pathname === page.path ? classes.activeLink : ''
                }`}
                sx={{
                  color: 'secondary.contrastText',
                  textDecoration: 'none',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 'medium',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                    mr: '1rem',
                    ml: '1rem',
                  }}
                >
                  {page.title}
                </Typography>
              </Link>
            ))}
          </Box>
          {user?.token ? (
            <Stack direction="row" gap={2}>
              <Tooltip title="Notifications">
                <IconButton
                  onClick={handleNotificationButtonClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Badge
                    badgeContent={numOfNewNotifications?.count}
                    color="primary"
                  >
                    <NotificationsIcon color="secondary" />
                  </Badge>
                </IconButton>
              </Tooltip>
              {isOpen && (
                <NotificationMenu
                  anchorEl={anchorElNotification}
                  setAnchorEl={setAnchorElNotification}
                  open={open}
                  setIsOpen={setIsOpen}
                  mutateNumOfNotificaitons={mutateNumOfNotificaitons}
                />
              )}
              <NavAvatar />
            </Stack>
          ) : (
            <LoginButton />
          )}
        </Toolbar>
      </Container>
    </Box>
  );
}

export default Navbar;
