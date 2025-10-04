'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import ProjectsGrid from './ProjectsGrid';
import NewProjectModal from './NewProjectModal';

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

const ProjectsLayout: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPublic, setFilterPublic] = useState<boolean | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on search term and public filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.source_file_path.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterPublic === null || project.is_public === filterPublic;
    
    return matchesSearch && matchesFilter;
  });

  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  const handleProjectDelete = (projectId: number) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const handleNewProject = async (data: { title: string; description?: string; file: File }) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.description) {
        formData.append('description', data.description);
      }
      formData.append('file', data.file);

      // TODO: Replace with actual API call
      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects(prev => [newProject, ...prev]);
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Wystąpił błąd podczas tworzenia projektu');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Moje Projekty
          </h1>
          <p className="text-muted-foreground">
            Zarządzaj swoimi projektami wizualizacji danych
          </p>
        </div>
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nowy Projekt
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Szukaj projektów..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilterPublic(null)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filterPublic === null
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-muted'
            }`}
          >
            Wszystkie
          </button>
          <button
            onClick={() => setFilterPublic(true)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filterPublic === true
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-muted'
            }`}
          >
            Publiczne
          </button>
          <button
            onClick={() => setFilterPublic(false)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filterPublic === false
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:bg-muted'
            }`}
          >
            Prywatne
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <ProjectsGrid
        projects={filteredProjects}
        loading={loading}
        onEditProject={handleProjectUpdate}
        onDeleteProject={handleProjectDelete}
      />

      {/* Stats */}
      {!loading && projects.length > 0 && (
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-foreground">
                {projects.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Łączna liczba projektów
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {projects.filter(p => p.is_public).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Projekty publiczne
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {projects.reduce((sum, p) => sum + (p.charts_count || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Łączna liczba wykresów
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onSubmit={handleNewProject}
      />
    </div>
  );
};

export default ProjectsLayout;
