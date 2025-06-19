import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  icons: {
    color: '#1C2732',
  },
  activeLink: {
    color: '#EC6744',
    fontWeight: 'bold',
  },
  activeButton: {
    backgroundColor: '#ab442a',
  },
  hoverEffect: {
    '&:hover': {
      color: '#EC6744',
    },
  },
  submitButton: {
    backgroundColor: '#297258',
    borderRadius: '5px',
    color: '#ffff',
    '&:hover': {
      backgroundColor: '#215b49',
    },
  },
  listItems: {
    paddingLeft: '0px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  iconHover: {
    '&:hover': {
      color: '#df7c2a',
    },
  },
  deleteButton: {
    backgroundColor: '#e41e1e',
    color: 'white',
    '&:hover': {
      backgroundColor: '#c01515',
    },
  },
  leaveButton: {
    borderColor: '#1C2732',
    color: '#1C2732',
    '&:hover': {
      backgroundColor: '#1C2732',
      color: '#fdf5f3',
      borderColor: '#1C2732',
    },
  },
  logoTypography: {
    fontFamily: " 'Mate SC', 'serif' ",
  },
});

export default useStyles;
