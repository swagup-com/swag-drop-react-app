const handleImg = (img, width, height) => {
  if (!img) {
    return '';
  }
  const imgSize = `_${width}x${height}.png`;
  const regex = /.png$/gi;
  const newFile = `${img.replace(regex, imgSize)}`;
  return newFile;
};

export default handleImg;
