import {
    Users,
    DollarSign,
    Briefcase,
    FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/DataContext';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export function Dashboard() {
    const { clients, tasks, invoices } = useData();

    // 1. Metrics Calculation
    const revenue = invoices
        .filter(i => i.status === 'paid')
        .reduce((acc, curr) => {
            const val = parseFloat(curr.amount.replace(/[^0-9,-]+/g, "").replace(",", "."));
            return acc + (isNaN(val) ? 0 : val);
        }, 0);

    const activeClients = clients.filter(c => c.status === 'active').length;
    const churnClients = clients.filter(c => c.status === 'churn').length;
    const negotiationClients = clients.filter(c => c.status === 'negotiation').length;

    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    const activeContracts = activeClients;

    const stats = [
        {
            title: "Receita Mensal",
            value: revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            icon: DollarSign,
            description: "Total acumulado",
            trend: "up"
        },
        {
            title: "Contratos Ativos",
            value: activeContracts.toString(),
            icon: FileText,
            description: "Em execução",
            trend: "neutral"
        },
        {
            title: "Tarefas Pendentes",
            value: pendingTasks.toString(),
            icon: Briefcase,
            description: "Aguardando conclusão",
            trend: "down"
        },
        {
            title: "Clientes",
            value: clients.length.toString(),
            icon: Users,
            description: `${negotiationClients} em negociação`,
            trend: "up"
        }
    ];

    // 2. Chart Data
    // Pie Chart: Client Status
    const clientStatusData = [
        { name: 'Ativos', value: activeClients, color: '#22c55e' }, // green-500
        { name: 'Negociação', value: negotiationClients, color: '#eab308' }, // yellow-500
        { name: 'Churn', value: churnClients, color: '#ef4444' } // red-500
    ].filter(d => d.value > 0);

    // Bar Chart: Revenue by Status (Mocking monthly distribution involves date parsing, simplifying to Status for now)
    const invoiceStatusData = [
        {
            name: 'Pago',
            value: invoices.filter(i => i.status === 'paid').length,
            amount: invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + parseFloat(curr.amount.replace(/[^0-9,-]+/g, "").replace(",", ".")), 0)
        },
        {
            name: 'Pendente',
            value: invoices.filter(i => i.status === 'pending').length,
            amount: invoices.filter(i => i.status === 'pending').reduce((acc, curr) => acc + parseFloat(curr.amount.replace(/[^0-9,-]+/g, "").replace(",", ".")), 0)
        },
        {
            name: 'Atrasado',
            value: invoices.filter(i => i.status === 'overdue').length,
            amount: invoices.filter(i => i.status === 'overdue').reduce((acc, curr) => acc + parseFloat(curr.amount.replace(/[^0-9,-]+/g, "").replace(",", ".")), 0)
        },
    ];

    const recentActivity = [
        ...tasks.slice(-3).reverse().map(t => ({
            id: t.id,
            type: 'task',
            title: `Tarefa: ${t.title}`,
            subtitle: t.clientName,
            time: new Date(t.dueDate).toLocaleDateString(),
            value: t.status
        })),
        ...invoices.slice(-3).reverse().map(i => ({
            id: i.id,
            type: 'invoice',
            title: `Fatura: ${i.amount}`,
            subtitle: i.clientName,
            time: new Date(i.dueDate).toLocaleDateString(),
            value: i.status
        }))
    ].slice(0, 5); // Just showing mixed 5 items

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Cockpit</h2>
                <p className="text-muted-foreground">Visão geral do desempenho da agência.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Composição da Carteira</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            {clientStatusData.length > 0 ? (
                                <PieChart>
                                    <Pie
                                        data={clientStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {clientStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Sem dados de clientes.
                                </div>
                            )}
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Faturamento por Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={invoiceStatusData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {recentActivity.map((item, index) => (
                            <div key={index} className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                                </div>
                                <div className="ml-auto font-medium text-sm text-muted-foreground">
                                    {item.time} ({item.value})
                                </div>
                            </div>
                        ))}
                        {recentActivity.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atividade recente encontrada.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
