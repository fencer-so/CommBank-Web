import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import 'date-fns'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import { Theme } from '../../components/Theme'

type Props = { goal: Goal }

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()

  // We fetch the "Live" goal from Redux. This updates instantly when changed.
  const goal = useAppSelector(selectGoalsMap)[props.goal.id]

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)
  
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    // Initialize state from the live goal
    if (goal) {
        setName(goal.name)
        setTargetDate(goal.targetDate)
        setTargetAmount(goal.targetAmount)
    }
  }, [goal])

  const updateNameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = event.target.value
    setName(nextName)
    const updatedGoal: Goal = {
      ...goal,
      name: nextName,
    }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(goal.id, updatedGoal)
  }

  const updateTargetAmountOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTargetAmount = parseFloat(event.target.value)
    setTargetAmount(nextTargetAmount)
    const updatedGoal: Goal = {
      ...goal,
      name: name ?? goal.name,
      targetDate: targetDate ?? goal.targetDate,
      targetAmount: nextTargetAmount,
    }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(goal.id, updatedGoal)
  }

  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (date != null) {
      setTargetDate(date)
      const updatedGoal: Goal = {
        ...goal,
        name: name ?? goal.name,
        targetDate: date ?? goal.targetDate,
        targetAmount: targetAmount ?? goal.targetAmount,
      }
      dispatch(updateGoalRedux(updatedGoal))
      updateGoalApi(goal.id, updatedGoal)
    }
  }

  // --- THE EMOJI HANDLER ---
  const updateIconOnSelect = (emoji: any) => {
    console.log("Emoji Selected:", emoji); // Check your console if this prints!
    
    setShowPicker(false)

    const updatedGoal: Goal = {
      ...goal,        // Grab the latest goal state
      icon: emoji.native, // Set the new icon
    }

    // 1. Update the screen immediately (Redux)
    dispatch(updateGoalRedux(updatedGoal))
    
    // 2. Save to the database
    updateGoalApi(goal.id, updatedGoal)
  }

  const togglePicker = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowPicker(!showPicker);
  }

  if (!goal) return null; // Safety check

  return (
    <GoalManagerContainer>
      
      {/* Header Area */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ position: 'relative', marginRight: '1rem' }}>
            
            {/* USE 'goal.icon' HERE (The live one), NOT 'props.goal.icon' */}
            {goal.icon ? (
                <GoalIcon onClick={togglePicker}>{goal.icon}</GoalIcon>
            ) : (
                <AddIconButton onClick={togglePicker}>+</AddIconButton>
            )}

            {/* Picker Popup */}
            {showPicker && (
                <div style={{ position: 'absolute', top: '60px', left: '0', zIndex: 9999 }}>
                    <Picker 
                        onSelect={updateIconOnSelect} 
                        theme="dark" 
                        showPreview={false} 
                        showSkinTones={false} 
                        native={true}
                    />
                </div>
            )}
        </div>

        <NameInput value={name ?? ''} onChange={updateNameOnChange} />
      </div>

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

// STYLES
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

const GoalIcon = styled.div`
    font-size: 3rem;
    cursor: pointer;
    user-select: none;
    transition: transform 0.1s;
    &:hover {
        transform: scale(1.1);
    }
`

const AddIconButton = styled.div`
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 2px dashed rgba(174, 174, 174, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(174, 174, 174, 1);
    font-size: 2rem;
    cursor: pointer;
    &:hover {
        border-color: white;
        color: white;
    }
`