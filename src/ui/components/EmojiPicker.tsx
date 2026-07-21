import { BaseEmoji, Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import React from 'react'
import { useAppSelector } from '../../store/hooks'
import { selectMode } from '../../store/themeSlice'

type Props = { onClick: (emoji: BaseEmoji, event: React.MouseEvent) => void }

export default function EmojiPicker(props: Props) {
  const mode = useAppSelector(selectMode)

  return <Picker theme={mode} onClick={props.onClick} />
}
