"use client";
import { useQuery } from "@tanstack/react-query";
type Task = {
  id: string;
  title: string;
  description: string;
  column: string;
};

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
      {data?.map((task) => (
        <div
          key={task.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <small>{task.column}</small>
        </div>
      ))}
    </div>
  );
}