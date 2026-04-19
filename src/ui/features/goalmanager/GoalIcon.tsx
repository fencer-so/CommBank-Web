import React from 'react'
import styled from 'styled-components'

type Props = { 
  icon: string | null; 
  onClick: (event: React.MouseEvent) => void; 
}

export default function GoalIcon(props: Props) {
  return (
    <TransparentButton onClick={props.onClick}>
      <Icon>{props.icon}</Icon>
    </TransparentButton>
  )
}

// Styled Components
const Icon = styled.h1`
  font-size: 6rem;
  cursor: pointer;
  margin: 0;
`

const TransparentButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`
