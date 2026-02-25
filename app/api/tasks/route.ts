let tasks = [
  {
    id: "1",
    title: "Setup project",
    description: "Initialize Next.js app",
    column: "backlog",
  },
];

export async function GET() {
  return Response.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newTask = {
    id: Date.now().toString(),
    ...body,
  };
  tasks.push(newTask);
  return Response.json(newTask);
}

export async function PUT(req: Request) {
  const body = await req.json();
  tasks = tasks.map((task) =>
    task.id === body.id ? { ...task, ...body } : task
  );
  return Response.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  tasks = tasks.filter((task) => task.id !== id);
  return Response.json({ success: true });
}