import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { accountProductsApi } from "../../api/swagup";
import { PostMessage, useTempletesStyles } from "./redeemCommon";


  
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

const RedeemTemplates = ({ redeem }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [availableSizes, setAvailableSizes] = useState([]);
    const [addressVerification, setAddressVerification] = useState({ address: {} });

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
  
    useEffect(() => {
      const setSizes = async () => {
        try {
          const { results: products } = await accountProductsApi.fetch({ ids: redeem?.products.map(p => p.id).join() });
          const sizes = products.reduce((rslt, p) => [...rslt, ...p.stock.filter(s => s.quantity).map(s => s.size)], []);
          setAvailableSizes(sizes);
        } catch (e) {
          log.debug('Error:', e);
        }
      };
      setSizes();
    }, [redeem.products]);
    const formMethods = useForm({
      resolver,
      mode: 'all',
      defaultValues: { shipping_country: redeem.isInternational ? undefined : 'US' }
    });
  
    const { formState, handleSubmit, setError } = formMethods;
    const isValid = _.isEmpty(formState.errors);
    const disableButton = !(isValid && formState.isDirty && formState.isValid);
    const handleONext = () => {
      const futureStep = currentStep + 1;
      if (futureStep > 3) {
        window.location = '/';
      } else setCurrentStep(futureStep);
    };
    const handleClose = () => setIsModalOpen(false);
  
    const handleAddressConfirmed = () => {
      handleONext();
    };
  
    const prepareOrder = async shippingData => {
      const newContact = await contactsApi.addContact(shippingData);
  
      if (newContact.result === 'error') return newContact;
      const order = {
        employee: newContact.id,
        delivery_method: 1,
        shipping_date: dayjs(minimumShippingDate(new Date(), useShippingCutoffHour)).format('YYYY-MM-DD'),
        products: redeem.products.map(p => ({
          product: p.id,
          sizes: [{ size: p.is_apparel ? newContact.size.id : 9, quantity: p.quantity }]
        })),
        source: `redeem-${redeem.id}`
      };
      const orders = [order];
      return orders;
    };
  
    const prepareError = errorData => {
      const fields = Object.keys(errorData);
      fields.forEach(field => setError(field, { type: 'validate', message: errorData[field][0] }, { shouldFocus: true }));
    };
  
    const textWorkOut = (obj, callback) => (obj.length ? obj : callback(obj[Object.keys(obj)[0]]));
    const extractFirstText = obj => (_.isArray(obj) ? extractFirstText(obj[0]) : textWorkOut(obj, extractFirstText));
  
    const sendSwag = async data => {
      const orders = await prepareOrder(data);
      if (orders.result === 'error') return prepareError(orders.data);
  
      const result = await shipmentsApi.sendSwag(orders, 1);
      if (result.result === 'error') {
        const error = extractFirstText(result.data);
        return setGeneralError(error);
      }
  
      return handleONext();
    };
  
    const onSendSwag = async data => {
      const {
        shipping_address1,
        shipping_address2,
        shipping_city,
        shipping_state,
        shipping_zip,
        shipping_country
      } = data;
      const sendAddress = {
        shipping_address1,
        shipping_address2,
        shipping_city,
        shipping_state,
        shipping_zip,
        shipping_country
      };
      setIsLoading(true);
      const { result, status } = await addressesApi.validate(sendAddress);
      setIsLoading(false);
  
      if (result === 'ok') {
        sendSwag(data);
      } else {
        setIsModalOpen(true);
        const address = {
          ...data,
          street: data.shipping_address1,
          secondary: data.shipping_address2,
          city: data.shipping_city,
          state: data.shipping_state,
          zipcode: data.shipping_zip,
          country: data.shipping_country || 'US'
        };
        setAddressVerification(address);
      }
    };
  
    const classes = useTempletesStyles({ background, color, accent, fontFamily });
    return (
      <Grid container direction="column" className={classes.root}>
        <Grid item className={classes.header}>
          <div className={classes.logoContainer}>
            <img src={logo} alt={name} className={classes.logo} />
          </div>
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
              <form onSubmit={handleSubmit(onSendSwag)}>
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