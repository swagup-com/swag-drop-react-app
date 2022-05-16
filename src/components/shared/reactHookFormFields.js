import * as React from 'react';
import {
  Tooltip as MuiTooltip,
  TextField as MuiTextField,
  textFieldClasses,
  tooltipClasses,
  inputBaseClasses,
  menuClasses,
  selectClasses,
  Grid,
  List
} from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Controller } from 'react-hook-form';
import { ellipsisStyles, scrollBar } from './styles/commonStyles';
import PhoneInput from './PhoneInput';

const Tooltip = ({ children }) => {
  return (
    <MuiTooltip
      sx={{
        [`& .${tooltipClasses.popper}`]: {
          zIndex: 1200 // less than the select menu (1300)
        },
        [`& .${tooltipClasses.tooltip}`]: {
          borderRadius: 5,
          padding: '13px 20px',
          color: '#f44336',
          fontSize: 12,
          fontFamily: 'Gilroy-SemiBold',
          lineHeight: 'normal',
          boxShadow: '0 6px 36px 0 rgba(0, 0, 0, 0.15)',
          backgroundImage: 'unset'
        }
      }}
    >
      {children}
    </MuiTooltip>
  );
};

const Wrapper = ({ children, withTooltip, error }) =>
  withTooltip ? (
    <Tooltip title={error || ''} placement="top" arrow>
      <div data-description="reference-holder">{children}</div>
    </Tooltip>
  ) : (
    children
  );

const StyledTextField = styled(MuiTextField)(({ withTooltip }) => ({
  [`& .${textFieldClasses.root}`]: !withTooltip ? { paddingTop: 5 } : undefined,
  [`& .${inputBaseClasses.inputMultiline}`]: { padding: 0 }
}));

const TextField = React.forwardRef(({ error, withTooltip, ...props }, ref) => {
  const { name } = props;
  // Adds tooltip styling to passed props
  const derivedProps = { ...props, sx: [props.sx, !withTooltip && { '& .MuiInputBase-input': { paddingTop: 5 } }] };
  return (
    <Wrapper withTooltip={withTooltip} error={error}>
      <StyledTextField
        {...derivedProps}
        id={name} // Makes this component testable
        inputRef={ref}
        error={Boolean(error)}
        helperText={withTooltip ? undefined : error ?? ' '}
        FormHelperTextProps={{ sx: { textAlign: 'right' }, ...props.FormHelperTextProps }}
      />
    </Wrapper>
  );
});

const getStyles = withTooltip => ({
  textField: {
    // paddingTop: 1.25,
    [`& .${selectClasses.select}`]: { paddingRight: '60px !important' }
  },
  label: {
    ...ellipsisStyles,
    paddingTop: withTooltip ? 1 : 1,
    color: '#bdbdbd',
    width: '100%',
    paddingRight: 17.5
  },
  menu: { [`& .${menuClasses.paper}`]: { display: 'flex', pr: 0.5, p: 1 } },
  menuListContainer: { flex: 1, ...scrollBar },
  menuList: { py: 0, flex: 1 }
});

const ListContainer = React.forwardRef((props, ref) => {
  const styles = getStyles();
  return (
    <Grid container ref={ref} sx={styles.menuListContainer}>
      <List sx={styles.menuList}>{props.children}</List>
    </Grid>
  );
});

const SelectIcon = props => <KeyboardArrowDownIcon style={{ right: 25 }} {...props} />;

const SelectField = ({
  control,
  name,
  error,
  defaultValue,
  withTooltip,
  onSelectChange,
  hideLabel = true,
  label,
  disabled,
  ...props
}) => {
  const styles = getStyles(withTooltip);
  return (
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
          <Wrapper withTooltip={withTooltip} error={error}>
            <MuiTextField
              {...props}
              label={label}
              select
              id={name} // Makes this component testable
              name={name}
              value={value}
              error={Boolean(error)}
              helperText={!withTooltip && (error ?? ' ')}
              FormHelperTextProps={{ sx: { textAlign: 'right' } }}
              disabled={disabled}
              SelectProps={{
                IconComponent: SelectIcon,
                MenuProps: {
                  sx: styles.menu,
                  MenuListProps: {
                    component: ListContainer
                  }
                }
              }}
              InputLabelProps={{
                shrink: hideLabel ? false : Boolean(value),
                sx: [styles.label, { display: hideLabel && Boolean(value) ? 'none' : 'unset', color: '#bdbdbd' }]
              }}
              sx={!withTooltip && styles.textField}
              onChange={handleSelect}
              onBlur={onBlur}
            />
          </Wrapper>
        );
      }}
    />
  );
};

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
