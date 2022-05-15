import React from 'react';
import { makeStyles } from '@mui/styles';
import styles from './styles/Loader';

const useStyles = makeStyles(styles);

const Loader = ({ absolute }) => {
  const classes = useStyles({ absolute });

  return (
    <div className={classes.loading}>
      <img src="/images/public/loader.png" alt="Loader" style={{ width: '100px' }} />
    </div>
  );
};

export default Loader;
