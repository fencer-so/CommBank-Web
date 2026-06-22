import { faCalendarAlt, faDollarSign, faSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import React, { useState } from 'react'
import styled from 'styled-components'
import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import { Theme } from '../../components/Theme'

const EMOJI_OPTIONS = ['💰', '🏠', '✈️', '🚗', '🎓', '🏖️', '🍎', '⚽'];

type Props = { goal: Goal }

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()
  const goal = useAppSelector(selectGoalsMap)[props.goal.id]

  const [name, setName] = useState(goal.name)
  const [showEmojiDropdown, setShowEmojiDropdown] = useState(false)

  const handleUpdate = (updatedFields: Partial<Goal>) => {
    const updatedGoal = { ...goal, ...updatedFields }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(goal.id, updatedGoal)
  }

  return (
    <GoalManagerContainer>
      <HeaderContainer>
        <IconWrapper onClick={() => setShowEmojiDropdown(!showEmojiDropdown)}>
          {goal.icon ? <EmojiDisplay>{goal.icon}</EmojiDisplay> : <FontAwesomeIcon icon={faSmile} size="2x" />}
        </IconWrapper>
        
        {showEmojiDropdown && (
          <EmojiDropdown>
            {EMOJI_OPTIONS.map((e) => (
              <span key={e} onClick={() => { handleUpdate({ icon: e }); setShowEmojiDropdown(false); }} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>{e}</span>
            ))}
          </EmojiDropdown>
        )}
        
        <NameInput value={name} onChange={(e) => setName(e.target.value)} onBlur={() => handleUpdate({ name })} />
      </HeaderContainer>

      <Group>
        <Field name="Target Date" icon={faCalendarAlt} />
        <Value><DatePicker value={goal.targetDate} onChange={(date: MaterialUiPickersDate) => handleUpdate({ targetDate: date as Date })} /></Value>
      </Group>

      <Group>
        <Field name="Target Amount" icon={faDollarSign} />
        <Value><StringInput type="number" value={goal.targetAmount} onChange={(e) => handleUpdate({ targetAmount: parseFloat(e.target.value) })} /></Value>
      </Group>
    </GoalManagerContainer>
  )
}

// Styled Components
const GoalManagerContainer = styled.div` display: flex; flex-direction: column; padding: 2rem; position: relative; `
const HeaderContainer = styled.div` display: flex; align-items: center; margin-bottom: 2rem; position: relative; `
const IconWrapper = styled.div` cursor: pointer; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(174,174,174,0.1); `
const EmojiDisplay = styled.span` font-size: 3rem; `
const EmojiDropdown = styled.div` position: absolute; top: 70px; left: 0; z-index: 100; background: white; padding: 10px; border-radius: 8px; display: flex; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); `
const Group = styled.div` display: flex; margin: 1rem 0; align-items: center; `
const NameInput = styled.input` background: transparent; border: none; font-size: 3rem; font-weight: bold; color: ${({ theme }: { theme: Theme }) => theme.text}; `
const Field = ({ name, icon }: { name: string, icon: any }) => <div style={{width: '150px', display: 'flex', alignItems: 'center'}}><FontAwesomeIcon icon={icon} /> <span style={{marginLeft: '10px'}}>{name}</span></div>
const Value = styled.div` margin-left: 2rem; `
const StringInput = styled.input` background: transparent; border: none; font-size: 1.5rem; font-weight: bold; color: ${({ theme }: { theme: Theme }) => theme.text}; `