// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

//project-imports
import { ThemeMode } from 'config';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(249, 250, 251)'
      }}
    ></Box>
  );
};

export default AuthBackground;
