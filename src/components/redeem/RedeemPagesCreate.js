import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox, CircularProgress, FormControlLabel, Grid, Switch, TextField, Tooltip } from '@mui/material';
import { Button } from '@swagup-com/react-ds-components';
import SwipeableViews from 'react-swipeable-views';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CheckCircle from '@mui/icons-material/RadioButtonUnchecked';
import CheckRounded from '@mui/icons-material/RadioButtonChecked';
import SortBy from '../shared/SortBy';
import styles from './styles/redeem';
import _ from 'lodash';
import { ColorInput, FileUploadZone, getStatus, TableEmptyState, prepareArtworkOnUploadIO, PresetTemplate, ProductCard } from './redeemCommon';
import { useCompany, usePaginatedQuery } from '../../hooks';
import apiPaths from '../../utils/apiPaths';
import accountProductsApi from '../../api/swagup/accountProducts';
import { CardsContainer } from '../shared/containers/Cards';
import solutiontriangle from '../../api/solutiontriangle';
import CenteredGrid from '../shared/CenteredGrid';
import TemplatePreview from './TemplatePreview';
import { makeStyles } from '@mui/styles';
import { redeemPages, verifications } from '../../api/swagdrop';
import swagDropServicesApiPaths from '../../utils/swagDropServicesApiPaths';

const useStyles = makeStyles(styles);

const darkTheme = { theme: 'dark', backgroundColor: '#000000', fontColor: '#ffffff', accentColor: '#45D2B0', fontFamily: 'Gilroy' };
const lightTheme = { theme: 'light', backgroundColor: '#FFFFFF', fontColor: '#0b1829', accentColor: '#9846DD', fontFamily: 'Futura' };
const dataTemplate = {
  accountId: '3174',
  projectName: 'New SwagDrop Page',
  isActive: true,
  products: [],
  clientLogo: 'https://images.squarespace-cdn.com/content/v1/583863c1e6f2e1216884123c/1501780578502-9VLVVYAWB2JLO86NWA0U/image-asset.jpeg?format=1000w',
  clientImage: 'https://swagup-static.swagup.com/platform/media/form/packs/SwagUp_-_Fulfillment_Internal_Test_--_Pack_Executive_.png',
  allowInternationalShipping: false,
  headline: 'Welcome to CompanyName',
  body: 'We like to welcome you to our company with some small gifts. Click the button below to redeem it.',
  callToActionButtonText: 'Redeem Here',
  last_modified: '01-24-22',
  theme: 'dark',
  backgroundColor: '#000000',
  fontColor: '#ffffff',
  accentColor: '#45D2B0',
  fontFamily: 'Gilroy'
};

const FormContainer = ({ children, title, step }) => {
  const classes = useStyles();
  return (
    <div>
      <p
        className={classes.designName}
        style={{ marginTop: 8, color: '#787B80', fontSize: 12, marginBottom: 8 }}
      >{`Step ${step}/3`}</p>
      <p className={classes.stepTitle}>{title}</p>
      <div className={classes.stepContainer}>{children}</div>
    </div>
  );
};

const templateFields = [
  {
    name: 'projectName',
    placeholder: 'Name your Redeem Page',
    label: 'Redeem Project Name ',
    required: true
  },
  {
    name: 'headline',
    placpeholder: 'Edit your Redeem Page Header',
    label: 'Page Header',
    required: true
  },
  {
    name: 'body',
    placeholder: 'Edit your Redeem Page Subtitle',
    label: 'Page Subtitle',
    multiline: true,
    required: true
  },
  {
    name: 'callToActionButtonText',
    placeholder: 'Edit your Call to action Text',
    label: 'Button Text',
    required: true
  },
  {
    name: 'clientLogo',
    placeholder: 'Change the Page Logo',
    label: 'Logo',
    image: true
  },
  {
    name: 'clientImage',
    placeholder: 'Change the Product Image',
    label: 'Product Image',
    image: true
  }
];

const perPageOptions = [12, 24, 36, 48];

