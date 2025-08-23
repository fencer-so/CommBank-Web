import { faCalendarAlt, faSmile } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, IconDefinition } from '@fortawesome/free-solid-svg-icons'
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
import { TransparentButton } from '../../components/TransparentButton'
import DatePicker from '../../components/DatePicker'
import EmojiPicker from '../../components/EmojiPicker'
import { Theme } from '../../components/Theme'
import GoalIcon from './GoalIcon'

type Props = { goal: Goal }

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
    setIcon(props.goal.icon)
  }, [props.goal])

  const updateNameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = event.target.value
    setName(nextName)
    const updatedGoal: Goal = { ...props.goal, name: nextName }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const updateTargetAmountOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextTargetAmount = parseFloat(event.target.value)
    setTargetAmount(nextTargetAmount)
    const updatedGoal: Goal = { ...props.goal, targetAmount: nextTargetAmount }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (date != null) {
      setTargetDate(date)
      const updatedGoal: Goal = { ...props.goal, targetDate: date }
      dispatch(updateGoalRedux(updatedGoal))
      updateGoalApi(props.goal.id, updatedGoal)
    }
  }

  const hasIcon = () => icon != null

  const addIconOnClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setEmojiPickerIsOpen(true)
  }

  // src/ui/features/goalmanager/GoalManager.tsx

  const pickEmojiOnClick = (emoji: BaseEmoji, event: React.MouseEvent) => {
    event.stopPropagation();
    const nativeEmoji = emoji.native;
    
    // This keeps the local UI state updated
    setIcon(nativeEmoji);
    setEmojiPickerIsOpen(false);

    // This creates the updated goal object with ALL recent changes
    const updatedGoal: Goal = {
      ...props.goal,
      icon: nativeEmoji, // The new icon
      name: name ?? props.goal.name, // The updated name from state
      targetDate: targetDate ?? props.goal.targetDate, // The updated date from state
      targetAmount: targetAmount ?? props.goal.targetAmount, // The updated amount from state
    };

    // This updates the Redux store so the whole app is aware of the change
    dispatch(updateGoalRedux(updatedGoal));
    
    // This calls the API to save the changes to the backend
    updateGoalApi(props.goal.id, updatedGoal);
  };

  return (
    <GoalManagerContainer>
      <EmojiPickerContainer
        isOpen={emojiPickerIsOpen}
        hasIcon={hasIcon()}
        onClick={(event) => event.stopPropagation()}
      >
        <EmojiPicker onClick={pickEmojiOnClick} />
      </EmojiPickerContainer>

      <GoalIconContainer shouldShow={hasIcon()}>
        <GoalIcon icon={goal.icon} onClick={addIconOnClick} />
      </GoalIconContainer>

      <AddIconButtonContainer hasIcon={hasIcon()}>
        <TransparentButton onClick={addIconOnClick}>
          <FontAwesomeIcon icon={faSmile} size="2x" />
          <AddIconButtonText>Add icon</AddIconButtonText>
        </TransparentButton>
      </AddIconButtonContainer>

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

// --- STYLED COMPONENTS ---
// These were missing from the previous version

const Field = (props: { name: string; icon: IconDefinition }) => (
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
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;

  &::placeholder {
    color: ${({ theme }: { theme: Theme }) => theme.textSecondary};
  }
`

type EmojiPickerContainerProps = { isOpen: boolean; hasIcon: boolean }

const EmojiPickerContainer = styled.div<EmojiPickerContainerProps>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: absolute;
  top: ${(props) => (props.hasIcon ? '6rem' : '8rem')};
  left: 0;
  z-index: 1000;
`

type GoalIconContainerProps = { shouldShow: boolean }

const GoalIconContainer = styled.div<GoalIconContainerProps>`
  display: ${(props) => (props.shouldShow ? 'flex' : 'none')};
  margin-bottom: 1rem;
`

type AddIconButtonContainerProps = { hasIcon: boolean }

const AddIconButtonContainer = styled.div<AddIconButtonContainerProps>`
  display: ${(props) => (props.hasIcon ? 'none' : 'flex')};
  flex-direction: row;
  align-items: center;
  margin-bottom: 1rem;
`

const AddIconButtonText = styled.span`
  margin-left: 0.6rem;
  font-size: 1.5rem;
  color: rgba(174, 174, 174, 1);
`

const Value = styled.div`
  display: flex;
  flex: 1;
  margin-left: 1rem;
`

const StringInput = styled.input`
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 2rem;
  color: ${({ theme }: { theme: Theme }) => theme.text};
  width: 100%;
`

const StringValue = styled.span`
  font-size: 2rem;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

const FieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 12rem;
`

const FieldName = styled.span`
  margin-left: 0.6rem;
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`