'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import api from '@/lib/api';
import { UploadCloud, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [captureDate, setCaptureDate] = useState('');
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length) {
            setFiles(prev => [...prev, ...acceptedFiles]);
            const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
            setError('');
            setSuccess(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }
    });

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) {
            setError('Please select at least one image.');
            return;
        }

        setUploading(true);
        setError('');

        try {
            // Upload files sequentially to avoid rate limiting or overwhelming backend
            for (const file of files) {
                const formData = new FormData();
                formData.append('original_image', file);
                formData.append('title', title);
                formData.append('description', description);
                formData.append('capture_date', captureDate);

                await api.post('/photos/upload/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            setSuccess(true);
            // Reset form
            setFiles([]);
            setPreviews([]);
            setTitle('');
            setDescription('');
            setCaptureDate('');
        } catch (err: any) {
            console.error(err);
            setError('Upload failed for some files. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <ProtectedRoute allowedRoles={['Uploader']}>
            <div className="min-h-screen bg-background p-6 md:p-12 mb-20 scroll-mt-20">
                <header className="flex justify-between items-center mb-10 max-w-5xl mx-auto mt-20 md:mt-16">
                    <div>
                        <h1 className="text-3xl font-bold font-sans tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back, {user?.username}</p>
                    </div>
                </header>

                <main className="max-w-3xl mx-auto bg-card/60 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg p-8">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-accent" />
                        Upload New Photo
                    </h2>

                    <form onSubmit={handleUpload} className="space-y-8">
                        {/* Drag & Drop Area */}
                        <motion.div
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            {...(getRootProps() as any)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden ${isDragActive
                                ? 'border-accent bg-accent/5 shadow-2xl shadow-accent/20'
                                : 'border-border bg-card/50 hover:bg-accent/5 hover:border-accent/50 hover:shadow-xl'
                                }`}
                        >
                            <input {...getInputProps()} />

                            {/* Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {previews.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full z-10">
                                    {previews.map((src, i) => (
                                        <div key={i} className="relative aspect-square group">
                                            <Image
                                                src={src}
                                                alt={`Preview ${i}`}
                                                fill
                                                className="object-cover rounded-lg shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                                className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md text-white rounded-full hover:bg-red-500 transition-all transform hover:scale-110 shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {/* Add more button */}
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg aspect-square hover:bg-white/5 transition-colors">
                                        <UploadCloud className="w-8 h-8 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground mt-2">Add more</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-6 z-10">
                                    <div className="w-20 h-20 bg-accent/10 border border-accent/20 text-accent rounded-full flex items-center justify-center mx-auto shadow-lg shadow-accent/10 group-hover:scale-110 transition-transform duration-300">
                                        <UploadCloud className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                                            Drag & Drop your masterpieces
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            or <span className="text-accent underline underline-offset-4">browse files</span> on your computer
                                        </p>
                                    </div>
                                    <div className="flex gap-4 text-xs text-muted-foreground/60 justify-center font-mono">
                                        <span>JPG</span>
                                        <span>PNG</span>
                                        <span>WEBP</span>
                                        <span>MAX 5MB</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Inputs */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-accent outline-none"
                                        placeholder="e.g. Sunset in Paris"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Capture Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={captureDate}
                                        onChange={(e) => setCaptureDate(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-accent outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description *</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-accent outline-none min-h-[100px]"
                                    placeholder="Tell the story behind this photo..."
                                />
                            </div>
                        </div>

                        {/* Status Messages */}
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-red-500/10 text-red-500 rounded text-sm text-center font-medium">
                                    {error}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-green-500/10 text-green-500 rounded text-sm text-center font-medium flex items-center justify-center gap-2">
                                    <Check className="w-4 h-4" /> Upload verification successful! Ready for marketplace.
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={uploading}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <Logo loading className="w-6 h-6" color="white" />
                                    Processing...
                                </>
                            ) : `Upload ${files.length > 0 ? files.length : ''} Photo${files.length !== 1 ? 's' : ''}`}
                        </Button>

                    </form>
                </main>
            </div>
        </ProtectedRoute>
    );
}
