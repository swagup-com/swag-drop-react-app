import React, { useEffect } from 'react';
import { Grid, MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { zipCodeText, normalizeUSZip } from '../../utils/utils';
import { TextField, SelectField, PhoneField } from '../shared/reactHookFormFields';
import { useCountries, useMemoizeStateFields, useSizes } from '../../hooks';

const ContactForm = ({ justAddress, fixedCountry, noCompany, noTitle, hideSizes, availableSizes }) => {
  const { control, formState, register, setValue, trigger, watch, getValues } = useFormContext();
  const { errors, touchedFields } = formState;
  const [country, state] = watch(['shipping_country', 'shipping_state']);
  const [onCountryChange, onStateChange] = useMemoizeStateFields({
    country,
    change: setValue,
    initialState: state,
    shouldValidate: !!touchedFields.shipping_state
  });

  const { data: countriesAPI } = useCountries();
  const countries = countriesAPI || [];
  const { data: sizesAPI } = useSizes({ select: data => data.filter(s => s.category === 'Apparel') });
  const sizes = sizesAPI || [];

  const allowInternationalShipping = country !== 'US';
  const provinces = countries?.find(c => c.iso2 === country)?.provinces ?? [];

  useEffect(() => {
    if (country) {
      trigger('phone_number');
      if (getValues('shipping_zip') || errors.shipping_zip) {
        trigger('shipping_zip');
      }
    }
  }, [country, errors, getValues, trigger]);

  const handleChangeZip = e => {
    if (!allowInternationalShipping) {
      const value = normalizeUSZip(e?.target?.value ?? '');
      setValue('shipping_zip', value);
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <SelectField
          name="shipping_country"
          error={errors.shipping_country?.message}
          totalItems={countries.length}
          onSelectChange={onCountryChange}
          control={control}
          label="Country"
          fullWidth
          disabled={fixedCountry}
        >
          {countries?.map(c => (
            <MenuItem key={c.iso2} value={c.iso2}>
              {c.name}
            </MenuItem>
          ))}
        </SelectField>
      </Grid>
      {!justAddress && (
        <>
          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              placeholder="First name"
              autoFocus
              autoComplete="first_name"
              error={errors.first_name?.message}
              {...register('first_name', { deps: ['last_name'] })}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              placeholder="Last name"
              autoComplete="last_name"
              error={errors.last_name?.message}
              {...register('last_name', { deps: ['first_name'] })}
            />
          </Grid>
          {!noCompany && (
            <Grid item md={6} xs={12}>
              <TextField fullWidth placeholder="Company name" autoComplete="company" {...register('company')} />
            </Grid>
          )}
          {!noTitle && (
            <Grid item sm={6} xs={12}>
              <TextField fullWidth placeholder="Title" autoComplete="title" {...register('title')} />
            </Grid>
          )}
          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              placeholder="Email address"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
          </Grid>
        </>
      )}
      <Grid item sm={6} xs={12}>
        <PhoneField
          name="phone_number"
          error={errors.phone_number?.message}
          control={control}
          defaultValue=""
          placeholder="Phone number"
          country={country}
          variant="outlined"
        />
      </Grid>
      {!justAddress && !hideSizes && (
        <Grid item xs={12}>
          <SelectField
            name="size"
            error={errors.size?.message}
            control={control}
            label="Shirt Size"
            totalItems={sizes.length}
            defaultValue=""
            fullWidth
          >
            <MenuItem key="" value="">
              <em>None</em>
            </MenuItem>
            {sizes
              ?.filter(s => !availableSizes || availableSizes.find(as => as.id === s.id))
              .map(size => (
                <MenuItem key={size.id} value={size.id}>
                  {size?.name}
                </MenuItem>
              ))}
          </SelectField>
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          fullWidth
          placeholder="Address"
          autoComplete="shipping_address1"
          error={errors.shipping_address1?.message}
          {...register('shipping_address1')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          placeholder="Floor, suite, unit (optional)"
          autoComplete="shipping_address2"
          error={errors.shipping_address2?.message}
          {...register('shipping_address2')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          placeholder="City"
          autoComplete="city"
          error={errors.shipping_city?.message}
          {...register('shipping_city')}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        {provinces.length === 0 ? (
          <TextField
            placeholder="State / Province / Region"
            autoComplete="shipping_state"
            error={errors.shipping_state?.message}
            {...register('shipping_state')}
            onChange={onStateChange}
            fullWidth
          />
        ) : (
          <SelectField
            name="shipping_state"
            error={errors.shipping_state?.message}
            onSelectChange={onStateChange}
            totalItems={provinces.length}
            label="State"
            control={control}
            fullWidth
          >
            {provinces.map(p => (
              <MenuItem key={p.code} value={p.code}>
                {p.name}
              </MenuItem>
            ))}
          </SelectField>
        )}
      </Grid>
      <Grid item sm={6} xs={12}>
        <TextField
          {...register('shipping_zip')}
          onInput={handleChangeZip}
          error={errors.shipping_zip?.message}
          placeholder={zipCodeText(allowInternationalShipping)}
          autoComplete="shipping_zip"
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default ContactForm;
