import { useDroppable } from '@dnd-kit/core';
import type { TaskStatus, Task } from '@/types';
import { cn } from '@/lib/utils';
import { KanbanCard } from './KanbanCard';
import { Badge } from '@/components/ui/badge';

interface KanbanColumnProps {
    id: TaskStatus;
    title: string;
    tasks: Task[];
    color: string;
}

export function KanbanColumn({ id, title, tasks, color }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col h-full min-w-[280px] w-full max-w-none md:max-w-xs bg-muted/30 rounded-lg p-2 md:p-4 border">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <div className={cn("h-3 w-3 rounded-full", color)} />
                    <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                </div>
                <Badge variant="secondary" className="text-xs font-normal">
                    {tasks.length}
                </Badge>
            </div>

            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 space-y-3 transition-colors rounded-md p-1",
                    isOver && "bg-muted/50 ring-2 ring-primary/20"
                )}
            >
                {tasks.map((task) => (
                    <KanbanCard key={task.id} task={task} />
                ))}
                {tasks.length === 0 && (
                    <div className="h-24 flex items-center justify-center text-xs text-muted-foreground border-2 border-dashed rounded-md">
                        Arraste tarefas aqui
                    </div>
                )}
            </div>
        </div>
    );
}
