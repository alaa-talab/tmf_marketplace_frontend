'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, Lock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Image from 'next/image';

interface Photo {
    id: number;
    title: string;
    description: string;
    capture_date: string;
    watermarked_image: string;
}

export const PhotoCard = ({ photo }: { photo: Photo }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;

        const xPct = mouseXPos / width - 0.5;
        const yPct = mouseYPos / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleViewDetails = () => {
        router.push(`/gallery/${photo.id}`);
    };

    const handleWatermarkedDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            showToast('Please sign in to download photos', 'warning');
            setTimeout(() => router.push('/auth/login'), 1500);
            return;
        }
        window.open(photo.watermarked_image, '_blank');
        showToast('Downloading watermarked version...', 'success');
    };

    const handleHQDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            showToast('Please sign in to download HQ photos', 'warning');
            setTimeout(() => router.push('/auth/login'), 1500);
            return;
        }

        try {
            const res = await api.get(`/photos/download/${photo.id}/`);
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

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleViewDetails}
            className="relative group w-full mb-6 break-inside-avoid rounded-xl overflow-hidden cursor-pointer"
        >
            {/* Image */}
            <Image
                src={photo.watermarked_image}
                alt={photo.title}
                width={500}
                height={500}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay - Reveal on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {photo.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 line-clamp-2">
                    {photo.description}
                </p>

                <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    {/* View Details */}
                    <Button
                        variant="primary"
                        className="flex-1 text-xs h-9"
                        onClick={handleViewDetails}
                    >
                        <Eye className="w-3 h-3 mr-1" /> View
                    </Button>

                    {/* Watermarked Download */}
                    <Button
                        variant="ghost"
                        className="flex-1 text-xs h-9 bg-white/10 hover:bg-white/20 text-white"
                        onClick={handleWatermarkedDownload}
                    >
                        <Lock className="w-3 h-3 mr-1" /> Watermarked
                    </Button>

                    {/* HQ Download */}
                    <Button
                        variant="ghost"
                        className="flex-1 text-xs h-9 bg-white/10 hover:bg-white/20 text-white"
                        onClick={handleHQDownload}
                    >
                        <Download className="w-3 h-3 mr-1" /> HQ
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
