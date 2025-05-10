import styled, { keyframes } from 'styled-components';

const spinAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const SyncIndicatorContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulseAnimation} 1.5s ease-in-out infinite;
`;

const SyncIcon = styled.svg`
  width: 14px;
  height: 14px;
  animation: ${spinAnimation} 1.2s linear infinite;
`;

const SyncIndicator = () => {
  return (
    <SyncIndicatorContainer>
      <SyncIcon viewBox="0 0 24 24" fill="none">
        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v2z" fill="#ffffff"/>
      </SyncIcon>
    </SyncIndicatorContainer>
  );
};

export default SyncIndicator;