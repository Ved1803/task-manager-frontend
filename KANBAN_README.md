# Jira-Style Kanban Board Implementation

A modern, responsive Kanban board built with React and @dnd-kit for drag-and-drop functionality. This implementation provides a Jira-like experience across desktop, laptop, and mobile devices.

## ✨ Features

### 🎯 Core Functionality
- **Drag & Drop**: Seamless task movement between status columns
- **Real-time Updates**: Automatic board refresh when tasks change status
- **API Integration**: Full backend synchronization with your existing API
- **Responsive Design**: Optimized for desktop, laptop, and mobile devices

### 📱 Responsive Layout
- **Desktop/Laptop**: Horizontal flex layout with all columns visible
- **Mobile**: Horizontal scrolling with snap-to-column behavior
- **Touch Support**: Optimized for touch devices with proper drag gestures

### 🎨 Visual Design
- **Modern UI**: Glassmorphism effects with backdrop blur
- **Status Indicators**: Color-coded status badges with icons
- **Priority Badges**: Visual priority indicators (High, Medium, Low)
- **Assignee Avatars**: User avatars with fallback images
- **Dark Mode**: Automatic dark mode detection and styling

### 🔧 Technical Features
- **Error Handling**: Graceful fallback to demo data if API fails
- **Loading States**: Smooth loading animations
- **Keyboard Support**: Full keyboard navigation for accessibility
- **Performance**: Optimized rendering with React best practices

## 🚀 Installation & Setup

### Dependencies
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Component Structure
```
src/components/task/
├── KanbanBoard.jsx      # Main Kanban board component
├── KanbanBoard.css      # Comprehensive styling
└── TaskTable.jsx        # Original table view (still available)
```

## 📡 API Integration

### Fetch Tasks by Status
```javascript
GET /api/v1/projects/:project_id/tasks/grouped_by_status
```

**Headers:**
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

**Optional Parameters:**
```javascript
{
  user_id: 123  // Optional: filter tasks for specific user
}
```

**Response Format:**
```javascript
{
  "todo": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Task description",
      "status": "todo",
      "priority": "high",
      "assigned_to": {
        "id": 1,
        "name": "John Doe"
      }
    }
  ],
  "in_progress": [...],
  "review": [...],
  "done": [...]
}
```

### Update Task Status
```javascript
PATCH /api/v1/projects/:project_id/tasks/:task_id
```

**Payload:**
```javascript
{
  "status": "new_status"
}
```

## 🎯 Usage

### Basic Implementation
```jsx
import KanbanBoard from './components/task/KanbanBoard';

const Tasks = () => {
  const location = useLocation();
  const { projectId } = location.state || {};

  return <KanbanBoard projectId={projectId} />;
};
```

### Status Configuration
The board automatically handles these statuses:
- `todo` / `to do`
- `in_progress` / `in progress`
- `review`
- `done` / `completed`

## 📱 Responsive Breakpoints

### Desktop (1200px+)
- Full horizontal layout
- All columns visible
- Maximum column width: 320px

### Laptop (900px-1199px)
- Adjusted spacing
- Responsive typography
- Optimized for smaller screens

### Tablet (768px-899px)
- Reduced column width: 300px
- Compact header layout
- Touch-optimized interactions

### Mobile (≤768px)
- Horizontal scrolling layout
- Column width: 260px-280px
- Snap-to-column scrolling
- Touch-friendly drag gestures

### Small Mobile (≤480px)
- Ultra-compact layout
- Column width: 240px
- Minimal padding and spacing

## 🎨 Design System

### Colors
- **Primary**: `#4f8cff` to `#7f9cf5` gradient
- **Status Colors**:
  - Todo: `#e2e8f0` (Light Gray)
  - In Progress: `#fef3c7` (Light Yellow)
  - Review: `#dbeafe` (Light Blue)
  - Done: `#dcfce7` (Light Green)
- **Priority Colors**:
  - High: `#ef4444` (Red)
  - Medium: `#f59e0b` (Orange)
  - Low: `#10b981` (Green)

### Typography
- **Font**: Poppins (Google Fonts)
- **Weights**: 200, 300, 400, 500, 600, 700
- **Responsive sizing** for all screen sizes

### Effects
- **Glassmorphism**: Backdrop blur with transparency
- **Shadows**: Layered shadow system
- **Animations**: Smooth transitions and hover effects
- **Gradients**: Modern gradient backgrounds

## 🔧 Customization

### Adding New Statuses
1. Update the `statuses` array in `KanbanBoard.jsx`
2. Add status colors and icons in the helper functions
3. Update the `getStatusTitle` function for display names

### Modifying Column Layout
```css
.kanban-column {
  min-width: 320px;  /* Adjust column width */
  max-width: 320px;
}
```

### Custom Styling
The CSS is modular and well-organized. Key classes:
- `.kanban-board`: Main container
- `.kanban-column`: Individual status columns
- `.task-card`: Task cards
- `.board-container.desktop`: Desktop layout
- `.board-container.mobile`: Mobile layout

## 🐛 Error Handling

### API Failures
- Automatic fallback to demo data
- User-friendly error messages
- Retry functionality
- Console logging for debugging

### Network Issues
- Graceful degradation
- Loading states
- Offline-friendly design

## ♿ Accessibility

### Keyboard Navigation
- Full keyboard support via @dnd-kit
- Tab navigation through all interactive elements
- Screen reader compatibility

### Visual Accessibility
- High contrast color schemes
- Clear visual hierarchy
- Proper focus indicators
- Dark mode support

## 🚀 Performance Optimizations

### React Best Practices
- Memoized components where appropriate
- Efficient re-rendering
- Optimized state management

### CSS Optimizations
- Hardware-accelerated animations
- Efficient selectors
- Minimal repaints and reflows

### Bundle Size
- Tree-shaking for @dnd-kit
- Optimized imports
- Minimal dependencies

## 🔄 State Management

### Local State
- `tasksByStatus`: Tasks grouped by status
- `loading`: Loading state indicator
- `error`: Error state management
- `isMobileView`: Responsive layout detection

### API Synchronization
- Real-time status updates
- Optimistic UI updates
- Rollback on API failures
- Automatic refresh on errors

## 📊 Demo Data

When the API is unavailable, the board shows demo data:
```javascript
{
  todo: [
    { id: 1, title: 'Design Homepage', description: 'Create wireframes...', status: 'todo', priority: 'high', assignee: { id: 1, name: 'John Doe' } },
    { id: 2, title: 'Setup Database', description: 'Configure database...', status: 'todo', priority: 'medium' }
  ],
  in_progress: [...],
  review: [...],
  done: [...]
}
```

## 🎯 Future Enhancements

### Planned Features
- **Filters**: Filter by assignee, priority, or date
- **Search**: Global task search functionality
- **Bulk Actions**: Multi-select and bulk operations
- **Real-time Collaboration**: WebSocket integration
- **Custom Fields**: Configurable task properties
- **Analytics**: Task completion metrics

### Technical Improvements
- **Virtual Scrolling**: For large task lists
- **Offline Support**: Service worker integration
- **Progressive Web App**: PWA capabilities
- **Advanced Animations**: More sophisticated transitions

## 🤝 Contributing

### Code Style
- Follow existing component patterns
- Use consistent naming conventions
- Maintain responsive design principles
- Add proper error handling

### Testing
- Test on multiple devices and screen sizes
- Verify drag-and-drop functionality
- Check API integration
- Validate accessibility features

---

**Built with ❤️ using React, @dnd-kit, and modern CSS** 