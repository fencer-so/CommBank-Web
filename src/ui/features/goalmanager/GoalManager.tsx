import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, faSmile, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import 'date-fns'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import { Theme } from '../../components/Theme'

import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

type Props = { goal: Goal }
export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()

  const goal = useAppSelector(selectGoalsMap)[props.goal.id]

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  useEffect(() => {
    setName(props.goal.name)
    setTargetDate(props.goal.targetDate)
    setTargetAmount(props.goal.targetAmount)
  }, [
    props.goal.id,
    props.goal.name,
    props.goal.targetDate,
    props.goal.targetAmount,
  ])

  useEffect(() => {
    setName(goal.name)
  }, [goal.name])

  const updateNameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = event.target.value
    setName(nextName)
    const updatedGoal: Goal = {
      ...props.goal,
      name: nextName,
    }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const updateTargetAmountOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTargetAmount = parseFloat(event.target.value)
    setTargetAmount(nextTargetAmount)
    const updatedGoal: Goal = {
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: nextTargetAmount,
    }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (date != null) {
      setTargetDate(date)
      const updatedGoal: Goal = {
        ...props.goal,
        name: name ?? props.goal.name,
        targetDate: date ?? props.goal.targetDate,
        targetAmount: targetAmount ?? props.goal.targetAmount,
      }
      dispatch(updateGoalRedux(updatedGoal))
      updateGoalApi(props.goal.id, updatedGoal)
    }
  }

  // ✅ Fixed: For v3, emoji object has `native` and `colons`
const handleIconSelect = async (emoji: any) => {
  const icon = emoji.native || '🤺';
  
  // 1. Update Redux (shows icon immediately)
  const updatedGoal: Goal = {
    ...props.goal,
    name: name ?? props.goal.name,
    targetDate: targetDate ?? props.goal.targetDate,
    targetAmount: targetAmount ?? props.goal.targetAmount,
    icon: icon,
  }
  dispatch(updateGoalRedux(updatedGoal))
  
  // 2. Save to backend (so it persists after refresh)
  try {
    await updateGoalApi(props.goal.id, updatedGoal)
    console.log('Icon saved!')
  } catch (error) {
    console.error('Failed to save:', error)
  }
  
  setShowEmojiPicker(false)
}

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const removeIcon = () => {
    const updatedGoal: Goal = {
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: targetAmount ?? props.goal.targetAmount,
      icon: undefined,
    }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  return (
    <GoalManagerContainer>
      <IconSection>
        <GoalIconContainer>
          {props.goal.icon ? (
            <>
              <GoalIconDisplay>{props.goal.icon}</GoalIconDisplay>
              <IconActionButton onClick={toggleEmojiPicker} title="Change icon">
                <FontAwesomeIcon icon={faSmile} size="lg" />
              </IconActionButton>
              <IconActionButton onClick={removeIcon} title="Remove icon">
                ✕
              </IconActionButton>
            </>
          ) : (
            <AddIconButton onClick={toggleEmojiPicker}>
              <FontAwesomeIcon icon={faSmile} size="lg" />
              <span>Add Icon</span>
            </AddIconButton>
          )}
        </GoalIconContainer>
      </IconSection>

      <NameInput value={name ?? ''} onChange={updateNameOnChange} />

      <Group>
        <Field name="Target Date" icon={faCalendarAlt} />
        <Value>
          <DatePicker value={targetDate} onChange={pickDateOnChange} />
        </Value>
      </Group>

      <Group>
        <Field name="Target Amount" icon={faDollarSign} />
        <Value>
          <StringInput value={targetAmount ?? ''} onChange={updateTargetAmountOnChange} />
        </Value>
      </Group>

      <Group>
        <Field name="Balance" icon={faDollarSign} />
        <Value>
          <StringValue>{props.goal.balance}</StringValue>
        </Value>
      </Group>

      <Group>
        <Field name="Date Created" icon={faCalendarAlt} />
        <Value>
          <StringValue>{new Date(props.goal.created).toLocaleDateString()}</StringValue>
        </Value>
      </Group>

      {/* ✅ Fixed Picker for v3 - uses onSelect not onEmojiSelect */}
      {showEmojiPicker && (
        <EmojiPickerOverlay onClick={() => setShowEmojiPicker(false)}>
          <EmojiPickerContainer onClick={(e) => e.stopPropagation()}>
            <Picker
              onSelect={handleIconSelect}
              showPreview={false}
              showSkinTones={false}
              emojiSize={32}
            />
            <ClosePickerButton onClick={() => setShowEmojiPicker(false)}>
              Close
            </ClosePickerButton>
          </EmojiPickerContainer>
        </EmojiPickerOverlay>
      )}
    </GoalManagerContainer>
  )
}

type FieldProps = { name: string; icon: IconDefinition }

const Field = (props: FieldProps) => (
  <FieldContainer>
    <FontAwesomeIcon icon={props.icon} size="2x" />
    <FieldName>{props.name}</FieldName>
  </FieldContainer>
)

const IconSection = styled.div`
  display: flex;
  margin-bottom: 1rem;
  width: 100%;
`

const GoalIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const GoalIconDisplay = styled.span`
  font-size: 4rem;
  line-height: 1;
`

const AddIconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: transparent;
  border: 2px dashed rgba(174, 174, 174, 0.5);
  border-radius: 8px;
  font-size: 1rem;
  color: rgba(174, 174, 174, 1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(174, 174, 174, 0.8);
    background-color: rgba(174, 174, 174, 0.1);
  }

  svg {
    color: rgba(174, 174, 174, 1);
  }
`

const IconActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  background-color: transparent;
  border: 1px solid rgba(174, 174, 174, 0.3);
  border-radius: 4px;
  color: rgba(174, 174, 174, 1);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    background-color: rgba(174, 174, 174, 0.1);
  }
`

const EmojiPickerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`

const EmojiPickerContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ClosePickerButton = styled.button`
  margin-top: 16px;
  padding: 8px 24px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  &:hover {
    background: #e0e0e0;
  }
`

const GoalManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  position: relative;
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
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 4rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

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