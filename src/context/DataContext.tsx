import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Client, Task, Invoice } from '@/types';
import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query
} from 'firebase/firestore';

interface DataContextType {
    clients: Client[];
    tasks: Task[];
    invoices: Invoice[];
    addClient: (client: Client) => Promise<void>;
    updateClient: (client: Client) => Promise<void>;
    removeClient: (id: string) => Promise<void>;
    addTask: (task: Task) => Promise<void>;
    updateTask: (task: Task) => Promise<void>;
    removeTask: (id: string) => Promise<void>;
    addInvoice: (invoice: Invoice) => Promise<void>;
    updateInvoice: (invoice: Invoice) => Promise<void>;
    removeInvoice: (id: string) => Promise<void>;
    getClientName: (id: string) => string;
    loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [clients, setClients] = useState<Client[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial Load & Real-time Sync
    useEffect(() => {
        try {
            // Clients
            const qClients = query(collection(db, "clients"));
            const unsubClients = onSnapshot(qClients, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Client));
                setClients(data);
            }, (error) => {
                console.error("Erro ao carregar clientes:", error);
                // toast.error("Erro de permissão: Você precisa estar logado.");
            });

            // Tasks
            const qTasks = query(collection(db, "tasks"));
            const unsubTasks = onSnapshot(qTasks, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task));
                setTasks(data);
            }, (error) => console.error("Erro ao carregar tarefas:", error));

            // Invoices
            const qInvoices = query(collection(db, "invoices"));
            const unsubInvoices = onSnapshot(qInvoices, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Invoice));
                setInvoices(data);
                setLoading(false);
            }, (error) => {
                console.error("Erro ao carregar faturas:", error);
                setLoading(false);
            });

            return () => {
                unsubClients();
                unsubTasks();
                unsubInvoices();
            };
        } catch (error) {
            console.error("Firestore Init Error:", error);
            setLoading(false);
        }
    }, []);

    // Clients
    const addClient = async (client: Client) => {
        const { id, ...data } = client; // Let Firestore generate ID or use clean data
        await addDoc(collection(db, "clients"), data);
    };
    const updateClient = async (client: Client) => {
        const docRef = doc(db, "clients", client.id);
        const { id, ...data } = client;
        await updateDoc(docRef, data);
    };
    const removeClient = async (id: string) => {
        await deleteDoc(doc(db, "clients", id));
    };

    // Tasks
    const addTask = async (task: Task) => {
        const { id, ...data } = task;
        await addDoc(collection(db, "tasks"), data);
    };
    const updateTask = async (task: Task) => {
        const docRef = doc(db, "tasks", task.id);
        const { id, ...data } = task;
        await updateDoc(docRef, data);
    };
    const removeTask = async (id: string) => {
        await deleteDoc(doc(db, "tasks", id));
    };

    // Invoices
    const addInvoice = async (invoice: Invoice) => {
        const { id, ...data } = invoice;
        await addDoc(collection(db, "invoices"), data);
    };
    const updateInvoice = async (invoice: Invoice) => {
        const docRef = doc(db, "invoices", invoice.id);
        const { id, ...data } = invoice;
        await updateDoc(docRef, data);
    };
    const removeInvoice = async (id: string) => {
        await deleteDoc(doc(db, "invoices", id));
    };

    const getClientName = (id: string) => clients.find(c => c.id === id)?.companyName || 'Cliente Desconhecido';

    return (
        <DataContext.Provider value={{
            clients, tasks, invoices,
            addClient, updateClient, removeClient,
            addTask, updateTask, removeTask,
            addInvoice, updateInvoice, removeInvoice,
            getClientName,
            loading
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
