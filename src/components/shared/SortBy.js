import * as React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MenuItem } from '@mui/material';
import Dropdown from './Dropdown';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  icon: {
    color: '#3577d4',
    fontSize: 16
  },
  label: {
    color: ({ selected }) => (selected ? '#3577d4' : '#0b1829'),
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    lineHeight: '10px',
    letterSpacing: 0,
    margin: 0
  },
  menuItem: {
    width: 156,
    height: 24,
    padding: '6px 0',
    margin: '6px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

const SortByItem = React.forwardRef(({ label, selected, ...props }, ref) => {
  const classes = useStyles({ selected });

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <MenuItem ref={ref} className={classes.menuItem} {...props}>
      <span className={classes.label}>{label}</span>
      {selected && <CheckCircleIcon className={classes.icon} />}
    </MenuItem>
  );
});

const SortBy = ({ options, selected, onChange, versatil }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => setAnchorEl(null);

  return (
    <Dropdown anchorEl={anchorEl} setAnchorEl={setAnchorEl} label={(versatil && selected) || 'Sort by'}>
      {options.map(({ label, value }) => (
        <SortByItem
          key={value}
          label={label}
          onClick={() => {
            onChange(value);
            handleClose();
          }}
          selected={selected === value}
        />
      ))}
    </Dropdown>
  );
};

export default SortBy;
