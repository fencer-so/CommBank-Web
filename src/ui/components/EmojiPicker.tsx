import { BaseEmoji, Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import { useAppSelector } from '../../store/hooks'
import { selectMode } from '../../store/themeSlice'

type Props = { onClick: (emoji: BaseEmoji) => void }

export default function EmojiPicker(props: Props) {
  const theme = useAppSelector(selectMode)

  const handleClick = (emoji: BaseEmoji, event: React.MouseEvent) => {
    props.onClick(emoji)
  }

  return (
    <Picker
      theme={theme}
      showPreview={false}
      showSkinTones={false}
      onClick={handleClick}
      color="primary"
    />
  )
}
