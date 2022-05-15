const styles = () => ({
  loading: {
    position: ({ absolute }) => (absolute ? 'absolute' : 'fixed'),
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: '3',
    cursor: 'pointer',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  }
});

export default styles;
