"use client";

import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import KanbanColumn from "./components/KanbanColumn";
import TaskForm from "./components/TaskForm";

type Task = {
  id: string;
  title: string;
  description: string;
  column: string;
};

const COLUMNS = ["backlog", "in-progress", "review", "done"];

// Mock API functions (replace with actual API calls)
const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch("/api/tasks");
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
};

const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
};

const updateTask = async (task: Task): Promise<Task> => {
  const response = await fetch("/api/tasks", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
};

const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch("/api/tasks", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) throw new Error("Failed to delete task");
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setOpenForm(false);
      setEditingTask(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const task = data.find((t) => t.id === draggableId);

    if (!task) return;

    if (task.column !== destination.droppableId) {
      updateMutation.mutate({
        ...task,
        column: destination.droppableId,
      });
    }
  };

  const handleCreateTask = (taskData: Omit<Task, "id">) => {
    if (editingTask) {
      updateMutation.mutate({
        ...editingTask,
        ...taskData,
      });
      setEditingTask(undefined);
    } else {
      createMutation.mutate(taskData);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingTask(undefined);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">📋 Kanban Board</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ marginTop: "20px" }}>
        {/* Search and Create Section */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginBottom: 3,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ flex: 1, minWidth: "200px" }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingTask(undefined);
              setOpenForm(true);
            }}
            sx={{ minWidth: "150px" }}
          >
            Add Task
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            Failed to load tasks. Please try again later.
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Kanban Board */}
        {!isLoading && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 2,
              }}
            >
              {COLUMNS.map((column) => (
                <KanbanColumn
                  key={column}
                  columnId={column}
                  columnName={column}
                  tasks={data}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  searchQuery={search}
                />
              ))}
            </Box>
          </DragDropContext>
        )}

        {/* Summary */}
        {!isLoading && (
          <Box sx={{ marginTop: 3, textAlign: "center", color: "#666" }}>
            <Typography variant="body2">
              Total Tasks: {data.length} | Backlog:{" "}
              {data.filter((t) => t.column === "backlog").length} | In
              Progress:{" "}
              {data.filter((t) => t.column === "in-progress").length}{" "}
              | Review:{" "}
              {data.filter((t) => t.column === "review").length} | Done:{" "}
              {data.filter((t) => t.column === "done").length}
            </Typography>
          </Box>
        )}
      </Container>

      {/* Task Form Dialog */}
      <TaskForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleCreateTask}
        initialTask={editingTask}
        columns={COLUMNS}
      />
    </div>
  );
}
