import * as React from 'react';
import ReactPhoneInput, { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import { TextField, Grid, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
// import { TextField } from '@swagup-com/components';
import Autocomplete from '@mui/material/Autocomplete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PublicIcon from '@mui/icons-material/Public';
import { scrollBar } from '../shared/styles/commonStyles';

const useCountrySelectStyles = makeStyles({
  container: {
    position: 'absolute',
    top: ({ variant }) => (variant === 'outlined' ? '0' : 'unset'),
    bottom: ({ variant, error }) => (!variant && error ? 23 : 0),
    left: 0,
    zIndex: 1,
    height: 'max-content',
    width: ({ open }) => open && '100%',
    '& + div': {
      opacity: ({ open }) => open && 0
    }
  },
  textField: {
    width: '100%',
    '&:focus': {
      borderRadius: '35px 0 0 35px',
      boxShadow: '0px 0px 2px 2px #3577d4',
      outline: 0
    },
    '& .MuiInputBase-input': {
      visibility: ({ open }) => (open ? 'visible' : 'hidden'),
      minWidth: 0
    },
    '& .PhoneInputCountryIcon': {
      minWidth: 24,
      height: 16
    }
  },
  inputBase: {
    paddingRight: '0 !important',
    cursor: ({ open }) => (open ? 'unset' : 'pointer')
  },
  inputBaseOutlined: {
    paddingLeft: '30px !important',
    paddingRight: '0 !important',
    cursor: ({ open }) => (open ? 'unset' : 'pointer'),
    backgroundColor: ({ open }) => (open ? '#fff' : 'unset'),
    '&:hover $notchedOutline': {
      border: ({ open }) => !open && 'none'
    }
  },
  inputBaseInput: {
    marginLeft: ({ open }) => (open ? 10 : 0),
    paddingLeft: '2px !important',
    paddingRight: '0 !important'
  },
  inputBaseUnderline: {
    paddingBottom: '3px !important',
    '&:before': {
      borderBottom: ({ open }) => (open ? '1px solid rgba(0, 0, 0, 0.42)' : '0')
    },
    '&:hover:not(.Mui-disabled):before': {
      borderBottom: ({ open }) => (open ? '2px solid rgba(0, 0, 0, 0.87)' : '0')
    }
  },
  notchedOutline: {
    border: ({ open }) => !open && 'none'
  },
  paper: { padding: '10px 5px' },
  listbox: { ...scrollBar },
  menuItem: {
    color: '#0f2440',
    '& mark': {
      fontWeight: 700,
      color: 'currentcolor',
      background: 'none'
    },
    '& .PhoneInputCountryIcon': { display: 'flex' },
    '& .PhoneInputCountryIconImg': { width: 24, height: 16 }
  }
});

const handleSearch = (opts, state) => {
  const { inputValue = '', getOptionLabel } = state;

  return opts.filter(opt => {
    const label = getOptionLabel(opt) ?? '';
    const regex = new RegExp(
      inputValue
        .split('')
        .map(letter => {
          if (/[^A-Za-z0-9 ]/.test(letter)) {
            return `\\${letter}`;
          }
          return letter;
        })
        .join('+.*'),
      'gi'
    );

    return label.match(regex);
  });
};

const getHighlightedLabel = (label, search) => {
  if (!search) return label;

  const loweredLabel = label.toLowerCase();
  const pieces = [];
  let substr = '';
  let j = 0;
  for (let i = 0, lastIndex = label.length - 1; i <= lastIndex; i += 1) {
    if (loweredLabel[i] === search[j]) {
      pieces.push(substr, <mark>{label[i]}</mark>);
      substr = '';
      j += 1;
    } else {
      substr = substr.concat(label[i]);
    }
  }
  pieces.push(substr);

  return pieces;
};

const CountrySelect = React.forwardRef(
  ({ options, onChange, onSelect, value, phoneValue, iconComponent: Icon, disabled, variant, meta, ...props }, ref) => {
    const [isInputOpen, setIsInputOpen] = React.useState(false);
    const [isListOpen, setIsListOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const inputRef = React.useRef();

    const classes = useCountrySelectStyles({ open: isInputOpen, variant, error: meta?.error });

    React.useLayoutEffect(() => {
      if (isInputOpen) {
        setSearchValue('');
        setIsListOpen(isInputOpen);
        setTimeout(() => inputRef.current.focus(), 0);
      } else setIsListOpen(isInputOpen);
    }, [isInputOpen]);

    React.useImperativeHandle(ref, () => ({ onChange }));

    const handleOpen = e => {
      if (!isInputOpen) {
        e.preventDefault();
      }
      setIsInputOpen(true);
    };

    const handleOnChange = (e, newValue) => {
      if (newValue) {
        onSelect(newValue.value);
        onChange(newValue.value);
      }
    };

   // const Input = variant === 'outlined' ? TextField : MuiTextField;
    const Input = TextField;
    const inputClasses =
      variant === 'outlined'
        ? {
            root: classes.inputBaseOutlined,
            notchedOutline: classes.notchedOutline,
            input: classes.inputBaseInput
          }
        : {
            root: classes.inputBase,
            underline: classes.inputBaseUnderline,
            input: classes.inputBaseInput
          };

    const selected = (value && options.find(opt => opt.value === value)) || null;

    return (
      <div className={classes.container}>
        <Autocomplete
          inputValue={searchValue}
          open={isListOpen}
          value={selected}
          onChange={handleOnChange}
          onInputChange={(e, sValue) => setSearchValue(sValue)}
          options={options.filter(opt => opt.value)}
          filterOptions={handleSearch}
          getOptionLabel={option => option.label}
          renderOption={(option, state) => {
            const { inputValue } = state;
            const highlightedLabel = getHighlightedLabel(option.label, inputValue);
            return (
              <Grid container justifyContent="space-between" className={classes.menuItem}>
                <Box display="flex" flex={1} alignItems="center">
                  <Icon country={option.value} label={option.label} />
                  <span style={{ marginLeft: 10 }}>{highlightedLabel}</span>
                </Box>
                {option.value && <span>+{getCountryCallingCode(option.value)}</span>}
              </Grid>
            );
          }}
          renderInput={params => (
            <Input
              {...params}
              inputRef={inputRef}
              placeholder="Search country"
              className={classes.textField}
              InputProps={{
                ...params.InputProps,
                classes: inputClasses,
                startAdornment: value ? <Icon country={value} label="" /> : <PublicIcon />,
                endAdornment: !isInputOpen && <KeyboardArrowDownIcon />,
                inputProps: { ...params.inputProps, autoComplete: 'one-time-code' }
              }}
              tabIndex="0"
              onKeyPress={handleOpen}
              onClick={handleOpen}
              disabled={disabled}
              {...props}
            />
          )}
          onClose={() => setIsInputOpen(false)}
          classes={{ listbox: classes.listbox, paper: classes.paper }}
        />
      </div>
    );
  },
  { displayName: 'CountrySelect' }
);

const useCustomInputStyles = makeStyles({
  root: { width: '100%' },
  inputBase: { paddingLeft: ({ variant }) => (variant === 'outlined' ? 0 : 58) },
  inputBaseInput: { paddingLeft: ({ variant }) => (variant === 'outlined' ? 86 : 0) },
  inputLabel: {
    paddingLeft: 58,
    whiteSpace: 'nowrap'
  },
  inputLabelShrink: { paddingLeft: 0 }
});

const PhoneNumberInput = React.forwardRef(
  ({ variant, meta, withTooltip, inputRef, ...props }, ref) => {
    const error = meta?.error;
    const { root, inputBase, inputLabel, inputLabelShrink, inputBaseInput } = useCustomInputStyles({ variant });
    // const Input = variant === 'outlined' ? TextField : MuiTextField;
    const Input = TextField;
    const [localRef, setLocalRef] = React.useState();
    const setRef = React.useCallback(
      newRef => {
        setLocalRef(newRef);
        ref(newRef);
      },
      [ref]
    );

    const { value, onChange } = props;
    React.useImperativeHandle(inputRef, () => ({ ref: localRef, value, onChange }));

    return (
      <Input
        {...props}
        inputRef={setRef}
        className={root}
        InputProps={{ classes: { root: inputBase, input: inputBaseInput } }}
        InputLabelProps={{ classes: { root: inputLabel, shrink: inputLabelShrink } }}
        error={Boolean(error)}
        helperText={(!withTooltip && error) || ''}
      />
    );
  },
  { displayName: 'PhoneNumberInput' }
);

const countryCodes = getCountries().map(country => `+${getCountryCallingCode(country)}`);

const PhoneInputHook = ({ country = 'US', label, variant, meta, withTooltip, width = '100%', onChange, ...props }) => {
  const countryRef = React.useRef();
  const phoneInputRef = React.useRef();
  const prevCountry = React.useRef(country);

  React.useEffect(() => {
    if (!phoneInputRef.current.value) {
      countryRef.current.onChange(country);
    }
  }, [country]);

  const handleCountryChange = newCountry => {
    if (newCountry) {
      prevCountry.current = newCountry;
    } else if (phoneInputRef.current.value[0] !== '+' || phoneInputRef.current.value.length === 1) {
      countryRef.current.onChange(prevCountry.current);
    }
  };

  const handleChange = e => {
    const value = phoneInputRef.current.value ? e : '';
    onChange(value);
  };

  const handleCountrySelect = newCountry => {
    phoneInputRef.current.ref.focus();
    const { value: prevNumber } = phoneInputRef.current;
    if (!prevNumber) return;

    const isCountryCode = countryCodes.some(code => code.startsWith(prevNumber));
    if (prevNumber.startsWith('+') && !isCountryCode) {
      const newPhone = `+${getCountryCallingCode(newCountry)}${prevNumber.slice(1).replace(/\s/g, '')}`;
      setTimeout(onChange, 0, newPhone);
    }
  };

  return (
    <ReactPhoneInput
      placeholder="Enter phone number"
      onChange={handleChange}
      onCountryChange={handleCountryChange}
      inputComponent={PhoneNumberInput}
      numberInputProps={{
        label,
        variant,
        meta,
        withTooltip,
        inputRef: phoneInputRef
      }}
      countrySelectComponent={CountrySelect}
      countrySelectProps={{ variant, meta, ref: countryRef, onSelect: handleCountrySelect }}
      displayInitialValueAsLocalNumber
      style={{ position: 'relative', width, zIndex: 2 }}
      focusInputOnCountrySelection={false}
      {...props}
    />
  );
};

const PhoneInputRedux = ({
  country = 'US',
  onChange,
  label,
  variant,
  meta,
  withTooltip,
  width = '100%',
  onBlur,
  ...props
}) => {
  const countryRef = React.useRef();
  const phoneInputRef = React.useRef();
  const prevCountry = React.useRef(country);
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const handleChange = newValue => onChange(newValue || '');

  const handleCountryChange = newCountry => {
    if (newCountry) {
      prevCountry.current = newCountry;
    } else if (phoneInputRef.current.value[0] !== '+' || phoneInputRef.current.value.length === 1) {
      countryRef.current.onChange(prevCountry.current);
    }
  };

  const handleCountrySelect = newCountry => {
    const { value: prevNumber } = phoneInputRef.current;
    if (!prevNumber) return;

    const isCountryCode = countryCodes.some(code => code.startsWith(prevNumber));
    if (prevNumber.startsWith('+') && !isCountryCode) {
      const newPhone = `+${getCountryCallingCode(newCountry)}${prevNumber.slice(1).replace(/\s/g, '')}`;
      setTimeout(onChange, 0, newPhone);
    }
  };

  return (
    <ReactPhoneInput
      defaultCountry={isFirstRender.current ? country : undefined}
      placeholder="Enter phone number"
      onChange={handleChange}
      onCountryChange={handleCountryChange}
      inputComponent={PhoneNumberInput}
      numberInputProps={{
        label,
        variant,
        meta,
        withTooltip,
        inputRef: phoneInputRef
      }}
      countrySelectComponent={CountrySelect}
      countrySelectProps={{ variant, meta, ref: countryRef, onSelect: handleCountrySelect }}
      displayInitialValueAsLocalNumber
      style={{ position: 'relative', width, zIndex: 2 }}
      {...props}
    />
  );
};

const PhoneInput = props => {
  const { control } = props;
  return control ? <PhoneInputHook {...props} /> : <PhoneInputRedux {...props} />;
};

export default PhoneInput;
