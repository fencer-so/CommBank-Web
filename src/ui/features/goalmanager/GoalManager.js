import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import 'date-fns'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import { Theme } from '../../components/Theme'

type Props = { goal: Goal }

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)

  // ✅ FIXED ICON STATE (NO NULL)
  const [icon, setIcon] = useState<string | undefined>(undefined)
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    setName(props.goal.name)
    setTargetDate(props.goal.targetDate)
    setTargetAmount(props.goal.targetAmount)
    setIcon(props.goal.icon) // ✅ FIXED
  }, [
    props.goal.id,
    props.goal.name,
    props.goal.targetDate,
    props.goal.targetAmount,
    props.goal.icon,
  ])

  const updateGoalAll = (updatedGoal: Goal) => {
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const updateNameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = event.target.value
    setName(nextName)

    updateGoalAll({
      ...props.goal,
      name: nextName,
      icon: icon, // ✅ FIXED
    })
  }

  const updateTargetAmountOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTargetAmount = parseFloat(event.target.value)
    setTargetAmount(nextTargetAmount)

    updateGoalAll({
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: nextTargetAmount,
      icon: icon, // ✅ FIXED
    })
  }

  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (date != null) {
      setTargetDate(date)

      updateGoalAll({
        ...props.goal,
        name: name ?? props.goal.name,
        targetDate: date,
        targetAmount: targetAmount ?? props.goal.targetAmount,
        icon: icon, // ✅ FIXED
      })
    }
  }

  // ✅ EMOJI SELECT
  const onEmojiSelect = (emoji: any) => {
    const selectedIcon = emoji.native
    setIcon(selectedIcon)
    setShowPicker(false)

    updateGoalAll({
      ...props.goal,
      icon: selectedIcon,
    })
  }

  return (
    <GoalManagerContainer>

      {/* ✅ ICON UI */}
      <IconSection>
        <IconDisplay onClick={() => setShowPicker(!showPicker)}>
          {icon || '➕'}
        </IconDisplay>

        {showPicker && (
          <EmojiPickerContainer>
            <Picker onSelect={onEmojiSelect} />
          </EmojiPickerContainer>
        )}
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

    </GoalManagerContainer>
  )
}

type FieldProps = { name: string; icon: any }

const Field = (props: FieldProps) => (
  <FieldContainer>
    <FontAwesomeIcon icon={props.icon} size="2x" />
    <FieldName>{props.name}</FieldName>
  </FieldContainer>
)

/* ✅ ICON STYLES */
const IconSection = styled.div`
  position: relative;
  margin-bottom: 1rem;
`

const IconDisplay = styled.div`
  font-size: 3rem;
  cursor: pointer;
`

const EmojiPickerContainer = styled.div`
  position: absolute;
  z-index: 10;
`

/* EXISTING */
const GoalManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Group = styled.div`
  display: flex;
  margin-top: 1.25rem;
`

const NameInput = styled.input`
  font-size: 4rem;
  font-weight: bold;
  border: none;
  outline: none;
  background: transparent;
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
  font-size: 1.8rem;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

const Value = styled.div`
  margin-left: 2rem;
`