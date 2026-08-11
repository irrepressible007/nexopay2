import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

const getSelectedSegmentsList = (selectedSegments, eventSegments) => {
    if (!selectedSegments || !eventSegments) return [];
    
    let parsedSegments = selectedSegments;
    if (typeof selectedSegments === 'string') {
        try { parsedSegments = JSON.parse(selectedSegments); } catch (e) { return []; }
    }

    let parsedEventSegments = eventSegments;
    if (typeof eventSegments === 'string') {
        try { parsedEventSegments = JSON.parse(eventSegments); } catch (e) { return []; }
    }

    if (!parsedSegments || typeof parsedSegments !== 'object' || !Array.isArray(parsedEventSegments)) return [];

    const list = [];
    const optionsMap = parsedSegments.__options || {};

    parsedEventSegments.forEach(seg => {
        if (!seg || !seg.id) return;
        const selection = parsedSegments[seg.id];
        if (!selection) return;

        if (seg.pricing_mode === 'global') {
            list.push({
                segmentName: seg.title,
                selectionText: 'Selected',
                price: seg.global_price || 0
            });
        } else {
            const subSegments = seg.sub_segments || [];
            const selectedSubIds = Array.isArray(selection) ? selection : [selection];
            
            selectedSubIds.forEach(subId => {
                const sub = (Array.isArray(subSegments) ? subSegments : []).find(s => s && s.id == subId);
                if (!sub) return;

                if (!sub.has_options || sub.pricing_mode === 'global') {
                    list.push({
                        segmentName: seg.title,
                        selectionText: sub.title,
                        price: sub.price || 0
                    });
                } else {
                    const subOptions = optionsMap[sub.id] || [];
                    const selectedOptIds = Array.isArray(subOptions) ? subOptions : [subOptions];
                    const optionsList = sub.options || [];
                    
                    selectedOptIds.forEach(optId => {
                        const opt = (Array.isArray(optionsList) ? optionsList : []).find(o => o && o.id == optId);
                        if (!opt) return;
                        
                        list.push({
                            segmentName: seg.title,
                            selectionText: `${sub.title} - ${opt.title}`,
                            price: opt.price || 0
                        });
                    });
                }
            });
        }
    });

    return list;
};

const getSegmentFilterOptions = (eventsList = [], selectedEventId) => {
    const options = [];
    if (!Array.isArray(eventsList)) return [];

    const targetEvents = selectedEventId ? eventsList.filter(e => e && e.id == selectedEventId) : eventsList;
    
    targetEvents.forEach(ev => {
        if (!ev) return;
        let segments = ev.segments || [];
        if (typeof segments === 'string') {
            try { segments = JSON.parse(segments); } catch(e) { segments = []; }
        }
        if (!Array.isArray(segments)) return;

        segments.forEach(seg => {
            if (!seg) return;
            if (seg.pricing_mode === 'global') {
                options.push({
                    key: seg.id,
                    label: targetEvents.length > 1 ? `[${ev.title}] ${seg.title}` : seg.title,
                });
            } else {
                let subSegments = seg.sub_segments || [];
                if (typeof subSegments === 'string') {
                    try { subSegments = JSON.parse(subSegments); } catch(e) { subSegments = []; }
                }
                if (!Array.isArray(subSegments)) return;

                subSegments.forEach(sub => {
                    if (!sub) return;
                    if (!sub.has_options || sub.pricing_mode === 'global') {
                        options.push({
                            key: sub.id,
                            label: targetEvents.length > 1 ? `[${ev.title}] ${seg.title} → ${sub.title}` : `${seg.title} → ${sub.title}`,
                        });
                    } else {
                        let optionsList = sub.options || [];
                        if (typeof optionsList === 'string') {
                            try { optionsList = JSON.parse(optionsList); } catch(e) { optionsList = []; }
                        }
                        if (!Array.isArray(optionsList)) return;

                        optionsList.forEach(opt => {
                            if (!opt) return;
                            options.push({
                                key: opt.id,
                                label: targetEvents.length > 1 ? `[${ev.title}] ${seg.title} → ${sub.title} (${opt.title})` : `${seg.title} → ${sub.title} (${opt.title})`,
                            });
                        });
                    }
                });
            }
        });
    });

    return options;
};

