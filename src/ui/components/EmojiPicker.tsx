import { EmojiData, Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import { useAppSelector } from '../../store/hooks'
import { selectMode } from '../../store/themeSlice'

type Props = { onClick: (emoji: EmojiData) => void }

export default function EmojiPicker(props: Props) {
  const theme = useAppSelector(selectMode)

  return (
    <Picker
      theme={theme}
      showPreview={false}
      showSkinTones={false}
      onClick={(emoji) => props.onClick(emoji)}
      color="primary"
    />
  )
}
