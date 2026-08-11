import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { createPortal } from 'react-dom';

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

    const eventLogo = registration.event ? registration.event.cover_image : null;

    const instituteName = extractField(formData, ['institute', 'institution', 'school', 'college', 'varsity', 'organization']) || 'N/A';
    const className = extractField(formData, ['class', 'grade', 'level']) || 'N/A';
    const categoryName = extractField(formData, ['category', 'group', 'division']) || registration.role?.name || 'Participant';

    const segmentsList = getSelectedSegmentsList 
        ? getSelectedSegmentsList(registration.selected_segments, registration.event?.segments) 
        : [];

    const handlePrint = () => {
        window.print();
    };

    const ticketContent = (
        <div 
            id="printable-ticket"
            className="bg-white text-black p-3 font-sans flex flex-col justify-start items-center text-center box-border border-2 border-black rounded-xl"
            style={{
                width: '2in',
                height: '5in',
                maxHeight: '5in',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        >
            {/* Event Logo Header */}
            {eventLogo && (
                <div className="mb-2 flex justify-center w-full">
                    <img 
                        src={eventLogo} 
                        alt={eventTitle} 
                        className="max-h-20 max-w-[1.7in] object-contain mx-auto" 
                    />
                </div>
            )}

            {/* Event Title / Header */}
            <div className="text-center w-full mb-3">
                <div className="text-xs font-black tracking-tight leading-tight uppercase text-black border-b-2 border-black pb-1 mb-1">
                    {eventTitle}
                </div>
                {/* Category Title */}
                <div className="text-sm font-black text-black uppercase tracking-wider">
                    {categoryName}
                </div>
            </div>

            {/* Ticket Form Fields */}
            <div className="w-full space-y-2 text-[11px] mt-1 grow flex flex-col justify-start">
                {/* Name */}
                <div className="flex items-start gap-1 w-full">
                    <div className="w-[65px] text-left font-bold text-black shrink-0 leading-tight">Name</div>
                    <div className="text-black font-bold">:</div>
                    <div className="grow border-2 border-black rounded-lg px-2 py-1 font-bold text-black bg-white text-left break-words leading-snug text-xs">
                        {name}
                    </div>
                </div>

                {/* Institute Name */}
                <div className="flex items-start gap-1 w-full">
                    <div className="w-[65px] text-left font-bold text-black shrink-0 leading-tight">Institute Name</div>
                    <div className="text-black font-bold">:</div>
                    <div className="grow border-2 border-black rounded-lg px-2 py-1 font-semibold text-black bg-white text-left leading-tight break-words text-[10px]">
                        {instituteName}
                    </div>
                </div>

                {/* Class */}
                <div className="flex items-start gap-1 w-full">
                    <div className="w-[65px] text-left font-bold text-black shrink-0 leading-tight">Class</div>
                    <div className="text-black font-bold">:</div>
                    <div className="grow border-2 border-black rounded-lg px-2 py-1 font-semibold text-black bg-white text-left break-words leading-snug text-xs">
                        {className}
                    </div>
                </div>

                {/* Segments Box */}
                <div className="flex items-start gap-1 w-full grow">
                    <div className="w-[65px] text-left font-bold text-black shrink-0 leading-tight">Segments</div>
                    <div className="text-black font-bold">:</div>
                    <div className="grow border-2 border-black rounded-lg p-1.5 font-semibold text-black bg-white text-left min-h-[80px] grow text-[10px] break-words">
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
    );

    return (
        <>
            <Modal show={show} onClose={onClose} maxWidth="md">
                <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center">
                    {/* Modal Action Header (Hidden during print) */}
                    <div className="w-full flex justify-between items-center mb-6 print:hidden border-b border-gray-200 dark:border-gray-700 pb-3">
                        <h3 className="text-lg font-bold">Print Participant Ticket (2" x 5")</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrint}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition flex items-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H7a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Ticket
                            </button>
                            <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                        </div>
                    </div>

                    {/* On-screen Preview */}
                    <div className="w-full flex justify-center py-4 bg-gray-100 dark:bg-gray-800 rounded-xl print:hidden">
                        <div className="shadow-2xl rounded-xl overflow-hidden bg-white p-1">
                            {ticketContent}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Portal directly to document.body for flawless single-page printing */}
            {show && typeof document !== 'undefined' && createPortal(
                <div id="printable-ticket-portal-root">
                    {ticketContent}
                </div>,
                document.body
            )}

            {/* Print Stylesheet */}
            <style>{`
                @media print {
                    /* Completely hide everything under body except portal root */
                    body > *:not(#printable-ticket-portal-root) {
                        display: none !important;
                    }
                    #printable-ticket-portal-root {
                        display: flex !important;
                        justify-content: center !important;
                        align-items: flex-start !important;
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 2in !important;
                        height: 5in !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                        overflow: hidden !important;
                    }
                    #printable-ticket {
                        width: 2in !important;
                        height: 5in !important;
                        max-height: 5in !important;
                        margin: 0 !important;
                        border: 2px solid #000000 !important;
                        box-shadow: none !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    html, body {
                        width: 2in !important;
                        height: 5in !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden !important;
                        background: #ffffff !important;
                    }
                    @page {
                        size: 2in 5in;
                        margin: 0;
                    }
                }
            `}</style>
        </>
    );
}
