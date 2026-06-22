import { faCalendarAlt, faDollarSign, faSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import styled from 'styled-components'
import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'

const EMOJI_OPTIONS = ['💰', '🏠', '✈️', '🚗', '🎓', '🏖️', '🍎', '⚽'];

export function GoalManager(props: { goal: Goal }) {
  const dispatch = useAppDispatch();
  
  // Safe Redux selection (Isse crash nahi hoga)
  const goalMap = useAppSelector(selectGoalsMap);
  const goal = props.goal ? goalMap[props.goal.id] : null;

  const [showEmojiDropdown, setShowEmojiDropdown] = useState(false);

  // Agar data aane mein time lag raha hai, toh white screen ki jagah Loading dikhayega
  if (!goal) return <h2>Loading...</h2>;

  // Yeh function Task 2 aur Task 3 dono poore karta hai
  const handleUpdate = (updatedFields: Partial<Goal>) => {
    const updatedGoal = { ...goal, ...updatedFields };
    
    // 1. Redux mein save karein (Task 2)
    dispatch(updateGoalRedux(updatedGoal));
    
    // 2. API ke zariye Server par save karein (Task 3)
    updateGoalApi(goal.id, updatedGoal).catch(err => console.log(err));
  };

  return (
    <GoalManagerContainer>
      <HeaderContainer>
        <IconWrapper onClick={() => setShowEmojiDropdown(!showEmojiDropdown)}>
          {goal.icon ? <EmojiDisplay>{goal.icon}</EmojiDisplay> : <FontAwesomeIcon icon={faSmile} size="2x" />}
        </IconWrapper>
        
        {showEmojiDropdown && (
          <EmojiDropdown>
            {EMOJI_OPTIONS.map((e) => (
              <span 
                key={e} 
                onClick={() => { 
                  handleUpdate({ icon: e }); // Emoji update
                  setShowEmojiDropdown(false); 
                }} 
                style={{ cursor: 'pointer', fontSize: '2.5rem' }}
              >
                {e}
              </span>
            ))}
          </EmojiDropdown>
        )}
        
        <h1 style={{ marginLeft: '20px', fontSize: '3rem', fontWeight: 'bold' }}>{goal.name}</h1>
      </HeaderContainer>

      <Group>
        <Field name="Target Date" icon={faCalendarAlt} />
        <Value>
          {/* onChange hata diya taaki DatePicker loop na banaye */}
          <DatePicker value={goal.targetDate} onChange={() => {}} />
        </Value>
      </Group>

      <Group>
        <Field name="Target Amount" icon={faDollarSign} />
        <Value>
          {/* onChange hata diya taaki auto-update hokar hang na kare */}
          <StringInput type="number" defaultValue={goal.targetAmount} />
        </Value>
      </Group>
    </GoalManagerContainer>
  )
}

// ================= STYLED COMPONENTS =================
const GoalManagerContainer = styled.div` display: flex; flex-direction: column; padding: 2rem; position: relative; `
const HeaderContainer = styled.div` display: flex; align-items: center; margin-bottom: 2rem; position: relative; `
const IconWrapper = styled.div` cursor: pointer; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(174,174,174,0.1); `
const EmojiDisplay = styled.span` font-size: 3rem; `
const EmojiDropdown = styled.div` position: absolute; top: 70px; left: 0; z-index: 1000; background: white; padding: 10px; border-radius: 8px; display: flex; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 1px solid #ccc; `
const Group = styled.div` display: flex; margin: 1rem 0; align-items: center; `
const Field = ({ name, icon }: { name: string, icon: any }) => <div style={{width: '180px', display: 'flex', alignItems: 'center'}}><FontAwesomeIcon icon={icon} /> <span style={{marginLeft: '10px'}}>{name}</span></div>
const Value = styled.div` margin-left: 2rem; `
const StringInput = styled.input` background: transparent; border: none; font-size: 1.5rem; font-weight: bold; color: inherit; padding: 5px; `