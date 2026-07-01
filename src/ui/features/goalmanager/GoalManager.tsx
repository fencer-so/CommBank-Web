import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, faSmile, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import 'date-fns'
import { BaseEmoji } from 'emoji-mart'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import EmojiPicker from '../../components/EmojiPicker'
import { Theme } from '../../components/Theme'

type Props = { goal: Goal }

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()
  const goal = useAppSelector(selectGoalsMap)[props.goal.id] ?? props.goal

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  useEffect(() => {
    setName(goal.name)
    setTargetDate(new Date(goal.targetDate))
    setTargetAmount(goal.targetAmount)
  }, [goal])

  const buildUpdatedGoal = (updatedFields: Partial<Goal>): Goal => ({
    ...goal,
    name: name ?? goal.name,
    targetDate: targetDate ?? goal.targetDate,
    targetAmount: targetAmount ?? goal.targetAmount,
    ...updatedFields,
  })

  const updateGoal = (updatedFields: Partial<Goal>) => {
    const updatedGoal = buildUpdatedGoal(updatedFields)
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(goal.id, updatedGoal)
  }

  const pickEmojiOnClick = async (emoji: BaseEmoji) => {
    const updatedGoal: Goal = {
      ...buildUpdatedGoal({}),
      icon: emoji.native,
    }

    dispatch(updateGoalRedux(updatedGoal))

    const wasUpdated = await updateGoalApi(goal.id, updatedGoal)

    if (wasUpdated) {
      setIsPickerOpen(false)
    } else {
      console.error('Goal icon update failed')
    }
  }

  const updateNameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    updateGoal({ name: event.target.value })
  }

  const updateTargetAmountOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(event.target.value)
    setTargetAmount(val)
    updateGoal({ targetAmount: val })
  }

  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (date) {
      setTargetDate(date)
      updateGoal({ targetDate: date })
    }
  }

  return (
    <GoalManagerContainer>
      <NameInput value={name ?? ''} onChange={updateNameOnChange} />

      <Group>
        <Field name="Icon" icon={faSmile} />
        <Value>
          <IconButton type="button" onClick={() => setIsPickerOpen(!isPickerOpen)}>
            {goal.icon ? (
              <SelectedIcon>{goal.icon}</SelectedIcon>
            ) : (
              <AddIconText>Add Icon</AddIconText>
            )}
          </IconButton>
          {isPickerOpen && (
            <PickerContainer>
              <EmojiPicker onClick={pickEmojiOnClick} />
            </PickerContainer>
          )}
        </Value>
      </Group>

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
          <StringValue>{goal.balance}</StringValue>
        </Value>
      </Group>

      <Group>
        <Field name="Date Created" icon={faCalendarAlt} />
        <Value>
          <StringValue>{new Date(goal.created).toLocaleDateString()}</StringValue>
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
  background-color: transparent;
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
  svg {
    color: rgba(174, 174, 174, 1);
  }
`
const StringValue = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
`
const StringInput = styled.input`
  background-color: transparent;
  border: none;
  font-size: 1.8rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`
const Value = styled.div`
  margin-left: 2rem;
  position: relative;
`
const IconButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  color: ${({ theme }: { theme: Theme }) => theme.text};
  cursor: pointer;
  display: flex;
  font-size: 1.8rem;
  font-weight: bold;
  min-height: 3rem;
  padding: 0;
`
const SelectedIcon = styled.span`
  font-size: 2.4rem;
  line-height: 1;
`
const AddIconText = styled.span`
  color: rgba(174, 174, 174, 1);
`
const PickerContainer = styled.div`
  left: 0;
  position: absolute;
  top: 3.5rem;
  z-index: 1;
`
