import { useMediaQuery } from '@mui/material';


const pageOptionsForBigScreens = [15, 30, 45, 60];
const pageOptionsForSmallScreens = [12, 24, 36, 48];

const usePerPageOptions = () => {
  const isUpXL = useMediaQuery(theme => theme.breakpoints.up('xl'), { noSsr: true });

  return isUpXL ? pageOptionsForBigScreens : pageOptionsForSmallScreens;
};

export { usePerPageOptions };
