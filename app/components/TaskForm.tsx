"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

type Task = {
  id: string;
  title: string;
  description: string;
  column: string;
};

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id">) => void;
  initialTask?: Task;
  columns: string[];
}

export default function TaskForm({
  open,
  onClose,
  onSubmit,
  initialTask,
  columns,
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    column: "backlog",
  });

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title,
        description: initialTask.description,
        column: initialTask.column,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        column: "backlog",
      });
    }
  }, [initialTask, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert("Please enter a task title");
      return;
    }
    onSubmit(formData);
    onClose();
    setFormData({
      title: "",
      description: "",
      column: "backlog",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialTask ? "Edit Task" : "Create New Task"}</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <TextField
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            multiline
            rows={4}
          />
          <FormControl fullWidth>
            <InputLabel>Column</InputLabel>
            <Select
              name="column"
              value={formData.column}
              onChange={handleChange}
              label="Column"
            >
              {columns.map((col) => (
                <MenuItem key={col} value={col}>
                  {col
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialTask ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
