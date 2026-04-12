import React from 'react'
import styled from 'styled-components'
import { selectGoalsMap } from '../../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import {
  setContent as setContentRedux,
  setIsOpen as setIsOpenRedux,
  setType as setTypeRedux
} from '../../../../store/modalSlice'
import { Card } from '../../../components/Card'

type Props = { id: string }

export default function GoalCard(props: Props) {
  const dispatch = useAppDispatch()
  const goal = useAppSelector(selectGoalsMap)[props.id]

  const onClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    dispatch(setContentRedux(goal))
    dispatch(setTypeRedux('Goal'))
    dispatch(setIsOpenRedux(true))
  }

  const asLocaleDateString = (date: Date) => new Date(date).toLocaleDateString()

  return (
    <Container key={goal.id} onClick={onClick}>
      {/* NEW: Display the icon emoji if the goal has one */}
      {goal.icon && <GoalIcon>{goal.icon}</GoalIcon>}
      <TargetAmount>${goal.targetAmount}</TargetAmount>
      <TargetDate>{asLocaleDateString(goal.targetDate)}</TargetDate>
    </Container>
  )
}

const Container = styled(Card)`
  display: flex;
  flex-direction: column;
  min-height: 140px;
  min-width: 140px;
  width: 33%;
  cursor: pointer;
  margin-left: 2rem;
  margin-right: 2rem;
  border-radius: 2rem;
  align-items: center;
`
/* NEW: Styled component to display the goal icon emoji on the card */
const GoalIcon = styled.h1`
  font-size: 3rem;
  margin-top: 0.5rem;
`
const TargetAmount = styled.h2`
  font-size: 2rem;
`
const TargetDate = styled.h4`
  color: rgba(174, 174, 174, 1);
  font-size: 1rem;
`