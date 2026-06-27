import { BaseEmoji, Picker } from 'emoji-mart'
// @ts-ignore
import 'emoji-mart/css/emoji-mart.css'
import React from 'react'
import { useAppSelector } from '../../store/hooks'
import { selectMode } from '../../store/themeSlice'

type Props = { onClick: (emoji: BaseEmoji, event: React.MouseEvent) => void }

export default function EmojiPicker(props: Props) {
  const theme = useAppSelector(selectMode)

  return (
    <Picker
      theme={theme === 'dark' ? 'dark' : 'light'}
      showPreview={false}
      showSkinTones={false}
      onClick={(emoji: BaseEmoji, event: React.MouseEvent) => {
        props.onClick(emoji, event)
      }}
      color="#FDD835"
    />
  )
}