// material-ui
import { useTheme } from '@mui/material/styles';
import logoEnergee from 'assets/images/logo-energee.png';
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="icon logo" width="100" />
     *
     */
    <>
        <img src={logoEnergee} alt="icon logo" width="150" />
    </>
  );
}
