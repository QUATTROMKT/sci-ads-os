import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    TouchSensor,
    KeyboardSensor
} from '@dnd-kit/core';
import type {
    DragEndEvent,
    DragStartEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from '@/components/kanban/KanbanColumn';
import { KanbanCard } from '@/components/kanban/KanbanCard';
import { useData } from '@/context/DataContext';
import type { Task, TaskStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'todo', title: 'A Fazer', color: 'bg-slate-500' },
    { id: 'in-progress', title: 'Em Execução', color: 'bg-blue-500' },
    { id: 'waiting', title: 'Aguardando Cliente', color: 'bg-amber-500' },
    { id: 'done', title: 'Concluído', color: 'bg-green-500' },
];

export function Tasks() {
    const { tasks, addTask, updateTask, clients } = useData();
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // New Task Form
    const [newTask, setNewTask] = useState<Partial<Task>>({
        priority: 'medium',
        status: 'todo'
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleAddTask = () => {
        if (!newTask.title || !newTask.clientId || !newTask.dueDate) return;

        const client = clients.find(c => c.id === newTask.clientId);
        const clientName = client ? client.companyName : 'Cliente Desconhecido';

        const task: Task = {
            id: crypto.randomUUID(),
            clientId: newTask.clientId,
            clientName: clientName,
            title: newTask.title,
            description: newTask.description || '',
            dueDate: newTask.dueDate,
            priority: newTask.priority as Task['priority'] || 'medium',
            status: newTask.status as TaskStatus || 'todo'
        };

        addTask(task);
        setNewTask({ priority: 'medium', status: 'todo' });
        setIsDialogOpen(false);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find(t => t.id === active.id);
        if (task) setActiveTask(task);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const columnId = over.id as TaskStatus;
            if (COLUMNS.some(col => col.id === columnId)) {
                const task = tasks.find(t => t.id === active.id);
                if (task) {
                    updateTask({ ...task, status: columnId });
                }
            }
        }
        setActiveTask(null);
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tarefas</h2>
                    <p className="text-muted-foreground">Gerencie o fluxo de trabalho da agência.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nova Tarefa</DialogTitle>
                            <DialogDescription>Adicione uma nova tarefa ao quadro.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Título</Label>
                                <Input
                                    id="title"
                                    className="col-span-3"
                                    value={newTask.title || ''}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="client" className="text-right">Cliente</Label>
                                <select
                                    id="client"
                                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={newTask.clientId || ''}
                                    onChange={e => setNewTask({ ...newTask, clientId: e.target.value })}
                                >
                                    <option value="">Selecione um cliente...</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>{client.companyName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="due" className="text-right">Prazo</Label>
                                <Input
                                    id="due"
                                    type="date"
                                    className="col-span-3"
                                    value={newTask.dueDate || ''}
                                    onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="prio" className="text-right">Prioridade</Label>
                                <select
                                    id="prio"
                                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={newTask.priority}
                                    onChange={e => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                                >
                                    <option value="low">Baixa</option>
                                    <option value="medium">Média</option>
                                    <option value="high">Alta</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleAddTask}>Criar Tarefa</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex h-full min-w-max gap-4 px-2">
                        {COLUMNS.map((col) => (
                            <KanbanColumn
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                tasks={tasks.filter(t => t.status === col.id)}
                                color={col.color}
                            />
                        ))}
                    </div>

                    <DragOverlay>
                        {activeTask ? <KanbanCard task={activeTask} /> : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}
