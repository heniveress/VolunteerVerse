import styled from 'styled-components';
import { Box } from '@mui/material';

const BackgroundBox = styled(Box)`
  && {
    padding: 20px;
    max-width: 100%;
    flex-grow: 1;
    backdrop-filter: blur(100px);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 15px;
  }
`;

export default BackgroundBox;
