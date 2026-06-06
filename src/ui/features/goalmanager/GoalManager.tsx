import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, IconDefinition } from '@fortawesome/free-solid-svg-icons'
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
import 'emoji-mart/css/emoji-mart.css'
import { Picker, BaseEmoji } from 'emoji-mart'
import GoalIcon from './GoalIcon'

type Props = { goal: Goal }
export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()

  const goal = useAppSelector(selectGoalsMap)[props.goal.id]

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)

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
const [icon, setIcon] = useState<string | null>(null)
const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
const toggleEmojiPicker = (event: React.MouseEvent) => {
  event.stopPropagation()
  setIsEmojiPickerOpen((current) => !current)
}
const onSelectEmoji = (emoji: BaseEmoji) => {
  const nextIcon = emoji.native ?? null
  setIcon(nextIcon)
  setIsEmojiPickerOpen(false)

  const updatedGoal: Goal = {
    ...props.goal,
    name: name ?? props.goal.name,
    targetDate: targetDate ?? props.goal.targetDate,
    targetAmount: targetAmount ?? props.goal.targetAmount,
    icon: nextIcon,
  }

  dispatch(updateGoalRedux(updatedGoal))
  updateGoalApi(props.goal.id, updatedGoal)
}

return (
  <GoalManagerContainer>
    <Header>
      <GoalIconContainer shouldShow={icon != null}>
        <GoalIcon icon={icon} onClick={toggleEmojiPicker} />
      </GoalIconContainer>

      <TitleGroup>
        <AddIconButtonContainer shouldShow={icon == null}>
          <AddIconButton onClick={toggleEmojiPicker}>+ Add icon</AddIconButton>
        </AddIconButtonContainer>

        <NameInput value={name ?? ''} onChange={updateNameOnChange} />
      </TitleGroup>
    </Header>

    <EmojiPickerContainer isOpen={isEmojiPickerOpen} hasIcon={icon != null}>
      <Picker
        native
        title="Pick your goal icon"
        emoji="point_up"
        onSelect={onSelectEmoji}
        showPreview={false}
        showSkinTones={false}
      />
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
// type AddIconButtonContainerProps = { shouldShow: boolean }
// type GoalIconContainerProps = { shouldShow: boolean }
// type EmojiPickerContainerProps = { isOpen: boolean; hasIcon: boolean }
const AddIconButtonContainer = styled.div<{ shouldShow: boolean }>`
  display: ${({ shouldShow }) => (shouldShow ? 'flex' : 'none')};
  margin-bottom: 0.75rem;
`

const GoalIconContainer = styled.div<{ shouldShow: boolean }>`
  display: ${({ shouldShow }) => (shouldShow ? 'flex' : 'none')};
  margin-right: 1.5rem;
  margin-top: 0.5rem;
`

const EmojiPickerContainer = styled.div<{ isOpen: boolean; hasIcon: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(${({ hasIcon }) => (hasIcon ? '6.5rem' : '3rem')});
  z-index: 10;

  .emoji-mart {
    border: none;
    border-radius: 1rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`

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
  align-items: flex-start;
  width: 100%;
  position: relative;
`

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const AddIconButton = styled.button`
  border: none;
  outline: none;
  background: rgba(174, 174, 174, 0.15);
  color: rgba(174, 174, 174, 1);
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 999px;
  padding: 0.6rem 1rem;
  cursor: pointer;
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
