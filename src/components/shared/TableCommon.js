/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { Fade, Menu } from '@mui/icons-material';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableRow from '@mui/material/TableRow';
import MuiCheckBox from '@mui/material/Checkbox';
import { withStyles } from '@mui/styles';

export const TableRow = withStyles({
  root: {
    '&, &$hover:hover': { backgroundColor: '#ffffff' },
    '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: '#f0f2f5' }
  },
  hover: {
    '&:hover, &.hovered': {
      boxShadow: '0 0 12px 2px rgba(0, 0, 0, 0.06)',
      transition: 'box-shadow 250ms',
      transform: 'scale(1)',
      '& td': { borderRight: 'none' }
    }
  }
})(MuiTableRow);

export const TableCell = withStyles({
  root: {
    borderBottom: 'solid 1px #f0f2f5',
    borderRight: 'solid 1px #f0f2f5',
    padding: 0,
    fontFamily: 'Gilroy-Regular',
    'tr &:first-of-type': {
      borderRight: 'none'
    },
    'tr &:last-of-type': {
      borderRight: 'none'
    },
    '& .divCell': {
      height: 41,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      '& .divContent': {
        minWidth: 0,
        fontWeight: 500,
        letterSpacing: 'normal',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }
    }
  },
  head: {
    '& .divCell': {
      padding: '12px 20px',
      '& .divContent': {
        fontFamily: 'Gilroy-Medium',
        fontSize: 10,
        lineHeight: 'normal',
        color: '#787b80',
        textTransform: 'capitalize'
      }
    },
    '&$paddingCheckbox .divCell': {
      padding: '0 0 0 20px'
    }
  },
  body: {
    color: '#0b1829',
    '& .divCell': {
      padding: '0 20px',
      '& .divContent': {
        fontSize: 14,
        lineHeight: 'normal'
      }
    }
  },
  paddingCheckbox: {
    width: 36,
    '& .divCell': {
      padding: '0 0 0 20px'
    }
  },
  stickyHeader: {
    background: '#ffffff'
  }
})(
  React.forwardRef(
    ({ children, ...props }, ref) => (
      <MuiTableCell ref={ref} {...props}>
        <div className="divCell">
          <div className="divContent">{children}</div>
        </div>
      </MuiTableCell>
    ),
    { displayName: 'TableCell' }
  )
);

export const CheckBox = withStyles({
  root: {
    padding: 0,
    color: '#ced1d6',
    '& .MuiSvgIcon-root': {
      width: 16,
      height: 16,
      fontSize: 16
    }
  }
})(MuiCheckBox);

export const FullnameWithHighlights = ({ name, highlight }) => {
  if (!highlight) return name;

  const regex = new RegExp(`(${highlight})`, 'gi');
  const namePieces = name.split(regex);

  return (
    <>
      {namePieces.map(piece => {
        if (piece.toLowerCase() !== highlight) {
          return <span style={{ color: '#787b80' }}>{piece}</span>;
        }

        return piece;
      })}
    </>
  );
};

export const MenuButton = ({
  children,
  open,
  onClick,
  onClose,
  onFocus,
  onBlur,
  ButtonComponent,
  disabled,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
    onClick(event);
  };

  return (
    <>
      <ButtonComponent open={open} onClick={handleClick} disabled={disabled} onFocus={onFocus} onBlur={onBlur} />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        getContentAnchorEl={null}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        TransitionComponent={Fade}
        {...props}
      >
        {children}
      </Menu>
    </>
  );
};

export const menuStyles = {
  menu: {
    boxShadow: '0 16px 32px 0 rgba(0, 0, 0, 0.05)',
    borderRadius: 15,
    width: 178,
    padding: '4px 20px'
  },
  menuItem: {
    minHeight: 'unset',
    padding: 0,
    fontFamily: 'Gilroy-SemiBold',
    fontSize: 14,
    fontWeight: 600,
    color: '#3577d4'
  }
};

export const hideableFilters = {
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  flex: 1,
  '&.hidden': {
    visibility: 'hidden',
    width: 0
  }
};
