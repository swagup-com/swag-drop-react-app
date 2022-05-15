import React from 'react';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  standardCard: {
    border: '1px solid #ebeef2',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    padding: '27px 32px 37px',
    maxHeight: 564,
    maxWidth: 276,
    transition: 'all 0.2s ease-in-out',
    [theme.breakpoints.down('xs')]: {
      justifySelf: 'center'
    },
    '&:hover': {
      boxShadow: '0 16px 32px 0 rgba(0, 0, 0, 0.05)'
    }
  },
  container: {
    display: 'grid',
    marginTop: 36,
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px',
    width: '100%',
    [theme.breakpoints.only('xl')]: {
      columnGap: '15px',
      gridTemplateColumns: 'repeat(5, 1fr)'
    },
    [theme.breakpoints.only('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)'
    },
    [theme.breakpoints.only('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)'
    },
    [theme.breakpoints.only('xs')]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
      justifyContent: 'center'
    }
  }
}));

const CommonContainer = ({ children, ...props }) => <Grid {...props}>{children}</Grid>;

const StandardCard = ({ className, ...props }) => {
  const classes = useStyles();
  return <CommonContainer className={clsx(classes.standardCard, className)} {...props} />;
};

const CardsContainer = ({ className, ...props }) => {
  const classes = useStyles();
  return <CommonContainer className={clsx(classes.container, className)} {...props} />;
};

export { StandardCard, CardsContainer };
