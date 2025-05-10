import styled, { keyframes } from 'styled-components';

const pulseAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const SpinnerContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 40px;
  height: 40px;

  div {
    position: absolute;
    width: 34px;
    height: 34px;
    border: 8px solid;
    border-radius: 50%;
    animation: ${rotateAnimation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #3b82f6 transparent transparent transparent;
    
    &:nth-child(1) {
      animation-delay: -0.45s;
      border-width: 8px;
      border-image: linear-gradient(135deg, #3b82f6, #ec4899) 1;
    }
    
    &:nth-child(2) {
      animation-delay: -0.3s;
      border-width: 6px;
      border-image: linear-gradient(135deg, #10b981, #3b82f6) 1;
    }
    
    &:nth-child(3) {
      animation-delay: -0.15s;
      border-width: 4px;
      border-image: linear-gradient(135deg, #f59e0b, #10b981) 1;
    }
  }

  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    background: #3b82f6;
    border-radius: 50%;
    animation: ${pulseAnimation} 1.5s ease-in-out infinite;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
`;

export const LoadingSpinner = () => {
  return (
    <SpinnerContainer>
      <div></div>
      <div></div>
      <div></div>
    </SpinnerContainer>
  );
};