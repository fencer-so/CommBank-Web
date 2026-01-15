import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import 'date-fns'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import AddIconButton from './AddIconButton'
import DatePicker from '../../components/DatePicker'
import { Theme } from '../../components/Theme'
import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import EmojiPicker from '../../components/EmojiPicker'
import { BaseEmoji } from 'emoji-mart'

/* ================= TYPES ================= */

type Props = { goal: Goal }

type EmojiPickerContainerProps = { isOpen: boolean; hasIcon: boolean }

const EmojiPickerContainer = styled.div<EmojiPickerContainerProps>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: absolute;
  top: ${(props) => (props.hasIcon ? '10rem' : '2rem')};
  left: 0;
`

/* ================= COMPONENT ================= */

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()
  const goal = useAppSelector(selectGoalsMap)[props.goal.id]

  const [name, setName] = useState<string>('')
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)
  const [icon, setIcon] = useState<string | null>(null)
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false)

  /* ================= EFFECTS ================= */

  const hasIcon = () => icon != null

  const pickEmojiOnClick = (emoji: BaseEmoji, event: React.MouseEvent) => {
    // TODO(TASK-2) Stop event propogation
    // TODO(TASK-2) Set icon locally
    // TODO(TASK-2) Close emoji picker
    // TODO(TASK-2) Create updated goal locally
    // TODO(TASK-2) Update Redux store
    // TODO(TASK-3) Update database

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

    // TODO(TASK-3) Update database
  }


  useEffect(() => {
    setName(goal.name)
    setTargetDate(goal.targetDate)
    setTargetAmount(goal.targetAmount)
    setIcon(goal.icon ?? null)
  }, [goal])

  /* ================= HANDLERS ================= */

  const handleAddIconClick = () => {
    setEmojiPickerIsOpen(!emojiPickerIsOpen)
  }

  const updateNameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = e.target.value
    setName(nextName)

    const updatedGoal: Goal = { ...goal, name: nextName }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(goal.id, updatedGoal)
  }

  const updateTargetAmountOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setTargetAmount(value)

    const updatedGoal: Goal = {
      ...goal,
      targetAmount: value,
      icon: icon ?? undefined,
    }

    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(goal.id, updatedGoal)
  }
  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (!date) return

    setTargetDate(date)

    const updatedGoal: Goal = {
      ...goal,
      targetDate: date as Date,
      icon: icon ?? undefined,
    }

    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(goal.id, updatedGoal)
  }


  /* ================= RENDER ================= */

  return (
    <GoalManagerContainer>
      <AddIconButton hasIcon={!!icon} onClick={handleAddIconClick} />

      <EmojiPickerContainer
        isOpen={emojiPickerIsOpen}
        hasIcon={hasIcon()}
        onClick={(event) => event.stopPropagation()}
      >
        <EmojiPicker onClick={pickEmojiOnClick} />
      </EmojiPickerContainer>

      <NameInput value={name} onChange={updateNameOnChange} />

      <Group>
        <Value>
          <DatePicker value={targetDate} onChange={pickDateOnChange} />
        </Value>
      </Group>

      <Group>
        <Value>
          <StringInput
            value={targetAmount ?? ''}
            onChange={updateTargetAmountOnChange}
          />
        </Value>
      </Group>
    </GoalManagerContainer>
  )
}

/* ================= STYLES ================= */

const GoalManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const Group = styled.div`
  display: flex;
  width: 100%;
  margin: 1.25rem 0;
`;

const NameInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  font-size: 4rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`;

const StringInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  font-size: 1.8rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`;

const Value = styled.div`
  margin-left: 2rem;
`;
