import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import handleImg from './handleImgHelper';
import { makeStyles } from '@mui/styles';

const ImgWithHandler = ({ src, alt, width, height, ...props }) => (
  <Img src={handleImg(src, width, height)} alt={alt} width={width} height={height} {...props} />
);

const useStyles = makeStyles({
  root: {
    width: ({ width }) => width,
    height: ({ height }) => height
  }
});

const Img = ({ src, alt, width, height, className, style, fallbackSrc = '/images/public/nopic.jpg', ...props }) => {
  const classes = useStyles({ width, height });
  const [localSrc, setLocalSrc] = useState(src || fallbackSrc);

  useEffect(() => setLocalSrc(src || fallbackSrc), [src, fallbackSrc]);

  return (
    <img
      role="presentation"
      src={localSrc}
      alt={alt}
      style={{ objectFit: 'cover', ...style }}
      className={clsx(classes.root, className)}
      onError={() => setLocalSrc(fallbackSrc)}
      {...props}
    />
  );
};

export { Img, ImgWithHandler };
