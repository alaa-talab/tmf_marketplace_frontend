'use client';

import { Logo } from '@/components/ui/logo';

export const Footer = () => {
    return (
        <footer
            className="relative h-[400px]"
            style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
        >
            <div className="fixed bottom-0 h-[400px] w-full bg-foreground text-background">
                <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <div className="p-4 bg-background/10 rounded-full">
                        <Logo className="w-16 h-16 text-background" />
                    </div>
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold font-sans tracking-tight mb-2">TMF Marketplace</h2>
                        <p className="text-background/60">The premium destination for digital assets.</p>
                    </div>
                    <div className="flex gap-6 text-sm font-medium">
                        <a href="#" className="hover:text-accent transition-colors">Terms</a>
                        <a href="#" className="hover:text-accent transition-colors">Privacy</a>
                        <a href="#" className="hover:text-accent transition-colors">Contact</a>
                        <a href="#" className="hover:text-accent transition-colors">Twitter</a>
                    </div>
                    <div className="pt-8 text-xs text-background/40">
                        © 2026 TMF Marketplace. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};
