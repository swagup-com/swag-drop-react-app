import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

import Tooltip from './Tooltip';
import { shipmentStatus } from '../../api/constants';
import { makeStyles } from '@mui/styles';

const commonShipmentStatusStyles = {
  padding: '7px 10px',
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 'normal',
  textTransform: 'uppercase'
};

const styles = {
  delivered: {
    color: '#45af5f',
    backgroundColor: '#e9f5ec'
  },
  onItsWay: {
    color: '#3577d4',
    backgroundColor: '#e7effa'
  },
  cancelled: {
    color: '#f44336',
    backgroundColor: '#fee8e7'
  },
  pendingProduction: {
    color: '#8d9299',
    backgroundColor: '#f1f2f3'
  }
};

const statusToStyle = {
  [shipmentStatus.onItsWay]: 'onItsWay',
  [shipmentStatus.scheduled]: 'onItsWay',
  [shipmentStatus.delivered]: 'delivered',
  [shipmentStatus.cancelled]: 'cancelled',
  [shipmentStatus.invalidAddress]: 'cancelled',
  [shipmentStatus.failure]: 'cancelled'
};

const tooltipText = {
  [shipmentStatus.onItsWay]: 'This shipment is on its way to the recipient.',
  [shipmentStatus.scheduled]: 'See the Shipping Date below to know when your swag is scheduled to leave the warehouse.',
  [shipmentStatus.pendingProduction]: 'The items in this shipment are in the process of being produced.',
  [shipmentStatus.cancelled]: 'This shipment has been cancelled',
  [shipmentStatus.failure]: 'This shipment was not able to be scheduled due to an error.',
  [shipmentStatus.invalidAddress]: 'The address for this shipment was invalid.',
  [shipmentStatus.delivered]: "This swag has been delivered to the recipient's address!",
  [shipmentStatus.returnToSender]: 'This shipment was returned to the warehouse.'
};

const useShipmentStyles = makeStyles({
  shipmentStatus: ({ status, lightStyle }) => ({
    ...commonShipmentStatusStyles,
    ...styles[statusToStyle[status] || 'pendingProduction'],
    borderRadius: lightStyle ? 16 : 8,
    fontWeight: lightStyle ? 400 : 600,
    fontSize: 10
  }),
  tooltip: {
    fontSize: 12,
    textAlign: 'center',
    width: 320
  }
});

const ShipmentStatus = ({ status, withTooltip, tooltipPlacement, lightStyle }) => {
  const classes = useShipmentStyles({ status, lightStyle });
  return withTooltip ? (
    <Tooltip placement={tooltipPlacement} title={tooltipText[status]} classes={{ tooltip: classes.tooltip }}>
      <Typography className={classes.shipmentStatus}>{status}</Typography>
    </Tooltip>
  ) : (
    <Typography className={classes.shipmentStatus}>{status}</Typography>
  );
};

ShipmentStatus.propTypes = {
  status: PropTypes.string.isRequired,
  withTooltip: PropTypes.bool,
  tooltipPlacement: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

ShipmentStatus.defaultProps = {
  withTooltip: false,
  tooltipPlacement: 'top'
};

export default ShipmentStatus;
