'use client';

import { FolderKanban, Plus, Calendar, Users } from "lucide-react";

const PROJECTS = [
  {
    id: 1,
    name: "Token Launch Campaign",
    description: "Complete token launch with marketing frames",
    status: "Active",
    frames: 5,
    members: 3,
    updated: "2 hours ago",
  },
  {
    id: 2,
    name: "NFT Collection",
    description: "Gallery and minting frames for NFT project",
    status: "Active",
    frames: 8,
    members: 2,
    updated: "1 day ago",
  },
  {
    id: 3,
    name: "Community Hub",
    description: "Engagement and governance tools",
    status: "Draft",
    frames: 3,
    members: 5,
    updated: "3 days ago",
  },
  {
    id: 4,
    name: "Airdrop Campaign",
    description: "Multi-phase airdrop distribution",
    status: "Completed",
    frames: 4,
    members: 2,
    updated: "1 week ago",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your frame projects and collaborations
          </p>
        </div>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Projects</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{PROJECTS.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Projects</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {PROJECTS.filter((p) => p.status === "Active").length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Frames</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {PROJECTS.reduce((sum, p) => sum + p.frames, 0)}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  const statusColors = {
    Active: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    Draft: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    Completed: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition cursor-pointer">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <FolderKanban className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.name}</h3>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[project.status as keyof typeof statusColors]}`}>
            {project.status}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FolderKanban className="w-4 h-4 mr-1" />
              {project.frames} frames
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {project.members} members
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {project.updated}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 rounded-b-lg">
        <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
          Open Project →
        </button>
      </div>
    </div>
  );
}
