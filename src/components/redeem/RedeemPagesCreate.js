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
import { ColorInput, FileUploadZone, getStatus, prepare, prepareArtworksOnS3, ProductCard } from './redeemCommon';
import { useCompany, usePaginatedQuery } from '../../hooks';
import apiPaths from '../../utils/apiPaths';
import accountProductsApi from '../../api/swagup/accountProducts';
import { CardsContainer } from '../shared/containers/Cards';
import solutiontriangle from '../../api/solutiontriangle';
import CenteredGrid from '../shared/CenteredGrid';
import TemplatePreview from './TemplatePreview';
import { makeStyles } from '@mui/styles';
import { redeemPages } from '../../api/swagdrop';

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

const PresetTemplate = ({ selected, onSelect, name, subtext, image }) => {
  const classes = useStyles({ selected });
  return (
    <div role="button" onClick={onSelect} className={classes.dataTemplate}>
      <Grid container alignItems="center">
        <Grid item>
          <div style={{ height: 56, width: 56, border: '1px solid #787B80', borderRadius: 16 }}>
            <img src={`/images/redeem/${image}.png`} alt={name} style={{ objectFit: 'scale-down', width: '100%' }} />
          </div>
        </Grid>
        <Grid item xs>
          <Grid container alignItems="center" style={{ paddingLeft: 32 }}>
            <Grid item>
              <p style={{ color: '#0B1829', fontFamily: 'Gilroy', fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
                {name}
              </p>
              <p style={{ color: '#787B80', fontFamily: 'Gilroy', fontSize: 14 }}>{subtext}</p>
            </Grid>
          </Grid>
        </Grid>
        <Grid item alignItems="center">
          <Grid item>
            {selected ? (
              <CheckRounded className={classes.linkIcon} style={{ height: 24, width: 24, color: '#3577D4' }} />
            ) : (
              <CheckCircle className={classes.linkIcon} style={{ height: 24, width: 24, color: '#3577D4' }} ss />
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

const templateFields = [
  {
    name: 'projectName',
    placeholder: 'Name your Redeem Page',
    label: 'Name',
    required: true
  },
  {
    name: 'headline',
    placeholder: 'Edit your Redeem Page Header',
    label: 'Header',
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

const themeVars = ['backgroundColor', 'fontColor', 'accentColor'];

const RedeemPagesCreate = () => {
  const [page, setPage] = useState(dataTemplate);
  const [currentStep, setCurrentStep] = useState(1);
  const [artworkLoader, setArtworkLoader] = useState([]);
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data } = useQuery('redeem-details', () => redeemPages.get(id), {
    enabled: !!id
  });
  const result = data?.data;
  useEffect(() => {
    if (result?.id) setPage(result);
  }, [result]);

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

  const { query: queryResult, pagination } = usePaginatedQuery({
    queryKey: [apiPaths.accountProducts, accountProductsParams],
    queryFn: (limit, offset) => {
      return accountProductsApi.fetch({ limit, offset, ...accountProductsParams });
    },
    perPageOptions
  });
  const accountProducts = queryResult.data;

  const createPayloadPage = () => {
    // const productsMap = page.products.filter(ap => accountProducts.results.some(p => p.id === ap.id));
    // const products = JSON.stringify(productsMap);
    // const theme = JSON.stringify(page.theme);
    const returnPage = {
      ...page,
      // products,
      // slug: prepare(`${page.company.name || page.company}-${page.name}`),
      // theme,
      // product: page.product || page.products[0].image,
      // allowInternationalShipping: page.allowInternationalShipping ? 1 : 0,
      // logo:
        // page.logo ||
        // page.company.logo ||
        // (page.theme.id === 1
        //   ? 'https://images.squarespace-cdn.com/content/v1/583863c1e6f2e1216884123c/1501780578502-9VLVVYAWB2JLO86NWA0U/image-asset.jpeg?format=1000w'
        //   : 'https://images.squarespace-cdn.com/content/v1/583863c1e6f2e1216884123c/1501780550627-8WL59H2VU6ODTI4E00J7/image-asset.png?format=1000w'),
      // company: page.company.name,
      // company_id: page.company.id,
      last_modified: dayjs().format('MM-DD-YY')
    };

    return returnPage;
  };
  const queryClient = useQueryClient();
  const createRedeem = useMutation(params => (id ? redeemPages.update(params) : redeemPages.create(params)), {
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
  const isThemeSelected = t => ['fontFamily', ...themeVars].every(key => page[key] === t[key]);

  const onChange = ({ target: { value, name } }) => setPage({ ...page, [name]: value });

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
    const uploaded = await prepareArtworksOnS3(image);
    setPage(p => ({ ...p, [property]: uploaded.url }));
    setArtworkLoader(al => al.filter(a => a !== property));
  };

  const errors = () => {
    if (currentStep === 1) return false;
    if (currentStep === 2) {
      return (
        (!page.projectName || !page.headline || !page.body || !page.callToActionButtonText || artworkLoader.length) &&
        'Some required fields are missing'
      );
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
                      />
                    </Grid>
                    <Grid item container xs={12} style={{ paddingTop: 32 }}>
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
                              <p style={{ fontSize: 12 }} className={classes.demoLabel}>
                                Font Family
                              </p>
                            }
                          />
                        </Grid>
                        <Grid item xs>
                          <Grid container>
                            {themeVars.map(tv => (
                              <Grid item xs={4} key={tv}>
                                <FormControlLabel
                                  className={classes.formControl}
                                  style={{ margin: '0px 16px 0px 0px' }}
                                  labelPlacement="top"
                                  control={
                                    <ColorInput
                                      value={page[tv]}
                                      className={classes.inputText}
                                      onChange={color =>
                                        setPage(p => ({ ...p, [tv]: color }))
                                      }
                                    />
                                  }
                                  label={
                                    <p style={{ fontSize: 12 }} className={classes.demoLabel}>
                                      {tv.charAt(0).toUpperCase() + tv.slice(1)}
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
                        <p style={{ marginBottom: 4, marginLeft: 24 }}>
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
                                  style={{ float: 'left', width: 20, height: 20, marginLeft: 16, borderRadius: 10 }}
                                />
                              )}
                              <p style={{ margin: 'auto' }}>Drop or Click to Upload</p>
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
                        style={{ margin: 0, marginTop: 24, marginLeft: 16 }}
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
                        label={<p className={classes.demoLabel}>Is Interational?</p>}
                      />
                    </Grid>
                  </Grid>
                </FormContainer>
                <FormContainer title="Select your products" step={currentStep}>
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
