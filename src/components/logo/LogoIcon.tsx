// material-ui
import { useTheme } from '@mui/material/styles';
import logoEnergee from 'assets/images/logo-energee.png';
import ThemeMode from 'components/Customization/ThemeMode';
import { Box } from '@mui/material';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoIconDark from 'assets/images/logo-icon-dark.svg';
 * import logoIcon from 'assets/images/logo-icon.svg';
 *
 */

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoIconDark : logoIcon} alt="icon logo" width="100" />
     *
     */
    <>
      <img src={logoEnergee} alt="icon logo" width="150" />
    </>
  );
}
