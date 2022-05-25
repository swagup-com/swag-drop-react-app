import React, { useEffect, useState } from 'react';
import { Grid, MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { zipCodeText, normalizeUSZip } from '../../utils/utils';
import { TextField, SelectField, PhoneField } from '../shared/reactHookFormFields';
import { useCountries, useMemoizeStateFields, useSizes } from '../../hooks';
import SwipeableViews from 'react-swipeable-views/lib/SwipeableViews';
import { useTempletesStyles } from '../redeem/redeemCommon';
import { Button, Tooltip } from '@swagup-com/react-ds-components';
import { KeyboardBackspace } from '@mui/icons-material';

const ContactForm = ({ justAddress, fixedCountry, noCompany, noTitle, hideSizes, availableSizes, redeem }) => {
  const { control, formState, register, setValue, trigger, watch, getValues } = useFormContext();
  const { errors, touchedFields } = formState;
  const [country, state] = watch(['shipping_country', 'shipping_state']);
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleONext = () =>  setCurrentStep(prev => prev !==  2 ? prev + 1 : prev);

  const handleOnPrevious = () =>  setCurrentStep(prev => prev !==  1 ? prev - 1 : prev);

  const errorTexts  = () => {
    if(!errors) return '';
    const keys = Object.keys(errors);
    console.log('xxx: ', errors);
    return errors[keys[0]] || '';
  };

  const classes = useTempletesStyles(redeem);

  return (
    <Grid container>
      <Grid item xs={6}>
        <SwipeableViews axis="x" index={currentStep - 1} className={classes.swipeableViews} disabled>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <SelectField
                  name="shipping_country"
                  error={errors.shipping_country?.message}
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
              {/* {!justAddress && !hideSizes && ( */}
              {!justAddress && (
                <Grid item xs={12}>
                  <SelectField
                    name="size"
                    error={errors.size?.message}
                    control={control}
                    label="Shirt Size"
                    defaultValue=""
                    fullWidth
                  >
                    <MenuItem key="" value="">
                      <em>None</em>
                    </MenuItem>
                    {sizes
                      ?.filter(s => !availableSizes || availableSizes.find(as => as.id === s.id))
                      .map(size => (
                        <MenuItem key={size.id} value={size?.name}>
                          {size?.name}
                        </MenuItem>
                      ))}
                  </SelectField>
                </Grid>
              )}
              </Grid>
              <Grid container spacing={4}>
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
        </SwipeableViews>
        <Grid item container className={classes.wizardFooter}>
              <Grid item xs={4}>
                <Button size="small" variant="text" onClick={handleOnPrevious} className={classes.previous} fullWidth>
                  <KeyboardBackspace className={classes.previousIcon} />
                  Previous step
                </Button>
              </Grid>
              <Grid xs item />
              <Grid item xs={3}>
                {/* <Tooltip title={<p>{errorTexts()}</p>} disableHoverListener={!errors}> */}
                  <div>
                    <Button
                      size="small"
                      variant="primary"
                      onClick={handleONext}
                      fullWidth
                      // disabled={cantContinue}
                      // loading={createRedeem.isLoading}
                    >
                      Continue
                    </Button>
                  </div>
                {/* </Tooltip> */}
              </Grid>
            </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container alignContent="center" style={{ height: '100%' }}>
          <div className={classes.productContainer}>
            <img src={redeem.clientImage} alt={redeem.projectName} className={classes.product} />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ContactForm;
