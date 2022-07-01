import React from 'react';

const style = {
  backgroundColor: '#F8F8F8',
  textAlign: 'center',
  padding: '10px',
  marginTop: '20px',
  top: '10px',
  left: '0',
  bottom: '0',
  width: '100%',
};

export default function Footer() {
  return (
    <footer style={style}>
      <p>
        Author: Shaw Lu <br></br>
        <a href='mailto:shawlu95@gmail.com'>shawlu95@gmail.com</a>
      </p>
    </footer>
  );
}
