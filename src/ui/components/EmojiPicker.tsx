import React from 'react';
import { BaseEmoji, Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { useAppSelector } from '../../store/hooks';
import { selectMode } from '../../store/themeSlice';

type Props = {
  onClick: (emoji: BaseEmoji, event: React.MouseEvent) => void;
};

const EmojiPickerWrapper: React.FC<Props> = ({ onClick }) => {
  const theme = useAppSelector(selectMode);

  return (
    <Picker
      theme={theme}
      showPreview={false}
      showSkinTones={false}
      onClick={onClick}
      color="primary"
    />
  );
};

export default EmojiPickerWrapper;
