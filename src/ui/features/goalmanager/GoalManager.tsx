// src/ui/features/goalmanager/GoalManager.tsx
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import 'date-fns'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../store/type'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import { Theme } from '../../components/Theme'

type Props = { goal: Goal }

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()
  const goal = useAppSelector(selectGoalsMap)[props.goal.id]

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)
  const [icon, setIcon] = useState<string | null>(null)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

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
    if (goal) setName(goal.name)
  }, [goal])

  const updateGoalField = (updatedFields: Partial<Goal>) => {
    const updatedGoal: Goal = {
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: targetAmount ?? props.goal.targetAmount,
      icon: icon ?? props.goal.icon,
      ...updatedFields,
    }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const updateNameOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateGoalField({ name: e.target.value })

  const updateTargetAmountOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateGoalField({ targetAmount: parseFloat(e.target.value) })

  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (date) updateGoalField({ targetDate: date })
    setTargetDate(date)
  }

  const onEmojiSelect = (emoji: any) => {
    updateGoalField({ icon: emoji.native })
    setIcon(emoji.native)
    setIsPickerOpen(false)
  }

  return (
    <GoalManagerContainer>
      {icon ? (
        <GoalIconContainer>
          <GoalIcon>{icon}</GoalIcon>
          <AddIconButton onClick={() => setIsPickerOpen(!isPickerOpen)}>Change Icon</AddIconButton>
        </GoalIconContainer>
      ) : (
        <AddIconButton onClick={() => setIsPickerOpen(!isPickerOpen)}>Add Icon</AddIconButton>
      )}

      {isPickerOpen && (
        <EmojiPickerContainer>
          <Picker onSelect={onEmojiSelect} />
        </EmojiPickerContainer>
      )}

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

const Field = (props: FieldProps) => (
  <FieldContainer>
    <FontAwesomeIcon icon={props.icon} size="2x" />
    <FieldName>{props.name}</FieldName>
  </FieldContainer>
)

const GoalManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  font-size: 4rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`
const FieldName = styled.h1`
  font-size: 1.8rem;
  margin-left: 1rem;
  color: rgba(174, 174, 174, 1);
`
const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  width: 20rem;
`
const StringValue = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
`
const StringInput = styled.input`
  background: transparent;
  border: none;
  font-size: 1.8rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`
const Value = styled.div`
  margin-left: 2rem;
`
const AddIconButton = styled.button`
  padding: 0.5rem 1rem;
  background: #ffcc00;
  border: none;
  cursor: pointer;
  margin-bottom: 1rem;
`
const GoalIconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`
const GoalIcon = styled.div`
  font-size: 3rem;
  margin-right: 1rem;
`
const EmojiPickerContainer = styled.div`
  position: absolute;
  top: 5rem;
  z-index: 1000;
`