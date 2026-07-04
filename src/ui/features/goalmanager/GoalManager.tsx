import 'date-fns'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Goal } from '../../../api/types'
import { updateGoal } from '../../../store/goals/actions'
import { useAppDispatch } from '../../../store/hooks'
import LoadingPanel from '../../components/LoadingPanel'
import AddIconButton from './AddIconButton'
import GoalIcon from './GoalIcon'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

type Props = {
  goal: Goal | null
  isLoading: boolean
}

export default function GoalManager(props: Props) {
  const dispatch = useAppDispatch()
  const [showPicker, setShowPicker] = useState(false)

  if (props.isLoading) {
    return <LoadingPanel />
  }

  if (!props.goal) {
    return (
      <Container>
        <Title>No Goal Selected</Title>
      </Container>
    )
  }

  const pickEmojiOnClick = (emoji: any) => {
    dispatch(updateGoal({ ...props.goal!, icon: emoji.native }))
    setShowPicker(false)
  }

  return (
    <Container>
      <HeaderRow>
        <GoalIcon 
          icon={props.goal.icon || null} 
          onClick={() => setShowPicker(!showPicker)} 
        />
        <TitleContainer>
          <Title>{props.goal.name}</Title>
          <AddIconButton 
            hasIcon={!!props.goal.icon} 
            onClick={() => setShowPicker(!showPicker)} 
          />
        </TitleContainer>
      </HeaderRow>

      {showPicker && (
        <PickerContainer>
          <Picker onSelect={pickEmojiOnClick} title="Pick a goal icon" emoji="point_up" />
        </PickerContainer>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
`

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2rem;
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
`

const PickerContainer = styled.div`
  position: absolute;
  z-index: 10;
  margin-top: 7rem;
`import 'date-fns'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Goal } from '../../../api/types'
import { updateGoal } from '../../../store/goals/actions'
import { useAppDispatch } from '../../../store/hooks'
import LoadingPanel from '../../components/LoadingPanel'
import AddIconButton from './AddIconButton'
import GoalIcon from './GoalIcon'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

type Props = {
  goal: Goal | null
  isLoading: boolean
}

export default function GoalManager(props: Props) {
  const dispatch = useAppDispatch()
  const [showPicker, setShowPicker] = useState(false)

  if (props.isLoading) {
    return <LoadingPanel />
  }

  if (!props.goal) {
    return (
      <Container>
        <Title>No Goal Selected</Title>
      </Container>
    )
  }

  const pickEmojiOnClick = (emoji: any) => {
    dispatch(updateGoal({ ...props.goal!, icon: emoji.native }))
    setShowPicker(false)
  }

  return (
    <Container>
      <HeaderRow>
        <GoalIcon 
          icon={props.goal.icon || null} 
          onClick={() => setShowPicker(!showPicker)} 
        />
        <TitleContainer>
          <Title>{props.goal.name}</Title>
          <AddIconButton 
            hasIcon={!!props.goal.icon} 
            onClick={() => setShowPicker(!showPicker)} 
          />
        </TitleContainer>
      </HeaderRow>

      {showPicker && (
        <PickerContainer>
          <Picker onSelect={pickEmojiOnClick} title="Pick a goal icon" emoji="point_up" />
        </PickerContainer>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
`

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2rem;
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
`

const PickerContainer = styled.div`
  position: absolute;
  z-index: 10;
  margin-top: 7rem;
`