const matchesSegmentKey = (reg, key) => {
    if (!key) return true;
    let sel = reg.selected_segments;
    if (!sel) return false;
    if (typeof sel === 'string') {
        try { sel = JSON.parse(sel); } catch(e) { return false; }
    }
    if (!sel || typeof sel !== 'object') return false;

    if (sel[key]) return true;

    for (const segId in sel) {
        if (segId === '__options') continue;
        const val = sel[segId];
        if (Array.isArray(val) && val.includes(key)) return true;
        if (typeof val === 'string' && val === key) return true;
    }

    if (sel.__options) {
        for (const subId in sel.__options) {
            const optVal = sel.__options[subId];
            if (Array.isArray(optVal) && optVal.includes(key)) return true;
            if (typeof optVal === 'string' && optVal === key) return true;
        }
    }

    return false;
};

export default function AnalyticsIndex({ auth, events = [], roles = [], selectedEventId, selectedRoleId, selectedSegmentKey, stats = {}, registrations = [], dynamicColumns = [] }) {
    const [eventId, setEventId] = useState(selectedEventId || '');
    const [roleId, setRoleId] = useState(selectedRoleId || '');
    const [segmentKey, setSegmentKey] = useState(selectedSegmentKey || '');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    const safeStats = stats || {};
    const selectedRole = (roles || []).find(r => r && r.id == roleId);
    const isParticipantFiltered = selectedRole && selectedRole.name && selectedRole.name.toLowerCase() === 'participant';

    const segmentOptions = getSegmentFilterOptions(events, eventId);

    const handleFilterChange = (newEventId, newRoleId, newSegmentKey) => {
        setEventId(newEventId);
        setRoleId(newRoleId);
        setSegmentKey(newSegmentKey);
        router.get(
            route('admin.analytics.index'), 
            { event_id: newEventId, role_id: newRoleId, segment_key: newSegmentKey }, 
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleExportSummary = () => {
        window.location.href = route('admin.analytics.export.summary', { event_id: eventId, role_id: roleId, segment_key: segmentKey });
    };

    const handleExportDetailed = () => {
        window.location.href = route('admin.analytics.export.detailed', { event_id: eventId, role_id: roleId, segment_key: segmentKey });
    };

    // Filter registrations by segment key and search term
    const filteredRegistrations = (registrations || []).filter(reg => {
        if (!reg) return false;
        if (segmentKey && !matchesSegmentKey(reg, segmentKey)) {
            return false;
        }

        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        
        const userName = reg.user ? (reg.user.name || '') : (reg.guest_name || '');
        const userEmail = reg.user ? (reg.user.email || '') : (reg.guest_email || '');
        const txid = reg.bkash_txid || '';
        const status = reg.status || '';
        
        if (userName.toLowerCase().includes(term)) return true;
        if (userEmail.toLowerCase().includes(term)) return true;
        if (txid.toLowerCase().includes(term)) return true;
        if (status.toLowerCase().includes(term)) return true;

        // Search inside dynamic form fields
        if (reg.form_data && typeof reg.form_data === 'object') {
            for (const key of (dynamicColumns || [])) {
                const val = reg.form_data[key];
                if (val !== undefined && val !== null) {
                    const strVal = Array.isArray(val) ? val.join(' ') : String(val);
                    if (strVal.toLowerCase().includes(term)) return true;
                }
            }
        }

        // Search inside selected segment titles
        const userSegList = getSelectedSegmentsList(reg.selected_segments, reg.event?.segments || []);
        for (const item of userSegList) {
            if (item && item.segmentName && item.selectionText) {
                const segStr = `${item.segmentName} ${item.selectionText}`.toLowerCase();
                if (segStr.includes(term)) return true;
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
                        <div className="flex-1 w-full md:w-auto flex flex-col sm:flex-row gap-4 flex-wrap">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Event</label>
                                <select 
                                    value={eventId}
                                    onChange={(e) => handleFilterChange(e.target.value, roleId, segmentKey)}
                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full sm:w-56"
                                >
                                    <option value="">Global (All Events)</option>
                                    {(events || []).map(ev => (
                                        ev && <option key={ev.id} value={ev.id}>{ev.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Segment</label>
                                <select 
                                    value={segmentKey}
                                    onChange={(e) => handleFilterChange(eventId, roleId, e.target.value)}
                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full sm:w-64"
                                >
                                    <option value="">All Segments</option>
                                    {segmentOptions.map(opt => (
                                        <option key={opt.key} value={opt.key}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {(eventId || roleId || segmentKey) && (
                                <div className="flex items-end">
                                    <button
                                        onClick={() => handleFilterChange('', '', '')}
                                        className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold pb-2"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}

                        </div>
                        <div className="flex gap-3 w-full md:w-auto justify-end">
                            <button 
                                onClick={handleExportSummary}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition text-sm"
                            >
                                Download Summary CSV
                            </button>
                            <button 
                                onClick={handleExportDetailed}
                                className="bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition text-sm"
                            >
                                Download Detailed CSV
                            </button>
                        </div>
                    </div>

                    {/* Top Level Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-indigo-500">
                            <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</div>
                            <div className="text-gray-900 dark:text-gray-100 font-black text-3xl">৳{(safeStats.total_revenue || 0).toLocaleString()}</div>
                            <div className="text-xs text-gray-400 mt-1">From approved registrations</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500">
                            <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Registrations</div>
                            <div className="text-gray-900 dark:text-gray-100 font-black text-3xl">{safeStats.total_registrations || 0}</div>
                        </div>
                        {!eventId && (
                            <>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-purple-500">
                                    <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Users</div>
                                    <div className="text-gray-900 dark:text-gray-100 font-black text-3xl">{safeStats.total_users || 0}</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-pink-500">
                                    <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Active Events</div>
                                    <div className="text-gray-900 dark:text-gray-100 font-black text-3xl">{safeStats.active_events || 0} / {safeStats.total_events || 0}</div>
                                </div>
                            </>
                        )}
                        {eventId && (
                            <>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-yellow-500">
                                    <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Pending Checkouts</div>
                                    <div className="text-gray-900 dark:text-gray-100 font-black text-3xl">{safeStats.pending_registrations || 0}</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-green-500">
                                    <div className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Approved Tickets</div>
                                    <div className="text-gray-900 dark:text-gray-100 font-black text-3xl">{safeStats.approved_registrations || 0}</div>
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
                                    <span className="font-bold text-gray-900 dark:text-white">{safeStats.approved_registrations || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Pending
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white">{safeStats.pending_registrations || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-red-500"></span> Rejected
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white">{safeStats.rejected_registrations || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Role Breakdown */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Sales by Role</h3>
                            
                            {(!safeStats.registrations_by_role || safeStats.registrations_by_role.length === 0) ? (
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
                                            {safeStats.registrations_by_role.map((item, i) => (
                                                <tr key={i} className="text-gray-800 dark:text-gray-200">
                                                    <td className="py-3 font-medium capitalize">{item.role || 'Unknown'}</td>
                                                    <td className="py-3 text-right">{item.count || 0}</td>
                                                    <td className="py-3 text-right font-bold text-indigo-600 dark:text-indigo-400">
                                                        ৳{(item.revenue || 0).toLocaleString()}
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
                            <div className="flex flex-col sm:flex-row gap-3 items-center">
                                <select 
                                    value={roleId}
                                    onChange={(e) => handleFilterChange(eventId, e.target.value, segmentKey)}
                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full sm:w-48 capitalize"
                                >
                                    <option value="">All Roles</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Search any field..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full sm:w-64"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto p-0">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm whitespace-nowrap">
                                <thead className="bg-gray-100 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 sticky left-0 bg-gray-100 dark:bg-gray-800 z-10 shadow-[1px_0_0_0_#e5e7eb] dark:shadow-[1px_0_0_0_#374151]">Name</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Email</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Role</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                        <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">TxID / Sender</th>
                                        <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                                        {(isParticipantFiltered || segmentKey || eventId) && (
                                            <th scope="col" className="px-4 py-3 text-left font-semibold text-teal-700 dark:text-teal-400 border-l border-gray-200 dark:border-gray-700">
                                                Participating Segments
                                            </th>
                                        )}
                                        
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
                                            <tr 
                                                key={reg.id} 
                                                onClick={() => setSelectedParticipant(reg)}
                                                className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition cursor-pointer"
                                            >
                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900 shadow-[1px_0_0_0_#e5e7eb] dark:shadow-[1px_0_0_0_#374151] font-medium group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition">
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
                                                    <div>{reg.bkash_txid || '-'}</div>
                                                    <div className="text-gray-500 dark:text-gray-500 text-[10px] mt-0.5">{reg.sender_number || ''}</div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-semibold">
                                                    ৳{reg.payable_amount}
                                                </td>
                                                {(isParticipantFiltered || segmentKey || eventId) && (
                                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 border-l border-gray-100 dark:border-gray-800 max-w-[250px] truncate" title={
                                                        getSelectedSegmentsList(reg.selected_segments, reg.event?.segments)
                                                            .map(item => `${item.segmentName} (${item.selectionText})`)
                                                            .join(', ')
                                                    }>
                                                        {getSelectedSegmentsList(reg.selected_segments, reg.event?.segments)
                                                            .map(item => `${item.segmentName} (${item.selectionText})`)
                                                            .join(', ') || '-'}
                                                    </td>
                                                )}
                                                
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

            {/* Participant Details Modal */}
            <Modal show={selectedParticipant !== null} onClose={() => setSelectedParticipant(null)} maxWidth="2xl">
                <div className="p-6 bg-white dark:bg-gray-900 w-full max-h-[85vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Participant Details
                        </h2>
                        <button onClick={() => setSelectedParticipant(null)} className="text-gray-400 hover:text-gray-500">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {selectedParticipant && (
                        <div className="space-y-6">
                            {/* Core Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</div>
                                    <div className="text-base text-gray-900 dark:text-gray-100 font-semibold">
                                        {selectedParticipant.user ? selectedParticipant.user.name : selectedParticipant.guest_name}
                                        {!selectedParticipant.user && <span className="ml-2 text-xs text-indigo-500 font-normal border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">Guest</span>}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</div>
                                    <div className="text-base text-gray-900 dark:text-gray-100">
                                        {selectedParticipant.user ? selectedParticipant.user.email : selectedParticipant.guest_email}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</div>
                                    <div className="text-base text-gray-900 dark:text-gray-100 capitalize">
                                        {selectedParticipant.role?.name || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</div>
                                    <div className="text-base">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            selectedParticipant.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                            selectedParticipant.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {selectedParticipant.status}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</div>
                                    <div className="text-base text-gray-900 dark:text-gray-100 font-mono">
                                        {selectedParticipant.bkash_txid || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Sender Number</div>
                                    <div className="text-base text-gray-900 dark:text-gray-100 font-mono">
                                        {selectedParticipant.sender_number || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount Paid</div>
                                    <div className="text-base text-indigo-600 dark:text-indigo-400 font-bold">
                                        ৳{selectedParticipant.payable_amount}
                                    </div>
                                </div>
                            </div>

                            {/* Selected Segments */}
                            {selectedParticipant.selected_segments && Object.keys(selectedParticipant.selected_segments).filter(k => k !== '__options').length > 0 && (
                                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Participating Segments</h3>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                                        {getSelectedSegmentsList(selectedParticipant.selected_segments, selectedParticipant.event?.segments).map((item, idx) => (
                                            <div key={idx} className="p-4 flex justify-between items-center">
                                                <div>
                                                    <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.segmentName}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.selectionText}</div>
                                                </div>
                                                <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                                    ৳{item.price}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Dynamic Form Data */}
                            {selectedParticipant.form_data && Object.keys(selectedParticipant.form_data).length > 0 && (
                                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Form Responses</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(selectedParticipant.form_data).map(([key, value]) => (
                                            <div key={key} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 h-full">
                                                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                                    {key.replace(/_/g, ' ')}
                                                </div>
                                                <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                                                    {Array.isArray(value) ? value.join(', ') : (value || '-')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex justify-end">
                                <SecondaryButton onClick={() => setSelectedParticipant(null)}>Close</SecondaryButton>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
