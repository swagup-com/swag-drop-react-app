import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import _ from 'lodash';
import dayjs from 'dayjs';
import styles from './styles/redeem';
import CenteredGrid from '../shared/CenteredGrid';
import { PostMessage, useTempletesStyles } from './redeemCommon';
import addressesApi from '../../api/swagup/addresses';
import AddressConfirmation from '../shared/AddressConfirmation';
import Loader from '../shared/Loader';
import { shipmentsApi, contactsApi } from '../../api/swagup';
import useShippingCutoffHour from '../../hooks/useShippingCutoffHour';
import { minimumShippingDate } from '../../utils/commonDateFunctions';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import RedeemTemplates from './RedeemTemplate';
import { redeemPages, redemptions, verifications } from '../../api/swagdrop';

const useStyles = makeStyles(styles);

const RedeemHome = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  // const [availableSizes, setAvailableSizes] = useState([]);
  const [formError, setFormError] = useState({});

  const [addressVerification, setAddressVerification] = useState({ address: {} });


  const { page } = useParams();
  const { data: response, isFetching } = useQuery('redeems', () => redeemPages.get(page), {
    initialData: { theme: {}, products: [] },
    enabled: !!page
  });
const redeem = response?.data;

  const handleONext = () => {
    const futureStep = currentStep + 1;
    if (futureStep > 3) {
      window.location = '/';
    } else setCurrentStep(futureStep);
  };
  const handleClose = () => setIsModalOpen(false);

  const handleAddressConfirmed = redemption => {
    doRedeem(redemption);
    handleONext();
  };

  // useEffect(() => {
  //   const setSizes = async () => {
  //     try {
  //       const { results: products } = await accountProductsApi.fetch({ ids: redeem?.products.map(p => p.id).join() });
  //       const sizes = products.reduce((rslt, p) => [...rslt, ...p.stock.filter(s => s.quantity).map(s => s.size)], []);
  //       setAvailableSizes(sizes);
  //     } catch (e) {
  //       log.debug('Error:', e);
  //     }
  //   };
  //   setSizes();
  // }, [redeem.products]);

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
    fields.forEach(field => setFormError(field, { type: 'validate', message: errorData[field][0] }, { shouldFocus: true }));
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

  const doRedeem = async redemption => {
    
    const result = await redemptions.create(redemption)
    if(result === 'error') 
      return setGeneralError("There was an error when redeeming the information");

    return handleONext();
  };
  
  const onSwagDrop = async data => {
    if(!canSubmit) return;
    const {
      shipping_address1,
      shipping_address2,
      shipping_city,
      shipping_state,
      shipping_zip,
      shipping_country
    } = data;
    const sendAddress = {
      addressLine1: shipping_address1,
      addressLine2: shipping_address2,
      city: shipping_city,
      state: shipping_state,
      zipCode: shipping_zip,
      country: shipping_country
    };
    setIsLoading(true);
    const validateAddress = await verifications.address(sendAddress);
    setIsLoading(false);

      
    const coreData = {
      redeemPageId: redeem.id,
        firstName: data.first_name,
        lastName:  data.last_name,
        apparelSize: data.size,
        phoneNumber: data.phone_number,
        emailAddress: data.email
    };

    if (validateAddress.country) {
      const redemption = {
        ...coreData,
        ...validateAddress
      }
      doRedeem(redemption);
    } 
    else if (validateAddress === 'The address could not be verified.') {
      setIsModalOpen(true);
      const address = {
        ...coreData,
        street: data.shipping_address1,
        secondary: data.shipping_address2,
        city: data.shipping_city,
        state: data.shipping_state,
        zipcode: data.shipping_zip,
        country: data.shipping_country || 'US'
      };
      setAddressVerification(address);
    }
    else
      setGeneralError("There was an error when validating the address");
  };

  const classes = useStyles(redeem);
  const templatedClasses = useTempletesStyles(redeem);

  return (
    <div className={classes.container}>
      <CenteredGrid>
        {!isFetching && (
        redeem.isActive ? (
          <RedeemTemplates
            redeem={redeem}
            onSwagDrop={onSwagDrop}
            generalError={generalError}
            formError={formError}
            currentStep={currentStep}
            handleONext={handleONext}
            setCanSubmit={setCanSubmit}
          />
        ) : (
          <PostMessage
            classes={templatedClasses}
            title="Under Construction"
            excerpt="We are launching soon. We are working hard. We are almost ready to launch. Something awesome is coming soon."
            handleONext={() => (window.location = '/')}
          />
          ))}
         <AddressConfirmation
            open={isModalOpen}
            onClose={handleClose}
            address={addressVerification}
            callbackAction={handleAddressConfirmed}
          />
          {(isLoading || isFetching) && <Loader absolute />}
      </CenteredGrid>
    </div>
  );
};

export default RedeemHome;
