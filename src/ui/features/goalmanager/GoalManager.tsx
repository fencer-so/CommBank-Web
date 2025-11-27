import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, faSmile } from '@fortawesome/free-solid-svg-icons'
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

// --- IMPORT EMOJI PICKER ---
import EmojiPicker from '../../components/EmojiPicker'
import { BaseEmoji } from 'emoji-mart'
// --- IMPORT TRANSPARENT BUTTON ---
import { TransparentButton } from '../../components/TransparentButton'


const BigIcon = styled.h1`
  font-size: 5.5rem;
  cursor: pointer;
`

function GoalIcon({ icon, onClick }: { icon: string, onClick: (e: React.MouseEvent) => void }) {
  return (
    <TransparentButton onClick={onClick}>
      <BigIcon>{icon}</BigIcon>
    </TransparentButton>
  )
}

type Props = { goal: Goal }

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()
  const goal = useAppSelector(selectGoalsMap)[props.goal.id]

  // Form state
  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)
  // Icon state
  const [icon, setIcon] = useState<string | null>(props.goal.icon ?? null)
  // Emoji picker open/close
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false)

  useEffect(() => {
    setName(goal.name)
    setTargetDate(goal.targetDate)
    setTargetAmount(goal.targetAmount)
    setIcon(goal.icon ?? null)
  }, [goal.id, goal.name, goal.targetDate, goal.targetAmount, goal.icon])

  // Inline handlers
  const hasIcon = () => icon != null

  // --- HERE'S THE MODIFIED HANDLER ---
  const pickEmojiOnClick = () => (emoji: BaseEmoji, event: React.MouseEvent) => {
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

  // Add icon button
  const addIconOnClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setEmojiPickerIsOpen(true)
  }
  // Icon click (change)
  const iconOnClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setEmojiPickerIsOpen(true)
  }

  // Other update handlers (unchanged)
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
        targetDate: date,
        targetAmount: targetAmount ?? props.goal.targetAmount,
      }
      dispatch(updateGoalRedux(updatedGoal))
      updateGoalApi(props.goal.id, updatedGoal)
    }
  }

  return (
    <GoalManagerContainer>
      <NameInput value={name ?? ''} onChange={updateNameOnChange} />
      {/* --- ICON/EMOJI ADD & CHANGE UI --- */}
      <Group>
        {/* Show icon if exists */}
        <GoalIconContainer shouldShow={!!icon}>
          {icon && (
            <GoalIcon icon={icon} onClick={iconOnClick} />
          )}
        </GoalIconContainer>
        {/* Show add icon button if missing */}
        <AddIconButtonContainer shouldShow={!icon}>
          <TransparentButton onClick={addIconOnClick}>
            <FontAwesomeIcon icon={faSmile} size="2x" />
            <AddIconButtonText>Add icon</AddIconButtonText>
          </TransparentButton>
        </AddIconButtonContainer>
        {/* Emoji Picker as popover/modal */}
        <EmojiPickerContainer
          isOpen={emojiPickerIsOpen}
          hasIcon={!!icon}
          onClick={e => e.stopPropagation()}
        >
          <EmojiPicker onClick={pickEmojiOnClick()} />
        </EmojiPickerContainer>
      </Group>
      {/* --- REST OF GOAL FIELDS --- */}
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
    </GoalManagerContainer>
  )
}

// --- FIELD AND STYLES BELOW ---

type FieldProps = { name: string; icon: any }
const Field = (props: FieldProps) => (
  <FieldContainer>
    <FontAwesomeIcon icon={props.icon} size="2x" />
    <FieldName>{props.name}</FieldName>
  </FieldContainer>
)

type AddIconButtonContainerProps = { shouldShow: boolean }
const AddIconButtonContainer = styled.div<AddIconButtonContainerProps>`
  display: ${(props) => (props.shouldShow ? 'flex' : 'none')};
  align-items: center;
`

type GoalIconContainerProps = { shouldShow: boolean }
const GoalIconContainer = styled.div<GoalIconContainerProps>`
  display: ${(props) => (props.shouldShow ? 'flex' : 'none')};
  align-items: center;
  min-width: 3rem;
  margin-right: 1rem;
`

type EmojiPickerContainerProps = { isOpen: boolean; hasIcon: boolean }
const EmojiPickerContainer = styled.div<EmojiPickerContainerProps>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: absolute;
  top: ${(props) => (props.hasIcon ? '10rem' : '2rem')};
  left: 0;
  z-index: 1000;
`

const AddIconButtonText = styled.span`
  font-size: 1.2rem;
  margin-left: 0.5rem;
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

export default GoalManager
