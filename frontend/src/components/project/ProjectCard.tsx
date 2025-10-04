import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Calendar, Eye, Settings, Trash2, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

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

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: number) => void;
  onTogglePublic?: (projectId: number, isPublic: boolean) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onTogglePublic,
}) => {
  const fileName = project.source_file_path.split('/').pop() || 'Unknown file';
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-foreground truncate">
                {project.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {fileName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {project.is_public && (
              <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Users size={14} className="text-green-600 dark:text-green-400" />
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        {project.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {project.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <BarChart3 size={12} />
              <span>{project.charts_count} wykresów</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>
                {formatDistanceToNow(new Date(project.created_at), {
                  addSuffix: true,
                  locale: pl,
                })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {project.is_public ? (
              <span className="text-green-600 dark:text-green-400 font-medium">Publiczny</span>
            ) : (
              <span className="text-orange-600 dark:text-orange-400 font-medium">Prywatny</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Link href={`/projects/${project.id}`}>
              <Button variant="default" size="sm" className="h-8">
                <Eye size={14} className="mr-1" />
                Zobacz
              </Button>
            </Link>
            
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => onEdit(project)}
              >
                <Settings size={14} className="mr-1" />
                Edytuj
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onTogglePublic && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => onTogglePublic(project.id, !project.is_public)}
              >
                <Users size={14} className="mr-1" />
                {project.is_public ? 'Ukryj' : 'Udostępnij'}
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(project.id)}
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
