import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Checkbox from '@/Components/Checkbox';
import { useState } from 'react';

export default function PartnersIndex({ auth, partners }) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingPartner, setEditingPartner] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        destination_url: '',
        is_active: true,
        logo_image: null,
    });

    const openCreateModal = () => {
        reset();
        setIsCreating(true);
    };

    const openEditModal = (partner) => {
        setEditingPartner(partner);
        setData({
            name: partner.name,
            destination_url: partner.destination_url || '',
            is_active: partner.is_active,
            logo_image: null,
        });
    };

    const closeModal = () => {
        setIsCreating(false);
        setEditingPartner(null);
        reset();
    };

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('admin.partners.store'), {
            onSuccess: () => closeModal(),
            forceFormData: true,
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        post(route('admin.partners.update', editingPartner.id), {
            onSuccess: () => closeModal(),
            forceFormData: true,
            _method: 'put',
        });
    };

    const deletePartner = (id) => {
        if (confirm('Are you sure you want to delete this partner?')) {
            destroy(route('admin.partners.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-white leading-tight">Partners Management</h2>
                    <PrimaryButton onClick={openCreateModal}>Add Partner</PrimaryButton>
                </div>
            }
        >
            <Head title="Partners" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl sm:rounded-3xl p-6">
                        <table className="w-full text-left text-gray-300">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="pb-3 font-semibold">Logo</th>
                                    <th className="pb-3 font-semibold">Name</th>
                                    <th className="pb-3 font-semibold">URL</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {partners.map((partner) => (
                                    <tr key={partner.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                        <td className="py-4">
                                            {partner.logo_image ? (
                                                <img src={partner.logo_image} alt={partner.name} className="h-10 object-contain bg-white/10 rounded-lg p-1" />
                                            ) : (
                                                <span className="text-gray-500 text-sm">No Logo</span>
                                            )}
                                        </td>
                                        <td className="py-4 font-bold text-white">{partner.name}</td>
                                        <td className="py-4 text-sm text-indigo-400">
                                            {partner.destination_url ? <a href={partner.destination_url} target="_blank">{partner.destination_url}</a> : '-'}
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${partner.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {partner.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right space-x-3">
                                            <button onClick={() => openEditModal(partner)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                                            <button onClick={() => deletePartner(partner.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {partners.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-500">No partners found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={isCreating || !!editingPartner} onClose={closeModal}>
                <form onSubmit={isCreating ? submitCreate : submitEdit} className="p-6 bg-gray-900 border border-white/10 rounded-2xl">
                    <h2 className="text-lg font-medium text-white mb-6">
                        {isCreating ? 'Add Partner' : 'Edit Partner'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Partner Name" className="text-gray-300" />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full bg-white/5 border-white/10 text-white"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="destination_url" value="Destination URL (Optional)" className="text-gray-300" />
                            <TextInput
                                id="destination_url"
                                type="url"
                                value={data.destination_url}
                                onChange={(e) => setData('destination_url', e.target.value)}
                                className="mt-1 block w-full bg-white/5 border-white/10 text-white"
                            />
                            <InputError message={errors.destination_url} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="logo_image" value="Logo Image (Optional)" className="text-gray-300" />
                            <input
                                type="file"
                                id="logo_image"
                                accept="image/*"
                                onChange={(e) => setData('logo_image', e.target.files[0])}
                                className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-400 hover:file:bg-indigo-500/30 transition cursor-pointer"
                            />
                            <InputError message={errors.logo_image} className="mt-2" />
                        </div>

                        <div className="block mt-4">
                            <label className="flex items-center">
                                <Checkbox
                                    name="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="bg-white/5 border-white/10"
                                />
                                <span className="ms-2 text-sm text-gray-300">Active (Show in Marquee)</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal} className="border-white/10 bg-white/5 text-gray-300">
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            {isCreating ? 'Add Partner' : 'Save Changes'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
