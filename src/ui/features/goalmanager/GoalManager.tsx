import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import {
  faDollarSign,
  faSmile,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import 'date-fns'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import {
  selectGoalsMap,
  updateGoal as updateGoalRedux
} from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import { Theme } from '../../components/Theme'
import EmojiPicker from '../../components/EmojiPicker'
import { TransparentButton } from '../../components/TransparentButton'
import GoalIcon from './GoalIcon'
import { BaseEmoji } from 'emoji-mart'

type Props = { goal: Goal }

type EmojiPickerContainerProps = { isOpen: boolean; hasIcon: boolean }
type GoalIconContainerProps = { shouldShow: boolean }
type AddIconButtonContainerProps = { hasIcon: boolean }

const EmojiPickerContainer = styled.div<EmojiPickerContainerProps>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: absolute;
  top: ${(props) => (props.hasIcon ? '10rem' : '2rem')};
  left: 0;
`

const GoalIconContainer = styled.div<GoalIconContainerProps>`
  display: ${(props) => (props.shouldShow ? 'flex' : 'none')};
`

const AddIconButtonContainer = styled.div<AddIconButtonContainerProps>`
  display: ${(props) => (props.hasIcon ? 'none' : 'flex')};
  align-items: center;
`

const AddIconText = styled.h3`
  margin-left: 0.5rem;
  font-size: 1.2rem;
`

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()

  const goal = useAppSelector(selectGoalsMap)[props.goal.id]

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)
  const [icon, setIcon] = useState<string | null>(null)
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false)

  useEffect(() => {
    setName(props.goal.name)
    setTargetDate(props.goal.targetDate)
    setTargetAmount(props.goal.targetAmount)
    setIcon(props.goal.icon ?? null)
  }, [
    props.goal.id,
    props.goal.name,
    props.goal.targetDate,
    props.goal.targetAmount,
    props.goal.icon
  ])

  useEffect(() => {
    setName(goal.name)
  }, [goal.name])

  const hasIcon = () => icon != null

  const addIconOnClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setEmojiPickerIsOpen(true)
  }

  // ✅ FIXED TYPE ISSUE HERE
  const pickEmojiOnClick =
    () =>
    (emoji: BaseEmoji, event: React.MouseEvent<Element, MouseEvent>) => {
      event.stopPropagation()

      const newIcon = emoji.native
      setIcon(newIcon)
      setEmojiPickerIsOpen(false)

      const updatedGoal: Goal = {
        ...props.goal,
        icon: newIcon,
        name: name ?? props.goal.name,
        targetDate: targetDate ?? props.goal.targetDate,
        targetAmount: targetAmount ?? props.goal.targetAmount
      }

      dispatch(updateGoalRedux(updatedGoal))
      updateGoalApi(props.goal.id, updatedGoal)
    }

  const updateNameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = event.target.value
    setName(nextName)

    const updatedGoal: Goal = {
      ...props.goal,
      name: nextName,
      icon
    }

    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const updateTargetAmountOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextTargetAmount = parseFloat(event.target.value)
    setTargetAmount(nextTargetAmount)

    const updatedGoal: Goal = {
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: nextTargetAmount,
      icon
    }

    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (!date) return

    setTargetDate(date)

    const updatedGoal: Goal = {
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: date,
      targetAmount: targetAmount ?? props.goal.targetAmount,
      icon
    }

    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  return (
    <GoalManagerContainer>
      <NameInput value={name ?? ''} onChange={updateNameOnChange} />

      <AddIconButtonContainer hasIcon={hasIcon()}>
        <TransparentButton onClick={addIconOnClick}>
          <FontAwesomeIcon icon={faSmile} size="2x" />
          <AddIconText>Add icon</AddIconText>
        </TransparentButton>
      </AddIconButtonContainer>

      <GoalIconContainer shouldShow={hasIcon()}>
        <GoalIcon icon={icon} onClick={addIconOnClick} />
      </GoalIconContainer>

      <EmojiPickerContainer
        isOpen={emojiPickerIsOpen}
        hasIcon={hasIcon()}
        onClick={(e) => e.stopPropagation()}
      >
        <EmojiPicker onClick={pickEmojiOnClick()} />
      </EmojiPickerContainer>

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
            value={targetAmount ?? ''}
            onChange={updateTargetAmountOnChange}
          />
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
          <StringValue>
            {new Date(props.goal.created).toLocaleDateString()}
          </StringValue>
        </Value>
      </Group>
    </GoalManagerContainer>
  )
}

/* ================= styled ================= */

const GoalManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  position: relative;
`

const Group = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 1.25rem 0;
`

const NameInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
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
  background: transparent;
  border: none;
  outline: none;
  font-size: 1.8rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

const Value = styled.div`
  margin-left: 2rem;
`

const Field = (props: { name: string; icon: IconDefinition }) => (
  <FieldContainer>
    <FontAwesomeIcon icon={props.icon} size="2x" />
    <FieldName>{props.name}</FieldName>
  </FieldContainer>
)