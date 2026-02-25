"use client";
import { useQuery } from "@tanstack/react-query";
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

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Kanban Board</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        {columns.map((column) => (
          <div
            key={column}
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
              ?.filter((task) => task.column === column)
              .map((task) => (
                <div
                  key={task.id}
                  style={{
                    background: "white",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "6px",
                  }}
                >
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}