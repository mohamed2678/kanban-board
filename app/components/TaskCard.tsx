"use client";

import { Draggable } from "@hello-pangea/dnd";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
// @ts-expect-error - @mui/icons-material types not available
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

type Task = {
  id: string;
  title: string;
  description: string;
  column: string;
};

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({
  task,
  index,
  onDelete,
  onEdit,
}: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            marginBottom: "12px",
            ...provided.draggableProps.style,
          }}
        >
          <Card
            sx={{
              cursor: "grab",
              "&:active": { cursor: "grabbing" },
              transition: "all 0.2s",
              backgroundColor: snapshot.isDragging ? "#f5f5f5" : "white",
              boxShadow: snapshot.isDragging
                ? "0 5px 15px rgba(0,0,0,0.3)"
                : "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent sx={{ paddingBottom: "8px" }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  wordBreak: "break-word",
                }}
              >
                {task.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: "12px",
                  lineHeight: "1.4",
                  wordBreak: "break-word",
                }}
              >
                {task.description || "No description"}
              </Typography>
            </CardContent>
            <CardActions sx={{ padding: "8px", justifyContent: "flex-end" }}>
              <Tooltip title="Edit task">
                <IconButton
                  size="small"
                  onClick={() => onEdit(task)}
                  color="primary"
                >
                  <EditIcon sx={{ fontSize: "18px" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete task">
                <IconButton
                  size="small"
                  onClick={() => onDelete(task.id)}
                  color="error"
                >
                  <DeleteIcon sx={{ fontSize: "18px" }} />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
