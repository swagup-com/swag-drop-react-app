import React from 'react';
import { Grid } from "@mui/material";
import { makeStyles } from '@mui/styles';



const defaultText = ({ fontColor, fontFamily }) => ({
    fontFamily: fontFamily || 'Gilroy-SemiBold',
    color: fontColor || '#0b1829'
  });
  const templateStyles = () => ({
    root: {
      height: 'auto',
      position: 'relative',
      background: ({ backgroundColor }) => backgroundColor || 'transparent',
      padding: '0px 5%'
    },
    header: {
      paddingTop: '2%'
    },
    logoContainer: {
      width: 32,
      height: 32,
      position: 'relative'
    },
    logo: {
      height: '100%',
      width: '100%',
      objectFit: 'scale-down'
    },
    headerText: props => ({ ...defaultText(props), fontSize: 18, marginTop: 10 }),
    subtitle: props => ({ ...defaultText(props), fontSize: 8, marginTop: 6, marginBottom: 10 }),
    advisory: props => ({ ...defaultText(props), fontSize: 6, marginTop: 10, marginBottom: 14 }),
    productContainer: {
      width: '100%',
      height: '40%'
    },
    product: {
      height: '100%',
      width: '100%',
      objectFit: 'scale-down'
    },
    button: {
      padding: '6px 12px',
      fontSize: 6,
      background: ({ accentColor }) => accentColor || '#3577d4',
      color: '#ffffff',
      borderRadius: 16,
      height: 'auto'
    }
  });
  
  const useTempletesStyles = makeStyles(templateStyles);
  const TemplatePreview = ({  page }) => {
    const { 
        projectName,
        headline,
        body,
        clientLogo,
        product,
        callToActionButtonText,
        company,
        fontFamily,
        backgroundColor,
        fontColor,
        accentColor,
        theme
      } = page;
      
    const isDarkTheme = theme === 'dark';
    const classes = useTempletesStyles({ backgroundColor, fontColor, accentColor, fontFamily });
    return (
        <div>
            <Grid container direction="column" className={classes.root} style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <Grid item className={classes.header}>
                <div className={classes.logoContainer}>
                    <img
                    src={
                        clientLogo ||
                        (isDarkTheme
                        ? 'https://images.squarespace-cdn.com/content/v1/583863c1e6f2e1216884123c/1501780578502-9VLVVYAWB2JLO86NWA0U/image-asset.jpeg?format=1000w'
                        : 'https://images.squarespace-cdn.com/content/v1/583863c1e6f2e1216884123c/1501780550627-8WL59H2VU6ODTI4E00J7/image-asset.png?format=1000w')
                    }
                    alt={projectName}
                    className={classes.logo}
                    />
                </div>
                </Grid>
                <Grid item xs>
                <Grid container style={{ height: '100%' }}>
                    <Grid item xs={6}>
                    <Grid container alignItems="center" style={{ height: '100%' }}>
                        <Grid item>
                        <p className={classes.headerText}>{headline}</p>
                        <p className={classes.subtitle}>{body}</p>
                        <a href="" className={classes.button}>
                            {callToActionButtonText}
                        </a>
                        <p className={classes.advisory}>
                            Please include your current address to ensure an accurate delivery at this time. Please be aware, due
                            to COVID-19, shipments may take longer than usual. Thank you for your patience & understanding.
                        </p>
                        </Grid>
                    </Grid>
                    </Grid>
                    <Grid item xs={6}>
                    <Grid container alignContent="center" style={{ height: '100%' }}>
                        <div className={classes.productContainer}>
                        <img src={product} alt={projectName} className={classes.product} />
                        </div>
                    </Grid>
                    </Grid>
                </Grid>
                </Grid>
                <Grid item>
                <Grid container justifyContent="center">
                    <p className={classes.advisory}>{`© ${new Date().getFullYear()} by ${company} in Partnership with SwagUp`}</p>
                </Grid>
                </Grid>
            </Grid>
        </div>
    );
  };

  export default TemplatePreview