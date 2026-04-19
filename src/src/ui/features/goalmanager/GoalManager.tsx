import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BaseEmoji } from 'emoji-mart'
import { faCalendarAlt, faSmile } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import 'date-fns'

import EmojiPicker from '../../components/EmojiPicker'
import GoalIcon from './GoalIcon'

import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'

type Props = { goal: Goal }

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()
  const goal = useAppSelector(selectGoalsMap)
[props.goal.id]


  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)

  const [icon, setIcon] = useState<string | null>((props.goal as any).icon || null)
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false)

  useEffect(() => {
    setName(props.goal.name)
    setTargetDate(props.goal.
targetDate)
    setTargetAmount(props.goal.targetAmount)

    setIcon((props.goal as any).icon || null)
  }, [
    props.goal,
    props.goal.id,
    props.goal.name,
    props.goal.targetDate,
    props.goal.targetAmount,
  ])

  useEffect(() => {
    setName(goal.name)
  }, [goal.name])

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
      icon: emoji.native ?? (props.goal as any).icon,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: targetAmount ?? props.goal.targetAmount,
    }

    dispatch(updateGoalRedux(
updatedGoal))

    updateGoalApi(props.goal.id, updatedGoal)
  }

  const updateNameOnChange = (event: React.ChangeEvent<
HTMLInputElement>) => {

    const nextName = event.target.value
    setName(nextName)
    const updatedGoal: Goal = { ...props.goal, name: nextName, icon: icon ?? undefined }
    dispatch(updateGoalRedux(
updatedGoal))

    updateGoalApi(props.goal.id, updatedGoal)
  }

  const updateTargetAmountOnChange = (event: React.ChangeEvent<
HTMLInputElement>) => {

    const nextTargetAmount = parseFloat(event.target.value)
    setTargetAmount(
nextTargetAmount)

    const updatedGoal: Goal = {
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: nextTargetAmount,
      icon: icon ?? undefined
    }
    dispatch(updateGoalRedux(
updatedGoal))

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
        icon: icon ?? undefined
      }
      dispatch(updateGoalRedux(
updatedGoal))

      updateGoalApi(props.goal.id, updatedGoal)
    }
  }

  return (
    <GoalManagerContainer>
     
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
       
        {/* State 1: Show the "Add Icon" button if there is NO icon */}
        <AddIconButtonContainer hasIcon={hasIcon()}>
          <TransparentButton onClick={addIconOnClick}>
            <FontAwesomeIcon icon={faSmile} size="2x" style={{ color: '#aaa' }} />
            <AddIconButtonText>Add icon</AddIconButtonText>
          </TransparentButton>
        </AddIconButtonContainer>

        {/* State 2: Show the giant Emoji if there IS an icon */}
        <GoalIconContainer shouldShow={hasIcon()}>
          <GoalIcon icon={icon} onClick={addIconOnClick} />
        </GoalIconContainer>

        {/* The Picker itself */}
        <EmojiPickerContainer
          isOpen={emojiPickerIsOpen}
          hasIcon={hasIcon()}
          onClick={(event) => event.stopPropagation()}
        >
          <EmojiPicker onClick={pickEmojiOnClick} />
        </EmojiPickerContainer>

      </div>

      <NameInput value={name ?? ''} onChange={updateNameOnChange} placeholder="Goal Name" />

      <Group>
        <Field name="Target Date" icon={faCalendarAlt} />
        <Value>
          <DatePicker value={targetDate} onChange={pickDateOnChange} />
        </Value>
      </Group>

      <Group>
        <Field name="Target Amount" icon={faDollarSign} />
        <Value>
          <StringInput value={targetAmount ?? ''} onChange={
updateTargetAmountOnChange} />

        </Value>
      </Group>

      <Group>
        <Field name="Balance" icon={faDollarSign} />
        <Value>
          <StringValue>{props.goal.
balance}</StringValue>

        </Value>
      </Group>

      <Group>
        <Field name="Date Created" icon={faCalendarAlt} />
        <Value>
          <StringValue>{new Date(props.goal.created).
toLocaleDateString()}</StringValue>

        </Value>
      </Group>
    </GoalManagerContainer>
  )
}

// --- Styled Components ---

type EmojiPickerContainerProps = { isOpen: boolean; hasIcon: boolean }

const EmojiPickerContainer = styled.div<
EmojiPickerContainerProps>`

  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: absolute;
  top: ${(props) => (props.hasIcon ? '7rem' : '3rem')};
  z-index: 100;
`

type AddIconButtonContainerProps = { hasIcon: boolean }

const AddIconButtonContainer = styled.div<AddIconButtonContainerProps>`
  display: ${(props) => (props.hasIcon ? 'none' : 'flex')};
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`

type GoalIconContainerProps = { shouldShow: boolean }

const GoalIconContainer = styled.div<GoalIconContainerProps>`
  display: ${(props) => (props.shouldShow ? 'flex' : 'none')};
  justify-content: center;
`

const TransparentButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`

const AddIconButtonText = styled.span`
  color: #aaa;
  font-size: 1rem;
`

const GoalManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`

const NameInput = styled.input`
  font-size: 2rem;
  border: none;
  border-bottom: 1px solid #ccc;
  margin-bottom: 2rem;
  outline: none;
  background: transparent;
  color: inherit;
`

const Group = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

const Value = styled.div`
  display: flex;
  align-items: center;
`

const StringInput = styled.input`
  font-size: 1.2rem;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 4px;
  width: 100px;
`

const StringValue = styled.span`
  font-size: 1.2rem;
`

const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
`

const Field = (props: { name: string; icon: any }) => (
  <FieldContainer>
    <FontAwesomeIcon icon={props.icon} />
    <span>{props.name}</span>
  </FieldContainer>
)