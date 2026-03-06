import React from 'react'
import styled from 'styled-components'
import { Goal } from '../../../api/types'
import { media } from '../../utils/media'
import { useAppSelector } from '../../../store/hooks'
import { selectContent, selectIsOpen, selectType } from '../../../store/modalSlice'
import { GoalManager } from '../../features/goalmanager/GoalManager'

export default function Modal() {
  const isOpen = useAppSelector(selectIsOpen)
  const content = useAppSelector(selectContent)
  const type = useAppSelector(selectType)

  const renderSwitch = () => {
    switch (type) {
      case 'Goal':
        return <GoalManager goal={content as Goal} />
    }
  }

  if (!isOpen || content === null) return null

  const onClick = (event: React.MouseEvent) => event.stopPropagation()

  return <Container onClick={onClick}>{renderSwitch()}</Container>
}

export const Container = styled.div`
  width: 85%;
  max-width: 1000px;
  height: 85%;
  max-height: 90vh;
  background-color: ${({ theme }) => theme.modalBackground};
  border-radius: 2rem;
  padding: 4rem 8rem;
  z-index: 100;
  overflow-y: auto;

  ${media('<desktop')} {
    width: 90%;
    padding: 3rem 4rem;
  }

  ${media('<tablet')} {
    width: 95%;
    max-height: 85vh;
    padding: 2rem 1.5rem;
    border-radius: 1rem;
  }
`
