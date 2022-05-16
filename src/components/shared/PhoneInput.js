import * as React from 'react';
import ReactPhoneInput, { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import { TextField, Grid, Box, Autocomplete, Paper as MuiPaper, styled } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { scrollBar } from './styles/commonStyles';

const getCountrySelectStyles = ({ open, error }) => ({
  container: {
    position: 'absolute',
    top: 0,
    bottom: error ? 23 : 0,
    left: 0,
    zIndex: 1,
    height: 'fit-content',
    width: open ? '100%' : 'fit-content',
    '& + div': {
      opacity: open && 0
    }
  },
  textField: {
    width: '100%',
    padding: '0 !important',
    '&:focus': {
      borderRadius: '35px 0 0 35px',
      boxShadow: '0px 0px 2px 2px #3577d4',
      outline: 0
    },
    '& .MuiInputBase-root': {
      paddingLeft: '30px !important',
      paddingRight: '0 !important',
      cursor: open ? 'unset' : 'pointer',
      backgroundColor: open ? '#fff' : 'unset',
      '& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline': {
        border: !open && 'none'
      }
    },
    '& .MuiInputBase-input': {
      minWidth: '0 !important',

      mx: open ? 2.5 : 0,
      padding: '10px 0 !important'
    },
    '& .PhoneInputCountryIcon': {
      minWidth: 24,
      height: 16
    }
  },
  listbox: scrollBar,
  menuItem: {
    color: '#0f2440',
    '& mark': {
      fontWeight: 700,
      color: 'currentcolor',
      background: 'none'
    },
    '& .PhoneInputCountryIcon': { display: 'flex' },
    '& .PhoneInputCountryIconImg': { width: 24, height: 16 }
  },
  autoComplete: { zIndex: 1 }
});

const Paper = styled(MuiPaper)`
  padding: 10px 5px;
`;

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
  ({ options, onChange, onSelect, value, iconComponent: Icon, disabled, meta, ...props }, ref) => {
    const [isInputOpen, setIsInputOpen] = React.useState(false);
    const [isListOpen, setIsListOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');

    const styles = getCountrySelectStyles({ open: isInputOpen, error: meta?.error });

    React.useLayoutEffect(() => {
      if (isInputOpen) {
        setSearchValue('');
        setIsListOpen(isInputOpen);
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

    const selected = (value && options.find(opt => opt.value === value)) || null;

    return (
      <Box sx={styles.container}>
        <Autocomplete
          inputValue={searchValue}
          open={isListOpen}
          value={selected}
          onChange={handleOnChange}
          onInputChange={(e, sValue) => setSearchValue(sValue)}
          options={options.filter(opt => opt.value)}
          filterOptions={handleSearch}
          getOptionLabel={option => option.label}
          renderOption={(optProps, { label, value }) => {
            const highlightedLabel = getHighlightedLabel(label, searchValue);
            return (
              <Grid container justifyContent="space-between" sx={styles.menuItem} {...optProps} component="li">
                <Box display="flex" flex={1} alignItems="center">
                  <Icon country={value} label={label} />
                  <span style={{ marginLeft: 10 }}>{highlightedLabel}</span>
                </Box>
                {value && <span>+{getCountryCallingCode(value)}</span>}
              </Grid>
            );
          }}
          renderInput={params => (
            <TextField
              {...params}
              placeholder="Search country"
              sx={styles.textField}
              InputProps={{
                ...params.InputProps,
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
          PaperComponent={Paper}
          ListboxProps={{ sx: styles.listbox }}
          sx={styles.autoComplete}
        />
      </Box>
    );
  },
  { displayName: 'CountrySelect' }
);

const customInputStyles = {
  root: {
    width: '100%',
    '& .MuiInputBase-root': { paddingLeft: 0 },
    '& .MuiInputBase-input': { paddingLeft: 21.5 },
    '& .MuiInputLabel-root': { paddingLeft: 14.5, whiteSpace: 'nowrap' },
    '& .MuiInputLabel-shrink': { paddingLeft: 0 }
  }
};

const PhoneNumberInput = React.forwardRef(
  ({ meta, withTooltip, inputRef, ...props }, ref) => {
    const error = meta?.error;
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
      <TextField
        {...props}
        inputRef={setRef}
        error={Boolean(error)}
        helperText={(!withTooltip && error) || ''}
        sx={customInputStyles.root}
      />
    );
  },
  { displayName: 'PhoneNumberInput' }
);

const countryCodes = getCountries().map(country => `+${getCountryCallingCode(country)}`);

const PhoneInput = ({ country = 'US', label, variant, meta, withTooltip, width = '100%', onChange, ...props }) => {
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

export default PhoneInput;
