
import { faCalendarAlt, faSmile } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { BaseEmoji, Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
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
import { selectMode } from '../../../store/themeSlice'
import DatePicker from '../../components/DatePicker'
import { Theme } from '../../components/Theme'

type Props = {
  goal: Goal
}

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()

  const goalsMap = useAppSelector(selectGoalsMap)
  const goal = goalsMap[props.goal.id] ?? props.goal
  const mode = useAppSelector(selectMode)

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)

  // Icon state
  const [icon, setIcon] = useState<string | null>(
    goal.icon ?? null
  )

  // Emoji picker visibility
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] =
    useState(false)

  // Task 3: Prevent repeated submissions
  const [isSavingIcon, setIsSavingIcon] = useState(false)

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

  useEffect(() => {
    setIcon(goal.icon ?? null)
  }, [goal.id, goal.icon])

  // Update goal name
  const updateNameOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextName = event.target.value
    setName(nextName)

    const updatedGoal: Goal = {
      ...goal,
      name: nextName,
    }

    dispatch(updateGoalRedux(updatedGoal))
    void updateGoalApi(goal.id, updatedGoal)
  }

  // Update target amount
  const updateTargetAmountOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextTargetAmount = parseFloat(event.target.value)

    setTargetAmount(nextTargetAmount)

    const updatedGoal: Goal = {
      ...goal,
      name: name ?? goal.name,
      targetDate: targetDate ?? goal.targetDate,
      targetAmount: nextTargetAmount,
    }

    dispatch(updateGoalRedux(updatedGoal))
    void updateGoalApi(goal.id, updatedGoal)
  }

  // Update target date
  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (date != null) {
      setTargetDate(date)

      const updatedGoal: Goal = {
        ...goal,
        name: name ?? goal.name,
        targetDate: date,
        targetAmount: targetAmount ?? goal.targetAmount,
      }

      dispatch(updateGoalRedux(updatedGoal))
      void updateGoalApi(goal.id, updatedGoal)
    }
  }

  // Open or close emoji picker
  const addIconOnClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (!isSavingIcon) {
      setEmojiPickerIsOpen((isOpen) => !isOpen)
    }
  }

  // TASK 3: Save selected emoji through the PUT API
  const pickEmojiOnClick = async (
    emoji: BaseEmoji,
    event: React.MouseEvent
  ) => {
    event.stopPropagation()

    if (isSavingIcon) {
      return
    }

    const selectedIcon = emoji.native

    // Preserve all existing goal properties
    const updatedGoal: Goal = {
      ...goal,
      icon: selectedIcon,
      name: name ?? goal.name,
      targetDate: targetDate ?? goal.targetDate,
      targetAmount: targetAmount ?? goal.targetAmount,
    }

    setIsSavingIcon(true)

    try {
      // Send updated goal to the .NET backend
      const success = await updateGoalApi(
        goal.id,
        updatedGoal
      )

      if (success) {
        // Update Redux after successful API request
        dispatch(updateGoalRedux(updatedGoal))

        // Update displayed icon
        setIcon(selectedIcon)

        // Close emoji picker
        setEmojiPickerIsOpen(false)

        console.log(
          'Goal icon saved successfully:',
          selectedIcon
        )
      } else {
        console.error('Failed to save the goal icon')
        alert(
          'Failed to save the goal icon. Please try again.'
        )
      }
    } catch (error) {
      console.error('Error updating goal icon:', error)

      alert(
        'An error occurred while saving the icon.'
      )
    } finally {
      setIsSavingIcon(false)
    }
  }

  const hasIcon = icon != null && icon !== ''

  return (
    <GoalManagerContainer>

      {/* Add icon button */}
      {!hasIcon && (
        <AddIconButtonContainer>
          <TransparentIconButton
            type="button"
            onClick={addIconOnClick}
            disabled={isSavingIcon}
          >
            <FontAwesomeIcon
              icon={faSmile}
              size="2x"
            />
            <AddIconButtonText>
              Add icon
            </AddIconButtonText>
          </TransparentIconButton>
        </AddIconButtonContainer>
      )}

      {/* Display and change an existing icon */}
      {hasIcon && (
        <GoalIconContainer>
          <TransparentIconButton
            type="button"
            onClick={addIconOnClick}
            title="Change goal icon"
            disabled={isSavingIcon}
          >
            <GoalIcon>{icon}</GoalIcon>
          </TransparentIconButton>
        </GoalIconContainer>
      )}

      {/* Emoji picker */}
      {emojiPickerIsOpen && (
        <EmojiPickerContainer
          hasIcon={hasIcon}
          onClick={(event) => event.stopPropagation()}
        >
          <Picker
            theme={mode}
            showPreview={false}
            showSkinTones={false}
            onClick={pickEmojiOnClick}
          />

          {isSavingIcon && (
            <SavingMessage>
              Saving icon...
            </SavingMessage>
          )}
        </EmojiPickerContainer>
      )}

      {/* Goal name */}
      <NameInput
        value={name ?? ''}
        onChange={updateNameOnChange}
      />

      {/* Target date */}
      <Group>
        <Field
          name="Target Date"
          icon={faCalendarAlt}
        />
        <Value>
          <DatePicker
            value={targetDate}
            onChange={pickDateOnChange}
          />
        </Value>
      </Group>

      {/* Target amount */}
      <Group>
        <Field
          name="Target Amount"
          icon={faDollarSign}
        />
        <Value>
          <StringInput
            type="number"
            value={targetAmount ?? ''}
            onChange={updateTargetAmountOnChange}
          />
        </Value>
      </Group>

      {/* Balance */}
      <Group>
        <Field
          name="Balance"
          icon={faDollarSign}
        />
        <Value>
          <StringValue>
            {goal.balance}
          </StringValue>
        </Value>
      </Group>

      {/* Date created */}
      <Group>
        <Field
          name="Date Created"
          icon={faCalendarAlt}
        />
        <Value>
          <StringValue>
            {new Date(goal.created).toLocaleDateString()}
          </StringValue>
        </Value>
      </Group>

    </GoalManagerContainer>
  )
}

