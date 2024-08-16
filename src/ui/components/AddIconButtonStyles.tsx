import styled from 'styled-components';

export const AddIconButtonContainer = styled.div<{ hasIcon: boolean }>`
  display: ${(props) => (props.hasIcon ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
`;

export const AddIconButtonText = styled.span`
  margin-left: 8px;
  font-size: 16px;
  color: #333;
`;