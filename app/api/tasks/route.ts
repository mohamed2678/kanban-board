interface Task {
  id: string;
  title: string;
  description: string;
  column: string;
}

// Initialize with sample tasks
let tasks: Task[] = [
  // Backlog tasks
  {
    id: "1",
    title: "Setup project",
    description: "Initialize Next.js app with TypeScript and ESLint configuration",
    column: "backlog",
  },
  {
    id: "2",
    title: "Design database schema",
    description: "Create entity-relationship diagram for the task management system",
    column: "backlog",
  },
  {
    id: "3",
    title: "Implement user authentication",
    description: "Add JWT-based authentication with NextAuth.js",
    column: "backlog",
  },
  {
    id: "4",
    title: "Create API documentation",
    description: "Write comprehensive API docs using Swagger/OpenAPI",
    column: "backlog",
  },
  {
    id: "5",
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing and deployment",
    column: "backlog",
  },

  // In Progress tasks
  {
    id: "6",
    title: "Build Kanban UI components",
    description: "Create drag-drop enabled task cards using Material UI",
    column: "in-progress",
  },
  {
    id: "7",
    title: "Implement React Query",
    description: "Setup React Query for server state management and caching",
    column: "in-progress",
  },
  {
    id: "8",
    title: "Create task CRUD operations",
    description: "Implement Create, Read, Update, Delete functionality for tasks",
    column: "in-progress",
  },

  // Review tasks
  {
    id: "9",
    title: "Add search functionality",
    description: "Implement real-time task search by title and description",
    column: "review",
  },
  {
    id: "10",
    title: "Implement pagination",
    description: "Add pagination controls to kanban columns for better UX",
    column: "review",
  },

  // Done tasks
  {
    id: "11",
    title: "Setup Material UI theme",
    description: "Configure Material UI theme and color scheme for the application",
    column: "done",
  },
  {
    id: "12",
    title: "Integrate drag-and-drop library",
    description: "Setup @hello-pangea/dnd for kanban board functionality",
    column: "done",
  },
  {
    id: "13",
    title: "Design responsive layout",
    description: "Ensure the application works on mobile, tablet, and desktop screens",
    column: "done",
  },
];

/**
 * GET /api/tasks
 * Retrieves all tasks
 */
export async function GET() {
  return Response.json(tasks);
}

/**
 * POST /api/tasks
 * Creates a new task
 * Body: { title: string, description: string, column: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation
    if (!body.title || typeof body.title !== "string") {
      return Response.json(
        { error: "Title is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.column || !["backlog", "in-progress", "review", "done"].includes(body.column)) {
      return Response.json(
        { error: "Invalid column value" },
        { status: 400 }
      );
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: body.title.trim(),
      description: body.description?.trim() || "",
      column: body.column,
    };

    tasks.push(newTask);
    return Response.json(newTask, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tasks
 * Updates an existing task
 * Body: { id: string, title?: string, description?: string, column?: string }
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return Response.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const taskIndex = tasks.findIndex((task) => task.id === body.id);
    if (taskIndex === -1) {
      return Response.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Update task with provided fields
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...(body.title && { title: body.title.trim() }),
      ...(body.description !== undefined && { description: body.description.trim() }),
      ...(body.column && { column: body.column }),
    };

    return Response.json(tasks[taskIndex]);
  } catch (error) {
    return Response.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks
 * Deletes a task by ID
 * Body: { id: string }
 */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return Response.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const initialLength = tasks.length;
    tasks = tasks.filter((task) => task.id !== id);

    if (tasks.length === initialLength) {
      return Response.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    return Response.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}