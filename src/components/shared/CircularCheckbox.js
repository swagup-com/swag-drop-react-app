import React from 'react';
import { Checkbox } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    width: ({ width }) => width,
    height: ({ height }) => height,
    color: '#ced1d6',
    border: 'solid 1px #ced1d6',
    transition: 'all 250ms',
    '$root.Mui-focusVisible &': {
      boxShadow: '0 0 5px #3577d4'
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5'
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      border: 'solid 1px #ebedf0',
      color: '#ebedf0'
    }
  },
  checkedIcon: {
    transition: 'all 250ms',
    color: '#ffffff',
    backgroundColor: '#3577d4',
    border: 'solid 1px #3577d4',
    'input:hover ~ &': {
      backgroundColor: '#3577d4'
    }
  }
});

const CircularCheckbox = ({ width = 24, height = 24, className, ...props }) => {
  const classes = useStyles({ width, height });

  return (
    <Checkbox
      className={clsx(classes.root, className)}
      disableRipple
      disableFocusRipple
      disableTouchRipple
      checkedIcon={
        <span className={clsx(classes.icon, classes.checkedIcon)}>
          <CheckIcon style={{ width: width - 8, height: height - 8 }} />
        </span>
      }
      icon={
        <span className={classes.icon}>
          <CheckIcon style={{ width: width - 8, height: height - 8 }} />
        </span>
      }
      inputProps={{ 'aria-label': 'decorative checkbox' }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

export default CircularCheckbox;
