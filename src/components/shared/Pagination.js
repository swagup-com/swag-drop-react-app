import React, { useCallback, forwardRef, useState } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { InputBase, MenuItem, Select, Typography, IconButton, Grid } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Button } from '@swagup-com/react-ds-components';
import { makeStyles, withStyles } from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  container: { width: 270 },
  selectRoot: {
    '&.MuiSelect-selectMenu:focus': {
      backgroundColor: 'transparent'
    }
  },
  select: { padding: '0 !important' },
  input: {
    color: 'inherit',
    fontSize: 'inherit',
    flexShrink: 0
  },
  paginationLabel: {
    lineHeight: theme.typography.pxToRem(18),
    color: '#868a8f',
    fontWeight: 400
  },
  darkGray: { color: '#4a505c' }
}));

export const CustomIconButton = withStyles({
  root: {
    boxShadow: '0 8px 24px 0 rgba(27, 28, 31, 0.05)'
  }
})(IconButton);

const CustomButton = withStyles({
  root: {
    width: 48,
    height: 48,
    minWidth: 48,
    padding: 12,
    border: 'none !important',
    boxShadow: '0 8px 24px 0 rgba(27, 28, 31, 0.05)',
    '&:hover': { color: 'rgba(0, 0, 0, 0.54)' }
  }
})(forwardRef((props, ref) => <Button innerRef={ref} {...props} />, { displayName: 'CustomButton' }));

const Pagination = ({
  component: Component = 'div',
  count,
  disabled,
  pageIndex,
  perPage,
  next,
  onNext,
  previous,
  onPrevious,
  sizeOptions,
  onPerPageChange,
  startText,
  endText = 'items',
  buttonClass
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const lastPage = count ? Math.max(0, Math.ceil(count / perPage) - 1) : pageIndex;

  const getSelectLabel = value => {
    const firstElement = count === 0 ? 0 : pageIndex * value + 1;
    const lastElement = Math.min(count, (pageIndex + 1) * value);

    const DarkerText = ({ children }) => <span className={classes.darkGray}>{children}</span>;

    return (
      <Typography variant="body2" className={classes.paginationLabel}>
        {startText}{' '}
        <DarkerText>
          {firstElement}-{lastElement}{' '}
        </DarkerText>
        of
        <DarkerText> {count} </DarkerText>
        {endText}
      </Typography>
    );
  };

  const handleChangeSize = useCallback(e => onPerPageChange(+e.target.value), [onPerPageChange]);

  const showPagination = count > _.min(sizeOptions);

  const BaseComponent = next ? Link : CustomButton;

  return (
    <Component>
      {showPagination && (
        <Grid container justifyContent="space-between" className={classes.container}>
          <CustomIconButton
            component={BaseComponent}
            to={previous}
            replace={Boolean(previous) || undefined}
            onClick={onPrevious}
            disabled={disabled || pageIndex === 0}
            aria-label="Previous Page"
            className={buttonClass}
          >
            <KeyboardArrowLeft />
          </CustomIconButton>
          <Select
            open={open}
            onOpen={() => setOpen(sizeOptions.length > 1)}
            onClose={() => setOpen(false)}
            classes={{
              root: classes.selectRoot,
              select: classes.select
            }}
            input={<InputBase className={classes.input} />}
            value={perPage}
            renderValue={getSelectLabel}
            IconComponent={() => <div />}
            onChange={handleChangeSize}
          >
            {sizeOptions.map(option => (
              <MenuItem key={option} value={option} style={{ justifyContent: 'center' }}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <CustomIconButton
            component={BaseComponent}
            to={next}
            replace={Boolean(next) || undefined}
            onClick={onNext}
            disabled={disabled || pageIndex >= lastPage}
            aria-label="Next Page"
            className={buttonClass}
          >
            <KeyboardArrowRight />
          </CustomIconButton>
        </Grid>
      )}
    </Component>
  );
};

export default Pagination;
