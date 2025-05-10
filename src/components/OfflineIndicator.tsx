import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Indicator = styled.div<{ isOnline: boolean }>`
  position: fixed;
  right: 7%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 50px;
  background: ${props => props.isOnline 
    ? 'rgba(16, 185, 129, 0.2)' 
    : 'rgba(239, 68, 68, 0.2)'};
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.isOnline 
    ? 'rgba(16, 185, 129, 0.3)' 
    : 'rgba(239, 68, 68, 0.3)'};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: ${slideIn} 0.3s ease-out forwards;
  z-index: 100;
  top: 6px;
`;

const StatusText = styled.span<{ isOnline: boolean }>`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.isOnline ? '#10b981' : '#ef4444'};
`;

const StatusIcon = styled.div<{ isOnline: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.isOnline ? '#10b981' : '#ef4444'};
  box-shadow: 0 0 10px ${props => props.isOnline ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'};
`;

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return (
    <Indicator isOnline={isOnline}>
      <StatusIcon isOnline={isOnline} />
      <StatusText isOnline={isOnline}>
        {isOnline ? 'You are online' : 'You are offline'}
      </StatusText>
    </Indicator>
  );
};

export default OfflineIndicator;