import React, { useState } from 'react';
import { Chip, ClickAwayListener, Grid, InputAdornment, Modal, TextField, Tooltip } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import { Button } from '@swagup-com/react-ds-components';
import { ChromePicker } from 'react-color';
import { Img } from '../shared/ImgUtils';
import { useDropzone } from 'react-dropzone';
import styles from './styles/redeem';
import { StandardCard } from '../shared/containers/Cards';
import CircularCheckbox from '../shared/CircularCheckbox';
import { adjustColor, s3, uploadFile } from '../../utils/utils';
import { TableCell, TableRow } from '../shared/TableCommon';
import { Link } from 'react-router-dom';
import { Add, ChevronRight, Remove } from '@mui/icons-material';
import StylessButton from '../shared/buttons';

const StatusChip = withStyles({
  root: ({ status }) => ({
    padding: '9px 13px',
    borderRadius: 14,
    textAlign: 'center',
    color: status?.color || '#8d9299',
    backgroundColor: status?.backgroundColor || '#ebeef2'
  }),
  label: {
    fontSize: '12px !important',
    padding: 0,
    fontFamily: 'Gilroy-SemiBold'
  }
})(Chip);

const defaultText = ({ fontColor, fontFamily }) => ({
  fontFamily: fontFamily || 'Gilroy',
  color: fontColor || '#0b1829',
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
    background: ({ backgroundColor }) => backgroundColor || 'transparent',
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
  headerText: props => ({ ...defaultText(props), fontSize: 64, marginBottom: 24, fontWeight: 700,
    ...standardMediaQueries(theme, 72, 24) }),
  subtitle: props => ({ ...defaultText(props), fontSize: 20, fontWeight: 400, marginBottom: 24,
    ...standardMediaQueries(theme, 20, 24) }),
  advisory: props => ({ ...defaultText(props), fontSize: 14, marginTop: 32, marginBottom: 56,
    ...standardMediaQueries(theme, 14, 56) }),
  formTitle: props => ({ ...defaultText(props), fontSize: 36, marginTop: 24, marginBottom: 32,
    ...standardMediaQueries(theme, 28, 32) }),
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
    '&:disabled': ({ accentColor }) => ({ backgroundColor: `${adjustColor(accentColor || '#3577d4',-0.9 )} !important` }),
    backgroundColor: ({ accentColor }) => (`${accentColor || '#3577d4'} !important`),
    color: '#ffffff',
    borderRadius: '32px !important',
    '& span': {
      color: '#ffffff',
      fontWeight: 700
    },
    [theme.breakpoints.down(1025)]: {
      padding: '16px 42px !important',
      minWidth: '192px !important',
      //  height: '48px !important'
    },
    [theme.breakpoints.down(913)]: {
      padding: '16px 16px !important',
      minWidth: '164px !important',
      height: '64px !important'
    },
    [theme.breakpoints.down(541)]: {
      padding: '12px 12px !important',
      minWidth: '142px !important',
      height: '56px !important'
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
    textAlign: 'left',
    zIndex: 2,
    [theme.breakpoints.down(913)]: {
      padding: '24px 32px'
    },
    [theme.breakpoints.down(541)]: {
      padding: '24px 16px'
    },
    [theme.breakpoints.down(391)]: {
      padding: '24px 8px'
    }
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

const useStyles = makeStyles(styles);

const pageStatusStyles = {
  published: { color: '#3577d4 !important', backgroundColor: '#ebf1fb !important' },
  draft: { color: '#8d9299 !important', backgroundColor: '#ebeef2 !important' }
};

const getStatus = active => active ? 'published' : 'drafted';
const prepare = text => text.toLowerCase().replaceAll(' ', '-');
const getPageLink = ({ urlSlug }) => urlSlug ? `/swag-drop/landings/${urlSlug}` : '/';;

const RedeemPageCard = ({ page, selected }) => {
const classes = useStyles(selected);

  return (
    <StandardCard className={classes.card} data-testid={`card-${page.id}`}>
      <Grid container>
        <Grid item xs={12} container alignItems="center" className={classes.cardHeader}>
          <Grid item xs>
            <StatusChip label={getStatus(page.isActive)} status={pageStatusStyles[getStatus(page.isActive)]} />
          </Grid>
          <Grid item>
            <a href={getPageLink(page)} target="_blank" className={classes.link} rel="noreferrer">
              Visit
            </a>
          </Grid>
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          <Grid className={classes.imageContainer}>
            <Img src={page.clientImage} alt={page.projectName} className={classes.designImage} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems="center" style={{ marginTop: 24 }}>
            <Grid item xs={12}>
              <p className={classes.designName} style={{ marginTop: 0 }}>
                {page.projectName}
              </p>
            </Grid>
          </Grid>
          <Grid container alignItems="center">
            <Grid item xs>
              <p className={classes.designPrice}>{page.allowInternationalShipping ? 'International' : 'US Only'}</p>
            </Grid>
            <Grid item>
              <Tooltip title="Last date modified" width={190} color="blue">
                <p className={classes.designType} style={{ opacity: 0.5 }}>
                  <span>{page.lastModified}</span>
                </p>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-start">
          <Grid item xs>
            <Button variant="text" component={Link} to={`/swag-drop/redeem-history/${page.urlSlug}`} className={classes.link} style={{ fontFamily: 'Gilroy', paddingLeft: 0, paddingRight: 0 }}>
              View SwagDrop Details
              <ChevronRight className={classes.linkIcon} />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </StandardCard>
  );
};

const ProductCard = ({ product, selected, onSelect, onSetQuanity, current }) => {
  const classes = useStyles({ selected });

  return (
    <StandardCard className={classes.productCard} data-testid={`card-${product.id}`}>
      <CircularCheckbox
        className={classes.productCheckbox}
        checked={selected}
        onChange={onSelect}
        inputProps={{ 'aria-label': product.name, 'aria-checked': selected }}
      />
      <Grid container style={{ padding: '0px 8px' }}>
        <Grid item xs={12} container justifyContent="center">
          <Grid className={classes.productImageContainer}>
            <Img src={product.image} alt={product.name} className={classes.productImage} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <p className={classes.designName} style={{ textAlign: 'center' }}>
            {product.name}
          </p>
        </Grid>
        <Grid container alignItems="center">
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              {product.stock
                .filter(stock => stock.quantity > 0)
                .map(stock => (
                  <Grid key={stock.size.id} item>
                    <p
                      style={{
                        fontSize: 10,
                        fontFamily: 'Gilroy-Medium',
                        textAlign: 'left',
                        fontWeight: stock.quantity ? 'bold' : 'lighter'
                      }}
                    >{`${stock.size.name}: ${stock.quantity}`}</p>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className={classes.quantitySection}>
        <Grid container alignItems="center">
          <Grid item style={{ height: 16 }}>
            <StylessButton
              disabled={!current?.quantity}
              style={{ height: 16 }}
              onClick={() => onSetQuanity(current, current.quantity - 1)}
            >
              <Remove className={classes.linkIcon} style={{ margin: 0 }} />
            </StylessButton>
          </Grid>
          <Grid item xs>
            <p style={{ textAlign: 'center' }}>{current?.quantity || 0}</p>
          </Grid>
          <Grid itemstyle={{ height: 16 }}>
            <StylessButton
              disabled={!current}
              style={{ height: 16 }}
              onClick={() => onSetQuanity(current, (current?.quantity || 0) + 1)}
            >
              <Add className={classes.linkIcon} style={{ margin: 0 }} />
            </StylessButton>
          </Grid>
        </Grid>
      </Grid>
    </StandardCard>
  );
};


const RedemptionRow = ({ redemption, showDetails }) => {
  const classes = useStyles();
  // const [cellColor, cellValue] = showGroupNames
  //   ? ['#0b1829', contact.groups?.map(g => g.name).join(', ')]
  //   : ['#787b80', contact.created_at && dayjs(contact.created_at).format('MM/DD/YY')];

  return (
    <TableRow hover>
      <TableCell className={classes.headerCell}  scope="row" width="40%" style={{ fontFamily: 'Gilroy-Medium' }}>
        {`${redemption.firstName || ''} ${redemption.lastName}`.trim()}
      </TableCell>
      <TableCell className={classes.headerCell}>{redemption.emailAddress}</TableCell>
      <TableCell className={classes.headerCell}>{`${redemption.addressLine1}, ${redemption.city}, ${redemption.state}, ${redemption.zipCode}`}</TableCell>
      {/* <TableCell>
        <Button variant="text" onClick={() => showDetails(redemption)} className={classes.link}>
          View Details
        </Button>
      </TableCell> */}
    </TableRow>
  );
};

const TableEmptyState = ({ text, subText}) => {
  const classes = useStyles();
  return (
    <Grid container direction="column" justifyContent="center" alignItems="center" className={classes.emptyContainer}>
      <Img src="/images/public/magnifier-180x180.png" className={classes.emptyImg} alt="No recipients found" />
      <span className={classes.emptytitle}>{text || 'No associated shipment found'}</span>
      <span className={classes.emptySubtitle}>{subText || 'Remove filters to see all recipients'}</span>
    </Grid>
  );
};

const useModalStyles = makeStyles({
  text: {
    fontFamily: 'Gilroy-SemiBold',
    marginTop: 56,
    marginBottom: 24,
    textAlign: 'center',
    color: '#0b1829',
    fontSize: 24
  },
  subtitle: {
    fontFamily: 'Gilroy',
    color: '#0b1829',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 56
  },
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'transparent',
    padding: 32
  },
  modalContent: {
    position: 'relative',
    padding: '32px 45px 36px 45px',
    borderRadius: 32,
    width: '520px !important',
    backgroundColor: '#fafafa',
    outline: 'none',
    border: 'transparent'
  }
});

const RedeemPageDeleteModal = ({ open, onClose, onDelete }) => {
  const classes = useModalStyles();

  return (
    <Modal title="Cancel Order" open={open} onClose={onClose} className={classes.modal}>
      <Grid container direction="column" alignItems="center" className={classes.modalContent}>
        <Grid item>
          <p className={classes.text}>Are you sure you want to delete this SwagDrop?</p>
          <p className={classes.subtitle}>This action will remove also the associated landing page.</p>
        </Grid>
        <Grid item>
          <Button size="small" variant="alert" onClick={onDelete} style={{ width: 256 }}>
            Delete SwagDrop
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

const SimpleTooltip = withStyles(() => ({
  tooltip: {
    padding: 0,
    pointerEvents: 'all',
    boxShadow: 'none',
    margin: '0px 0px 2px 0px'
  }
}))(Tooltip);

const ColorInput = ({ value, onChange, className }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker(prev => !prev);
  };

  const handleClose = () => setDisplayColorPicker(false);

  return (
    <SimpleTooltip
      placement="top-start"
      open={displayColorPicker}
      title={
        <ClickAwayListener onClickAway={handleClose} disableReactTree>
          <div>
            <ChromePicker color={value}  onChange={color => onChange(color.hex)}/>
          </div>
        </ClickAwayListener>
      }
    >
      <TextField
        size="small"
        value={value}
        onChange={({ target }) => onChange(target.value)}
        onClick={handleClick}
        className={className}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <div style={{ height: 16, width: 16, borderRadius: 8, border: '1px solid #E5E7E8', background: value }} />
            </InputAdornment>
          )
        }}
      />
    </SimpleTooltip>
  );
};

const FileUploadZone = ({ handleFileUpload, children, disabled, renderComponent }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: 'image/*, application/pdf, application/illustrator, application/postscript'
  });
  return (
    <Grid container {...getRootProps()} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <input {...getInputProps()} disabled={disabled} />
      {renderComponent ? renderComponent({ isDragActive }) : children}
    </Grid>
  );
};

const prepareArtworkOnUploadIO = async artwork => {
  const uploadIOData = await uploadFile(artwork);
  return { name: uploadIOData.fileId, url: uploadIOData.fileUrl };
}
const prepareArtworksOnS3 = async artwork => {
  const s3Data = await s3
    .upload({
      Key: `${Date.now()}-${artwork.name.replaceAll(' ', '-').replaceAll('_', '-')}`,
      Body: artwork,
      ContentType: artwork.type
    })
    .promise();
  return { name: artwork.name, url: s3Data.Location };
};

export {
  RedeemPageCard,
  ProductCard,
  getPageLink,
  prepare,
  PostMessage,
  prepareArtworksOnS3,
  prepareArtworkOnUploadIO,
  FileUploadZone,
  RedemptionRow,
  TableEmptyState,
  RedeemPageDeleteModal,
  ColorInput,
  getStatus,
  useTempletesStyles
};

