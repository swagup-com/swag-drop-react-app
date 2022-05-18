import React, { useState } from 'react';
import { Grid, Modal, Paper } from '@mui/material';
import clsx from 'clsx';
import IconClose from '@mui/icons-material/Close';
import { moneyStr, getTaxes, getEmployeeShipAddress, joinFields, getSortedBySize, getEstimatedDeliveryMsg } from '../../utils/utils';
import ShipmentStatus from './ShipmentStatus';
import { ImgWithHandler } from './ImgUtils';
import styles from './styles/StaffDisplayTool';
import StylessButton from './buttons';
import { redactedText } from '../../api/constants';
import { withStyles } from '@mui/styles';

const customFormatDate = date =>
  `${date.getMonth() + 1}/${date.getDate()}/${date
    .getFullYear()
    .toString()
    .slice(2)}`;

const DetailsModal = ({ classes, order, onClose }) => {
  const [recipientElRef, setRecipientElRef] = useState(null);

  if (!order) return null;

  const {
    employee,
    products,
    delivery_method: deliveryMethod,
    shipping_date: shippingDate,
    shipping_notes: shippingNotes,
    total_shipping: totalCost,
    shipping_state: shippingState,
    tracking,
    tracking_url: trackingUrl,
    status,
    date,
    requested_by: requestedBy,
    redacted
  } = order;

  const estimatedDeliveryMsg = shippingDate
    ? getEstimatedDeliveryMsg(
        shippingDate,
        deliveryMethod.turnaround_time_min_days,
        deliveryMethod.turnaround_time_max_days,
        customFormatDate
      )
    : '-';

  const formatStringDate = strDate => {
    const [year, month, day] = strDate.split('-');
    return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year.slice(2)}`;
  };

  const sizeForExpressDate = deliveryMethod.name === 'Express';
  const totalCostAndTax = parseFloat(totalCost) + getTaxes(shippingState, totalCost);

  return (
    <Modal
      aria-labelledby="order-details-title"
      aria-describedby="order-details-description"
      open={order !== null}
      onClose={onClose}
      className={classes.modalViewDetails}
    >
      <Paper className={classes.modalViewDetailsContainer}>
        <StylessButton type="button" onClick={onClose} className={classes.iconCloseContainer}>
          <IconClose className={classes.iconClose} />
        </StylessButton>
        <Grid container>
          <Grid item xs={8}>
            <Grid container wrap="nowrap" alignItems="center">
              <p className={classes.modalViewDetailsTitle}>Shipment details</p>
              <ShipmentStatus status={status} withTooltip tooltipPlacement="bottom" />
            </Grid>
            <p className={classes.modalViewDetailsCreated}>Created on {formatStringDate(date)}</p>
          </Grid>
          <Grid item xs={4}>
            <p className={classes.modalViewDetailsTracking}>Tracking number</p>
            <a
              target="_blank"
              style={{ width: 'min-content', display: 'inline-block' }}
              rel="noopener noreferrer"
              href={trackingUrl}
            >
              <p className={classes.modalViewDetailsTrackingNumber}>{tracking || '-'}</p>
            </a>
          </Grid>
        </Grid>
        <Grid container className={classes.modalDetailsContent}>
          <Grid
            ref={setRecipientElRef}
            container
            direction="column"
            item
            xs={12}
            sm={5}
            md={5}
            lg={5}
            className={classes.modalViewDetailsRecipient}
          >
            <div className={classes.modalViewDetailsRecipientText}>
              <p className={classes.modalViewDetailsRecipientTitle}>Recipient</p>
              <p className={classes.modalViewDetailsRecipientContent}>
                {redacted ? redactedText : joinFields([employee.first_name, employee.last_name], ' ')}
              </p>
              <p className={classes.modalViewDetailsRecipientContent}>
                {redacted ? redactedText : getEmployeeShipAddress(order)}
              </p>
            </div>
            <div className={classes.modalViewDetailsRecipientText}>
              <p className={classes.modalViewDetailsRecipientTitle}>Shipping Notes</p>
              <p className={clsx(classes.modalViewDetailsRecipientContent, classes.modalViewDetailsShippingNotes)}>
                {redacted ? redactedText : shippingNotes || <span>&nbsp;</span>}
              </p>
            </div>
            <div className={classes.modalViewDetailsRecipientText}>
              <p className={classes.modalViewDetailsRecipientTitle}>Requested by</p>
              <p className={classes.modalViewDetailsRecipientContent}>{requestedBy}</p>
            </div>
            <hr className={classes.modalViewDetailsRecipientSeparator} />
            <Grid container>
              <Grid
                item
                xs={12}
                sm={6}
                md={sizeForExpressDate ? 5 : 4}
                lg={sizeForExpressDate ? 5 : 4}
                className={classes.modalViewDetailsRecipientText}
              >
                <p className={classes.modalViewDetailsRecipientTitle}>Shipping Date</p>
                <p className={classes.modalViewDetailsRecipientContent}>
                  {shippingDate ? formatStringDate(shippingDate) : '-'}
                </p>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={sizeForExpressDate ? 5 : 6}
                lg={sizeForExpressDate ? 5 : 6}
                className={classes.modalViewDetailsRecipientText}
              >
                <p className={classes.modalViewDetailsRecipientTitle}>Delivery Date</p>
                <p className={classes.modalViewDetailsRecipientContent}>{estimatedDeliveryMsg}</p>
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={2} className={classes.modalViewDetailsRecipientText}>
                <p className={classes.modalViewDetailsRecipientTitle}>Items</p>
                <p className={classes.modalViewDetailsRecipientContent}>{products.length}</p>
              </Grid>
              <Grid item xs={6} className={classes.modalViewDetailsRecipientText}>
                <p className={classes.modalViewDetailsRecipientTitle}>Delivery type</p>
                <Grid className={classes.modalViewDetailsRecipientDeliveryMethod}>{deliveryMethod.name}</Grid>
              </Grid>
            </Grid>
            <hr className={classes.modalViewDetailsRecipientSeparator} />
            <Grid container alignItems="center">
              <Grid item xs={6} className={clsx(classes.modalViewDetailsRecipientText, classes.mb0)}>
                <p className={classes.modalViewDetailsRecipientTitle}>Total Price</p>
              </Grid>
              <Grid item xs={6} className={clsx(classes.modalViewDetailsRecipientText, classes.mb0)}>
                <p className={classes.modalViewDetailsRecipientTotal}>{moneyStr(totalCostAndTax)}</p>
              </Grid>
            </Grid>
          </Grid>
          {recipientElRef && recipientElRef.clientHeight && (
            <Grid
              container
              item
              xs={12}
              sm={7}
              md={7}
              lg={7}
              style={{ height: recipientElRef && recipientElRef.clientHeight }}
              className={classes.modalViewDetailsItems}
            >
              <Grid direction="column" container className={classes.modalViewDetailsItemsInner}>
                <p className={classes.modalViewDetailsRecipientTitle}>Items</p>
                <div className={classes.modalViewDetailsItemsContainer}>
                  {getSortedBySize(products).map(p => (
                    <Grid container style={{ marginBottom: 20 }} key={`${p.product.id}-${p.size.id}`}>
                      <Grid item className={classes.ItemImageContainer}>
                        <ImgWithHandler
                          className={classes.ItemImage}
                          src={p.product.image}
                          alt={p.product.name}
                          width={180}
                          height={180}
                        />
                      </Grid>
                      <Grid item xs={7} sm={7} className={classes.itemColumnText}>
                        <p className={classes.modalViewDetailsItemsBoldText}>{p.product.name}</p>
                        <p className={classes.modalViewDetailsItemsNormalText}>
                          <span className={classes.modalViewDetailsColorTitle}>Color:</span>{' '}
                          {p.product.theme_color || '-'}
                        </p>
                        <p className={classes.modalViewDetailsItemsNormalText}>
                          <span className={classes.modalViewDetailsColorTitle}>Size:</span> {p.size.name}
                        </p>
                      </Grid>
                      <Grid item style={{ marginLeft: 'auto', marginRight: 10 }}>
                        <p className={classes.modalViewDetailsItemsBoldText}>x{p.quantity}</p>
                      </Grid>
                    </Grid>
                  ))}
                  {products.length <= 1 && (
                    <Grid item container direction="column">
                      <Grid item xs={12} container justifyContent="center">
                        <img
                          src="/images/shipping/empty-proofs.svg"
                          alt="that’s all folks"
                          className={classes.thasIsAllFolksImage}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <p className={classes.thasIsAllFolksText}>That’s all folks</p>
                      </Grid>
                    </Grid>
                  )}
                </div>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Modal>
  );
};

export default withStyles(styles)(DetailsModal);
