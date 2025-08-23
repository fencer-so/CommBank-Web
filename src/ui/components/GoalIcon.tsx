import React from 'react'
import styled from 'styled-components'
// Corrected the import path to be one level higher
import { TransparentButton } from './TransparentButton' 

type Props = {
  icon: string | null | undefined
  onClick: (event: React.MouseEvent) => void
}

const Icon = styled.h1`
  font-size: 5.5rem;
  cursor: pointer;
  margin: 0;
`

export default function GoalIcon(props: Props) {
  return (
    <TransparentButton onClick={props.onClick}>
      <Icon>{props.icon}</Icon>
    </TransparentButton>
  )
}