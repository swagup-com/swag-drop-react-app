import { useRef } from 'react';

const useMemoizeStateFields = ({ country, setCountry, change, initialState, propertyName, shouldValidate = true }) => {
  const states = useRef({
    [country]: initialState ?? ''
  });

  const handleCountryChange = e => {
    const { value } = e.target;
    if (setCountry) setCountry(value);
    change(propertyName ?? 'shipping_state', states.current[value] ?? '', { shouldValidate });
  };

  const handleStateChange = e => {
    states.current[country] = e.target.value;
  };

  return [handleCountryChange, handleStateChange, states];
};

export default useMemoizeStateFields;
