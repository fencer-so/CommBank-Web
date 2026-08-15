import React from 'react'
import styled from 'styled-components'

type Props = {
  icon: string
  onClick: (e: React.MouseEvent) => void
}

export default function GoalIcon({ icon, onClick }: Props) {
  return (
    <TransparentButton onClick={onClick}>
      <Icon>{icon}</Icon>
    </TransparentButton>
  )
}

const TransparentButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  &:focus {
    outline: none;
  }
`

const Icon = styled.h1`
  font-size: 5.5rem;
  margin: 0;
  padding: 0;
  line-height: 1;
  cursor: pointer;
`