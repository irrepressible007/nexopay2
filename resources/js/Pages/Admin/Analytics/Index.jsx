import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AnalyticsIndex({ auth, events, selectedEventId, stats, registrations = [], dynamicColumns = [] }) {
    const [eventId, setEventId] = useState(selectedEventId || '');
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setEventId(value);
        router.get(route('admin.analytics.index'), { event_id: value }, { preserveState: true, preserveScroll: true });
    };

    const handleExportSummary = () => {
        window.location.href = route('admin.analytics.export.summary', { event_id: eventId });
    };

    const handleExportDetailed = () => {
        window.location.href = route('admin.analytics.export.detailed', { event_id: eventId });
    };

    // Filter registrations by search term
    const filteredRegistrations = registrations.filter(reg => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        
        const userName = reg.user ? reg.user.name : (reg.guest_name || '');
        const userEmail = reg.user ? reg.user.email : (reg.guest_email || '');
        const txid = reg.bkash_txid || '';
        
        if (userName.toLowerCase().includes(term)) return true;
        if (userEmail.toLowerCase().includes(term)) return true;
        if (txid.toLowerCase().includes(term)) return true;
        if (reg.status.toLowerCase().includes(term)) return true;

        // Search inside dynamic form fields
        if (reg.form_data) {
            for (const key of dynamicColumns) {
                const val = reg.form_data[key];
                if (val) {
                    const strVal = Array.isArray(val) ? val.join(' ') : String(val);
                    if (strVal.toLowerCase().includes(term)) return true;
                }
            }
        }
        
        return false;
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Analytics & Reports</h2>}
        >
            <Head title="Analytics & Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header / Filter Area */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1 w-full md:w-auto">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Event</label>
                            <select 
                                value={eventId}
                                onChange={handleFilterChange}
                                className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full md:w-64"
                            >
                                <option value="">Global (All Events)</option>
                                {events.map(ev => (
                                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto justify-end">
                            <button 
                                onClick={handleExportSummary}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
                            >
                                Download Summary CSV
                            </button>
                            <button 
                                onClick={handleExportDetailed}
                                className="bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
                            >
                                Download Detailed CSV
                            </button>
                        </div>
                    </div>

                    {/* Top Level Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-indigo-500">
                            <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</div>
                            <div className="text-gray-900 dark:text-gray-100 font-black text-3xl">৳{stats.total_revenue.toLocaleString()}</div>
                            <div className="text-xs text-gray-400 mt-1">From approved registrations</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500">
                            <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Registrations</div>
                            <div className="text-gray-900 dark:text-gray-100 font-black text-3xl">{stats.total_registrations}</div>
                        </div>
                        {!eventId && (
                            <>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-purple-500">
                                    <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Users</div>
                                    <div className="text-gray-900 dark:text-gray-100 font-black text-3xl">{stats.total_users}</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-pink-500">
                                    <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Active Events</div>
                                    <div className="text-gray-900 dark:text-gray-100 font-black text-3xl">{stats.active_events} / {stats.total_events}</div>
                                </div>
                            </>
                        )}
                        {eventId && (
                            <>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-yellow-500">
                                    <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Pending Checkouts</div>
                                    <div className="text-gray-900 dark:text-gray-100 font-black text-3xl">{stats.pending_registrations}</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-green-500">
                                    <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Approved Tickets</div>
                                    <div className="text-gray-900 dark:text-gray-100 font-black text-3xl">{stats.approved_registrations}</div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Breakdown Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        
                        {/* Registration Status Breakdown */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Status Breakdown</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-green-500"></span> Approved
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white">{stats.approved_registrations}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Pending
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white">{stats.pending_registrations}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-red-500"></span> Rejected
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white">{stats.rejected_registrations}</span>
                                </div>
                            </div>
                        </div>

                        {/* Role Breakdown */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Sales by Role</h3>
                            
                            {stats.registrations_by_role.length === 0 ? (
                                <p className="text-gray-500">No data available yet.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-gray-500 dark:text-gray-400 text-sm">
                                                <th className="pb-3 font-semibold">Role</th>
                                                <th className="pb-3 font-semibold text-right">Tickets</th>
                                                <th className="pb-3 font-semibold text-right">Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {stats.registrations_by_role.map((item, i) => (
                                                <tr key={i} className="text-gray-800 dark:text-gray-200">
                                                    <td className="py-3 font-medium capitalize">{item.role}</td>
                                                    <td className="py-3 text-right">{item.count}</td>
                                                    <td className="py-3 text-right font-bold text-indigo-600 dark:text-indigo-400">
                                                        ৳{item.revenue.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Detailed Data Table */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg flex flex-col">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Detailed Registrations</h3>
                                <p className="text-sm text-gray-500 mt-1">Scroll horizontally to view custom form fields. Use the search to filter all columns.</p>
                            </div>
                            <input
                                type="text"
                                placeholder="Search any field..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-64"
                            />
                        </div>
                        <div className="overflow-x-auto p-0">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm whitespace-nowrap">
                                <thead className="bg-gray-100 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 sticky left-0 bg-gray-100 dark:bg-gray-800 z-10 shadow-[1px_0_0_0_#e5e7eb] dark:shadow-[1px_0_0_0_#374151]">Name</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Email</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Role</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">TxID</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                                        
                                        {/* Render Dynamic Columns */}
                                        {dynamicColumns && dynamicColumns.map(col => (
                                            <th key={col} className="px-4 py-3 text-left font-semibold text-indigo-700 dark:text-indigo-400 border-l border-gray-200 dark:border-gray-700">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                                    {filteredRegistrations.length > 0 ? (
                                        filteredRegistrations.map(reg => (
                                            <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 shadow-[1px_0_0_0_#e5e7eb] dark:shadow-[1px_0_0_0_#374151] font-medium">
                                                    {reg.user ? reg.user.name : reg.guest_name} {reg.user ? '' : <span className="text-xs text-gray-500 font-normal ml-1">(Guest)</span>}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                                    {reg.user ? reg.user.email : reg.guest_email}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 capitalize">
                                                    {reg.role?.name || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        reg.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                        reg.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {reg.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">
                                                    {reg.bkash_txid || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-semibold">
                                                    ৳{reg.payable_amount}
                                                </td>
                                                
                                                {/* Render Dynamic Column Values */}
                                                {dynamicColumns && dynamicColumns.map(col => {
                                                    const rawVal = (reg.form_data && reg.form_data[col]) ? reg.form_data[col] : '-';
                                                    const displayVal = Array.isArray(rawVal) ? rawVal.join(', ') : rawVal;
                                                    return (
                                                        <td key={col} className="px-4 py-3 text-gray-600 dark:text-gray-400 border-l border-gray-100 dark:border-gray-800 max-w-[200px] truncate" title={displayVal}>
                                                            {displayVal}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6 + (dynamicColumns ? dynamicColumns.length : 0)} className="px-4 py-8 text-center text-gray-500">
                                                No registrations match your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
