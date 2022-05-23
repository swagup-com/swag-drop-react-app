
export function StylessButton({
    id,
    className,
    children,
    width = 'auto',
    height = 'auto',
    onClick,
    onMouseEnter,
    onMouseLeave,
    onLoad
  }) {
    return (
      <button
        type="button"
        id={id}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={className}
        onLoad={onLoad}
        style={{
          display: 'table',
          cursor: 'pointer',
          textAlign: 'center !important',
          border: 'none',
          width,
          height,
          backgroundColor: 'transparent',
          color: '#3577d4',
          textDecorationLine: 'none',
          outline: 0,
          padding: 0
        }}
      >
        <div
          style={{
            verticalAlign: 'middle',
            letterSpacing: 'normal',
            textAlign: 'center'
          }}
        >
          {children}
        </div>
      </button>
    );
  };

  export default StylessButton;