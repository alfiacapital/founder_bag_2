import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  MessageSquarePlus,
  Text,
  TextQuote,
  Twitter,
  Youtube,
  Smile,
} from "lucide-react";
import { Command, createSuggestionItems, renderItems } from "novel";
import { createRoot } from 'react-dom/client';
import EmojiPicker from 'emoji-picker-react';
import { axiosClient } from "@/api/axios.jsx";

// Image upload function
// This function uploads images to your backend (Vercel Blob) and returns the URL
const uploadFn = async (file) => {
  try {
    // Create FormData to send the file
    const formData = new FormData();
    formData.append('image', file);
    
    // Upload to your backend API
    const response = await axiosClient.post('/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Check if upload was successful
    if (response.data.success && response.data.url) {
      console.log('Image uploaded successfully:', response.data.url);
      return response.data.url;
    } else {
      throw new Error(response.data.message || 'Failed to upload image');
    }
    
  } catch (error) {
    console.error("Error uploading image:", error);
    
    // Show user-friendly error message
    const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image';
    alert(`Upload failed: ${errorMessage}`);
    
    // Don't use fallback - let user try again
    throw error;
  }
};

export const suggestionItems = createSuggestionItems([
  {
    title: "Emoji",
    description: "Insert an emoji.",
    searchTerms: ["emoji", "emoticon", "smiley"],
    icon: <Smile size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      
      // Create emoji picker container
      const pickerContainer = document.createElement('div');
      pickerContainer.className = 'emoji-picker-slash-container';
      pickerContainer.style.cssText = `
        position: fixed;
        z-index: 9999;
      `;
      
      // Get editor position
      const editorEl = editor.view.dom;
      const rect = editorEl.getBoundingClientRect();
      pickerContainer.style.top = `${rect.top + 40}px`;
      pickerContainer.style.left = `${rect.left}px`;
      
      document.body.appendChild(pickerContainer);
      
      // Create React root and render EmojiPicker
      const root = createRoot(pickerContainer);
      
      const handleEmojiClick = (emojiObject) => {
        editor.chain().focus().insertContent(emojiObject.emoji).run();
        root.unmount();
        pickerContainer.remove();
        document.removeEventListener('click', closeHandler);
      };
      
      const closeHandler = (e) => {
        if (!pickerContainer.contains(e.target)) {
          root.unmount();
          pickerContainer.remove();
          document.removeEventListener('click', closeHandler);
        }
      };
      
      // Render the emoji picker
      root.render(
        <div style={{ 
          background: 'var(--color-bg2)', 
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}>
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
      );
      
      // Add click outside listener after a short delay
      setTimeout(() => {
        document.addEventListener('click', closeHandler);
      }, 100);
    },
  },
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <Text size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    },
  },
  {
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "list", "check", "checkbox"],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote"],
    icon: <TextQuote size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run(),
  },
  {
    title: "Code",
    description: "Capture a code snippet.",
    searchTerms: ["codeblock"],
    icon: <Code size={18} />,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media"],
    icon: <ImageIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      // upload image
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          try {
            // Upload the file and get the URL
            const url = await uploadFn(file);
            
            // Insert the image into the editor at the current position
            editor.chain().focus().setImage({ src: url }).run();
          } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
          }
        }
      };
      input.click();
    },
  },
  {
    title: "Youtube",
    description: "Embed a Youtube video.",
    searchTerms: ["video", "youtube", "embed"],
    icon: <Youtube size={18} />,
    command: ({ editor, range }) => {
      const videoLink = prompt("Please enter Youtube Video Link");
      //From https://regexr.com/3dj5t
      const ytregex = new RegExp(
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/,
      );

      if (ytregex.test(videoLink)) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setYoutubeVideo({
            src: videoLink,
          })
          .run();
      } else {
        if (videoLink !== null) {
          alert("Please enter a correct Youtube Video Link");
        }
      }
    },
  },
  {
    title: "Twitter",
    description: "Embed a Tweet.",
    searchTerms: ["twitter", "embed"],
    icon: <Twitter size={18} />,
    command: ({ editor, range }) => {
      const tweetLink = prompt("Please enter Twitter Link");
      const tweetRegex = new RegExp(/^https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]{1,15})(\/status\/(\d+))?(\/\S*)?$/);

      if (tweetRegex.test(tweetLink)) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setTweet({
            src: tweetLink,
          })
          .run();
      } else {
        if (tweetLink !== null) {
          alert("Please enter a correct Twitter Link");
        }
      }
    },
  },
]);

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});
