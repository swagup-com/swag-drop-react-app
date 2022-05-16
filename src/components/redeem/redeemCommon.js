import React from 'react';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Button } from '@swagup-com/react-ds-components';

const defaultText = ({ color, fontFamily }) => ({
  fontFamily: fontFamily || 'Gilroy',
  color: color || '#0b1829',
  margin: 0
});

const standardMediaQueries = (theme, fontSize, marginBottom) => ({
  [theme.breakpoints.down(1025)]: {
    fontSize: fontSize * 0.9,
    marginBottom: marginBottom * 0.9
  },
  [theme.breakpoints.down(913)]: {
    fontSize: fontSize * 0.8,
    marginBottom: marginBottom * 0.8
  },
  [theme.breakpoints.down(769)]: {
    fontSize: fontSize * 0.7,
    marginBottom: marginBottom * 0.7,
    lineHeight: 1.3
  },
  [theme.breakpoints.down(541)]: {
    fontSize: fontSize * 0.7,
    marginBottom: marginBottom * 0.7,
    textAlign: 'center'
  },
  [theme.breakpoints.down(391)]: {
    fontSize: fontSize * 0.6,
    marginBottom: marginBottom * 0.6  
  }
});

const templateStyles = theme => ({
  root: {
    position: 'relative',
    background: ({ background }) => background || 'transparent',
    padding: '0px 24px',
    flexDirection: 'column',
    display: 'flex',
    minHeight: '100vh',
  [theme.breakpoints.down(1025)]: {
    padding: '0px 32px'
  },
  [theme.breakpoints.down(913)]: {
    padding: '0px 24px'
  },
  [theme.breakpoints.down(541)]: {
    padding: '0px 16px',
    textAlign: 'center'
  },
  [theme.breakpoints.down(391)]: {
    padding: '0px 8px'
  }
  },
  header: {
    paddingTop: '16px'
  },
  logoContainer: {
    width: 156,
    height: 92,
    position: 'relative',
    [theme.breakpoints.down(1025)]: {
      width: 132,
      height: 72
    },
    [theme.breakpoints.down(913)]: {
      width: 124,
      height: 64
    },
    [theme.breakpoints.down(541)]: {
      width: 112,
      height: 56
    },
    [theme.breakpoints.down(391)]: {
      width: 92,
      height: 42
    }
  },
  logo: {
    height: '100%',
    width: '100%',
    objectFit: 'contain'
  },
  headerText: props => ({ ...defaultText(props), fontSize: 72, marginBottom: 24, fontWeight: 700,
    ...standardMediaQueries(theme, 72, 24) }),
  subtitle: props => ({ ...defaultText(props), fontSize: 20, fontWeight: 400, marginBottom: 24,
    ...standardMediaQueries(theme, 20, 24) }),
  advisory: props => ({ ...defaultText(props), fontSize: 14, marginTop: 32, marginBottom: 56,
    ...standardMediaQueries(theme, 14, 56) }),
  productContainer: {
    width: '100%',
    height: 320,
    [theme.breakpoints.down(913)]: {
      height: 292
    },
    [theme.breakpoints.down(913)]: {
      height: 212
    }
  },
  product: {
    height: '100%',
    width: '100%',
    objectFit: 'contain'
  },
  button: {
    marginTop: 24,
    marginLeft: 4,
    // padding: '16px 42px !important',
    minWidth: '212px !important',
    '&:disabled': { backgroundColor: 'rgba(0, 0, 0, 0.26) !important' },
    backgroundColor: ({ accent }) => (`${accent || '#3577d4'} !important`),
    color: '#ffffff',
    borderRadius: '32px !important',
    '& span': {
      color: '#ffffff',
      fontWeight: 700
    },
    [theme.breakpoints.down(1025)]: {
      padding: '16px 42px !important',
      minWidth: '192px !important',
      height: '48px !important'
    },
    [theme.breakpoints.down(913)]: {
      padding: '16px 16px !important',
      minWidth: '164px !important',
      height: '52px !important'
    },
    [theme.breakpoints.down(541)]: {
      padding: '12px 12px !important',
      minWidth: '142px !important',
      height: '46px !important'
    },
    [theme.breakpoints.down(391)]: {
      padding: '6px 8px !important',
      minWidth: '124px !important',
      height: '36px !important'
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
const prepare = text => text.toLowerCase().replaceAll(' ', '-');
const getPagePath = ({ company, name }) => company && name ? `/swag-drop/${prepare(company)}/${prepare(name)}` : '/';

export {
  useTempletesStyles,
  PostMessage,
  getPagePath
};
