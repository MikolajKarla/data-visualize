import { useAuth, authenticatedFetch } from '@/lib/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';

export interface Project {
  id: number;
  title: string;
  description?: string;
  source_file_path: string;
  created_at: string;
  updated_at?: string;
  is_public: boolean;
  charts_count: number;
  user_id?: number;
}

export interface ProjectCreate {
  title: string;
  description?: string;
  is_public: boolean;
}

// Custom hook for projects API
export const useProjectsAPI = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchUserProjects = async (userId?: number): Promise<Project[]> => {
    if (!user && !userId) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      const targetUserId = userId || user!.id;
      const response = await authenticatedFetch(`/projects/user/${targetUserId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }
      
      const projects = await response.json();
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Nie udało się pobrać projektów');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async (projectData: ProjectCreate): Promise<Project> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      const response = await authenticatedFetch('/projects/save', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to save project');
      }

      const result = await response.json();
      toast.success('Projekt został zapisany pomyślnie!');
      return result.project;
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Wystąpił błąd podczas zapisywania projektu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchUserProjects,
    saveProject,
    loading,
  };
};