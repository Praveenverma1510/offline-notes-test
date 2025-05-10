import styled, { keyframes } from 'styled-components';

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
    stroke-dashoffset: 60;
  }
  50% {
    stroke-dashoffset: 0;
  }
  100% {
    transform: rotate(360deg);
    stroke-dashoffset: -60;
  }
`;

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
`;

const SyncIndicatorContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
  animation: ${pulseAnimation} 1.5s ease-in-out infinite;
`;

const SyncCircle = styled.svg`
  width: 20px;
  height: 20px;
  transform-origin: center;
  
  circle {
    fill: none;
    stroke: white;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 60;
    animation: ${spinAnimation} 1.5s cubic-bezier(0.4, 0.1, 0.4, 1) infinite;
  }
`;

const SyncIndicator = () => {
  return (
    <SyncIndicatorContainer>
      <SyncCircle viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
      </SyncCircle>
    </SyncIndicatorContainer>
  );
};

export default SyncIndicator;