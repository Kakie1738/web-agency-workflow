"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function DebugPage() {
  const projects = useQuery(api.projects.getProjects)
  const clients = useQuery(api.clients.getClients)
  const tasks = useQuery(api.tasks.getTasks)

  console.log("Debug Page - Raw data:", { projects, clients, tasks })

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Debug Information</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Projects ({projects === undefined ? "Loading..." : projects?.length || 0})</h2>
          <div className="space-y-2">
            {projects === undefined ? (
              <p className="text-muted-foreground">Loading projects...</p>
            ) : projects?.length === 0 ? (
              <p className="text-muted-foreground">No projects found</p>
            ) : (
              projects?.map((project) => (
                <div key={project._id} className="bg-gray-50 p-2 rounded text-sm">
                  <p><strong>ID:</strong> {project._id}</p>
                  <p><strong>Title:</strong> {project.title}</p>
                  <p><strong>Status:</strong> {project.status}</p>
                  <p><strong>Client ID:</strong> {project.clientId}</p>
                  <p><strong>Created:</strong> {new Date(project.createdAt || 0).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Clients ({clients === undefined ? "Loading..." : clients?.length || 0})</h2>
          <div className="space-y-2">
            {clients === undefined ? (
              <p className="text-muted-foreground">Loading clients...</p>
            ) : clients?.length === 0 ? (
              <p className="text-muted-foreground">No clients found</p>
            ) : (
              clients?.map((client) => (
                <div key={client._id} className="bg-gray-50 p-2 rounded text-sm">
                  <p><strong>ID:</strong> {client._id}</p>
                  <p><strong>Name:</strong> {client.name}</p>
                  <p><strong>Email:</strong> {client.email}</p>
                  <p><strong>Status:</strong> {client.status}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Tasks ({tasks === undefined ? "Loading..." : tasks?.length || 0})</h2>
          <div className="space-y-2">
            {tasks === undefined ? (
              <p className="text-muted-foreground">Loading tasks...</p>
            ) : tasks?.length === 0 ? (
              <p className="text-muted-foreground">No tasks found</p>
            ) : (
              tasks?.map((task) => (
                <div key={task._id} className="bg-gray-50 p-2 rounded text-sm">
                  <p><strong>ID:</strong> {task._id}</p>
                  <p><strong>Title:</strong> {task.title}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                  <p><strong>Project ID:</strong> {task.projectId}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Raw JSON Data</h2>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
          {JSON.stringify({ projects, clients, tasks }, null, 2)}
        </pre>
      </div>
    </div>
  )
}