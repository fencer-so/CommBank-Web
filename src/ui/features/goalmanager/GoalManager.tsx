
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
import {
  selectGoalsMap,
  updateGoal as updateGoalRedux,
} from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'

import DatePicker from '../../components/DatePicker'
import EmojiPicker from '../../components/EmojiPicker'
import { Theme } from '../../components/Theme'
import AddIconButton from './AddIconButton'
import GoalIcon from './GoalIcon'

type Props = {
  goal: Goal
}

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()
  const goalsMap = useAppSelector(selectGoalsMap)
  const goal = goalsMap[props.goal.id] ?? props.goal

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [iconStatus, setIconStatus] = useState('')

  const hasIcon = Boolean(goal.icon)


useEffect(() => {
  setName(goal.name)
  setTargetDate(goal.targetDate)
  setTargetAmount(goal.targetAmount)
}, [goal.id, goal.name, goal.targetDate, goal.targetAmount])

useEffect(() => {
  setIsEmojiPickerOpen(false)
  setIconStatus('')
}, [goal.id])


  useEffect(() => {
    setName(goal.name)
  }, [goal.name])

  const saveGoal = (updatedGoal: Goal) => {
    dispatch(updateGoalRedux(updatedGoal))
    void updateGoalApi(updatedGoal.id, updatedGoal)
  }

  const updateNameOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextName = event.target.value
    setName(nextName)

    saveGoal({
      ...goal,
      name: nextName,
    })
  }

  const updateTargetAmountOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextTargetAmount = parseFloat(event.target.value)
    setTargetAmount(nextTargetAmount)

    if (!Number.isFinite(nextTargetAmount)) {
      return
    }

    saveGoal({
      ...goal,
      name: name ?? goal.name,
      targetDate: targetDate ?? goal.targetDate,
      targetAmount: nextTargetAmount,
    })
  }

  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (date == null) {
      return
    }

    setTargetDate(date)

    saveGoal({
      ...goal,
      name: name ?? goal.name,
      targetDate: date,
      targetAmount: targetAmount ?? goal.targetAmount,
    })
  }

  const toggleEmojiPicker = (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsEmojiPickerOpen((previous) => !previous)
  }


const selectEmoji = (
  emoji: BaseEmoji,
  event: React.MouseEvent
) => {
  event.stopPropagation()

  const updatedGoal: Goal = {
    ...goal,
    icon: emoji.native,
  }

  // Update the interface immediately.
  dispatch(updateGoalRedux(updatedGoal))
  setIsEmojiPickerOpen(false)

  // Save the selected emoji to the backend.
  void updateGoalApi(updatedGoal.id, updatedGoal).then((success) => {
    if (success) {
      setIconStatus('Goal icon saved successfully.')
    } else {
      setIconStatus(
        'Could not save the icon to the server. It may revert after refreshing.'
      )
    }
  })
}


  return (
    <GoalManagerContainer>
      <IconSection>
        <GoalIconContainer $shouldShow={hasIcon}>
          <GoalIcon
            icon={goal.icon ?? null}
            onClick={toggleEmojiPicker}
          />
        </GoalIconContainer>

        <AddIconButtonContainer $shouldShow={!hasIcon}>
          <AddIconButton
            hasIcon={hasIcon}
            onClick={toggleEmojiPicker}
          />
        </AddIconButtonContainer>

        <EmojiPickerContainer $isOpen={isEmojiPickerOpen}>
          {isEmojiPickerOpen && (
            <EmojiPicker onClick={selectEmoji} />
          )}
        </EmojiPickerContainer>
      </IconSection>

      {iconStatus && (
        <StatusMessage role="status">
          {iconStatus}
        </StatusMessage>
      )}

      <NameInput
        value={name ?? ''}
        onChange={updateNameOnChange}
        aria-label="Goal name"
      />

      <Group>
        <Field name="Target Date" icon={faCalendarAlt} />
        <Value>
          <DatePicker
            value={targetDate}
            onChange={pickDateOnChange}
          />
        </Value>
      </Group>

      <Group>
        <Field name="Target Amount" icon={faDollarSign} />
        <Value>
          <StringInput
            type="number"
            value={targetAmount ?? ''}
            onChange={updateTargetAmountOnChange}
            aria-label="Target amount"
          />
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
          <StringValue>
            {new Date(goal.created).toLocaleDateString()}
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
  $shouldShow: boolean
}

type GoalIconContainerProps = {
  $shouldShow: boolean
}

type EmojiPickerContainerProps = {
  $isOpen: boolean
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
`

const GoalIconContainer = styled.div<GoalIconContainerProps>`
  display: ${({ $shouldShow }) =>
    $shouldShow ? 'block' : 'none'};
`

const AddIconButtonContainer =
  styled.div<AddIconButtonContainerProps>`
    display: ${({ $shouldShow }) =>
      $shouldShow ? 'block' : 'none'};
  `

const EmojiPickerContainer =
  styled.div<EmojiPickerContainerProps>`
    display: ${({ $isOpen }) =>
      $isOpen ? 'block' : 'none'};

    position: absolute;
    top: 100%;
    left: 0;
    z-index: 100;
    max-width: 100%;
  `

const StatusMessage = styled.p`
  font-size: 0.85rem;
  color: rgba(174, 174, 174, 1);
  margin: 0.5rem 0;
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
