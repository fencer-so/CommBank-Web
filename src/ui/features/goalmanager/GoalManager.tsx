import React, { useEffect, useState } from 'react'
import { faCalendarAlt, faDollarSign, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { faSmile } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import 'date-fns'
import styled from 'styled-components'
import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import { TransparentButton } from '../../components/TransparentButton'
import { Theme } from '../../components/Theme'
import EmojiPicker from '../../components/EmojiPicker'
import { EmojiData } from 'emoji-mart'

type Props = { goal: Goal }

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()
  const goal = useAppSelector(selectGoalsMap)[props.goal.id]

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)
  const [icon, setIcon] = useState<string | null>(goal.icon || null)
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false)

  useEffect(() => {
    setName(props.goal.name)
    setTargetDate(props.goal.targetDate)
    setTargetAmount(props.goal.targetAmount)
    setIcon(props.goal.icon || null)
  }, [props.goal])

  const hasIcon = () => icon != null

  const addIconOnClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    setEmojiPickerIsOpen(true)
  }

  const pickEmojiOnClick = (emoji: EmojiData) => {
    setEmojiPickerIsOpen(false)

    if ('native' in emoji) {
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

      updateGoalApi(props.goal.id, updatedGoal).catch((error) => {
        console.error('Failed to update goal icon:', error)
      })
    }
  }

  return (
    <GoalManagerContainer>
      <NameInput value={name ?? ''} onChange={(e) => setName(e.target.value)} />

      <Group>
        <Field name="Target Date" icon={faCalendarAlt} />
        <Value>
          <DatePicker value={targetDate} onChange={(date) => date && setTargetDate(date)} />
        </Value>
      </Group>

      <Group>
        <Field name="Target Amount" icon={faDollarSign} />
        <Value>
          <StringInput
            value={targetAmount ?? ''}
            onChange={(e) => setTargetAmount(parseFloat(e.target.value))}
          />
        </Value>
      </Group>

      {/* Icon Picker Section */}
      <Group>
        <Field name="Goal Icon" icon={faDollarSign} />
        <Value>
          {icon ? <IconDisplay>{icon}</IconDisplay> : <Placeholder>Select an icon</Placeholder>}
          <EmojiButton onClick={() => setEmojiPickerIsOpen((prev) => !prev)}>
            🎨 Pick Emoji
          </EmojiButton>
        </Value>
      </Group>

      {/* Add Icon Button - Visible Only When No Icon Exists */}
      {!hasIcon() && (
        <AddIconButtonContainer>
          <TransparentButton onClick={addIconOnClick}>
            <FontAwesomeIcon icon={faSmile} size="2x" />
            <AddIconButtonText>Add Icon</AddIconButtonText>
          </TransparentButton>
        </AddIconButtonContainer>
      )}

      {/* Emoji Picker */}
      <EmojiPickerContainer
        isOpen={emojiPickerIsOpen}
        hasIcon={hasIcon()}
        onClick={(event) => event.stopPropagation()}
      >
        <EmojiPicker onClick={pickEmojiOnClick} />
      </EmojiPickerContainer>
    </GoalManagerContainer>
  )
}

type FieldProps = { name: string; icon: IconDefinition }
type EmojiPickerContainerProps = { isOpen: boolean; hasIcon: boolean }

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
  display: flex;
  align-items: center;
`

const EmojiPickerContainer = styled.div<EmojiPickerContainerProps>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: absolute;
  top: ${(props) => (props.hasIcon ? '10rem' : '2rem')};
  left: 0;
`

const IconDisplay = styled.div`
  font-size: 3rem;
  margin-right: 1rem;
`

const Placeholder = styled.div`
  font-size: 1.5rem;
  color: gray;
`

const EmojiButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  background-color: #ffcc00;
  color: black;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 1rem;
`

export default GoalManager

const AddIconButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`

const AddIconButtonText = styled.span`
  margin-left: 0.5rem;
  font-size: 1.2rem;
  color: gray;
`
