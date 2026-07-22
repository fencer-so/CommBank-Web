import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import {
  faDollarSign,
  faPlus,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { BaseEmoji } from 'emoji-mart'
import 'date-fns'
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
import EmojiPicker from '../../components/EmojiPicker'
import { Theme } from '../../components/Theme'

type Props = { goal: Goal }

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()

  const goal = useAppSelector(selectGoalsMap)[props.goal.id]

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)
  const [icon, setIcon] = useState<string | null>(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

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
    props.goal.icon,
  ])

  useEffect(() => {
    setName(goal.name)
    setIcon(goal.icon ?? null)
  }, [goal.name, goal.icon])

  const saveGoal = (updatedGoal: Goal) => {
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const updateNameOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextName = event.target.value
    setName(nextName)

    const updatedGoal: Goal = {
      ...props.goal,
      name: nextName,
      icon: icon ?? props.goal.icon,
    }

    saveGoal(updatedGoal)
  }

  const updateTargetAmountOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextTargetAmount = parseFloat(event.target.value)
    setTargetAmount(nextTargetAmount)

    const updatedGoal: Goal = {
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: nextTargetAmount,
      icon: icon ?? props.goal.icon,
    }

    saveGoal(updatedGoal)
  }

  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (date != null) {
      setTargetDate(date)

      const updatedGoal: Goal = {
        ...props.goal,
        name: name ?? props.goal.name,
        targetDate: date,
        targetAmount: targetAmount ?? props.goal.targetAmount,
        icon: icon ?? props.goal.icon,
      }

      saveGoal(updatedGoal)
    }
  }

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen)
  }

  const pickEmojiOnClick = (
    emoji: BaseEmoji,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation()

    const nextIcon = emoji.native
    setIcon(nextIcon)
    setIsEmojiPickerOpen(false)

    const updatedGoal: Goal = {
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: targetAmount ?? props.goal.targetAmount,
      icon: nextIcon,
    }

    saveGoal(updatedGoal)
  }

  return (
    <GoalManagerContainer>
      <IconSection>
        <GoalIconContainer shouldShow={icon != null}>
          <GoalIconButton type="button" onClick={toggleEmojiPicker}>
            {icon}
          </GoalIconButton>
        </GoalIconContainer>

        <AddIconButtonContainer shouldShow={icon == null}>
          <AddIconButton type="button" onClick={toggleEmojiPicker}>
            <FontAwesomeIcon icon={faPlus} />
            Add icon
          </AddIconButton>
        </AddIconButtonContainer>

        <EmojiPickerContainer
          isOpen={isEmojiPickerOpen}
          hasIcon={icon != null}
        >
          <EmojiPicker onClick={pickEmojiOnClick} />
        </EmojiPickerContainer>
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

type FieldProps = {
  name: string
  icon: IconDefinition
}

type AddIconButtonContainerProps = {
  shouldShow: boolean
}

type GoalIconContainerProps = {
  shouldShow: boolean
}

type EmojiPickerContainerProps = {
  isOpen: boolean
  hasIcon: boolean
}

const Field = (props: FieldProps) => (
  <FieldContainer>
    <FontAwesomeIcon icon={props.icon} size="2x" />
    <FieldName>{props.name}</FieldName>
  </FieldContainer>
)

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
`

const AddIconButtonContainer = styled.div<AddIconButtonContainerProps>`
  display: ${({ shouldShow }) => (shouldShow ? 'block' : 'none')};
  margin-bottom: 1rem;
`

const GoalIconContainer = styled.div<GoalIconContainerProps>`
  display: ${({ shouldShow }) => (shouldShow ? 'block' : 'none')};
  margin-bottom: 1rem;
`

const AddIconButton = styled.button`
  background-color: transparent;
  border: 1px solid rgba(174, 174, 174, 1);
  border-radius: 0.5rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: ${({ theme }: { theme: Theme }) => theme.text};

  svg {
    margin-right: 0.5rem;
  }
`

const GoalIconButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 4rem;
  padding: 0;
`

const EmojiPickerContainer = styled.div<EmojiPickerContainerProps>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  z-index: 10;
  top: ${({ hasIcon }) => (hasIcon ? '5rem' : '3rem')};
  left: 0;
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