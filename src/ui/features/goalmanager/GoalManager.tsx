import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, IconDefinition, faPlus } from '@fortawesome/free-solid-svg-icons'
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
import EmojiPicker from '../../components/EmojiPicker'
import { Theme } from '../../components/Theme'
import { BaseEmoji } from 'emoji-mart'

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
        icon: icon ?? props.goal.icon,
      }
      dispatch(updateGoalRedux(updatedGoal))
      updateGoalApi(props.goal.id, updatedGoal)
    }
  }

  const updateIcon = (nextIcon: string) => {
    setIcon(nextIcon)
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

  const pickEmojiOnClick = (emoji: BaseEmoji, event: React.MouseEvent) => {
    updateIcon(emoji.native)
    setIsPickerOpen(false)
  }


  return (
    <GoalManagerContainer>
      <TopContainer>
        <IconContainer onClick={() => setIsPickerOpen(!isPickerOpen)}>
          {icon ? (
            <>
              <IconText>{icon}</IconText>
              <RemoveIcon onClick={(e) => {
                e.stopPropagation();
                updateIcon("");
              }}>×</RemoveIcon>
            </>
          ) : (
            <AddIconContainer>
              <FontAwesomeIcon icon={faPlus} size="2x" />
              <AddIconText>Add Icon</AddIconText>
            </AddIconContainer>
          )}
        </IconContainer>
        <NameInput value={name ?? ''} onChange={updateNameOnChange} />

        {isPickerOpen && (
          <>
            <Backdrop onClick={() => setIsPickerOpen(false)} />
            <EmojiPickerContainer>
              <EmojiPicker onClick={pickEmojiOnClick} />
            </EmojiPickerContainer>
          </>
        )}
      </TopContainer>

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

const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2rem;
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6rem;
  height: 6rem;
  background-color: rgba(174, 174, 174, 0.1);
  border-radius: 1.5rem;
  margin-right: 2rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;

  &:hover {
    background-color: rgba(174, 174, 174, 0.2);
  }
`

const RemoveIcon = styled.div`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: ${({ theme }) => theme.alertColor};
  color: white;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  
  &:hover {
    transform: scale(1.1);
  }
`

const IconText = styled.span`
  font-size: 3rem;
`

const AddIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(174, 174, 174, 1);

  svg {
    font-size: 1.5rem;
    margin-bottom: 0.2rem;
  }
`

const AddIconText = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
`

const EmojiPickerContainer = styled.div`
  position: absolute;
  top: 8rem;
  left: 0;
  z-index: 1001;
  box-shadow: var(--shadow-lg);
  border-radius: 1rem;
  overflow: hidden;
`

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
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
