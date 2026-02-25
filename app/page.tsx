"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

type Task = {
  id: string;
  title: string;
  description: string;
  column: string;
};

const columns = ["backlog", "in-progress", "review", "done"];
async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("Failed to fetch tasks");
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

async function createTask(task: Omit<Task, "id">) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export default function Home() {
  const queryClient = useQueryClient();
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const mutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const task = data.find((t) => t.id === draggableId);
    if (!task) return;
    mutation.mutate({
      ...task,
      column: destination.droppableId,
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Kanban Board</h1>
      <button
        onClick={() =>
          createMutation.mutate({
            title: "New Task",
            description: "Task description",
            column: "backlog",
          })
        }
        style={{
          marginBottom: "20px",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Add Task
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "20px" }}>
          {columns.map((column) => (
            <Droppable droppableId={column} key={column}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: 1,
                    background: "#f4f4f4",
                    padding: "10px",
                    borderRadius: "8px",
                    minHeight: "300px",
                  }}
                >
                  <h2 style={{ textTransform: "capitalize" }}>{column}</h2>
                  {data
                    .filter((task) => task.column === column)
                    .map((task, index) => (
                      <Draggable
                        draggableId={task.id}
                        index={index}
                        key={task.id}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              background: "white",
                              padding: "10px",
                              marginBottom: "10px",
                              borderRadius: "6px",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
