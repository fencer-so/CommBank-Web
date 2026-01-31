import { faCalendarAlt, faSmile } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { BaseEmoji } from 'emoji-mart'
import 'date-fns'
import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import EmojiPicker from '../../components/EmojiPicker'
import { TransparentButton } from '../../components/TransparentButton'
import GoalIcon from './GoalIcon'
import { Theme } from '../../components/Theme'


type Props = { goal: Goal }

// Styled Components
type AddIconButtonContainerProps = { hasIcon: boolean }
type GoalIconContainerProps = { shouldShow: boolean }
type EmojiPickerContainerProps = { isOpen: boolean; hasIcon: boolean }

const AddIconButtonContainer = styled.div<AddIconButtonContainerProps>`
  display: ${(props) => (props.hasIcon ? 'none' : 'flex')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 2rem;
  width: 100%;
`

const AddIconButtonText = styled.p`
  font-size: 1.5rem;
  margin-top: 1rem;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

const GoalIconContainer = styled.div<GoalIconContainerProps>`
  display: ${(props) => (props.shouldShow ? 'flex' : 'none')};
  justify-content: center;
  margin-bottom: 2rem;
  width: 100%;
`

const EmojiPickerContainer = styled.div<EmojiPickerContainerProps>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #ddd;
  padding: 10px;
  
  /* Limit size */
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
  
  /* Center the picker */
  justify-content: center;
  align-items: center;
`

const GoalManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  position: relative;
  padding: 2rem;
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
  width: 100%;
  margin-bottom: 2rem;
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
  width: 100%;
`

const Value = styled.div`
  margin-left: 2rem;
  flex: 1;
`

// Field Component
type FieldProps = { name: string; icon: IconDefinition }

const Field = (props: FieldProps) => (
  <FieldContainer>
    <FontAwesomeIcon icon={props.icon} size="2x" />
    <FieldName>{props.name}</FieldName>
  </FieldContainer>
)

// Main GoalManager Component
export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()
  const goal = useAppSelector(selectGoalsMap)[props.goal.id]
  const pickerRef = useRef<HTMLDivElement>(null)

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)
  const [icon, setIcon] = useState<string | null>(null)
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false)

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setEmojiPickerIsOpen(false)
      }
    }

    if (emojiPickerIsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [emojiPickerIsOpen])

  // Initialize state from props
  useEffect(() => {
    setName(props.goal.name)
    setTargetDate(props.goal.targetDate)
    setTargetAmount(props.goal.targetAmount)
    setIcon(props.goal.icon)
  }, [
    props.goal.id,
    props.goal.name,
    props.goal.targetDate,
    props.goal.targetAmount,
    props.goal.icon,
  ])

  // Update state when Redux goal changes
  useEffect(() => {
    setName(goal.name)
    setIcon(goal.icon)
  }, [goal.name, goal.icon])

  // Helper functions
  const hasIcon = () => icon != null && icon !== ''

  const addIconOnClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setEmojiPickerIsOpen(true)
  }

  const pickEmojiOnClick = (emoji: BaseEmoji, event: React.MouseEvent) => {
    event.stopPropagation()
    
    setIcon(emoji.native)
    setEmojiPickerIsOpen(false)

    const updatedGoal: Goal = {
      ...props.goal,
      icon: emoji.native ?? props.goal.icon,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: targetAmount ?? props.goal.targetAmount,
    }

    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const getUpdatedGoal = (updates: Partial<Goal>): Goal => {
    return {
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: targetAmount ?? props.goal.targetAmount,
      icon: icon ?? props.goal.icon,
      ...updates,
    }
  }

  const updateNameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = event.target.value
    setName(nextName)
    const updatedGoal = getUpdatedGoal({ name: nextName })
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const updateTargetAmountOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTargetAmount = parseFloat(event.target.value)
    setTargetAmount(nextTargetAmount)
    const updatedGoal = getUpdatedGoal({ targetAmount: nextTargetAmount })
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (date != null) {
      setTargetDate(date)
      const updatedGoal = getUpdatedGoal({ targetDate: date })
      dispatch(updateGoalRedux(updatedGoal))
      updateGoalApi(props.goal.id, updatedGoal)
    }
  }

  return (
    <GoalManagerContainer>
      {/* Icon Section - Add Icon Button or Goal Icon */}
      <AddIconButtonContainer hasIcon={hasIcon()}>
        <TransparentButton onClick={addIconOnClick}>
          <FontAwesomeIcon icon={faSmile} size="2x" />
          <AddIconButtonText>Add icon</AddIconButtonText>
        </TransparentButton>
      </AddIconButtonContainer>

      <GoalIconContainer shouldShow={hasIcon()}>
        <GoalIcon icon={icon} onClick={addIconOnClick} />
      </GoalIconContainer>

      {/* Goal Name Input */}
      <NameInput 
        value={name ?? ''} 
        onChange={updateNameOnChange}
        placeholder="Goal Name"
      />

      {/* Goal Details */}
      <Group>
        <Field name="Target Date" icon={faCalendarAlt} />
        <Value>
          <DatePicker value={targetDate} onChange={pickDateOnChange} />
        </Value>
      </Group>

      <Group>
        <Field name="Target Amount" icon={faDollarSign} />
        <Value>
          <StringInput 
            type="number"
            value={targetAmount ?? ''} 
            onChange={updateTargetAmountOnChange}
            placeholder="0.00"
          />
        </Value>
      </Group>

      <Group>
        <Field name="Balance" icon={faDollarSign} />
        <Value>
          <StringValue>${props.goal.balance.toFixed(2)}</StringValue>
        </Value>
      </Group>

      <Group>
        <Field name="Date Created" icon={faCalendarAlt} />
        <Value>
          <StringValue>{new Date(props.goal.created).toLocaleDateString()}</StringValue>
        </Value>
      </Group>

      {/* Emoji Picker */}
      <EmojiPickerContainer
        ref={pickerRef}
        isOpen={emojiPickerIsOpen}
        hasIcon={hasIcon()}
        onClick={(event) => event.stopPropagation()}
      >
        <EmojiPicker onClick={pickEmojiOnClick} />
      </EmojiPickerContainer>
    </GoalManagerContainer>
  )
}