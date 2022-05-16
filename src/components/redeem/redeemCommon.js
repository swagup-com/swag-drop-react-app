import React from 'react';
import { Grid, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
// import { Button, TextField } from '@swagup-com/components';

const defaultText = ({ color, fontFamily }) => ({
  fontFamily: fontFamily || 'Gilroy',
  color: color || '#0b1829',
  margin: 0
});
const templateStyles = () => ({
  root: {
    position: 'relative',
    background: ({ background }) => background || 'transparent',
    padding: '0px 24px',
    flexDirection: 'column',
    display: 'flex',
    minHeight: '100vh'
  },
  header: {
    paddingTop: '16px'
  },
  logoContainer: {
    width: 156,
    height: 92,
    position: 'relative'
  },
  logo: {
    height: '100%',
    width: '100%',
    objectFit: 'contain'
  },
  headerText: props => ({ ...defaultText(props), fontSize: 72, marginBottom: 24, fontWeight: 700 }),
  subtitle: props => ({ ...defaultText(props), fontSize: 20, fontWeight: 400, marginBottom: 24 }),
  advisory: props => ({ ...defaultText(props), fontSize: 14, marginTop: 32, marginBottom: 56 }),
  productContainer: {
    width: '100%',
    height: 320
  },
  product: {
    height: '100%',
    width: '100%',
    objectFit: 'contain'
  },
  button: {
    marginTop: 24,
    marginLeft: 4,
    padding: '16px 42px',
    fontSize: 20,
    backgroundColor: ({ accent }) => accent || '#3577d4',
    color: '#ffffff',
    borderRadius: 32,
    '& span': {
      color: '#ffffff'
    }
  },
  shipSwagFormContainer: {
    padding: '24px 142px',
    paddingBottom: 156,
    background: ({ background }) => background || 'transparent',
    zIndex: 2
  },
  footer: {
    // width: '100vw',
    // zIndex: 0,
    // position: 'fixed',
    // left: '0px',
    // bottom: '0vh'
  }
});

const useTempletesStyles = makeStyles(templateStyles);

const PostMessage = ({ classes, title, excerpt, handleONext }) => (
  <div className={classes.shipSwagFormContainer}>
    <Grid container justifyContent="center">
      <Grid item>
        <h2 className={classes.headerText} style={{ fontSize: 42 }}>
          {title}
        </h2>
      </Grid>
      <Grid item xs={12} justifyContent="center">
        <Grid container justifyContent="center">
          <h2 className={classes.subtitle} style={{ fontSize: 24, textAlign: 'center' }}>
            {excerpt}
          </h2>
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Button
          variant="primary"
          size="small"
          className={classes.button}
          style={{ marginLeft: 0, marginTop: 56, width: 320 }}
          onClick={handleONext}
        >
          Continue with SwagUp
        </Button>
      </Grid>
    </Grid>
  </div>
);

export {
  useTempletesStyles,
  PostMessage
};
