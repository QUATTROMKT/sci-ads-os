import { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    ExternalLink,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { Client } from '@/types';
import { useData } from '@/context/DataContext';

export function Clients() {
    const { clients, addClient, removeClient } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // New Client Form State
    const [newClient, setNewClient] = useState<Partial<Client>>({
        status: 'negotiation'
    });

    const filteredClients = clients.filter(client =>
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.decisionMaker.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddClient = () => {
        if (!newClient.companyName || !newClient.decisionMaker) return;

        const client: Client = {
            id: crypto.randomUUID(),
            companyName: newClient.companyName,
            decisionMaker: newClient.decisionMaker,
            niche: newClient.niche || 'Geral',
            status: newClient.status as Client['status'] || 'negotiation',
            startDate: newClient.startDate || new Date().toISOString(),
            ltv: newClient.ltv || 'R$ 0,00',
            driveLink: newClient.driveLink
        };

        addClient(client);
        setNewClient({ status: 'negotiation' }); // Reset form
        setIsDialogOpen(false);
    };

    const handleDeleteClient = (id: string) => {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            removeClient(id);
        }
    };

    const getStatusBadge = (status: Client['status']) => {
        switch (status) {
            case 'active':
                return <Badge variant="success">Ativo</Badge>;
            case 'churn':
                return <Badge variant="destructive">Churn</Badge>;
            case 'negotiation':
                return <Badge variant="warning">Negociação</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
                    <p className="text-muted-foreground">Gerencie sua carteira de clientes e leads.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Adicionar Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo Cliente</DialogTitle>
                            <DialogDescription>
                                Preencha as informações abaixo para cadastrar um novo cliente.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Empresa</Label>
                                <Input
                                    id="name"
                                    className="col-span-3"
                                    value={newClient.companyName || ''}
                                    onChange={e => setNewClient({ ...newClient, companyName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="decisor" className="text-right">Decisor</Label>
                                <Input
                                    id="decisor"
                                    className="col-span-3"
                                    value={newClient.decisionMaker || ''}
                                    onChange={e => setNewClient({ ...newClient, decisionMaker: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="niche" className="text-right">Nicho</Label>
                                <Input
                                    id="niche"
                                    className="col-span-3"
                                    value={newClient.niche || ''}
                                    onChange={e => setNewClient({ ...newClient, niche: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <select
                                    id="status"
                                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={newClient.status}
                                    onChange={e => setNewClient({ ...newClient, status: e.target.value as Client['status'] })}
                                >
                                    <option value="negotiation">Negociação</option>
                                    <option value="active">Ativo</option>
                                    <option value="churn">Churn</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="ltv" className="text-right">LTV Estimado</Label>
                                <Input
                                    id="ltv"
                                    className="col-span-3"
                                    placeholder="R$ 0,00"
                                    value={newClient.ltv || ''}
                                    onChange={e => setNewClient({ ...newClient, ltv: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleAddClient}>Salvar Cliente</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar por empresa ou decisor..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                            <tr>
                                <th className="px-4 py-3">Empresa</th>
                                <th className="px-4 py-3">Decisor</th>
                                <th className="px-4 py-3">Nicho</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Início</th>
                                <th className="px-4 py-3">LTV</th>
                                <th className="px-4 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-4 py-3 font-medium">{client.companyName}</td>
                                    <td className="px-4 py-3">{client.decisionMaker}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{client.niche}</td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(client.status)}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(client.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{client.ltv}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {client.driveLink && (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" title="Drive Link">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDeleteClient(client.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredClients.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        Nenhum cliente encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
