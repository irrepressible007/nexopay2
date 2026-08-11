import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

const extractField = (formData = {}, keywords = []) => {
    if (!formData || typeof formData !== 'object') return '';
    for (const key of Object.keys(formData)) {
        const lowerKey = key.toLowerCase();
        if (keywords.some(kw => lowerKey.includes(kw))) {
            const val = formData[key];
            if (Array.isArray(val)) return val.join(', ');
            return val ? String(val) : '';
        }
    }
    return '';
};

export default function TicketPrintModal({ show, onClose, registration, getSelectedSegmentsList }) {
    if (!registration) return null;

    const eventTitle = registration.event ? registration.event.title : 'Event Ticket';
    const name = registration.user ? registration.user.name : (registration.guest_name || 'N/A');
    const formData = registration.form_data || {};

    const instituteName = extractField(formData, ['institute', 'institution', 'school', 'college', 'varsity', 'organization']) || 'N/A';
    const className = extractField(formData, ['class', 'grade', 'level']) || 'N/A';
    const categoryName = extractField(formData, ['category', 'group', 'division']) || registration.role?.name || 'Participant';

    const segmentsList = getSelectedSegmentsList 
        ? getSelectedSegmentsList(registration.selected_segments, registration.event?.segments) 
        : [];

    const handlePrint = () => {
        window.print();
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center">
                {/* Modal Action Header (Hidden during print) */}
                <div className="w-full flex justify-between items-center mb-6 print:hidden border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h3 className="text-lg font-bold">Print Participant Ticket</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition flex items-center gap-1.5"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H7a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print Ticket (2in)
                        </button>
                        <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                    </div>
                </div>

                {/* Printable Ticket Area */}
                <div id="printable-ticket-wrapper" className="w-full flex justify-center py-4 bg-gray-100 dark:bg-gray-800 rounded-xl print:p-0 print:bg-white print:w-auto">
                    <div 
                        id="printable-ticket"
                        className="bg-white text-black p-3 rounded-lg shadow-md print:shadow-none border border-gray-300 print:border-none font-sans"
                        style={{
                            width: '2.2in', // Exactly 2 inches printable width with padding fit
                            minHeight: '3.2in',
                            boxSizing: 'border-box'
                        }}
                    >
                        {/* Event Title / Logo Header */}
                        <div className="text-center mb-3">
                            <div className="text-base font-black tracking-tight leading-tight uppercase text-black border-b-2 border-black pb-1 mb-1">
                                {eventTitle}
                            </div>
                            {/* Category Title */}
                            <div className="text-sm font-extrabold text-black uppercase tracking-wider">
                                {categoryName}
                            </div>
                        </div>

                        {/* Ticket Form Fields */}
                        <div className="space-y-2 text-[11px]">
                            {/* Name */}
                            <div className="flex items-start gap-1">
                                <div className="w-[70px] font-bold text-gray-800 shrink-0">Name</div>
                                <div className="text-gray-800 font-bold">:</div>
                                <div className="grow border-2 border-black rounded-lg px-2 py-0.5 font-semibold text-black bg-white truncate">
                                    {name}
                                </div>
                            </div>

                            {/* Institute Name */}
                            <div className="flex items-start gap-1">
                                <div className="w-[70px] font-bold text-gray-800 shrink-0 leading-tight">Institute Name</div>
                                <div className="text-gray-800 font-bold">:</div>
                                <div className="grow border-2 border-black rounded-lg px-2 py-1 font-semibold text-black bg-white leading-snug min-h-[32px] break-words">
                                    {instituteName}
                                </div>
                            </div>

                            {/* Class */}
                            <div className="flex items-start gap-1">
                                <div className="w-[70px] font-bold text-gray-800 shrink-0">Class</div>
                                <div className="text-gray-800 font-bold">:</div>
                                <div className="grow border-2 border-black rounded-lg px-2 py-0.5 font-semibold text-black bg-white truncate">
                                    {className}
                                </div>
                            </div>

                            {/* Segments Box */}
                            <div className="flex items-start gap-1">
                                <div className="w-[70px] font-bold text-gray-800 shrink-0">Segments</div>
                                <div className="text-gray-800 font-bold">:</div>
                                <div className="grow border-2 border-black rounded-lg p-1.5 font-semibold text-black bg-white min-h-[60px] text-[10px]">
                                    {segmentsList.length > 0 ? (
                                        <ul className="list-disc list-inside space-y-0.5">
                                            {segmentsList.map((item, i) => (
                                                <li key={i} className="leading-tight break-words">
                                                    {item.segmentName} {item.selectionText !== 'Selected' ? `(${item.selectionText})` : ''}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-gray-500 italic">None</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print Stylesheet injection */}
                <style>{`
                    @media print {
                        body * {
                            visibility: hidden !important;
                        }
                        #printable-ticket, #printable-ticket * {
                            visibility: visible !important;
                        }
                        #printable-ticket {
                            position: fixed !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 2in !important;
                            margin: 0 !important;
                            padding: 0.1in !important;
                            border: none !important;
                            box-shadow: none !important;
                        }
                        @page {
                            size: 2in auto;
                            margin: 0;
                        }
                    }
                `}</style>
            </div>
        </Modal>
    );
}
