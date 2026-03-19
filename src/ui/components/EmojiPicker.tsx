import Picker from '@emoji-mart/react'
import { useAppSelector } from '../../store/hooks'
import { selectMode } from '../../store/themeSlice'

interface Props {
  onClick: (emoji: any) => void;
}


export default function EmojiPicker(props: Props) {
  const theme = useAppSelector(selectMode)

return (
  <Picker 
    theme={theme}
    data={async () => {
      const response = await fetch('https://cdn.jsdelivr.net')
      return response.json()
    }}
    onEmojiSelect={(emoji: any) => props.onClick(emoji)}
    previewPosition="none" // Replaces showPreview={false}
    skinTonePosition="none" // Replaces showSkinTones={false}
  />
)

}