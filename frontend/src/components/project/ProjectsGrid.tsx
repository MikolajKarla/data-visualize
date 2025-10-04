import React from 'react';
import Link from 'next/link';
import ProjectCard from './ProjectCard';

interface Project {
  id: number;
  title: string;
  description?: string;
  source_file_path: string;
  created_at: string;
  updated_at?: string;
  is_public: boolean;
  charts_count: number;
}

interface ProjectsGridProps {
  projects: Project[];
  loading?: boolean;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: number) => void;
  onTogglePublic?: (projectId: number, isPublic: boolean) => void;
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  loading = false,
  onEditProject,
  onDeleteProject,
  onTogglePublic,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </div>
            <div className="h-3 bg-muted rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="h-8 bg-muted rounded w-20"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Brak projektów
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Nie masz jeszcze żadnych projektów. Utwórz pierwszy projekt przesyłając plik CSV.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Utwórz projekt
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEditProject}
          onDelete={onDeleteProject}
          onTogglePublic={onTogglePublic}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;
