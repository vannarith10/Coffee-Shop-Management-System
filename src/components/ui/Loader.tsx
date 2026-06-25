import React from 'react';
import styled from 'styled-components';

interface LoaderProps {
  size?: number; // optional, defaults to 48
}

const Loader: React.FC<LoaderProps> = ({size = 48}) => {
    
  return (
    <StyledWrapper>
      <div className="loader" style={{ width: size, height: size }}/>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    border-radius: 50%;
    box-sizing: border-box;
    border-top: 8px solid #fff;
    border-left: 8px solid #fff;
    border-right: 8px solid #ff00;
    animation: loader .7s infinite linear;
  }

  @keyframes loader {
    to {
      transform: rotate(360deg);
    }
  }`;

export default Loader;
