import React from 'react'
import { Picker, EmojiData } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import { useAppSelector } from '../../store/hooks'
import { selectMode } from '../../store/themeSlice'

type Props = {
  onClick: (emoji: EmojiData) => void // ✅ Remove event parameter
}

export default function EmojiPicker({ onClick }: Props) {
  const theme = useAppSelector(selectMode)

  return (
    <Picker
      set="apple"
      theme={theme === 'dark' ? 'dark' : 'light'}
      showPreview={false}
      showSkinTones={false}
      onSelect={onClick}
    />
  )
}
