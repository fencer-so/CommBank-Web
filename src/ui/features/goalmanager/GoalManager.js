import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { BaseEmoji } from 'emoji-mart'
import 'date-fns'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import EmojiPicker from '../../components/EmojiPicker'
import { Theme } from '../../components/Theme'
import AddIconButton from './AddIconButton'
import GoalIcon from './GoalIcon'

type GoalWithIcon = Goal & { icon?: string | null }
type Props = { goal: GoalWithIcon }
export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()

  const goal = useAppSelector(selectGoalsMap)[props.goal.id] as GoalWithIcon

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
  }, [goal.name])

  useEffect(() => {
    setIcon(goal.icon ?? null)
  }, [goal.icon])

  const persistGoal = (updatedGoal: GoalWithIcon) => {
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const buildUpdatedGoal = (overrides: Partial<GoalWithIcon>): GoalWithIcon => {
    const currentGoal = goal ?? props.goal

    return {
      ...currentGoal,
      name: name ?? currentGoal.name,
      targetDate: targetDate ?? currentGoal.targetDate,
      targetAmount: targetAmount ?? currentGoal.targetAmount,
      icon: icon ?? currentGoal.icon ?? null,
      ...overrides,
    }
  }

  const updateNameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = event.target.value
    setName(nextName)
    persistGoal(buildUpdatedGoal({ name: nextName }))
  }

  const updateTargetAmountOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTargetAmount = parseFloat(event.target.value)
    setTargetAmount(nextTargetAmount)
    persistGoal(buildUpdatedGoal({ targetAmount: nextTargetAmount }))
  }

  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (date != null) {
      setTargetDate(date)
      persistGoal(buildUpdatedGoal({ targetDate: date }))
    }
  }

  const toggleEmojiPicker = (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsEmojiPickerOpen(prevState => !prevState)
  }

  const pickEmojiOnClick = (emoji: BaseEmoji, event: React.MouseEvent) => {
    event.stopPropagation()
    const nextIcon = emoji.native
    setIcon(nextIcon)
    setIsEmojiPickerOpen(false)
    persistGoal(buildUpdatedGoal({ icon: nextIcon }))
  }

  return (
    <GoalManagerContainer>
      <Header>
        <GoalIconContainer shouldShow={Boolean(icon)}>
          <GoalIcon icon={icon} onClick={toggleEmojiPicker} />
        </GoalIconContainer>

        <AddIconButtonContainer shouldShow={!icon}>
          <AddIconButton hasIcon={Boolean(icon)} onClick={toggleEmojiPicker} />
        </AddIconButtonContainer>
      </Header>

      <EmojiPickerContainer isOpen={isEmojiPickerOpen} hasIcon={Boolean(icon)}>
        <EmojiPicker onClick={pickEmojiOnClick} />
      </EmojiPickerContainer>

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
    </GoalManagerContainer>
  )
}

type FieldProps = { name: string; icon: IconDefinition }
type AddIconButtonContainerProps = { shouldShow: boolean }
type GoalIconContainerProps = { shouldShow: boolean }
type EmojiPickerContainerProps = { isOpen: boolean; hasIcon: boolean }

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

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

const AddIconButtonContainer = styled.div<AddIconButtonContainerProps>`
  display: ${({ shouldShow }) => (shouldShow ? 'flex' : 'none')};
  margin-bottom: 1.5rem;
`

const GoalIconContainer = styled.div<GoalIconContainerProps>`
  display: ${({ shouldShow }) => (shouldShow ? 'flex' : 'none')};
  margin-bottom: 1rem;
`

const EmojiPickerContainer = styled.div<EmojiPickerContainerProps>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  top: ${({ hasIcon }) => (hasIcon ? '5.5rem' : '3rem')};
  left: 0;
  z-index: 2;
`
