import React, { forwardRef } from 'react';
import { Grid } from '@mui/material';
import { withStyles } from '@mui/styles';
import clsx from 'clsx';

const styles = theme => ({
  center: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 1440,
    [theme.breakpoints.only('lg')]: {
      width: 1200
    },
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  }
});

const CenteredGridWithRef = ({ children, classes, className, ...props }, ref) => (
  <Grid {...props} ref={ref} className={clsx(classes.center, className)}>
    {children}
  </Grid>
);

const CenteredGrid = forwardRef(CenteredGridWithRef);

export default withStyles(styles)(CenteredGrid);
