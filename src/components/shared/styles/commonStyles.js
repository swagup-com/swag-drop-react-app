const scrollBar = {
  overflowY: 'auto',
  overflowX: 'hidden',
  '&::-webkit-scrollbar': {
    backgroundColor: '#ebeef2',
    width: 4,
    borderRadius: 4
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#d3dbe5',
    width: 10,
    borderRadius: 10
  }
};

const scrollBarAutohide = {
  ...scrollBar,
  '&::-webkit-scrollbar': {
    ...scrollBar['&::-webkit-scrollbar'],
    backgroundColor: 'rbg(0,0,0,0)'
  },
  '&::-webkit-scrollbar-thumb': {
    ...scrollBar['&::-webkit-scrollbar-thumb'],
    backgroundColor: 'rbg(0,0,0,0)'
  },
  '&:hover::-webkit-scrollbar': { backgroundColor: '#ebeef2' },
  '&:hover::-webkit-scrollbar-thumb': { backgroundColor: '#d3dbe5' }
};

const ellipsisStyles = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const greyRoundBorder = {
  borderRadius: 10,
  border: 'solid 1px #f0f2f5'
};

export { ellipsisStyles, greyRoundBorder, scrollBar, scrollBarAutohide };
