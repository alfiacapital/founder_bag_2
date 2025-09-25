import React from 'react';
import EmojiPicker from 'emoji-picker-react';

const CustomEmojiPicker = ({ onSelect, onClose, position = { top: 0, left: 0 } }) => {
  const handleEmojiClick = (emojiObject) => {
    onSelect(emojiObject.emoji);
    onClose();
  };

  return (
    <div 
      className="emoji-picker-container"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 9999,
      }}
    >
      <div className="emoji-picker-wrapper">
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          autoFocusSearch={true}
          theme="auto"
          emojiStyle="apple"
          defaultSkinTone="neutral"
          lazyLoadEmojis={false}
          searchPlaceholder="Search emojis..."
          suggestedEmojisMode="frequent"
          skinTonesDisabled={false}
          width={350}
          height={450}
          previewConfig={{
            showPreview: true,
            defaultCaption: "Choose an emoji"
          }}
        />
      </div>
    </div>
  );
};

export default CustomEmojiPicker;