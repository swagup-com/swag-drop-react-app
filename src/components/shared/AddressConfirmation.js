import React from 'react';
import { Grid, Modal, Typography, Box, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import { joinFields } from '../../utils/utils';
import { Button } from '@swagup-com/react-ds-components';

const useStyles = makeStyles(theme => ({
  actionsContainer: {
    padding: '36px 78px 27px',
    width: 282,
    boxSizing: 'content-box',
    margin: 'auto',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
      padding: '36px 0px 27px',
      width: '100%'
    }
  },
  close: {
    cursor: 'pointer',
    color: '#868a8f',
    fontSize: 18
  },
  edit: {
    height: 16,
    marginTop: 36
  },
  infoCard: {
    boxShadow: '0 16px 36px 0 rgba(0, 0, 0, 0.05)',
    borderRadius: 15,
    width: 336,
    margin: 'auto',
    marginTop: 36,
    padding: '14px 26px 18px',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      padding: '14px 0px 18px',
      width: '100%'
    }
  },
  paper: {
    position: 'absolute',
    width: '780px !important',
    backgroundColor: '#ffffff',
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
    outline: 'none',
    padding: 24,
    borderRadius: 20,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  }
}));

const fields = ['street', 'secondary', 'city', 'state', 'zipcode', 'country'];

const cleanAddress = address => fields.reduce((acc, f) => ({ ...acc, [f]: address[f] ?? '' }), {});

const AddressConfirmation = ({ open, onClose, callbackAction, address, message, disableForceAddress }) => {
  const classes = useStyles();

  const handleConfirm = () => {
    callbackAction(address);
    onClose('confirmed');
  };

  const handleClose = (e, reason) => {
    if (reason !== 'backdropClick') {
      onClose();
    }
  };

  const verificationFailedMessage =
    message || 'There was something wrong during your address verification. You may retry or confirm it as it is.';

  const a = cleanAddress(address);
  const text = joinFields([a.street, a.secondary, a.city, joinFields([a.state, a.zipcode], ' '), a.country], ', ');

  return (
    <Modal onClose={handleClose} open={open}>
      <Grid container className={classes.paper}>
        <Grid item xs={12} container justifyContent="flex-end">
          <CloseIcon onClick={onClose} className={classes.close} />
        </Grid>
        <Box m="auto" maxWidth={500} textAlign="center">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Unable to Verify Address
          </Typography>
          <Box pt={3}>
            <Typography variant="subtitle1">{verificationFailedMessage}</Typography>
          </Box>

          <Paper className={classes.infoCard}>
            <Typography variant="subtitle1">Address entered</Typography>
            <Typography variant="body1" style={{ color: '#0b1829' }}>
              {text}
            </Typography>
          </Paper>

          <Grid container item xs={12} justifyContent="center" className={classes.actionsContainer}>
            <Button variant="primary" onClick={handleConfirm} disabled={disableForceAddress}>
              Yes, use this address
            </Button>
            <Button variant="text" onClick={onClose} className={classes.edit}>
              Edit address
            </Button>
          </Grid>
        </Box>
      </Grid>
    </Modal>
  );
};

export default AddressConfirmation;
