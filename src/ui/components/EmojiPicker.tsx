import { BaseEmoji, Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import { useAppSelector } from '../../store/hooks'
import { selectMode } from '../../store/themeSlice'

type Props = { onClick: (emoji: BaseEmoji, event: React.MouseEvent) => void; }

export default function EmojiPicker({ onClick }: Props) {
  const theme = useAppSelector(selectMode);

  return (
    <Picker
      theme={theme}
      showPreview={false}
      showSkinTones={false}
      onClick={onClick}
      color="primary"
    />
  )
}
