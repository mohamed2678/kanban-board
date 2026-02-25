"use client";

import { Droppable } from "@hello-pangea/dnd";
import { useState, useMemo } from "react";
import {
  Paper,
  Typography,
  Pagination,
  Box,
  CircularProgress,
} from "@mui/material";
import TaskCard from "./TaskCard";

type Task = {
  id: string;
  title: string;
  description: string;
  column: string;
};

interface KanbanColumnProps {
  columnId: string;
  columnName: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  searchQuery: string;
  isLoading?: boolean;
  itemsPerPage?: number;
}

const ITEMS_PER_PAGE = 5;

export default function KanbanColumn({
  columnId,
  columnName,
  tasks,
  onDelete,
  onEdit,
  searchQuery,
  isLoading = false,
  itemsPerPage = ITEMS_PER_PAGE,
}: KanbanColumnProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter tasks by search query and column
  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.column === columnId &&
        (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [tasks, columnId, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTasks, currentPage, itemsPerPage]);

  // Reset to first page when search changes
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Color scheme for different columns
  const columnColors: { [key: string]: string } = {
    backlog: "#fafafa",
    "in-progress": "#e3f2fd",
    review: "#fff3e0",
    done: "#e8f5e9",
  };

  const columnBorders: { [key: string]: string } = {
    backlog: "#bdbdbd",
    "in-progress": "#90caf9",
    review: "#ffb74d",
    done: "#66bb6a",
  };

  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            flex: 1,
            background: columnColors[columnId] || "#fafafa",
            padding: "16px",
            borderRadius: "8px",
            minHeight: "600px",
            backgroundColor: snapshot.isDraggingOver
              ? "rgba(33, 150, 243, 0.1)"
              : columnColors[columnId],
            border: `2px solid ${columnBorders[columnId] || "#e0e0e0"}`,
            transition: "all 0.2s ease",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          {/* Column Header */}
          <Box sx={{ marginBottom: "12px" }}>
            <Typography
              variant="h6"
              sx={{
                textTransform: "capitalize",
                fontWeight: 700,
                fontSize: "16px",
                marginBottom: "4px",
                color: "#333",
              }}
            >
              {columnName.replace(/_/g, " ")}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#666",
                fontSize: "12px",
              }}
            >
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            </Typography>
          </Box>

          {/* Loading State */}
          {isLoading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <CircularProgress size={40} />
            </Box>
          )}

          {/* Tasks List */}
          {!isLoading && (
            <>
              <Box sx={{ flex: 1, overflowY: "auto", marginBottom: "12px" }}>
                {paginatedTasks.length > 0 ? (
                  paginatedTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      onDelete={onDelete}
                      onEdit={onEdit}
                    />
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#999",
                      textAlign: "center",
                      padding: "20px 10px",
                      fontStyle: "italic",
                    }}
                  >
                    No tasks yet
                  </Typography>
                )}
                {provided.placeholder}
              </Box>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    size="small"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontSize: "12px",
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Paper>
      )}
    </Droppable>
  );
}
