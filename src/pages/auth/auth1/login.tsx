// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import useAuth from 'hooks/useAuth';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';

// assets
import logo from 'assets/images/logo-energee.png';
import { Box } from '@mui/material';

// ================================|| LOGIN ||================================ //

export default function Login() {
  const { isLoggedIn } = useAuth();

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} md={8}>
        <Box
          sx={{
            display: 'flex',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, .1), 0 10px 10px -5px rgba(0, 0, 0, .04)',
            borderRadius: 2,
            padding: 3,
            backgroundColor: 'white'
          }}
        >
          {/* Logo Section */}
          <Grid container>
            <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
              <img src={logo} alt="logo" style={{ maxWidth: '100%', height: 'auto' }} />
            </Grid>

            {/* Login Form Section */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Typography variant="h3">Login</Typography>
                <AuthLogin forgot="/auth/forgot-password" />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
