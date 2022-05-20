import React from 'react';
import { Grid } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Img, productImageBasedOnStatus } from '../shared/ImgUtils';
import styles from './styles/redeem';
import { useCircularIndex } from '../../hooks';
import { withStyles } from '@mui/styles';

const arrowStyles = {
  button: {
    cursor: 'pointer',
    transition: '0.6s ease',
    userSelect: 'none',
    width: 32,
    height: 32,
    borderRadius: 16,
    background: '#ffffff',
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.1)',
    padding: 0,
    color: '#0B1829',
    paddingTop: 1,
    border: 'none'
  },
  icon: {
    fontSize: 12,
    marginTop: 2
  }
};

const ArrowButton = withStyles(arrowStyles)(({ rotated, icon: Icon, classes, ...props }) => (
  <button type="button" {...props} className={classes.button}>
    <Icon className={classes.icon} />
  </button>
));

const ProductsCarousel = ({ classes, products }) => {
  const [current, handlePrevious, handleNext] = useCircularIndex(0, products.length);
  const product = products[current];
  const availableQty = product.stock.reduce((sum, inv) => sum + inv.quantity, 0);
  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container>
          <Grid container justifyContent="space-between" alignItems="center" item xs={12}>
            <ArrowButton rotated icon={ChevronLeft} onClick={handlePrevious} />
            <Img src={productImageBasedOnStatus(product, 256, 256)} className={classes.proofImg} alt="Product" />
            <ArrowButton icon={ChevronRight} onClick={handleNext} />
          </Grid>
        </Grid>
      </Grid>

      <div style={{ paddingLeft: 32, paddingBottom: 12 }}>
        <p className={classes.packTitle}>{product.name}</p>
        <p className={classes.statusText} style={{ marginBotton: 12 }}>Available qty: {availableQty}</p>
      </div>
      <Grid
        item
        container
        style={{ marginLeft: 32, marginRight: 32 }}
        className={classes.separateProofButtonsContainer}
      >
        <Grid container>
          {product.stock
            .filter(stock => stock.quantity > 0)
            .map(stock => (
              <Grid key={stock.size.id} item xs={3}>
                <p
                  style={{
                    marginTop: 16,
                    fontSize: 16,
                    fontFamily: 'Gilroy',
                    textAlign: 'left',
                    fontWeight: stock.quantity ? 'bold' : 'lighter'
                  }}
                >{`${stock.size.name}: ${stock.quantity}`}</p>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ProductsCarousel);
