import * as React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ButtonBase, Menu, Fade } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  button: {
    display: 'inline-flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 80,
    height: 24,
    padding: '2px 8px',
    color: ({ open }) => (open ? '#0b1829' : '#787b80'),
    '&:hover': { color: '#0b1829' }
  },
  buttonIcon: {
    color: 'inherit',
    fontSize: 18,
    transform: ({ open }) => (open ? 'rotate(-180deg)' : '')
  },
  buttonText: {
    color: 'inherit',
    fontFamily: 'Gilroy-Medium',
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: '8px'
  },
  menu: {
    borderRadius: 15,
    boxShadow: '0 16px 32px 0 rgba(0, 0, 0, 0.05)',
    padding: '4px 18px'
  }
});

const Dropdown = ({ anchorEl, setAnchorEl, label, children }) => {
  const open = Boolean(anchorEl);
  const classes = useStyles({ open });

  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <ButtonBase aria-controls={label} aria-haspopup="true" className={classes.button} onClick={handleClick}>
        <span className={classes.buttonText}>{label}</span>
        <KeyboardArrowDownIcon className={classes.buttonIcon} />
      </ButtonBase>
      <Menu
        anchorEl={anchorEl}
        id={label}
        keepMounted
        classes={{ paper: classes.menu }}
        open={open}
        onClose={handleClose}
        MenuListProps={{ style: { padding: 0 } }}
        getContentAnchorEl={null}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        tabIndex="-1"
        TransitionComponent={Fade}
      >
        {children}
      </Menu>
    </>
  );
};

export default Dropdown;
