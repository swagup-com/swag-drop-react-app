import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import * as yup from 'yup';
import dayjs from 'dayjs';
import styles from './styles/redeem';
import CenteredGrid from '../shared/CenteredGrid';
import { emailRegex, getSchema } from '../../utils/commonValidations';
import EmployeeForm from '../support/EmployeeForm';
import { PostMessage, useTempletesStyles } from './redeemCommon';
import addressesApi from '../../api/swagup/addresses';
import AddressConfirmation from '../shared/AddressConfirmation';
import Loader from '../shared/Loader';
import { shipmentsApi, contactsApi, accountProductsApi } from '../../api/swagup';
import useShippingCutoffHour from '../../hooks/useShippingCutoffHour';
import { minimumShippingDate } from '../../utils/commonDateFunctions';
import solutiontriangle from  '../../api/solutiontriangle';
import log from '../../utils/logger';
import SwipeableViews from 'react-swipeable-views/lib/SwipeableViews';
import apiPaths from '../../utils/apiPaths';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import RedeemTemplates from './RedeemTemplate';

const useStyles = makeStyles(styles);

const RedeemHome = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [availableSizes, setAvailableSizes] = useState([]);

  const [addressVerification, setAddressVerification] = useState({ address: {} });


  const { company, page } = useParams();
  const { data: redeem } = useQuery('redeems', () => solutiontriangle.getbyslug(`${company}-${page}`), {
    initialData: { theme: {} },
    enabled: !!(company && page)
  });

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

  const onSwagDrop = async data => {
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

  const classes = useStyles(redeem.theme);
  const templatedClasses = useTempletesStyles(redeem.theme);
  
  return (
    <div className={classes.container}>
      <CenteredGrid>
        {redeem.status === 'draft' ? (
          <PostMessage
            classes={templatedClasses}
            title="Under Construction"
            excerpt="We are launching soon. We are working hard. We are almost ready to launch. Something awesome is coming soon."
            handleONext={() => (window.location = '/')}
          />
        ) : (
          <RedeemTemplates
            redeem={redeem}
            onSwagDrop={onSwagDrop}
          />
        )}
         <AddressConfirmation
            open={isModalOpen}
            onClose={handleClose}
            address={addressVerification}
            callbackAction={handleAddressConfirmed}
          />
          {isLoading && <Loader />}
      </CenteredGrid>
    </div>
  );
};

export default RedeemHome;
