import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { createGoal as createGoalApi, getGoals } from '../../../../api/lib'
import { createGoal as createGoalRedux, selectGoalsList } from '../../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import {
  setContent as setContentRedux,
  setIsOpen as setIsOpenRedux,
  setType as setTypeRedux,
} from '../../../../store/modalSlice'
import { SectionHeading } from '../../../components/SectionHeading'
import { media } from '../../../utils/media'
import GoalsContent from './GoalsContent'

export default function GoalsSection() {
  const dispatch = useAppDispatch()
  const goalIds = useAppSelector(selectGoalsList)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchGoals = async () => {
      const goals = await getGoals()
      if (goals != null) {
        const recentGoals = goals.slice(-10)
        recentGoals.forEach((goal) => dispatch(createGoalRedux(goal)))
      }
    }
    fetchGoals()
  }, [dispatch])

  const onClick = async () => {
    const goal = await createGoalApi()
    if (goal != null) {
      dispatch(createGoalRedux(goal))
      dispatch(setContentRedux(goal))
      dispatch(setTypeRedux('Goal'))
      dispatch(setIsOpenRedux(true))
    }
  }

  return (
    <Container>
      <TopGroup>
        <SectionHeading>Goals</SectionHeading>
        <Icon onClick={onClick} aria-label="Create goal">
          <PlusCircleSvg />
        </Icon>
      </TopGroup>
      <GoalsContent ids={goalIds} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  margin-top: 2rem;
  margin-bottom: 2rem;

  ${media('<tablet')} {
    width: 100%;
  }
`

const TopGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  ${media('<tablet')} {
    flex-direction: column;
  }
`

const Icon = styled.a`
  margin-left: 1rem;
`

const PlusCircleSvg = () => (
  <svg viewBox="0 0 448 512" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v112H80c-17.7 0-32 14.3-32 32s14.3 32 32 32h112v112c0 17.7 14.3 32 32 32s32-14.3 32-32V256h112c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80zM224 512C100.3 512 0 411.7 0 288S100.3 64 224 64s224 100.3 224 224-100.3 224-224 224z" />
  </svg>
)