"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Download, Lock, ArrowLeft, Calendar, User, X, Maximize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/api';
import Image from 'next/image';

interface PhotoDetail {
    id: number;
    title: string;
    description: string;
    capture_date: string;
    watermarked_image: string;
}

export default function PhotoDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [photo, setPhoto] = useState<PhotoDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const response = await api.get('/photos/gallery/');
                const photos = response.data;
                const currentPhoto = photos.find((p: PhotoDetail) => p.id === Number(params.id));

                if (currentPhoto) {
                    setPhoto(currentPhoto);
                } else {
                    showToast('Photo not found', 'error');
                    router.push('/gallery');
                }
            } catch (error) {
                console.error('Failed to fetch photo:', error);
                showToast('Failed to load photo', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchPhoto();
    }, [params.id, router, showToast]);

    const handleWatermarkedDownload = () => {
        if (!user) {
            showToast('Please sign in to download photos', 'warning');
            setTimeout(() => router.push('/auth/login'), 1500);
            return;
        }
        if (photo) {
            window.open(photo.watermarked_image, '_blank');
            showToast('Downloading watermarked version...', 'success');
        }
    };

    const handleHQDownload = async () => {
        if (!user) {
            showToast('Please sign in to download HQ photos', 'warning');
            setTimeout(() => router.push('/auth/login'), 1500);
            return;
        }

        try {
            const res = await api.get(`/photos/download/${params.id}/`);
            const url = res.data.original_image_url;
            if (url) {
                window.open(url, '_blank');
                showToast('Downloading HQ version...', 'success');
            }
        } catch (err) {
            console.error("HQ Download failed", err);
            showToast('Failed to download HQ photo', 'error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading photo...</p>
                </div>
            </div>
        );
    }

    if (!photo) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Main Content - Split Screen */}
            <div className="grid lg:grid-cols-2 min-h-screen">
                {/* Left Side - Image */}
                <div className="relative h-[40vh] lg:h-screen lg:sticky lg:top-0  flex flex-col justify-center mt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full flex items-center justify-center p-2 md:p-8"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <div
                            className="relative group cursor-zoom-in h-full w-full flex items-center justify-center"
                            onClick={() => setLightboxOpen(true)}
                        >
                            <Image
                                src={photo.watermarked_image}
                                alt={photo.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain  lg:rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                <Maximize2 className="w-8 h-8 text-white drop-shadow-lg" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Details */}
                <div className="px-6 py-12 lg:p-16 flex flex-col justify-center bg-background relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-xl"
                    >
                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-bold font-sans tracking-tighter mb-6 leading-tight">
                            {photo.title}
                        </h1>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-6 mb-10 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(photo.capture_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="w-px h-4 bg-border" />
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>TMF Curated</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-12">
                            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-accent rounded-full" />
                                About this Asset
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {photo.description || 'No description available for this masterpiece.'}
                            </p>
                        </div>

                        {/* Creative Download Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold tracking-tight">Acquire Asset</h3>

                            <div className="flex flex-col gap-4">
                                {/* HQ Download - Shining Border Effect */}
                                <div className="group relative w-full cursor-pointer" onClick={handleHQDownload}>
                                    {/* Animated Gradient Border */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 via-white/20 to-[#e3672a] rounded-xl opacity-75 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                                    <div className="relative flex items-center justify-between w-full h-full px-6 py-5 bg-background border border-white/10 rounded-xl leading-none">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 font-bold text-lg text-white">
                                                <Download className="w-5 h-5 text-accent" />
                                                High Quality License
                                            </div>
                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Full Resolution • No Watermark</span>
                                        </div>
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 text-accent group-hover:scale-110 transition-transform">
                                            <ArrowLeft className="w-5 h-5 rotate-180" />
                                        </div>
                                    </div>
                                </div>

                                {/* Watermarked Download - Shining Border Effect */}
                                <div className="group relative w-full cursor-pointer" onClick={handleWatermarkedDownload}>
                                    {/* Animated Gradient Border */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 via-white/20 to-[#e3672a]/20 rounded-xl opacity-50 blur-sm group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                                    <div className="relative flex items-center justify-between w-full h-full px-6 py-5 bg-background border border-white/10 rounded-xl leading-none">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 font-bold text-lg text-white/90">
                                                <Lock className="w-5 h-5 text-accent" />
                                                Watermarked Preview
                                            </div>
                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Low Res • For Evaluation</span>
                                        </div>
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full  text-accent group-hover:scale-110 transition-transform">
                                            <ArrowLeft className="w-5 h-5 rotate-180" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!user && (
                                <p className="text-xs text-center text-muted-foreground/60 italic">
                                    * You must be signed in to download assets.
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setLightboxOpen(false); setScale(1); }}
                        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out overflow-hidden"
                    >
                        {/* Top Controls */}
                        <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
                            <button
                                onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); setScale(1); }}
                                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Bottom Zoom Controls */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full bg-black/50 border border-white/10 backdrop-blur-md z-50">
                            <button
                                onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(1, s - 0.5)); }}
                                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-5 h-5" />
                            </button>
                            <span className="min-w-[3rem] text-center text-sm font-medium text-white select-none">
                                {Math.round(scale * 100)}%
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(4, s + 0.5)); }}
                                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </button>
                            <div className="w-px h-4 bg-white/20 mx-1" />
                            <button
                                onClick={(e) => { e.stopPropagation(); setScale(1); }}
                                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                                title="Reset"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>

                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: scale, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            drag={scale > 1}
                            dragConstraints={{ left: -scale * 200, right: scale * 200, top: -scale * 200, bottom: scale * 200 }}
                            src={photo.watermarked_image}
                            alt={photo.title}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-grab active:cursor-grabbing"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}