'use client';

import { useState, useEffect, useRef } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
    Search,
    Filter,
    ChevronDown,
    Clock,
    CheckCircle,
    AlertCircle,
    PlayCircle,
    Circle,
    ChevronRight,
    ClipboardList,
    MoreVertical,
    ArrowUpDown,
    Plus,
    ChevronLeft,
    Calendar,
    Eye,
    Trash2
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { backendApi } from '@/services/api';

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const dateRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        async function loadTasks() {
            try {
                setLoading(true);
                const data = await backendApi.get('/tasks');
                if (!isMounted) return;
                setTasks(data || []);
            } catch (err) {
                console.error('Failed to load tasks', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        loadTasks();
        return () => { isMounted = false; };
    }, []);

    async function handleCreate() {
        // TODO: open modal or navigate to /tasks/add
    }

    async function handleDelete(id) {
        try {
            await backendApi.delete(`/tasks/${id}`);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Failed to delete task', err);
        }
    }

    const summaryData = [
        { title: 'Total Tasks', value: tasks.length.toString(), change: '+12%', icon: <ClipboardList className="h-5 w-5" /> },
        { title: 'Not Started', value: tasks.filter(t => t.status === 'NOT_STARTED').length.toString(), change: '+5%', icon: <Circle className="h-5 w-5 text-gray-400" /> },
        { title: 'Delayed', value: tasks.filter(t => t.status === 'DELAYED').length.toString(), change: '-2%', icon: <AlertCircle className="h-5 w-5 text-red-500" /> },
        { title: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length.toString(), change: '+8%', icon: <PlayCircle className="h-5 w-5 text-blue-500" /> },
        { title: 'Completed', value: tasks.filter(t => t.status === 'COMPLETED').length.toString(), change: '+15%', icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
    ];

    return (
        <DashboardLayout>
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                        <p className="text-gray-500">Manage your team's tasks and progress</p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
                    {summaryData.map((item, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                            <div className="flex flex-row items-center justify-between p-4 pb-2 border-b">
                                <h3 className="text-sm font-medium text-gray-500">
                                    {item.title}
                                </h3>
                                <div className={`p-1.5 rounded-md ${index === 2 ? 'bg-red-50' : 'bg-gray-50'}`}>
                                    {item.icon}
                                </div>
                            </div>
                            <div className="p-4 pt-0">
                                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                                <p className={`text-xs mt-1 ${item.change.startsWith('+') ? 'text-green-600' : item.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                                    {item.change} from last month
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Task List */}
                <Card>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b">
                        <h3 className="text-base font-semibold text-gray-900">All Tasks</h3>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="p-4">
                        {loading ? (
                            <p className="text-sm text-gray-500">Loading tasks...</p>
                        ) : tasks.length === 0 ? (
                            <p className="text-sm text-gray-500">No tasks found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="p-3 text-left">Title</th>
                                            <th className="p-3 text-left">Assigned To</th>
                                            <th className="p-3 text-left">Status</th>
                                            <th className="p-3 text-left">Due Date</th>
                                            <th className="p-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map(t => (
                                            <tr key={t.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3 font-medium">{t.title || '-'}</td>
                                                <td className="p-3">{t.assignedToName || '-'}</td>
                                                <td className="p-3">
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                        t.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                        t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                        t.status === 'DELAYED' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {t.status?.replace('_', ' ') || '-'}
                                                    </span>
                                                </td>
                                                <td className="p-3">{t.dueDate || '-'}</td>
                                                <td className="p-3">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
                                                            <Eye size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(t.id)} className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}