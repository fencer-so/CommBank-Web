import React from 'react'
import { BaseEmoji, Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

import { useAppSelector } from '../../../store/hooks'
import { selectMode } from '../../../store/themeSlice'

type Props = {
  onClick: (emoji: BaseEmoji, event: React.MouseEvent<HTMLElement>) => void
}

export default function EmojiPicker(props: Props) {
  const theme = useAppSelector(selectMode)

  return <Picker theme={theme} onClick={props.onClick} />
}