/** @type {{
  className: string,
  role: string,
  style: {
    cursor: string,
    position: string,
    zIndex: number
  }
}} */
export const makeInteractive = {
  className: 'interactive',
  role: 'button',
  style: { 
    cursor: 'none',  // Hide default cursor
    position: 'relative',
    zIndex: 2
  }
}; 