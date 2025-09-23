# Novel Editor Integration

This project now includes the Novel editor - a Notion-style WYSIWYG editor with AI-powered features.

## 🚀 Quick Start

### 1. Access the Editor

Visit: `http://localhost:5173/novel-editor` (or your dev server URL)

### 2. Use in Your Components

```jsx
import { NovelEditor } from './components/novel-editor';

function MyComponent() {
  const handleUpdate = (data) => {
    console.log('Editor data:', data);
    // data contains: json, html, markdown, text, wordCount, charCount
  };

  return (
    <NovelEditor
      onUpdate={handleUpdate}
      placeholder="Start writing..."
      showStatusBar={true}
      showWordCount={true}
      autoSave={true}
    />
  );
}
```

## 📁 Files Added

- `src/components/novel-editor/NovelEditor.jsx` - Main editor component
- `src/components/novel-editor/extensions.js` - Editor extensions configuration
- `src/components/novel-editor/slash-command.jsx` - Slash command menu items
- `src/components/novel-editor/index.js` - Export file
- `src/components/novel-editor/NovelEditorExample.jsx` - Usage example
- `src/pages/NovelEditorDemo.jsx` - Demo page
- `src/router/index.jsx` - Updated with new route

## ✨ Features

- **Slash Commands**: Type `/` to see all available commands
- **Bubble Menu**: Select text to see formatting options
- **Image Upload**: Drag & drop or paste images
- **Math Equations**: Support for LaTeX math
- **Code Highlighting**: Syntax highlighting for code blocks
- **YouTube/Twitter**: Embed videos and tweets
- **Auto-save**: Automatically saves to localStorage
- **Dark Mode**: Supports your app's dark mode
- **Responsive**: Works on all screen sizes

## 🎯 Available Commands

Type `/` and you'll see:

- **Headings** (H1, H2, H3)
- **Lists** (Bullet, Numbered, Task)
- **Code Block**
- **Quote**
- **Horizontal Rule**
- **Image**
- **Math Equation**
- **YouTube Video**
- **Twitter Tweet**

## 🔧 Customization

### Props

```jsx
<NovelEditor
  initialContent={jsonContent}     // Initial content as JSON
  onUpdate={handleUpdate}          // Callback when content changes
  className="custom-class"         // Additional CSS classes
  placeholder="Custom placeholder" // Placeholder text
  showStatusBar={true}             // Show save status
  showWordCount={true}             // Show word count
  autoSave={true}                  // Auto-save to localStorage
  saveDelay={500}                  // Auto-save delay in ms
/>
```

### Styling

The editor uses Tailwind CSS classes and respects your app's dark mode. You can customize styles by:

1. Modifying the component's className props
2. Adding custom CSS for specific elements
3. Using Tailwind utility classes

### Image Upload

To enable image upload, update the `uploadFn` in `NovelEditor.jsx`:

```jsx
const uploadFn = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  return data.url;
};
```

## 🔄 Integration with Existing Components

### Replace TipTap Editor

```jsx
// Instead of your current TipTap editor
import { NovelEditor } from './components/novel-editor';

// Use Novel editor
<NovelEditor
  onUpdate={(data) => {
    // Handle the data the same way as your current editor
    console.log(data.json); // JSON content
    console.log(data.html); // HTML content
  }}
/>
```

### Add to Forms

```jsx
function MyForm() {
  const [formData, setFormData] = useState({});
  
  return (
    <form>
      <input name="title" />
      <NovelEditor
        onUpdate={(data) => {
          setFormData(prev => ({
            ...prev,
            content: data.json,
            contentHtml: data.html
          }));
        }}
      />
      <button type="submit">Save</button>
    </form>
  );
}
```

## 🎨 Styling Integration

The editor automatically uses your app's:
- Dark mode classes (`dark:` prefix)
- Tailwind CSS utilities
- Color scheme
- Font families

## 📱 Mobile Support

The editor is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones
- Touch devices

## 🔍 Troubleshooting

### Common Issues

1. **Import errors**: Make sure you're importing from the correct path
2. **Styling issues**: Check that Tailwind CSS is properly configured
3. **Image upload**: Implement the `uploadFn` for your backend
4. **Dark mode**: Ensure your app's dark mode classes are working

### Debug Mode

Add this to see detailed logs:

```jsx
<NovelEditor
  onUpdate={(data) => {
    console.log('Editor update:', data);
  }}
  // ... other props
/>
```

## 🚀 Next Steps

1. **Test the editor**: Visit `/novel-editor` to try it out
2. **Customize**: Modify the slash commands and styling as needed
3. **Integrate**: Use it in your existing components
4. **Backend**: Set up image upload API endpoint
5. **AI Features**: Add AI completion features if needed

## 📚 More Information

- [Novel Documentation](https://novel.sh/docs)
- [TipTap Documentation](https://tiptap.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

The editor is now ready to use in your project! 🎉
