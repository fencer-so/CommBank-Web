import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import React from 'react';

// We removed the "event" requirement here so it matches the v3 Picker perfectly
type Props = { onClick: (emoji: any) => void }

export default function EmojiPicker(props: Props) {
  return (
    <Picker 
      showPreview={false}
      showSkinTones={false}
      onSelect={props.onClick} 
    />
  );
}