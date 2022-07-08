import React from 'react';

const style = {
  backgroundColor: '#F8F8F8',
  textAlign: 'center',
  padding: '10px',
  marginTop: '3rem',
  top: '10px',
  left: '0',
  bottom: '0',
  width: '100%',
  display: 'flex',
  height: '5rem',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

export default function Footer() {
  return (
    <footer style={style}>
      <p>
        &copy; {new Date().getFullYear()}
        <span> Shaw Lu</span>
      </p>
    </footer>
  );
}
