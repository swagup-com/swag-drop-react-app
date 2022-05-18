import { ellipsisStyles } from '../../shared/styles/commonStyles';

export const sortByStyles = theme => ({
  filterValue: {
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 16,
    color: '#434d5c',
    lineHeight: '12px',
    marginLeft: 5
  },
  filterText: {
    ...ellipsisStyles,
    fontFamily: 'Gilroy-Regular',
    fontSize: 16,
    color: '#8d9299'
  },
  sortByContainer: {
    width: '100%',
    alignItems: ({ unaligned }) => (unaligned ? 'unset' : 'center')
  },
  sortBy: {
    backgroundColor: '#fff',
    textAlign: 'left',
    boxSizing: 'border-box',
    width: 260,
    paddingRight: 5,
    [theme.breakpoints.down('md')]: {
      width: 200
    }
  },
  item: {
    paddingLeft: 30
  },
  input: {
    background: 'transparent'
  },
  muiSelectMenu: {
    height: 0,
    display: 'flex',
    alignItems: 'center'
  },
  muiIconOutlined: {
    right: 18
  }
});

export const multiselectFilter = theme => ({
  menuButton: {
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    borderColor: '#D3DBE6',
    paddingRight: 20,
    borderWidth: 1,
    '&:hover': {
      borderColor: '#8D9299'
    },
    '&:focus': {
      borderColor: '#3577D4',
      borderWidth: 2
    },
    height: 57,
    width: 276,
    [theme.breakpoints.down('md')]: {
      width: '100%'
    },
    '& .MuiButton-label': {
      color: '#8d9299',
      fontSize: 16,
      fontFamily: 'Gilroy-Regular',
      fontWeight: 400,
      lineHeight: '32px',
      letterSpacing: '0.00938em',
      justifyContent: 'flex-start'
    },
    '& .MuiButton-endIcon': {
      marginLeft: 'auto'
    }
  },
  menu: {
    width: 278,
    [theme.breakpoints.down('md')]: {
      width: '45%'
    }
  },
  menuItem: {
    padding: '6px 25px'
  },
  buttonsSection: {
    padding: '0 25px',
    height: 60
  },
  button: {
    fontFamily: 'Gilroy-Medium',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 0.71
  },
  optionsText: {
    ...ellipsisStyles,
    fontFamily: 'Gilroy-SemiBold',
    color: '#434d5c',
    marginLeft: 5
  },
  checkbox: {
    '& svg': {
      fontSize: 14
    },
    color: '#ced1d6'
  },
  tooltip: {
    fontSize: 12,
    textAlign: 'center'
  }
});

export const searchFilledStyles = {
  root: {
    backgroundColor: 'transparent',
    paddingLeft: 0,
    '&:hover': {
      backgroundColor: 'transparent'
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent'
    }
  },
  input: {
    paddingTop: 0,
    paddingBottom: 0
  }
};

export const searchOutlinedStyles = {
  adornedEnd: { backgroundColor: '#fff' },
  adornedStart: { backgroundColor: '#fff' }
};