// Field component
type FieldProps = {
  name: string
  icon: IconDefinition
}

const Field = (props: FieldProps) => (
  <FieldContainer>
    <FontAwesomeIcon
      icon={props.icon}
      size="2x"
    />
    <FieldName>{props.name}</FieldName>
  </FieldContainer>
)

// Main container
const GoalManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  position: relative;
`

// Add icon button container
const AddIconButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`

// Transparent button
const TransparentIconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }: { theme: Theme }) => theme.text};

  &:hover {
    opacity: 0.75;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

// Add icon text
const AddIconButtonText = styled.span`
  font-size: 1.5rem;
  font-weight: 500;
`

// Existing icon container
const GoalIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1rem;
`

// Goal emoji
const GoalIcon = styled.span`
  font-size: 5.5rem;
  line-height: 1.2;
  cursor: pointer;
`

// Emoji picker container
type EmojiPickerContainerProps = {
  hasIcon: boolean
}

const EmojiPickerContainer =
  styled.div<EmojiPickerContainerProps>`
    display: flex;
    flex-direction: column;
    position: absolute;

    top: ${(props) =>
      props.hasIcon ? '10rem' : '3rem'};

    left: 0;
    z-index: 1000;
  `

// Task 3: Saving indicator
const SavingMessage = styled.p`
  font-size: 1rem;
  padding: 0.5rem;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

// Input group
const Group = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
`

// Goal name
const NameInput = styled.input`
  display: flex;
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 4rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

// Field name
const FieldName = styled.h1`
  font-size: 1.8rem;
  margin-left: 1rem;
  color: rgba(174, 174, 174, 1);
  font-weight: normal;
`

// Field container
const FieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 20rem;

  svg {
    color: rgba(174, 174, 174, 1);
  }
`

// Text value
const StringValue = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
`

// Text input
const StringInput = styled.input`
  display: flex;
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 1.8rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

// Value container
const Value = styled.div`
  margin-left: 2rem;
`