const fontFamilies = [
  { value: 'Gilroy', label: 'Gilroy' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Futura', label: 'Futura' }
];

const themeVars = [{ key: 'backgroundColor', label: 'Background Color' }, {  key: 'fontColor', label: 'Font Color' }, { key: 'accentColor', label: 'Accent Color' } ];

const RedeemPagesCreate = () => {
  const [page, setPage] = useState(dataTemplate);
  const [currentStep, setCurrentStep] = useState(1);
  const [artworkLoader, setArtworkLoader] = useState([]);
  const [nammingError, setNammingError] = useState();
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data } = useQuery(['redeem-details', id], () => redeemPages.get(id), {
    enabled: !!id
  });
  const originalPage = data?.data;
  useEffect(() => {
    if (originalPage?.id) setPage(originalPage);
  }, [originalPage]);

  //const { data: company } = useCompany();
  const company = useMemo(() => ({ id: 3719, name: 'Weathervane' }), []);

  useEffect(() => {
    document.getElementById('root').style.background = 'linear-gradient(90deg, rgba(255,255,255) 50%, #EBF1FB 50%)';
    return () => (document.getElementById('root').style.background = '#ffffff');
  }, []);

  useEffect(() => {
    if (company.id) setPage(p => ({ ...p, company }));
  }, [company]);

  const accountProductsParams = {
    visible_in_inventory: true,
    search: '',
    record_type: 'all',
    inventory: 'available',
    ordering: '-created_at'
  };

  // const { query: queryResult, pagination } = usePaginatedQuery({
  //   queryKey: [apiPaths.accountProducts, accountProductsParams],
  //   queryFn: (limit, offset) => {
  //     return accountProductsApi.fetch({ limit, offset, ...accountProductsParams });
  //   },
  //   perPageOptions
  // });
  const accountProducts = { results: [] }; // queryResult.data;

  const createPayloadPage = () => {
    let returnPage = {
      ...page,
      lastModified: dayjs().format('MM-DD-YY')
    };

    if(id) returnPage = Object.keys(returnPage).reduce((rslt,  key) => returnPage[key] !== originalPage[key] && key !== 'company' ? {...rslt, [key]: returnPage[key] } : rslt, {})

    return returnPage;
  };
  const queryClient = useQueryClient();
  const createRedeem = useMutation(params => (id ? redeemPages.update(page.id, params) : redeemPages.create(params)), {
    onSuccess: () => {
      queryClient.invalidateQueries(['redeem']);
      return navigate('/swag-drop/redeems');
    }
  });

  const handleOnPrevious = () => {
    const futureStep = currentStep - 1;
    if (futureStep === 0) navigate('/swag-drop/redeems');
    else setCurrentStep(futureStep);
  };

  const handleONext = () => {
    const futureStep = currentStep + 1;
    if (futureStep > 3) {
      createRedeem.mutate(createPayloadPage(page));
    } else setCurrentStep(futureStep);
  };
  const isThemeSelected = t => ['fontFamily', ...themeVars.map(tv => tv.key)].every(key => page[key] === t[key]);

  const { isLoading:  isNameQueryLoading } = useQuery([swagDropServicesApiPaths.verifyName, page.projectName],
    () => verifications.names({ projectName: page.projectName }),
    {
      onSuccess: rslt => setNammingError(rslt?.available || rslt?.projectName === originalPage?.projectName ? '' : 'The current Project Name is already been used'),
      enabled: page.projectName  !== originalPage?.projectName
    }
  );

  
  const onChange = async ({ target: { value, name } }) =>  setPage({ ...page, [name]: value });

  const handleOnSelect = ap =>
    setPage(pg => ({
      ...page,
      product: ap.image,
      products: pg.products.some(p => p.id === ap.id)
        ? pg.products.filter(p => p.id !== ap.id)
        : [{ id: ap.id, name: ap.name, image: ap.image, quantity: 1, is_apparel: ap.is_apparel }, ...pg.products]
    }));

  const handleSetProductQuantity = (ap, qty) => {
    let product = page.products.find(p => p.id === ap.id);
    product = { ...product, quantity: qty };
    setPage({
      ...page,
      products: page.products.map(p => (p.id === product.id ? product : p))
    });
  };

  const handleFileUpload = async (acceptedFiles, property) => {
    setArtworkLoader(al => [...al, property]);
    const image = acceptedFiles[0];
    // const filePath = URL.createObjectURL(image);
    const uploaded = await prepareArtworkOnUploadIO(image);
    setPage(p => ({ ...p, [property]: uploaded.url }));
    setArtworkLoader(al => al.filter(a => a !== property));
  };

  const errors = () => {
    if (currentStep === 1) return false;
    if (currentStep === 2) {
      if(!page.projectName || !page.headline || !page.body || !page.callToActionButtonText || artworkLoader.length)
      return 'Some required fields are missing';
      if (isNameQueryLoading) return "Validating Project Name...";
      return page.projectName  !== originalPage?.projectName  && nammingError;
    }
    if (currentStep === 3)
      return (
        ((!accountProducts?.results || !accountProducts.results.find(ap => page.products.some(p => p.id === ap.id)))) && accountProducts?.results.length > 0 &&
        'You must select at least a product'
      );
    return false;
  };
  const cantContinue = !(company.id && !errors()) || createRedeem.isLoading;

  return (
    <CenteredGrid className={classes.root}>
      <Grid container>
        <Grid item xs style={{ paddingRight: 16 }}>
          <Grid container direction="column" className={classes.fullHeight}>
            <Grid item>
              <p variant="h1" className={classes.title} style={{ fontSize: 28 }}>
                {`${id ? 'Update' : 'Create a'} SwagDrop page`}
              </p>
            </Grid>
            <Grid item xs>
              <SwipeableViews axis="x" index={currentStep - 1} className={classes.swipeableViews} disabled>
                <FormContainer title="Choose your template" step={currentStep}>
                  <Grid container style={{ paddingTop: 16 }}>
                    <Grid item xs={12}>
                      <PresetTemplate
                        page={page}
                        onSelect={() => setPage({ ...page, ...darkTheme })}
                        selected={isThemeSelected(darkTheme)}
                        name="Dark Theme"
                        subtext="A cool dark looking view"
                        image="path2510"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <PresetTemplate
                        page={page}
                        onSelect={() => setPage({ ...page, ...lightTheme })}
                        selected={isThemeSelected(lightTheme)}
                        name="Light Theme"
                        subtext="A cool light looking view"
                        image="path2536"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <PresetTemplate
                        page={page}
                        onSelect={() => setPage(p => ({ ...p, theme: 'custom' }))}
                        selected={!isThemeSelected(darkTheme) && !isThemeSelected(lightTheme)}
                        name="Custom Theme"
                        subtext="Customize it yourself"
                        image="vector"
                        isCustom
                      />
                    </Grid>
                    <Grid item container xs={12} style={{ paddingTop: 16 }}>
                      <Grid container>
                        <Grid item xs={3}>
                          <FormControlLabel
                            className={classes.formControl}
                            style={{ margin: 0, marginLeft: 24 }}
                            labelPlacement="top"
                            control={
                              <SortBy
                                versatil
                                options={fontFamilies}
                                selected={page.fontFamily}
                                onChange={value =>
                                  setPage(p => ({ ...p, fontFamily : value }))
                                }
                              />
                            }
                            label={
                              <p style={{ fontSize: 16 }} className={classes.demoLabel}>
                                Font Family
                              </p>
                            }
                          />
                        </Grid>
                        <Grid item xs>
                          <Grid container>
                            {themeVars.map(tv => (
                              <Grid item xs={4} key={tv.key}>
                                <FormControlLabel
                                  className={classes.formControl}
                                  style={{ margin: '0px 16px 0px 0px' }}
                                  labelPlacement="top"
                                  control={
                                    <ColorInput
                                      value={page[tv.key]}
                                      className={classes.inputText}
                                      onChange={color =>
                                        setPage(p => ({ ...p, [tv.key]: color }))
                                      }
                                    />
                                  }
                                  label={
                                    <p style={{ fontSize: 16 }} className={classes.demoLabel}>
                                      {tv.label}
                                    </p>
                                  }
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </FormContainer>
                <FormContainer title="Customize your content" step={currentStep}>
                  <Grid container>
                    <Grid container justifyContent="flex-end">
                      <FormControlLabel
                        label={`Status: ${getStatus(page.isActive)}`}
                        style={{ width: 150 }}
                        labelPlacement="top"
                        control={
                          <Switch
                            checked={page.isActive}
                            onChange={({ target: { checked } }) =>
                              setPage(p => ({ ...p, isActive: checked }))
                            }
                          />
                        }
                      />
                    </Grid>
                    {templateFields.map(tf => (
                      <Grid item xs={tf.image ? 6 : 12} key={tf.name} style={{ paddingBottom: 12, paddingRight: 24 }}>
                        <p style={{ color: '#4A4F54', fontSize: 14, marginBottom: 4, marginLeft: 24, paddingTop: tf.image ? 16 : 0 }}>
                          {tf.label}
                          {tf.required && <strong>*</strong>}
                        </p>
                        {tf.image ? (
                          <FileUploadZone handleFileUpload={files => handleFileUpload(files, tf.name)}>
                            <Grid
                              container
                              justifyContent="center"
                              alignItems="center"
                              className={classes.uploadButton}
                            >
                              {artworkLoader.includes(tf.name) ? (
                                <CircularProgress style={{ float: 'left', width: 20, height: 20, marginLeft: 16 }} />
                              ) : (
                                <img
                                  src={page[tf.name] || '/images/public/nopic.jpg'}
                                  alt={tf.name}
                                  style={{ float: 'left', width: 20, height: 20, marginLeft: 24, borderRadius: 10 }}
                                />
                              )}
                              <p style={{ margin: 'auto', marginLeft: 24 }}>Drop or Click to Upload</p>
                            </Grid>
                          </FileUploadZone>
                        ) : (
                          <TextField
                            // className={tf.multiline ? classes.inputTextMultiline : classes.inputText}
                            placeholder={tf.placeholder}
                            size="small"
                            value={page[tf.name]}
                            name={tf.name}
                            onChange={onChange}
                            fullWidth
                            multiline={tf.multiline}
                          />
                        )}
                      </Grid>
                    ))}
                    <Grid item>
                      <FormControlLabel
                        className={classes.formControl}
                        style={{ margin: 0, marginTop: 24, marginLeft: 22 }}
                        control={
                          <Checkbox
                            disableRipple
                            disableFocusRipple
                            disableTouchRipple
                            className={classes.allCheckbox}
                            checked={!!page.allowInternationalShipping}
                            onChange={({ target: { checked } }) => setPage({ ...page, allowInternationalShipping: checked })}
                            inputProps={{ 'aria-label': `Selection shortcut actions checkbox` }}
                          />
                        }
                        label={<p style={{ marginLeft: 20 }} className={classes.demoLabel}>Can Ship Internationally?</p>}
                      />
                    </Grid>
                  </Grid>
                </FormContainer>
                <FormContainer title="Select your products" step={currentStep}>
                  {accountProducts?.results?.length ? (
                  <CardsContainer className={classes.productCardsContainer}>
                    {accountProducts?.results?.map(ap => (
                      <ProductCard
                        key={ap.id}
                        product={ap}
                        selected={page.products.some(p => p.id === ap.id)}
                        onSelect={() => handleOnSelect(ap)}
                        onSetQuanity={(p, qty) => handleSetProductQuantity(p, qty)}
                        current={page.products.find(p => p.id === ap.id)}
                      />
                    ))}
                  </CardsContainer>
                  )
                  : (<TableEmptyState text="No products found" subText="You can products to you Inventory" />)}
                </FormContainer>
              </SwipeableViews>
            </Grid>
            <Grid item container className={classes.wizardFooter}>
              <Grid item xs={4}>
                <Button size="small" variant="text" onClick={handleOnPrevious} className={classes.previous} fullWidth>
                  <KeyboardBackspaceIcon className={classes.previousIcon} />
                  Previous step
                </Button>
              </Grid>
              <Grid xs item />
              <Grid item xs={3}>
                <Tooltip title={errors()} disableHoverListener={!errors()}>
                  <div>
                    <Button
                      size="small"
                      variant="primary"
                      onClick={handleONext}
                      fullWidth
                      disabled={cantContinue}
                      loading={createRedeem.isLoading}
                    >
                      Continue
                    </Button>
                  </div>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container alignItems="center" style={{ paddingLeft: 32, height: '100%' }}>
            <Grid item>
              <TemplatePreview
                page={page}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CenteredGrid>
  );
};

export default RedeemPagesCreate;
