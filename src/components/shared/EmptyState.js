import React from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Button } from '@swagup-com/react-ds-components';
import { imageSrcSet } from '../../utils/utils';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    paddingTop: 20,
    paddingBottom: 42
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    textAlign: 'center',
    maxWidth: 600
  },
  title: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 24,
    letterSpacing: 'normal',
    lineHeight: 'normal'
  },
  imageText: {
    whiteSpace: 'pre-wrap',
    fontSize: 14,
    lineHeight: 1.57,
    color: '#787b80'
  },
  button: {
    marginTop: 36
  },
  image: {
    marginTop: ({ marginTop }) => (marginTop >= 0 ? marginTop : 56),
    width: 180,
    alignSelf: 'center'
  }
});

export default function EmptyState({ title, image, button, marginTop, maxWidth }) {
  const classes = useStyles({ marginTop });
  const srcSet = image.path.endsWith('.svg') ? undefined : imageSrcSet(image.path);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <img src={image.path} alt={image.alt} className={classes.image} srcSet={srcSet} />
        <p variant="h1" className={classes.title} style={{ maxWidth }}>
          {title}
        </p>
        {image.text && (
          <p variant="body1" className={classes.imageText}>
            {image.text}
          </p>
        )}
        {button && (
          <div className={classes.button}>
            <Button component={button.link ? Link : undefined} to={button.link} onClick={button.onClick}>
              {button.text}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
