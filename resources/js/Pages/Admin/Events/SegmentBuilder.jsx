import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function SegmentBuilder({ segments = [], setSegments, hasBasePrice, setHasBasePrice }) {

    const addSegment = () => {
        setSegments([...segments, {
            id: `seg_${Date.now()}`,
            title: '',
            is_mandatory: false,
            allow_multiple: false,
            pricing_mode: 'sub_segment', // 'global' or 'sub_segment'
            global_price: 0,
            sub_segments: []
        }]);
    };

    const updateSegment = (index, key, value) => {
        const newSegments = segments.map((seg, i) => 
            i === index ? { ...seg, [key]: value } : seg
        );
        setSegments(newSegments);
    };

    const removeSegment = (index) => {
        setSegments(segments.filter((_, i) => i !== index));
    };

    const addSubSegment = (segIndex) => {
        const newSegments = segments.map((seg, i) => {
            if (i === segIndex) {
                return {
                    ...seg,
                    sub_segments: [
                        ...(seg.sub_segments || []),
                        {
                            id: `sub_${Date.now()}`,
                            title: '',
                            price: 0,
                            has_options: false,
                            allow_multiple: false,
                            pricing_mode: 'global', // 'global' or 'option'
                            options: []
                        }
                    ]
                };
            }
            return seg;
        });
        setSegments(newSegments);
    };

    const updateSubSegment = (segIndex, subIndex, key, value) => {
        const newSegments = segments.map((seg, i) => {
            if (i === segIndex) {
                const newSubs = (seg.sub_segments || []).map((sub, j) => 
                    j === subIndex ? { ...sub, [key]: value } : sub
                );
                return { ...seg, sub_segments: newSubs };
            }
            return seg;
        });
        setSegments(newSegments);
    };

    const removeSubSegment = (segIndex, subIndex) => {
        const newSegments = segments.map((seg, i) => {
            if (i === segIndex) {
                return {
                    ...seg,
                    sub_segments: (seg.sub_segments || []).filter((_, j) => j !== subIndex)
                };
            }
            return seg;
        });
        setSegments(newSegments);
    };

    const addOption = (segIndex, subIndex) => {
        const newSegments = segments.map((seg, i) => {
            if (i === segIndex) {
                const newSubs = (seg.sub_segments || []).map((sub, j) => {
                    if (j === subIndex) {
                        return {
                            ...sub,
                            has_options: true,
                            options: [
                                ...(sub.options || []),
                                {
                                    id: `opt_${Date.now()}`,
                                    title: '',
                                    price: 0
                                }
                            ]
                        };
                    }
                    return sub;
                });
                return { ...seg, sub_segments: newSubs };
            }
            return seg;
        });
        setSegments(newSegments);
    };

    const updateOption = (segIndex, subIndex, optIndex, key, value) => {
        const newSegments = segments.map((seg, i) => {
            if (i === segIndex) {
                const newSubs = (seg.sub_segments || []).map((sub, j) => {
                    if (j === subIndex) {
                        const newOpts = (sub.options || []).map((opt, k) => 
                            k === optIndex ? { ...opt, [key]: value } : opt
                        );
                        return { ...sub, options: newOpts };
                    }
                    return sub;
                });
                return { ...seg, sub_segments: newSubs };
            }
            return seg;
        });
        setSegments(newSegments);
    };

    const removeOption = (segIndex, subIndex, optIndex) => {
        const newSegments = segments.map((seg, i) => {
            if (i === segIndex) {
                const newSubs = (seg.sub_segments || []).map((sub, j) => {
                    if (j === subIndex) {
                        const newOpts = (sub.options || []).filter((_, k) => k !== optIndex);
                        return { 
                            ...sub, 
                            options: newOpts,
                            has_options: newOpts.length > 0
                        };
                    }
                    return sub;
                });
                return { ...seg, sub_segments: newSubs };
            }
            return seg;
        });
        setSegments(newSegments);
    };

    return (
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Event Segments & Pricing</h3>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="has_base_price"
                        checked={hasBasePrice}
                        onChange={(e) => setHasBasePrice(e.target.checked)}
                        className="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 mr-2"
                    />
                    <InputLabel htmlFor="has_base_price" value="Charge Base Participant Price (Top-level)" className="!mb-0" />
                </div>
            </div>

            <div className="space-y-6">
                {segments.map((segment, segIndex) => (
                    <div key={segment.id} className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 mr-4">
                                <InputLabel value="Segment Title" />
                                <TextInput
                                    type="text"
                                    value={segment.title}
                                    onChange={(e) => updateSegment(segIndex, 'title', e.target.value)}
                                    placeholder="e.g. Gaming Tournament, Workshop Session"
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeSegment(segIndex)}
                                className="text-red-500 hover:text-red-700 font-bold mt-6"
                            >
                                Remove Segment
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <InputLabel value="Pricing Mode" />
                                <select
                                    value={segment.pricing_mode}
                                    onChange={(e) => updateSegment(segIndex, 'pricing_mode', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 rounded-md shadow-sm"
                                >
                                    <option value="sub_segment">Price per Sub-segment/Option</option>
                                    <option value="global">Global Segment Price</option>
                                </select>
                            </div>

                            {segment.pricing_mode === 'global' && (
                                <div>
                                    <InputLabel value="Global Price (৳)" />
                                    <TextInput
                                        type="number"
                                        value={segment.global_price}
                                        onChange={(e) => updateSegment(segIndex, 'global_price', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                </div>
                            )}

                            <div className="flex flex-col justify-center space-y-2 mt-4 md:mt-0">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={segment.is_mandatory}
                                        onChange={(e) => updateSegment(segIndex, 'is_mandatory', e.target.checked)}
                                        className="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 mr-2"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Mandatory Segment</span>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={segment.allow_multiple}
                                        onChange={(e) => updateSegment(segIndex, 'allow_multiple', e.target.checked)}
                                        className="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 mr-2"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Allow Multiple Sub-segments</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sub-segments</h4>
                                <button
                                    type="button"
                                    onClick={() => addSubSegment(segIndex)}
                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 text-sm font-bold"
                                >
                                    + Add Sub-segment
                                </button>
                            </div>

                            {(segment.sub_segments || []).length > 0 ? (
                                <div className="space-y-4">
                                    {(segment.sub_segments || []).map((sub, subIndex) => (
                                        <div key={sub.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                            
                                            {/* Sub-segment Header row */}
                                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-2">
                                                <div className="flex-1 w-full">
                                                    <InputLabel value="Sub-segment Title" className="text-xs" />
                                                    <TextInput
                                                        type="text"
                                                        value={sub.title}
                                                        onChange={(e) => updateSubSegment(segIndex, subIndex, 'title', e.target.value)}
                                                        placeholder="e.g. Olympiad, T-Shirt"
                                                        className="block w-full text-sm mt-1"
                                                    />
                                                </div>

                                                {segment.pricing_mode === 'sub_segment' && (!sub.has_options || sub.pricing_mode === 'global') && (
                                                    <div className="w-full sm:w-32">
                                                        <InputLabel value="Price (৳)" className="text-xs" />
                                                        <TextInput
                                                            type="number"
                                                            value={sub.price}
                                                            onChange={(e) => updateSubSegment(segIndex, subIndex, 'price', e.target.value)}
                                                            className="block w-full text-sm mt-1"
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex gap-2 self-end sm:self-center mt-2 sm:mt-5">
                                                    <button
                                                        type="button"
                                                        onClick={() => addOption(segIndex, subIndex)}
                                                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded"
                                                    >
                                                        + Add Option
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSubSegment(segIndex, subIndex)}
                                                        className="text-red-500 hover:text-red-700 text-sm font-bold ml-2"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Options Area (Level 3) */}
                                            {sub.has_options && (
                                                <div className="mt-4 pl-4 sm:pl-8 border-l-2 border-indigo-100 dark:border-indigo-900/50 space-y-3">
                                                    
                                                    {/* Options settings */}
                                                    <div className="flex flex-wrap gap-4 mb-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                                        {segment.pricing_mode === 'sub_segment' && (
                                                            <div>
                                                                <InputLabel value="Option Pricing Mode" className="text-xs" />
                                                                <select
                                                                    value={sub.pricing_mode || 'global'}
                                                                    onChange={(e) => updateSubSegment(segIndex, subIndex, 'pricing_mode', e.target.value)}
                                                                    className="mt-1 block w-full text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 rounded-md shadow-sm"
                                                                >
                                                                    <option value="global">Fixed Price for Sub-segment</option>
                                                                    <option value="option">Price per Option</option>
                                                                </select>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center self-end pb-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={sub.allow_multiple}
                                                                onChange={(e) => updateSubSegment(segIndex, subIndex, 'allow_multiple', e.target.checked)}
                                                                className="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 mr-2"
                                                            />
                                                            <span className="text-xs text-gray-600 dark:text-gray-400">Allow Multiple Options</span>
                                                        </div>
                                                    </div>

                                                    {/* Options loop */}
                                                    {(sub.options || []).map((opt, optIndex) => (
                                                        <div key={opt.id} className="flex gap-3 items-center">
                                                            <div className="flex-1">
                                                                <TextInput
                                                                    type="text"
                                                                    value={opt.title}
                                                                    onChange={(e) => updateOption(segIndex, subIndex, optIndex, 'title', e.target.value)}
                                                                    placeholder="Option Title (e.g. Senior Category)"
                                                                    className="block w-full text-sm bg-gray-50 dark:bg-gray-900"
                                                                />
                                                            </div>
                                                            {segment.pricing_mode === 'sub_segment' && sub.pricing_mode === 'option' && (
                                                                <div className="w-24 flex items-center gap-1">
                                                                    <span className="text-gray-500 text-sm">৳</span>
                                                                    <TextInput
                                                                        type="number"
                                                                        value={opt.price}
                                                                        onChange={(e) => updateOption(segIndex, subIndex, optIndex, 'price', e.target.value)}
                                                                        className="block w-full text-sm bg-gray-50 dark:bg-gray-900"
                                                                    />
                                                                </div>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOption(segIndex, subIndex, optIndex)}
                                                                className="text-red-400 hover:text-red-600 text-sm font-bold ml-1"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No sub-segments added yet.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    onClick={addSegment}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                    + Add New Segment
                </button>
            </div>
        </div>
    );
}
