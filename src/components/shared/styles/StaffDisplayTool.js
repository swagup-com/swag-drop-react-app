import { scrollBar, ellipsisStyles } from './commonStyles';

const commonFontStyle = {
  fontFamily: 'Roboto',
  fontSize: '12px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal'
};

const styles = theme => ({
  staffCard: {
    border: '1px solid #d4d9e2',
    borderRadius: 4,
    padding: 0
  },
  imgContainer: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    height: 271,
    paddingTop: 15
  },
  multipleProductsStatusContainer: {
    position: 'absolute',
    width: 140,
    marginLeft: -70,
    left: '50%',
    bottom: 17
  },
  multipleProductsStatus: {
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#434c5f',
    backgroundColor: '#ecedef !important',
    '& > img': { width: 16, height: 16, marginRight: 4 },
    '& > .MuiTypography-root': {
      fontSize: 10,
      fontWeight: 600,
      lineHeight: 'normal',
      textTransform: 'uppercase'
    }
  },
  packTitle: {
    ...commonFontStyle,
    fontWeight: 'bold',
    color: '#434c5f',
    marginBottom: 16
  },
  packNormaltext: {
    ...commonFontStyle,
    color: '#434c5f',
    marginBottom: 0,
    opacity: '0.9'
  },
  packEmployeeName: {
    ...commonFontStyle,
    color: '#0f2440',
    fontWeight: 'bold',
    marginBottom: 8
  },
  packDateText: {
    ...commonFontStyle,
    color: '#434c5f',
    marginBottom: 0,
    opacity: '0.9',
    textAlign: 'right',
    [theme.breakpoints.down('sm')]: { textAlign: 'center' }
  },
  red: {
    color: '#b00020'
  },
  packDeletetext: {
    ...commonFontStyle,
    textAlign: 'right',
    color: '#f44336 !important',
    marginTop: 'auto'
  },
  closeButton: {
    marginTop: 1,
    marginRight: 1
  },
  modalTitle: {
    ...commonFontStyle,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -10,
    color: '#434c5f'
  },
  modalTextContainer: {
    textAlign: 'center',
    padding: '20px 100px',
    [theme.breakpoints.down('sm')]: { padding: '20px 0' }
  },
  modalText: {
    ...commonFontStyle,
    fontSize: '24px',
    textAlign: 'center',
    color: '#434c5f',
    paddingBottom: 10
  },
  modalContent: {
    textAlign: 'center',
    borderRadius: 10
  },
  approveButtonContainer: {
    textAlign: 'center',
    padding: '20px 85px',
    [theme.breakpoints.down('sm')]: { padding: '20px 0' }
  },
  paper: {
    position: 'absolute',
    left: '50%',
    webkitTransform: 'translateX(-50%)',
    transform: 'translateX(-50%)',
    top: 180,
    width: 590,
    height: 328,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(6),
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      top: 120,
      width: 320
    }
  },
  packButtonsContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center'
  },
  packViewDetails: {
    padding: '19px 21px !important',
    border: '1px solid #3577d4 !important',
    borderRadius: '32px',
    '&  *': {
      fontFamily: 'Gilroy-Bold !important',
      color: '#3577d4',
      lineHeight: 0.71
    },
    [theme.breakpoints.between('md', 'lg')]: { padding: '19px 15px !important' }
  },
  mb0: { marginBottom: '0 !important' },
  modalViewDetails: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'transparent',
    padding: 32
  },
  modalDetailsContent: {
    ...scrollBar,
    marginTop: 45,
    maxHeight: 'calc(100vh - 240px)'
  },
  modalViewDetailsContainer: {
    position: 'relative',
    padding: '32px 45px 36px 45px',
    minWidth: 320,
    maxWidth: 1176,
    width: '100%',
    backgroundColor: '#fafafa',
    outline: 'none',
    border: 'transparent',
    [theme.breakpoints.down('md')]: { padding: '60px 40px' },
    [theme.breakpoints.down('sm')]: { padding: '60px 20px' },
    [theme.breakpoints.down('xs')]: { padding: '35px 10px' }
  },
  iconCloseContainer: {
    position: 'absolute',
    top: 35,
    right: 35,
    color: '#434d5c !important'
  },
  modalViewDetailsTitle: {
    opacity: '0.9',
    fontFamily: 'Gilroy-Bold',
    fontSize: '24px',
    fontWeight: 500,
    color: '#0f2440',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 32,
    marginRight: 20,
    [theme.breakpoints.down('xs')]: { paddingLeft: 16, fontSize: 16 }
  },
  modalViewDetailsCreated: {
    marginTop: 6,
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: '#8d9299',
    paddingLeft: 32,
    [theme.breakpoints.down('xs')]: { paddingLeft: 16, fontSize: 10 }
  },
  modalViewDetailsTracking: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 12,
    color: '#8d9299',
    [theme.breakpoints.down('xs')]: { marginTop: 40 }
  },
  modalViewDetailsTrackingNumber: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 24,
    color: '#3577d4',
    opacity: 0.9,
    lineHeight: 'normal'
  },
  modalViewDetailsRecipient: {
    minHeight: 510,
    padding: '28px 32px',
    maxWidth: 414,
    marginRight: 32,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    [theme.breakpoints.down('1030')]: { marginRight: 0 },
    [theme.breakpoints.down('sm')]: { padding: '28px 16px', marginRight: 0 }
  },
  modalViewDetailsShippingNotes: {
    maxHeight: 100,
    overflowY: 'auto',
    textAlign: 'justify'
  },
  modalViewDetailsRecipientText: {
    marginBottom: 28,
    '& > p': { margin: 0, padding: 0 }
  },
  modalViewDetailsRecipientTitle: {
    marginBottom: 8,
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    lineHeight: 1.43,
    color: '#8d9299'
  },
  modalViewDetailsColorTitle: {
    color: '#8d9299'
  },
  modalViewDetailsRecipientContent: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 14,
    lineHeight: 1.43,
    color: '#434c5f'
  },
  modalViewDetailsRecipientDeliveryMethod: {
    marginTop: 5,
    padding: '5px !important',
    border: '1px solid #8d9299 !important',
    borderRadius: 5,
    lineHeight: 1,
    color: '#0f2440',
    fontFamily: 'Gilroy-SemiBold !important',
    fontSize: 14,
    width: 'min-content'
  },
  modalViewDetailsRecipientTotal: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 20,
    lineHeight: 1,
    color: '#0f2440',
    textAlign: 'right'
  },
  modalViewDetailsRecipientSeparator: {
    margin: '0 0 28px 0',
    border: '1px solid #ebeef2'
  },
  modalViewDetailsItems: {
    minHeight: 510,
    paddingLeft: 0,
    [theme.breakpoints.down('sm')]: { paddingLeft: 16 },
    [theme.breakpoints.down('xs')]: { paddingLeft: 0 }
  },
  modalViewDetailsItemsInner: {
    padding: '28px 32px',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: '100%',
    flexWrap: 'nowrap'
  },
  modalViewDetailsItemsContainer: {
    ...scrollBar,
    marginTop: 7
  },
  modalViewDetailsItemsBoldText: {
    ...ellipsisStyles,
    fontFamily: 'Gilroy',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#434c5f',
    marginBottom: 6,
    marginTop: 27
  },
  modalViewDetailsItemsNormalText: {
    fontFamily: 'Gilroy-Medium',
    fontWeight: 500,
    fontSize: 12,
    color: '#0f2440',
    lineHeight: 'normal',
    marginBottom: 6
  },
  itemColumnText: {
    paddingLeft: 32,
    [theme.breakpoints.down('xs')]: { paddingLeft: 0 }
  },
  ItemImage: {
    height: '100% !important',
    width: '100% !important',
    borderRadius: 10
  },
  ItemImageContainer: {
    width: 124,
    height: 124,
    borderRadius: 10,
    border: 'solid 1px #ebeef2',
    backgroundColor: '#ffffff'
  },
  thasIsAllFolksImage: {
    width: 138.6,
    height: 105,
    objectFit: 'contain',
    marginTop: 78,
    marginBottom: 27
  },
  thasIsAllFolksText: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 24,
    fontWeight: 600,
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#8d9299',
    textAlign: 'center'
  }
});

export default styles;
