import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  MenuItem,
  Select,
  OutlinedInput,
  Input,
  FilledInput,
  FormControl,
  Checkbox,
  Typography,
  InputAdornment,
  Grid
} from '@mui/material';
import { Search, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Button } from '@swagup-com/react-ds-components';
import _ from 'lodash';
import Tooltip from './Tooltip';
import { multiselectFilter, sortByStyles, searchOutlinedStyles, searchFilledStyles } from './styles/filters';
import { makeStyles, withStyles } from '@mui/styles';

const getInputVariant = variant => {
  if (variant === 'filled') return FilledInput;
  if (variant === 'outlined') return OutlinedInput;
  return Input;
};

export const SearchField = ({ value, onChange, variant, placeholder = 'Search', fullWidth, height, ...props }) => {
  const [currentValue, setCurrentValue] = useState(value);

  const InputVariant = getInputVariant(variant);
  const handleChange = e => {
    setCurrentValue(e.target.value);
    onChange(e);
  };

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <FormControl variant={variant} fullWidth={fullWidth}>
      <InputVariant
        value={currentValue}
        placeholder={placeholder}
        onChange={handleChange}
        style={{ height }}
        {...props}
      />
    </FormControl>
  );
};

export const FilledSearchField = withStyles(searchFilledStyles)(
  ({
    startAdornment = (
      <InputAdornment position="start" style={{ marginTop: 0 }}>
        <Search style={{ color: '#aaaaaa' }} />
      </InputAdornment>
    ),
    ...props
  }) => <SearchField variant="filled" startAdornment={startAdornment} {...props} />
);

export const OutlinedSearchField = withStyles(searchOutlinedStyles)(props => (
  <SearchField variant="outlined" {...props} />
));

const useSortByStyle = makeStyles(sortByStyles);

export const SortBy = ({
  value,
  disabled,
  onChange,
  items,
  title,
  width,
  height,
  icon = KeyboardArrowDown,
  ...props
}) => {
  const classes = useSortByStyle(props);
  const selectRef = useRef();

  return (
    <FormControl variant="outlined" className={classes.sortByContainer}>
      <Select
        ref={selectRef}
        value={value}
        disabled={disabled}
        onChange={onChange}
        IconComponent={icon}
        MenuProps={{ PaperProps: { style: { width: selectRef.current?.offsetWidth + 2 } } }}
        input={<OutlinedInput classes={{ input: classes.input }} />}
        className={classes.sortBy}
        style={{ width, height }}
        classes={{ selectMenu: classes.muiSelectMenu, iconOutlined: classes.muiIconOutlined }}
      >
        {items.map(item => (
          <MenuItem value={item.value} key={item.value} className={classes.item}>
            <Typography className={classes.filterText}>
              <span style={{ visibility: value === item.value ? 'visible' : 'hidden' }}>{title}</span>
              <span className={classes.filterValue}>{item.text}</span>
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const useStyles = makeStyles(multiselectFilter);

export const MultiselectFilter = ({
  values,
  selected,
  onApply,
  title,
  defaultText = 'Default',
  width,
  height,
  behavior = 'checkbox'
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);

  const classes = useStyles();

  const sortedSelectedValues = selectedValues.sort();
  const selectedList = React.useMemo(() => selected.split(','), [selected]);
  const noneSelected = selectedValues.length === 0;

  useEffect(() => {
    setSelectedValues(selected === '' ? [] : selectedList);
  }, [selected, selectedList]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setSelectedValues(selected === '' ? [] : selectedList);
    setAnchorEl(null);
  };

  const handleClear = () => {
    setSelectedValues([]);
  };

  const handleApply = () => {
    onApply({ target: { value: noneSelected ? '' : sortedSelectedValues.toString() } });
    setAnchorEl(null);
  };

  const handleSelectItem = value => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(i => i !== value));
    } else {
      setSelectedValues(behavior === 'radiobutton' ? [value] : [...selectedValues, value]);
    }
  };

  const selectedTip = () => {
    if (anchorEl) return '';
    if (noneSelected) {
      return defaultText;
    }
    if (selectedValues.length === 1) {
      return selectedValues[0];
    }

    return (
      <Tooltip title={sortedSelectedValues.join(', ')} classes={{ tooltip: classes.tooltip }}>
        <span>{`${selectedValues.length} Selected`}</span>
      </Tooltip>
    );
  };

  const Icon = props => (anchorEl ? <KeyboardArrowUp {...props} /> : <KeyboardArrowDown {...props} />);

  const sameSelection = _.xor(selectedValues, selectedList.filter(Boolean)).length === 0;

  return (
    <Grid item container justifyContent="center">
      <Button
        variant="secondary"
        onClick={handleClick}
        onClose={handleClose}
        endIcon={<Icon style={{ fontSize: '1.5rem' }} htmlColor="#0000008A" />}
        className={classes.menuButton}
        style={{ width, height }}
      >
        {title} <span className={classes.optionsText}>{selectedTip()}</span>
      </Button>
      <Menu
        elevation={8}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        classes={{ paper: classes.menu }}
      >
        {values.map(value => (
          <MenuItem
            value={value.value}
            key={value.value}
            onClick={() => handleSelectItem(value.text)}
            className={classes.menuItem}
          >
            <Checkbox
              color="primary"
              disabled={!selectedValues.includes(value.text)}
              checked={selectedValues.includes(value.text)}
              onClick={() => handleSelectItem(value.text)}
              className={classes.checkbox}
            />
            <Typography
              variant="body1"
              style={{
                fontSize: 14,
                marginLeft: 5,
                color: selectedValues.includes(value.text) ? '#0b1829' : '#787b80'
              }}
            >
              {value.text}
            </Typography>
          </MenuItem>
        ))}
        <div style={{ borderTop: 1, borderColor: '#ebedf0', borderTopStyle: 'solid' }} />
        <Grid item container className={classes.buttonsSection}>
          <Button
            variant="text"
            disabled={noneSelected}
            onClick={handleClear}
            className={classes.button}
            style={{ color: noneSelected ? '#ced1d6' : '#0b1829' }}
          >
            Clear
          </Button>
          <Button
            variant="text"
            disabled={sameSelection}
            onClick={handleApply}
            className={classes.button}
            style={{
              marginLeft: 'auto',
              color: sameSelection ? '#787b80' : '#3577d4'
            }}
          >
            Apply
          </Button>
        </Grid>
      </Menu>
    </Grid>
  );
};

const nameItems = [
  { value: '-created_at', text: 'Newest first' },
  { value: 'created_at', text: 'Oldest first' },
  { value: 'full_name', text: 'Name A - Z' },
  { value: '-full_name', text: 'Name Z - A' }
];

export const SortByName = ({ value, onChange, width, height, icon, classes }) => (
  <SortBy
    value={value}
    onChange={onChange}
    items={nameItems}
    title="Sort:"
    width={width}
    height={height}
    icon={icon}
    classes={classes}
  />
);
