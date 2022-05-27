import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid } from "@mui/material";
import _ from 'lodash';
import * as yup from 'yup';
import { FormProvider, useForm } from "react-hook-form";
import SwipeableViews from "react-swipeable-views/lib/SwipeableViews";
import { emailRegex, getSchema } from "../../utils/commonValidations";
import ContactForm from "../support/ContactForm";
import { getPageLink, PostMessage, useTempletesStyles } from "./redeemCommon";
import { Button } from '@swagup-com/react-ds-components';


  
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

const RedeemTemplates = ({ redeem, onSwagDrop, handleONext, currentStep, setCanSubmit,
    generalError,
    formError }) => {
    const {
        projectName,
        headline,
        body,
        clientLogo,
        clientImage,
        callToActionButtonText,
        fontFamily,
        backgroundColor,
        fontColor,
        accentColor,
        apparelSizes = []
      } = redeem;

      const formMethods = useForm({
        resolver,
        mode: 'all',
        defaultValues: { shipping_country: redeem.allowInternationalShipping ? undefined : 'US' }
      });
    
    const { handleSubmit } = formMethods;
    // const isValid = _.isEmpty(formState.errors);
    // const disableButton = !(isValid && formState.isDirty && formState.isValid);
   
    // useEffect(() => {
    // // setError(formError);
    // }, [formError, setError]);
  
    const classes = useTempletesStyles({ backgroundColor, fontColor, accentColor, fontFamily });
    return (
      <Grid container direction="column" className={classes.root}>
        <Grid item className={classes.header}>
            <a href={getPageLink(redeem)}>
                <div className={classes.logoContainer}>
                    <img src={clientLogo} alt={projectName} className={classes.logo} />
                </div>
            </a>
        </Grid>
        <Grid item container alignItems="center" xs>
          <SwipeableViews axis="x" index={currentStep - 1} className={classes.swipeableViews} disabled>
            <div>
              <Grid container>
                <Grid item sm={6} xs={12}>
                  <p className={classes.headerText}>{headline}</p>
                  <p className={classes.subtitle}>{body}</p>
                  <Button variant="primary" className={classes.button} onClick={handleONext}>
                    {callToActionButtonText}
                  </Button>
                  <p className={classes.advisory}>
                    Please include your current address to ensure an accurate delivery at this time. Please be aware, due
                    to COVID-19, shipments may take longer than usual. Thank you for your patience & understanding.
                  </p>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Grid container alignContent="center" style={{ height: '100%' }}>
                    <div className={classes.productContainer}>
                      <img src={clientImage} alt={projectName} className={classes.product} />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </div>
            <div className={classes.shipSwagFormContainer}>
              {}
              <form onSubmit={handleSubmit(onSwagDrop)}>
                {currentStep === 2 && (
                  <FormProvider {...formMethods}>
                    <ContactForm
                      fixedCountry={!redeem.allowInternationalShipping}
                      noCompany
                      noTitle
                      hideSizes={apparelSizes.length === 0}
                      availableSizes={apparelSizes.map((s,idx) => ({id: idx + 1, name: s }))}
                      redeem={redeem}
                      setCanSubmit={setCanSubmit}
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
            >{`© ${new Date().getFullYear()} by ${'Weathervane'} in Partnership with SwagUp`}</p>
          </Grid>
         
        </Grid>
      </Grid>
    );
  };

  export  default RedeemTemplates;