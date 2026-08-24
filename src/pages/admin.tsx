import { FormEvent, useEffect, useState } from "react";

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};
type Project = { id: number; name: string; description: string };

export default function Admin() {
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    name: "",
    favicon: "/favicon.ico",
    imageUrl: "",
    description: "",
    sourceCodeHref: "",
    liveWebsiteHref: "",
  });

  const load = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    const [messagesResponse, projectsResponse] = await Promise.all([
      fetch("/api/admin/messages", { headers }),
      fetch("/api/projects"),
    ]);
    if (!messagesResponse.ok) return setNotice("Enter a valid admin token.");
    setMessages(await messagesResponse.json());
    setProjects(await projectsResponse.json());
    setNotice("");
  };

  useEffect(() => {
    const savedToken = window.localStorage.getItem("admin-token") ?? "";
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    window.localStorage.setItem("admin-token", token);
    void load();
    const interval = window.setInterval(() => void load(), 5000);
    return () => window.clearInterval(interval);
  }, [token]);

  const createProject = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/admin/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        imageUrl: form.imageUrl
          .split(",")
          .map((image) => image.trim())
          .filter(Boolean),
        liveWebsiteHref: form.liveWebsiteHref || null,
      }),
    });
    setNotice(
      response.ok ? "Project created." : "Project could not be created.",
    );
    if (response.ok) {
      setForm({
        name: "",
        favicon: "/favicon.ico",
        imageUrl: "",
        description: "",
        sourceCodeHref: "",
        liveWebsiteHref: "",
      });
      void load();
    }
  };

  const deleteProject = async (id: number) => {
    await fetch(`/api/admin/projects?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    void load();
  };

  return (
    <main className="mx-auto mb-40 mt-12 w-full max-w-6xl px-6 text-foreground sm:px-14 md:px-20">
      <h1 className="text-3xl font-semibold">Portfolio Admin</h1>
      <p className="mt-2 text-muted-foreground">
        Messages refresh every five seconds.
      </p>
      <label className="mt-8 block max-w-xl text-sm font-semibold">
        Admin token
        <input
          type="password"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          className="mt-2 w-full rounded-md border border-accent/30 bg-background p-3"
          placeholder="ADMIN_TOKEN"
        />
      </label>
      {notice && <p className="mt-4 text-sm text-accent">{notice}</p>}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Contact messages</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {messages.map((message) => (
            <article
              key={message.id}
              className="rounded-lg border border-accent/20 p-4"
            >
              <p className="font-semibold">{message.subject}</p>
              <p className="text-sm">
                {message.name} &lt;{message.email}&gt;
              </p>
              <p className="mt-3 text-sm">{message.message}</p>
              <time className="mt-3 block text-xs text-muted-foreground">
                {new Date(message.createdAt).toLocaleString()}
              </time>
            </article>
          ))}
          {!messages.length && (
            <p className="text-muted-foreground">No messages yet.</p>
          )}
        </div>
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Add project</h2>
        <form
          onSubmit={createProject}
          className="mt-4 grid gap-3 md:grid-cols-2"
        >
          {(
            [
              "name",
              "favicon",
              "imageUrl",
              "description",
              "sourceCodeHref",
              "liveWebsiteHref",
            ] as const
          ).map((field) => (
            <input
              key={field}
              required={field !== "liveWebsiteHref"}
              value={form[field]}
              onChange={(event) =>
                setForm({ ...form, [field]: event.target.value })
              }
              className="rounded-md border border-accent/30 bg-background p-3"
              placeholder={
                field === "imageUrl" ? "Image URLs, comma separated" : field
              }
            />
          ))}
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-3 font-semibold text-background md:col-span-2"
          >
            Create project
          </button>
        </form>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-lg border border-accent/20 p-4"
            >
              <span>{project.name}</span>
              <button
                onClick={() => void deleteProject(project.id)}
                className="text-sm font-semibold text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
