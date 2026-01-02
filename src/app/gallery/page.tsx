'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { PhotoCard } from '@/components/gallery/PhotoCard';

interface Photo {
    id: number;
    title: string;
    description: string;
    capture_date: string;
    watermarked_image: string;
}

export default function GalleryPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await api.get('/photos/gallery/');
                setPhotos(response.data);
            } catch (error) {
                console.error('Failed to fetch photos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading gallery...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-28 mb-20 mt-22 md:mt-2">
            <header className="mb-10 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold font-sans tracking-tight mb-2">Photo Gallery</h1>
                <p className="text-muted-foreground">Discover stunning photography from talented creators</p>
            </header>

            <main className="max-w-7xl mx-auto">
                {photos.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">No photos available yet.</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {photos.map((photo) => (
                            <PhotoCard key={photo.id} photo={photo} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
