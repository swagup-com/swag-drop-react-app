import React from 'react';
import { Tooltip as MuiTooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';

const styles = () => ({
  tooltip: ({ placement, color, width, fontSize, fontColor, backgroundColor }) => ({
    backgroundColor: backgroundColor || (color === 'purple' ? '#9846dd' : '#3577d4'),
    color: fontColor || '#ffffff',
    textAlign: placement === 'right' ? 'left' : 'center',
    fontFamily: 'Gilroy',
    fontSize: fontSize || 16,
    width,
    borderRadius: 10
  }),
  tipArrow: ({ color, backgroundColor }) => ({ color: backgroundColor || (color === 'purple' ? '#9846dd' : '#3577d4') })
});

const useStyles = makeStyles(styles);

const Tooltip = ({
  placement = 'top',
  color = 'purple',
  fontColor,
  backgroundColor,
  arrow = true,
  width = 320,
  fontSize,
  children,
  ...props
}) => {
  const { tooltip, tipArrow } = useStyles({ placement, color, backgroundColor, width, fontSize, fontColor });

  return (
    <MuiTooltip placement={placement} arrow={arrow} classes={{ tooltip, arrow: tipArrow }} {...props}>
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
