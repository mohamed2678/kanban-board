"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import TaskForm from "./components/TaskForm";
import KanbanColumn from "./components/KanbanColumn";

type Task = {
  id: string;
  title: string;
  description: string;
  column: string;
};

const COLUMNS = ["backlog", "in-progress", "review", "done"];

async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

async function createTask(task: Omit<Task, "id">) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

async function updateTask(task: Task) {
  const res = await fetch("/api/tasks", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

async function deleteTask(id: string) {
  const res = await fetch("/api/tasks", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: 1000 * 60 * 5, // 5 minutes
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

    // Only update if the column changed
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
    <>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            📋 Kanban Board
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
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
                  isLoading={false}
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
              {data.filter((t) => t.column === "backlog").length} | In Progress:{" "}
              {data.filter((t) => t.column === "in-progress").length} | Review:{" "}
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
    </>
  );
}
