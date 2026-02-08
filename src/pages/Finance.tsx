import { useState } from 'react';
import {
    Plus,
    Search,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle,
    Pencil,
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
import type { Invoice } from '@/types';
import { useData } from '@/context/DataContext';

export function Finance() {
    const { invoices, addInvoice, updateInvoice, removeInvoice, clients } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // New/Edit Invoice Form
    const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
        status: 'pending'
    });

    const filteredInvoices = invoices.filter(inv =>
        inv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSaveInvoice = () => {
        if (!newInvoice.clientId || !newInvoice.amount || !newInvoice.dueDate) return;

        const client = clients.find(c => c.id === newInvoice.clientId);
        const clientName = client ? client.companyName : 'Cliente Desconhecido';

        const invoiceData: Invoice = {
            id: editingId || crypto.randomUUID(),
            clientId: newInvoice.clientId,
            clientName: clientName,
            amount: newInvoice.amount,
            dueDate: newInvoice.dueDate,
            status: newInvoice.status as Invoice['status'] || 'pending'
        };

        if (editingId) {
            updateInvoice(invoiceData);
        } else {
            addInvoice(invoiceData);
        }

        setNewInvoice({ status: 'pending' });
        setEditingId(null);
        setIsDialogOpen(false);
    };

    const handleEditInvoice = (invoice: Invoice) => {
        setNewInvoice(invoice);
        setEditingId(invoice.id);
        setIsDialogOpen(true);
    };

    const handleDeleteInvoice = (id: string) => {
        if (confirm('Tem certeza que deseja excluir este pagamento?')) {
            removeInvoice(id);
        }
    };

    const getStatusBadge = (status: Invoice['status']) => {
        switch (status) {
            case 'paid':
                return (
                    <Badge variant="success" className="gap-1 pl-1 pr-2">
                        <CheckCircle2 className="h-3 w-3" /> Pago
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge variant="warning" className="gap-1 pl-1 pr-2">
                        <Clock className="h-3 w-3" /> Pendente
                    </Badge>
                );
            case 'overdue':
                return (
                    <Badge variant="destructive" className="gap-1 pl-1 pr-2">
                        <AlertCircle className="h-3 w-3" /> Atrasado
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestão Financeira</h2>
                    <p className="text-muted-foreground">Controle de faturas, pagamentos e recebimentos.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => {
                            setNewInvoice({ status: 'pending' });
                            setEditingId(null);
                        }}>
                            <Plus className="mr-2 h-4 w-4" /> Novo Pagamento
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Editar Pagamento' : 'Novo Pagamento'}</DialogTitle>
                            <DialogDescription>
                                {editingId ? 'Atualize as informações do pagamento.' : 'Lance um novo pagamento ou fatura.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="client" className="text-right">Cliente</Label>
                                <select
                                    id="client"
                                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={newInvoice.clientId || ''}
                                    onChange={e => setNewInvoice({ ...newInvoice, clientId: e.target.value })}
                                >
                                    <option value="">Selecione um cliente...</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>{client.companyName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">Valor</Label>
                                <Input
                                    id="amount"
                                    className="col-span-3"
                                    placeholder="R$ 0,00"
                                    value={newInvoice.amount || ''}
                                    onChange={e => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="due" className="text-right">Vencimento</Label>
                                <Input
                                    id="due"
                                    type="date"
                                    className="col-span-3"
                                    value={newInvoice.dueDate || ''}
                                    onChange={e => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <select
                                    id="status"
                                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={newInvoice.status}
                                    onChange={e => setNewInvoice({ ...newInvoice, status: e.target.value as Invoice['status'] })}
                                >
                                    <option value="pending">Pendente</option>
                                    <option value="paid">Pago</option>
                                    <option value="overdue">Atrasado</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleSaveInvoice}>Salvar Pagamento</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Recebido (Total)</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold">
                            R$ {invoices.filter(i => i.status === 'paid')
                                .reduce((acc, curr) => acc + parseFloat(curr.amount.replace('R$', '').replace('.', '').replace(',', '.').trim()), 0)
                                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
                {/* Pending and Overdue cards could be similarly calculated */}
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar pagamentos..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                            <tr>
                                <th className="px-4 py-3">Cliente</th>
                                <th className="px-4 py-3">Valor</th>
                                <th className="px-4 py-3">Vencimento</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredInvoices.map((bg) => (
                                <tr key={bg.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-4 py-3 font-medium">{bg.clientName}</td>
                                    <td className="px-4 py-3 font-medium">{bg.amount}</td>
                                    <td className={`px-4 py-3 ${bg.status === 'overdue' || (new Date(bg.dueDate) < new Date() && bg.status !== 'paid') ? 'text-red-500 font-medium' : ''
                                        }`}>
                                        {new Date(bg.dueDate).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(bg.status)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:text-amber-700" onClick={() => handleEditInvoice(bg)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDeleteInvoice(bg.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        Nenhum pagamento encontrado.
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
