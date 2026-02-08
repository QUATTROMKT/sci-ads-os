import { useDraggable } from '@dnd-kit/core';
import { Calendar, User, AlertCircle } from 'lucide-react';
import type { Task } from '@/types';
import { cn } from '@/lib/utils';
import { CSS } from '@dnd-kit/utilities';

interface KanbanCardProps {
    task: Task;
}

export function KanbanCard({ task }: KanbanCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: { task },
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-500';
            case 'medium': return 'text-amber-500';
            case 'low': return 'text-blue-500';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "bg-card p-4 rounded-md shadow-sm border cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow touch-none select-none",
                isDragging && "opacity-50 ring-2 ring-primary rotate-2"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm line-clamp-2 leading-tight">{task.title}</h4>
                <AlertCircle className={cn("h-4 w-4 shrink-0 mt-0.5", getPriorityColor(task.priority))} />
            </div>

            <div className="space-y-2 mt-3">
                <div className="flex items-center text-xs text-muted-foreground">
                    <User className="h-3 w-3 mr-1.5" />
                    <span className="truncate max-w-[120px]">{task.clientName}</span>
                </div>

                {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {task.tags.map(tag => (
                            <div key={tag} className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-sm">
                                {tag}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className={`flex items-center text-xs ${new Date(task.dueDate) < new Date() ? 'text-red-500 font-medium' : 'text-muted-foreground'
                        }`}>
                        <Calendar className="h-3 w-3 mr-1.5" />
                        <span>{new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
