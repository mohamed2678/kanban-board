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

  // Update form data when task changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (initialTask) {
      setFormData({
        title: initialTask.title,
        description: initialTask.description,
        column: initialTask.column,
      });
    }
  }, [initialTask]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        title: "",
        description: "",
        column: "backlog",
      });
    }
  }, [open]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    e: { target: { name: string | undefined; value: unknown } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name || "column"]: value,
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
            onChange={handleTextChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleTextChange}
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
              onChange={handleSelectChange}
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
