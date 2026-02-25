# 📋 Kanban Board Application

A modern, fully-functional Kanban-style ToDo list application built with **Next.js**, **React**, **Material UI**, and **React Query**. This application allows you to manage tasks across four columns (Backlog, In Progress, Review, Done) with drag-and-drop functionality, search, pagination, and more.

## ✨ Features

- **4-Column Kanban Board**: Organize tasks into Backlog, In Progress, Review, and Done columns
- **Drag-and-Drop**: Seamlessly move tasks between columns using the intuitive drag-and-drop interface
- **Create Tasks**: Add new tasks with title and description via a modal dialog
- **Edit Tasks**: Update existing tasks by editing their title, description, or column
- **Delete Tasks**: Remove tasks with confirmation to prevent accidental deletion
- **Search & Filter**: Real-time search functionality to filter tasks by title or description
- **Pagination**: Each column includes pagination with customizable items per page
- **Server-Side State Management**: React Query handles caching, synchronization, and background refetching
- **Responsive Design**: Mobile-friendly layout that works on all screen sizes
- **Material UI Components**: Professional-grade UI components for a polished user experience
- **Sample Data**: Pre-populated with 13 sample tasks to demonstrate functionality
- **Error Handling**: Graceful error messages and loading states

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with built-in API routes |
| **React 19** | UI library |
| **TypeScript** | Type-safe development |
| **Material UI (MUI) 7** | Component library and styling |
| **@tanstack/react-query 5** | Server state management and caching |
| **@hello-pangea/dnd 18** | Drag-and-drop functionality |
| **Emotion** | CSS-in-JS styling (required by MUI) |

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd kanban-board
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

All required dependencies are already listed in `package.json`:
- `@tanstack/react-query` - for data caching and server state
- `@hello-pangea/dnd` - for drag-and-drop functionality
- `@mui/material` and `@mui/icons-material` - for UI components
- `zustand` - for client state management (optional, available for future use)

### Step 3: Start the Development Server
```bash
npm run dev
# or
yarn dev
```

The application will start on **http://localhost:3000**

### Step 4: Build for Production
```bash
npm run build
npm start
```

## 🚀 Usage Guide

### Creating a Task
1. Click the **"+ Add Task"** button in the top-right
2. Fill in the task title (required) and description (optional)
3. Select the target column from the dropdown
4. Click **"Create"** to add the task

### Editing a Task
1. Hover over a task card and click the **pencil icon** (Edit)
2. Update the task details in the dialog
3. Click **"Update"** to save changes

### Deleting a Task
1. Hover over a task card and click the **trash icon** (Delete)
2. Confirm the deletion when prompted

### Moving Tasks Between Columns
1. Click and drag any task card
2. Drop it into the desired column
3. The task will automatically update in the database

### Searching Tasks
1. Use the **search bar** at the top to filter tasks
2. Search works across all columns and matches title or description
3. Results update in real-time as you type

### Pagination
- Each column shows up to **5 tasks per page** by default
- Use the pagination controls at the bottom of each column to navigate
- The page count updates automatically based on filtered results

## 📁 Project Structure

```
kanban-board/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       └── route.ts           # API endpoints for CRUD operations
│   ├── components/
│   │   ├── TaskForm.tsx           # Modal dialog for creating/editing tasks
│   │   ├── TaskCard.tsx           # Individual task card component
│   │   └── KanbanColumn.tsx       # Column component with pagination
│   ├── layout.tsx                 # Root layout with React Query provider
│   ├── page.tsx                   # Main Kanban board page
│   ├── globals.css                # Global styles
│   └── page.module.css            # Page-specific styles
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── next.config.ts                 # Next.js configuration
├── eslint.config.mjs             # ESLint configuration
└── README.md                      # This file
```

## 🔌 API Endpoints

All API endpoints are located at `/api/tasks` and handle JSON requests.

### GET /api/tasks
Retrieves all tasks.

**Response:**
```json
[
  {
    "id": "1",
    "title": "Setup project",
    "description": "Initialize Next.js app with TypeScript",
    "column": "backlog"
  }
]
```

### POST /api/tasks
Creates a new task.

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "column": "backlog"
}
```

**Response:** Returns the created task with a generated ID.

### PUT /api/tasks
Updates an existing task.

**Request Body:**
```json
{
  "id": "1",
  "title": "Updated Title",
  "description": "Updated description",
  "column": "in-progress"
}
```

**Response:** Returns the updated task.

### DELETE /api/tasks
Deletes a task by ID.

**Request Body:**
```json
{
  "id": "1"
}
```

**Response:** Returns success message.

## 🎨 Customization

### Items Per Page
To change the number of items displayed per page, modify the `ITEMS_PER_PAGE` constant in `app/components/KanbanColumn.tsx`:

```typescript
const ITEMS_PER_PAGE = 5; // Change to desired number
```

### Column Names/Order
To modify the columns, update the `COLUMNS` array in `app/page.tsx`:

```typescript
const COLUMNS = ["backlog", "in-progress", "review", "done"];
```

### Colors
Column-specific colors are defined in `KanbanColumn.tsx`:

```typescript
const columnColors: { [key: string]: string } = {
  backlog: "#fafafa",
  "in-progress": "#e3f2fd",
  review: "#fff3e0",
  done: "#e8f5e9",
};
```

## 🧪 Testing

### Manual Testing Checklist
- [x] Create a task with title and description
- [x] Edit existing task details
- [x] Delete a task with confirmation
- [x] Drag and drop tasks between columns
- [x] Search filters tasks by title and description
- [x] Pagination works in each column
- [x] Responsive design on mobile/tablet/desktop
- [x] Error handling displays messages
- [x] Loading states show while fetching data
- [x] React Query caches data efficiently

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Notes on Implementation

### Server State Management
- **React Query** handles all server state (tasks fetching, caching, mutations)
- Automatic cache invalidation after mutations
- Stale time set to 5 minutes for optimal performance
- Background refetching ensures data freshness

### Data Persistence
- Currently uses in-memory storage in the API route
- For production, replace with a database (PostgreSQL, MongoDB, etc.)
- All CRUD operations are ready for database integration

### Error Handling
- API endpoints validate input data
- User-friendly error messages on UI
- Confirmation dialogs prevent accidental operations
- React Query retry logic for failed requests

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms
The application is a standard Next.js project and can be deployed to:
- Netlify
- AWS Amplify
- Heroku
- DigitalOcean
- Any Node.js hosting provider

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Ensure all dependencies are installed:
```bash
npm install
```

### Issue: Drag-and-drop not working
**Solution:** Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Tasks not persisting after refresh
**Note:** This is expected behavior with the current in-memory API. To persist data:
1. Use a database backend
2. Or implement localStorage for client-side persistence

### Issue: Slow search performance
**Solution:** React Query caching automatically optimizes this. Consider increasing the `staleTime` value if needed.

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues, questions, or feedback, please open an issue on the GitHub repository.

---

**Built with ❤️ using Next.js and React**
