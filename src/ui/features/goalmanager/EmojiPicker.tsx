import { BaseEmoji, Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import { Goal } from '../../../api/types'
import { useAppSelector } from '../../store/hooks'
import { selectMode } from '../../store/themeSlice'

type Props = { onClick: (emoji: BaseEmoji, event: React.MouseEvent) => void }

export default function EmojiPicker(props: Props) {
  const theme = useAppSelector(selectMode)

  return (
    <Picker
      theme={theme}
      showPreview={false}
      showSkinTones={false}
      onClick={props.onClick}
      color="primary"
    />
  )
}

const pickEmojiOnClick = (emoji: BaseEmoji, event: MouseEvent) => {
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

function updateGoalRedux(updatedGoal: Goal): any {
    throw new Error('Function not implemented.')
}
function setEmojiPickerIsOpen(arg0: boolean) {
    throw new Error('Function not implemented.')
}

function setIcon(native: string) {
    throw new Error('Function not implemented.')
}

function dispatch(arg0: any) {
    throw new Error('Function not implemented.')
}

