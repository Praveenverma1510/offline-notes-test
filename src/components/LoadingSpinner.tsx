import styled, { keyframes } from 'styled-components';

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
    border-color: #6366f1;
  }
  50% {
    border-color: #ec4899;
  }
  100% {
    transform: rotate(360deg);
    border-color: #6366f1;
  }
`;

export const SpinnerContainer = styled.div`
  display: inline-block;
  width: 36px;
  height: 36px;
  border: 4px solid transparent;
  border-top-color: #6366f1;
  border-right-color: #ec4899;
  border-radius: 50%;
  animation: ${spinAnimation} 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
  position: relative;
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.3);
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 24px;
    height: 24px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    backdrop-filter: blur(2px);
  }
`;

export const LoadingSpinner = () => {
  return <SpinnerContainer />;
};