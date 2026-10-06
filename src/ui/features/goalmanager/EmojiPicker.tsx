import { EmojiData, Picker as EmojiMartPicker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import React, { useEffect } from 'react'
import styled from 'styled-components'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelect: (icon: string) => void
}

export default function EmojiPicker(props: Props) {
  const { isOpen, onClose, onSelect } = props

  useEffect(() => {
    if (!isOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const selectEmoji = (emoji: EmojiData) => {
    const icon = 'native' in emoji ? emoji.native : emoji.colons
    if (icon) onSelect(icon)
    onClose()
  }

  return (
    <Overlay>
      <Backdrop type="button" aria-label="Close emoji picker" onClick={onClose} />
      <PickerContainer role="dialog" aria-modal="true" aria-label="Select an emoji">
        <EmojiMartPicker onSelect={selectEmoji} />
      </PickerContainer>
    </Overlay>
  )
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
`

const Backdrop = styled.button`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: default;
`

const PickerContainer = styled.div`
  position: relative;
  z-index: 1;
`
