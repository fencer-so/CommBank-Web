import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, faSmile, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import 'date-fns'
import { Picker } from 'emoji-mart'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import {
  selectGoalsMap,
  updateGoal as updateGoalRedux,
} from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import { Theme } from '../../components/Theme'

type Props = { goal: Goal }

export const GoalManager = React.memo((props: Props) => {
  const dispatch = useAppDispatch()
  const goal = useAppSelector(selectGoalsMap)[props.goal.id]

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  // Inject emoji‑mart CSS once
  useEffect(() => {
    if (!document.querySelector('link[href*="emoji-mart"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href =
        'https://cdnjs.cloudflare.com/ajax/libs/emoji-mart/3.0.1/emoji-mart.min.css'
      document.head.appendChild(link)
    }
  }, [])

  if (!goal) return null

  // ---------- Handlers ----------
  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedGoal: Goal = { ...goal, name: e.target.value }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(goal.id, updatedGoal)
  }

  const updateTargetAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      const updatedGoal: Goal = { ...goal, targetAmount: 0 }
      dispatch(updateGoalRedux(updatedGoal))
      updateGoalApi(goal.id, updatedGoal)
      return
    }
    const amount = parseFloat(value)
    if (isNaN(amount)) return
    const updatedGoal: Goal = { ...goal, targetAmount: amount }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(goal.id, updatedGoal)
  }

  const updateTargetDate = (date: MaterialUiPickersDate) => {
    if (date == null) return
    const updatedGoal: Goal = { ...goal, targetDate: date }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(goal.id, updatedGoal)
  }

  // ✅ This is the "pickEmojiOnClick" handler – updates icon and persists via PUT
  const updateIcon = (newIcon: string | null) => {
    const updatedGoal: Goal = { ...goal, icon: newIcon ?? undefined }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(goal.id, updatedGoal) // ← PUT request saves to backend
    setIsEmojiPickerOpen(false)
  }

  const handleEmojiSelect = (emoji: any) => {
    if (emoji && typeof emoji.native === 'string') {
      updateIcon(emoji.native)
    }
  }

  const openPicker = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEmojiPickerOpen(true)
  }

  const closePicker = () => {
    setIsEmojiPickerOpen(false)
  }

  const hasIcon = goal.icon != null

  // ---------- Render ----------
  return (
    <GoalManagerContainer onClick={closePicker}>
      <IconSection>
        {hasIcon ? (
          <IconButton onClick={openPicker}>
            <IconDisplay>{goal.icon}</IconDisplay>
          </IconButton>
        ) : (
          <IconButton onClick={openPicker}>
            <FontAwesomeIcon icon={faSmile} size="2x" />
            <AddIconText>Add icon</AddIconText>
          </IconButton>
        )}

        {isEmojiPickerOpen && (
          <EmojiPickerContainer onClick={(e) => e.stopPropagation()}>
            <Picker
              set="apple"
              title="Choose a goal icon"
              emoji="point_up"
              onSelect={handleEmojiSelect} // ← emoji selection handler
            />
          </EmojiPickerContainer>
        )}
      </IconSection>

      <NameInput value={goal.name || ''} onChange={updateName} />

      <Group>
        <Field name="Target Date" icon={faCalendarAlt} />
        <Value>
          <DatePicker value={goal.targetDate} onChange={updateTargetDate} />
        </Value>
      </Group>

      <Group>
        <Field name="Target Amount" icon={faDollarSign} />
        <Value>
          <StringInput
            value={goal.targetAmount ?? ''}
            onChange={updateTargetAmount}
          />
        </Value>
      </Group>

      <Group>
        <Field name="Balance" icon={faDollarSign} />
        <Value>
          <StringValue>{goal.balance}</StringValue>
        </Value>
      </Group>

      <Group>
        <Field name="Date Created" icon={faCalendarAlt} />
        <Value>
          <StringValue>
            {new Date(goal.created).toLocaleDateString()}
          </StringValue>
        </Value>
      </Group>
    </GoalManagerContainer>
  )
})

// ---------- Styled Components ----------
const GoalManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  position: relative;
`

const IconSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
`

const IconButton = styled.button`
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

const IconDisplay = styled.h1`
  font-size: 5.5rem;
  margin: 0;
  padding: 0;
  line-height: 1;
`

const AddIconText = styled.span`
  font-size: 1.2rem;
  font-weight: 500;
`

const EmojiPickerContainer = styled.div`
  position: absolute;
  top: 6rem;
  left: 0;
  z-index: 9999;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
`

const Group = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
`

const NameInput = styled.input`
  display: flex;
  width: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 4rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

const Field = ({ name, icon }: { name: string; icon: IconDefinition }) => (
  <FieldContainer>
    <FontAwesomeIcon icon={icon} size="2x" />
    <FieldName>{name}</FieldName>
  </FieldContainer>
)

const FieldName = styled.h1`
  font-size: 1.8rem;
  margin-left: 1rem;
  color: rgba(174, 174, 174, 1);
  font-weight: normal;
`

const FieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 20rem;
  svg {
    color: rgba(174, 174, 174, 1);
  }
`

const StringValue = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
`

const StringInput = styled.input`
  display: flex;
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 1.8rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

const Value = styled.div`
  margin-left: 2rem;
`