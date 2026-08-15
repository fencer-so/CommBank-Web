import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmile } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

type Props = {
  onClick: (e: React.MouseEvent) => void
}

export default function AddIconButton({ onClick }: Props) {
  return (
    <TransparentButton onClick={onClick}>
      <FontAwesomeIcon icon={faSmile} size="2x" />
      <AddIconButtonText>Add icon</AddIconButtonText>
    </TransparentButton>
  )
}

// Use TransparentButton as per spec – define it here if missing
const TransparentButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  &:focus {
    outline: none;
  }
`

const AddIconButtonText = styled.span`
  font-size: 1.2rem;
  font-weight: 500;
`