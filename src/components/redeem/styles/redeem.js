import { ellipsisStyles, scrollBar } from '../../shared/styles/commonStyles';
import { changeColorLightness } from '../../shared/styles/utils';

const styles = theme => ({
  container: {
    minHeight: '100vh',
    position: 'relative',
    background: ({ backgroundColor }) => backgroundColor
  },
  title: {
    fontSize: 40,
    lineHeight: 1
  },
  goBack: {
   display: 'flex'
  },
  card: {
    padding: '23px 27px',
    border: '1px solid #ebeef2',
    '&:hover': {
      border: '1px solid #3577d4'
    }
  },
  cardsContainer: {
    gridTemplateColumns: 'repeat(auto-fill, 276px)',
    transition: 'all 1s',
    marginTop: 0
  },
  headerCell: {
    padding: '0px !important'
  },
  imageContainer: {
    width: 220,
    height: 220
  },
  designImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  cardHeader: {
    paddingBottom: 26
  },
  productCard: {
    padding: '16px 6px',
    border: ({ selected }) => (selected ? '2px solid #3577d4' : '1px solid #ebeef2'),
    '&:hover': {
      border: '1px solid #3577d4'
    }
  },
  productCardsContainer: {
    gridTemplateColumns: 'repeat(auto-fill, 132px)',
    transition: 'all 1s',
    marginTop: 0
  },
  productImageContainer: {
    width: 100,
    height: 100
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  productCardHeader: {
    paddingBottom: 8
  },
  designPrice: {
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 1,
    fontSize: 14,
    height: 16,
    color: '#0b1829',
    '& span': {
      color: '#787b80'
    }
  },
  designPriceInfo: {
    marginTop: 5,
    marginBottom: 14,
    marginLeft: 6,
    height: 15
  },
  priceInfo: {
    fontFamily: 'Gilroy-Semibold',
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'center',
    color: '#0b1829'
  },

  link: {
    alignItems: 'center',
    color: '#3577d4',
    display: 'inline-flex',
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 14,
    padding: '3px 8px',
    paddingLeft: 0,
    width: 'fit-content',
    letterSpacing: 'normal',
    height: 'auto',
    '&:hover': { color: changeColorLightness('#3577d4') }
  },
  linkIcon: {
    cursor: 'pointer',
    fontSize: 16,
    marginLeft: 6
  },
  designName: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 16,
    color: '#0b1829',
    marginTop: 16,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  cardName: {
    height: 26,
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 16,
    lineHeight: 1.63,
    letterSpacing: 'normal',
    color: '#0b1829',
    ...ellipsisStyles
  },
  searchInput: {
    minWidth: 244,
    '& .MuiInputAdornment-positionStart': {
      paddingLeft: 14,
      paddingRight: 0
    },
    '& input': {
      background: 'transparent',
      fontSize: 12,
      color: '#787b80',
      paddingLeft: 4
    }
  },
  searchField: {
    height: 56,
    minWidth: 276
  },
  stepContainer: {
    padding: '6px 0px',
    maxHeight: 'calc(100vh - 292px)',
    overflowY: 'auto',
    ...scrollBar
  },
  swipeableViews: {
    height: '100%',
    width: '100%',
    flex: 1,
    '& .react-swipeable-view-container': {
      height: '100%'
    }
  },
  wizardFooter: {
    padding: '32px 0px'
  },
  stepTitle: {
    fontSize: 16,
    lineHeight: 1
  },
  // inputTextMultiline: {
  //   height: '42px !important',
  //   padding: '8px 24px !important'
  // },
  inputText:  {
    fontSize: 16,
    '& input': {
      padding: '12px !important'
    }
  },
  exportButtom: {
    padding: '0px 12px',
    fontFamily: 'Gilroy',
    cursor: 'pointer',
    color: '3577d4',
    '&:disabled': {
      color: 'ebeef2'
    }
  },
  dataTemplate: {
    marginRight: 16,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    cursor: 'pointer',
    border: ({ selected }) => `1px solid #${selected ? '3577d4' : 'ebeef2'}`,
    '&:hover': {
      boxShadow: '0 32px 85px 0 rgba(12, 23, 18, 0.05)'
    }
  },
  emptytitle: {
    fontFamily: 'Gilroy',
    fontSize: 16,
    lineHeight: 1.5,
    textAlign: 'center',
    color: '#0b1829'
  },
  emptySubtitle: {
    fontFamily: 'Gilroy',
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'center',
    color: '#0b1829'
  },
  dataTemplateCustom: {
    marginRight: 16,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    border: ({ selected }) => `1px solid #${selected ? '3577d4' : 'ebeef2'}`
  },
  formControl: {
    marginTop: 16,
    marginLeft: 32,
    fontSize: 16
  },
  previousIcon: {
    marginRight: 8
  },
  allCheckbox: {
    paddingLeft: 0,
    width: 24,
    height: 4,
    color: '#ced1d6',
    '& svg': {
      width: 24,
      height: 24
    },
    '&.MuiCheckbox-colorSecondary.Mui-checked': {
      color: '#3577d4'
    }
  },
  separateProofButtonsContainer: {
    marginTop: 16,
    paddingTop: 10,
    borderTop: '1px solid  #E5E7E8'
  },
  statusText: {
    color: '#4A4F54',
    fontFamily: 'Gilroy',
    fontWeight: 400,
    fontSize: 14,
    textAlign: 'left',
    marginTop: 8
  },
  packTitle: {
    marginTop: 24,
    color: '#131415',
    fontFamily: 'Gilroy',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: 20
  },
  proofImg: {
    width: 256,
    height: 256,
    objectFit: 'contain',
    textAlign: 'center',
    borderRadius: 15,
    [theme.breakpoints.between('md', 'lg')]: { width: 200, height: 200 },
    [theme.breakpoints.down('sm')]: { width: 256, height: 256 },
    [theme.breakpoints.down('xs')]: { width: 200, height: 200 }
  },
  tableContainer: {
    border: 'solid 1px #f0f2f5',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: '100%',
    overflow: 'hidden',
    flex: 1,
    minHeight: 44
  },
  goBackIcon: {
    cursor: 'pointer',
    fontSize: 16,
    height: 16,
    marginRight: 10
  }
});
export default styles;
