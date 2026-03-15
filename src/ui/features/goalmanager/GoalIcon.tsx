import React from 'react'
import styled from 'styled-components'

// Agar aapke project me TransparentButton pehle se hai toh usko import kar lena, 
// warna yeh CSS kaam kar jayegi:
const TransparentButton = styled.button`
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  display: flex;
  align-items: center;
`

const Icon = styled.h1`
  font-size: 6rem;
  cursor: pointer;
  margin: 0;
`

type Props = {
  icon?: string | null;
  onClick: (event: React.MouseEvent) => void;
}

export default function GoalIcon(props: Props) {
  return (
    <TransparentButton type="button" onClick={props.onClick}>
      <Icon>{props.icon}</Icon>
    </TransparentButton>
  )
}