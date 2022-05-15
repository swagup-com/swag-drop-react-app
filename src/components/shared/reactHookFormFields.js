import React, { forwardRef } from 'react';
import NumberFormat from 'react-number-format';
// import { TextField as MuiTextField } from '@swagup-com/components';
import { Tooltip as MuiTooltip, TextField as MuiTextField } from '@mui/material';
import { withStyles, makeStyles } from '@mui/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Controller } from 'react-hook-form';
import RSC from 'react-scrollbars-custom';
import clsx from 'clsx';
import PhoneInput from './PhoneInput';
import { ellipsisStyles } from '../shared/styles/commonStyles';

const Tooltip = withStyles({
  popper: {
    zIndex: 1200 // less than the select menu (1300)
  },
  tooltip: {
    borderRadius: 5,
    padding: '13px 20px',
    color: ({ error_type: errorType }) => (errorType === 'warning' ? '#fe8e26' : '#f44336'),
    fontSize: 12,
    fontFamily: 'Gilroy-SemiBold',
    lineHeight: 'normal',
    boxShadow: '0 6px 36px 0 rgba(0, 0, 0, 0.15)',
    backgroundImage: 'unset'
  }
})(MuiTooltip);

const Wrapper = ({ children, withTooltip, errorType, error }) =>
  withTooltip ? (
    <Tooltip title={error || ''} placement="top" arrow error_type={errorType}>
      <div data-description="reference-holder">{children}</div>
    </Tooltip>
  ) : (
    children
  );

const useStyles = makeStyles({
  root: ({ withTooltip }) => (!withTooltip ? { paddingTop: 5 } : undefined)
});

const TextField = React.forwardRef(({ error, withTooltip, className, formatFn, ...props }, ref) => {
  const classes = useStyles({ withTooltip });
  const { name } = props;
  const InputProps = {
    ...props.InputProps,
    ...(formatFn && {
      inputComponent: NumberFormat,
      inputProps: { format: formatFn, getInputRef: ref }
    })
  };

  return (
    <Wrapper withTooltip={withTooltip} error={error}>
      <MuiTextField
        {...props}
        id={name} // Makes this component testable
        inputRef={ref}
        error={Boolean(error)}
        helperText={withTooltip ? undefined : error ?? ' '}
        className={clsx(classes.root, className)}
        InputProps={InputProps}
      />
    </Wrapper>
  );
});

const styles = {
  labelInput: {
    ...ellipsisStyles,
    paddingTop: ({ withTooltip }) => (withTooltip ? 1 : 4),
    color: '#bdbdbd',
    width: '100%',
    paddingRight: 70
  },
  textInput: {
    paddingRight: '60px !important'
  },
  menuPaper: {
    overflowY: 'hidden'
  },
  menuItem: {
    '& .MuiMenuItem-root': {
      height: 52,
      display: 'flex',
      alignItems: 'center'
    }
  },
  inputWarning: {
    '.MuiOutlinedInput-root.Mui-error & ~ .MuiOutlinedInput-notchedOutline': {
      borderColor: '#fe8e26',
      '&:hover': {
        borderColor: '#fe8e26'
      }
    }
  }
};

const getScrollable = (totalItems, itemHeight) => {
  if (typeof window === 'undefined') return null;
  const windowsHeight = window.innerHeight - 96;
  const totalHeight = totalItems * itemHeight;
  const height = Math.min(windowsHeight, totalHeight);
  return forwardRef((props, ref) => <RSC ref={ref} {...props} style={{ height }} />, {
    displayName: 'Scrollbars'
  });
};

const SelectIcon = props => <KeyboardArrowDownIcon style={{ right: 25 }} {...props} />;

const SelectField = withStyles(styles)(
  ({
    control,
    name,
    error,
    defaultValue,
    withTooltip,
    errorType = 'error',
    totalItems,
    itemHeight = 52,
    onSelectChange,
    hideLabel = true,
    label,
    classes,
    disabled,
    ...props
  }) => (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => {
        const handleSelect = e => {
          onChange(e);
          if (onSelectChange) onSelectChange(e);
        };
        return (
          <Wrapper withTooltip={withTooltip} errorType={errorType} error={error}>
            <MuiTextField
              {...props}
              label={label}
              select
              id={name} // Makes this component testable
              name={name}
              value={value}
              title={value}
              error={Boolean(error)}
              helperText={!withTooltip && error}
              disabled={disabled}
              SelectProps={{
                IconComponent: SelectIcon,
                MenuProps: {
                  classes: { paper: classes.menuPaper },
                  MenuListProps: {
                    classes: { root: classes.menuItem },
                    component: getScrollable(totalItems, itemHeight)
                  }
                }
              }}
              InputProps={{
                classes: { input: clsx(classes.textInput, errorType === 'warning' && classes.inputWarning) }
              }}
              InputLabelProps={{
                shrink: hideLabel ? false : Boolean(value),
                className: classes.labelInput,
                style: { display: hideLabel && Boolean(value) ? 'none' : 'unset', color: '#bdbdbd' }
              }}
              style={!withTooltip ? { paddingTop: 5, paddingBottom: error ? 0 : 23 } : undefined}
              onChange={handleSelect}
              onBlur={onBlur}
            />
          </Wrapper>
        );
      }}
    />
  )
);

const PhoneField = ({ name, error, withTooltip, control, defaultValue, ...props }) => (
  <Wrapper withTooltip={withTooltip} error={error}>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { ref, ...field } }) => (
        <PhoneInput
          {...props}
          {...field}
          control={control}
          id={name} // Makes this component testable
          name={name}
          meta={{ error }}
          withTooltip={withTooltip}
        />
      )}
    />
  </Wrapper>
);

export { TextField, SelectField, PhoneField };
