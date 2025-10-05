# 🎯 Focus Mode - Feature Documentation

## Overview
Focus Mode is a distraction-free productivity feature that opens in a new tab, allowing users to concentrate on one task at a time using the Pomodoro Technique with fully customizable timers.

## 🚀 Key Features

### 1. **Opens in New Tab**
- Clean, dedicated page for distraction-free focus
- Can work on multiple tasks across different tabs
- Maintains your main task board state

### 2. **Customizable Pomodoro Timer**
- **Focus Time**: Default 25 minutes (fully customizable 1-120 min)
- **Short Break**: Default 5 minutes (fully customizable 1-120 min)
- **Long Break**: Default 15 minutes (fully customizable 1-120 min)
- Live timer in browser tab title
- Visual progress ring around timer
- Auto-switches to breaks after focus sessions
- Long break after every 4 pomodoros

### 3. **Timer Presets**
Quick-switch between different work styles:
- **Classic**: 25/5/15 (Traditional Pomodoro)
- **Extended**: 50/10/30 (Deep work sessions)
- **Short**: 15/3/10 (Quick sprints)
- **Balanced**: 45/15/30 (Balanced approach)

### 4. **Advanced Settings**
- **Editable Timer Durations**: Click any duration to edit (1-120 minutes)
- **Auto-start Options**: 
  - Auto-start breaks after focus sessions
  - Auto-start pomodoros after breaks
- **Sound Notifications**: Toggle timer completion sounds
- **Persistent Settings**: All settings saved to localStorage

### 5. **Task Management**
- View complete task details (title, estimated time, due date)
- Display and track subtasks with completion status
- Complete tasks directly from focus mode
- Delete tasks from focus mode
- Navigate between incomplete tasks with buttons or keyboard

### 6. **Session Statistics**
Real-time tracking:
- Completed pomodoros counter
- Total focus time calculation
- Visual session progress

### 7. **Keyboard Shortcuts**
- `ESC` - Exit focus mode (return to task board)
- `SPACE` - Start/Pause timer
- `←` - Previous task
- `→` - Next task

### 8. **Visual Enhancements**
- Circular progress indicator around timer
- Color-coded timer modes:
  - 🔵 Blue for Focus
  - 🟢 Green for Short Break
  - 🟣 Purple for Long Break
- Animated running indicator (pulsing dot)
- Dark theme optimized for eye comfort
- Smooth transitions and animations

## 📱 How to Use

### Starting Focus Mode

**Option 1: From Task Board**
1. Click the "Focus Mode" button at the top of the task board
2. Opens in a new tab with the first incomplete task

**Option 2: From Task Card**
1. Hover over any task card
2. Click the focus icon (🎯) in the action buttons
3. Opens in a new tab with that specific task

### Using the Timer

1. **Select Timer Mode**: Choose between Focus, Short Break, or Long Break
2. **Start Timer**: Click "Start" button or press `SPACE`
3. **Pause if Needed**: Click "Pause" or press `SPACE` again
4. **Reset Timer**: Click the reset button if you need to restart

### Customizing Timer Durations

1. Click the **Settings** icon (⚙️) in the top right
2. Click on any duration number to edit it
3. Enter your desired time (1-120 minutes)
4. Press Enter or click outside to save
5. Or use Quick Presets for instant configuration

### Managing Tasks

- **Complete Task**: Click the checkmark icon
- **Delete Task**: Click the trash icon
- **Navigate**: Use arrow buttons or keyboard shortcuts
- **View Progress**: Check "Task X of Y" at the bottom

## 🎨 UI Components

### Header
- Exit button (returns to task board)
- Running status indicator (green when active)
- Pomodoro counter (🍅 X Pomodoros)
- Sound toggle (mute/unmute)
- Settings button

### Settings Panel (Collapsible)
- Timer duration editors
- Quick preset buttons
- Auto-start toggles
- Session statistics

### Main Focus Area
- Timer mode selector
- Large timer display with progress ring
- Start/Pause and Reset buttons
- Task card with full details
- Subtasks list with progress
- Navigation controls

## 💡 Tips for Maximum Productivity

1. **Start with Defaults**: Try the classic 25/5/15 timing first
2. **Customize Gradually**: Adjust timers based on your natural focus patterns
3. **Use Auto-start**: Enable for uninterrupted flow
4. **Track Progress**: Monitor your pomodoro count to gauge productivity
5. **Honor Breaks**: Don't skip breaks - they're essential for sustained focus
6. **Multiple Tabs**: Open different tasks in different tabs for quick switching

## 🔧 Technical Details

### Routes
**Task Board**: `/space/:id/board`  
**Focus Mode**: `/space/:id/focus?taskId=<taskId>`

### URL Parameters
- `id`: The workspace/space ID
- `taskId`: (optional) Specific task to focus on

### Navigation Flow
1. User clicks Focus Mode button → Opens new tab at `/space/:id/focus?taskId=<taskId>`
2. User clicks Exit/ESC → Navigates back to `/space/:id/board`
3. All tasks deleted → Auto-redirects to task board after 2 seconds

### Local Storage Keys
- `focusModeSettings`: Stores all user preferences

### Data Persistence
- Timer settings persist across sessions
- Auto-start preferences saved
- Sound preferences saved
- Custom durations maintained

## 🎯 Integration Points

### TaskBoard Component
- Provides "Focus Mode" button
- Handles opening new tab with task context
- Filters incomplete tasks for focus mode

### Task Cards
- Individual focus buttons on each card
- Direct access to focus on specific tasks

### API Endpoints Used
- `GET /user-tasks/:spaceId` - Fetch tasks
- `PUT /tasks/complete/:taskId` - Complete task
- `DELETE /tasks/:taskId` - Delete task

## 🌟 Future Enhancement Ideas

- Timer sound customization
- Detailed productivity analytics
- Focus time goals and achievements
- Task notes/description in focus mode
- Distraction log (track interruptions)
- Team focus sessions (collaborative mode)
- Integration with calendar events
- Mobile app support

## 📊 Benefits

✅ **Improved Focus**: Eliminates distractions from the main board
✅ **Flexible Timing**: Adapts to your personal work rhythm
✅ **Better Time Management**: Track actual time spent on tasks
✅ **Reduced Context Switching**: Focus on one task at a time
✅ **Gamification**: Pomodoro counter motivates completion
✅ **Accessibility**: Full keyboard support for power users

---

**Version**: 2.0  
**Last Updated**: 2025  
**Component**: `src/pages/space/FocusModePage.jsx`

