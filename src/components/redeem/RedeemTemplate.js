import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid } from "@mui/material";
import _ from 'lodash';
import * as yup from 'yup';
import { FormProvider, useForm } from "react-hook-form";
import SwipeableViews from "react-swipeable-views/lib/SwipeableViews";
import { emailRegex, getSchema } from "../../utils/commonValidations";
import EmployeeForm from "../support/EmployeeForm";
import { getPagePath, PostMessage, useTempletesStyles } from "./redeemCommon";
import { Button } from "@swagup-com/components";


  
  const fieldsToValidate = [
    'shipping_country',
    'first_name',
    'last_name',
    'email',
    'shipping_address1',
    'shipping_address2',
    'shipping_city',
    'phone_number',
    'shipping_state',
    'shipping_zip'
  ];
  
  const resolver = yupResolver(
    getSchema(fieldsToValidate, {
      email: yup
        .string()
        .trim()
        .matches(emailRegex, 'The email format is not correct')
        .required('Required')
    })
  );

const RedeemTemplates = ({ redeem, onSwagDrop, handleONext, currentStep, 
    generalError,
    formError,
    availableSizes }) => {
    const {
        name,
        header,
        subtitle,
        logo,
        product,
        button,
        company,
        background,
        color,
        accent,
        fontFamily
      } = redeem;

      const formMethods = useForm({
        resolver,
        mode: 'all',
        defaultValues: { shipping_country: redeem.isInternational ? undefined : 'US' }
      });
    
    const { formState, handleSubmit, setError } = formMethods;
    const isValid = _.isEmpty(formState.errors);
    const disableButton = !(isValid && formState.isDirty && formState.isValid);
   
    useEffect(() => {
    // setError(formError);
    }, [formError, setError]);
  
    const classes = useTempletesStyles({ background, color, accent, fontFamily });
    return (
      <Grid container direction="column" className={classes.root}>
        <Grid item className={classes.header}>
            <a href={getPagePath(redeem)}>
                <div className={classes.logoContainer}>
                    <img src={logo} alt={name} className={classes.logo} />
                </div>
            </a>
        </Grid>
        <Grid item container alignItems="center" xs>
          <SwipeableViews axis="x" index={currentStep - 1} className={classes.swipeableViews} disabled>
            <div>
              <Grid container>
                <Grid item xs={6}>
                  <p className={classes.headerText}>{header}</p>
                  <p className={classes.subtitle}>{subtitle}</p>
                  <Button variant="primary" className={classes.button} onClick={handleONext}>
                    {button}
                  </Button>
                  <p className={classes.advisory}>
                    Please include your current address to ensure an accurate delivery at this time. Please be aware, due
                    to COVID-19, shipments may take longer than usual. Thank you for your patience & understanding.
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <Grid container alignContent="center" style={{ height: '100%', paddingLeft: 32 }}>
                    <div className={classes.productContainer}>
                      <img src={product} alt={name} className={classes.product} />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </div>
            <div className={classes.shipSwagFormContainer}>
              <form onSubmit={handleSubmit(onSwagDrop)}>
                <Grid container justifyContent="center">
                  <p className={classes.subtitle} style={{ fontSize: 28 }}>
                    Fill out the following form and get your swag
                  </p>
                </Grid>
                {currentStep === 2 && (
                  <FormProvider {...formMethods}>
                    <EmployeeForm
                      fixedCountry={!redeem.isInternational}
                      noCompany
                      noTitle
                      hideSizes={!redeem.products.some(p => p.is_apparel)}
                      availableSizes={availableSizes}
                    />
                  </FormProvider>
                )}
                {generalError && (
                  <div>
                    <p style={{ fontSize: 16, textAlign: 'center', color: '#F44336', marginBottom: 16 }}>
                      {generalError}
                    </p>
                  </div>
                )}
                <Grid container justifyContent="center">
                  <Button
                    variant="primary"
                    type="submit"
                    className={classes.button}
                    style={{ marginLeft: 0, marginTop: generalError ? 10 : 42, width: 320 }}
                    disabled={disableButton}
                  >
                    Send
                  </Button>
                </Grid>
              </form>
            </div>
            <PostMessage classes={classes} title="Thanks" excerpt="And come back soon. 😉" handleONext={handleONext} />
          </SwipeableViews>
        </Grid>
        <Grid item>
          <Grid container justifyContent="center" className={classes.footer}>
            <p
              className={classes.advisory}
              style={{ marginTop: 56 }}
            >{`© ${new Date().getFullYear()} by ${company} in Partnership with SwagUp`}</p>
          </Grid>
         
        </Grid>
      </Grid>
    );
  };

  export  default RedeemTemplates;