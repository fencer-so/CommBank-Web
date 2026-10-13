
import React from 'react'
import styled from 'styled-components'
import { selectGoalsMap } from '../../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import {
  setContent as setContentRedux,
  setIsOpen as setIsOpenRedux,
  setType as setTypeRedux,
} from '../../../../store/modalSlice'
import { Card } from '../../../components/Card'

type Props = {
  id: string
}

export default function GoalCard(props: Props) {
  const dispatch = useAppDispatch()

  const goal = useAppSelector(selectGoalsMap)[props.id]

  const onClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    dispatch(setContentRedux(goal))
    dispatch(setTypeRedux('Goal'))
    dispatch(setIsOpenRedux(true))
  }

  const asLocaleDateString = (date: Date) =>
    new Date(date).toLocaleDateString()

  if (!goal) {
    return null
  }

  return (
    <Container key={goal.id} onClick={onClick}>

      {/* Goal target amount */}
      <TargetAmount>
        ${goal.targetAmount.toLocaleString()}
      </TargetAmount>

      {/* Goal target date */}
      <TargetDate>
        {asLocaleDateString(goal.targetDate)}
      </TargetDate>

      {/* Task 2: Display the selected goal icon */}
      {goal.icon && (
        <GoalIcon>
          {goal.icon}
        </GoalIcon>
      )}

    </Container>
  )
}

// Main goal card container
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
  justify-content: center;

  padding: 1rem;

  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`

// Target amount
const TargetAmount = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`

// Target date
const TargetDate = styled.h4`
  color: rgba(174, 174, 174, 1);
  font-size: 1rem;
  font-weight: normal;
  margin-bottom: 0.75rem;
`

// Task 2: Goal emoji icon
const GoalIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 5.5rem;
  line-height: 1.2;

  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  user-select: none;
`
