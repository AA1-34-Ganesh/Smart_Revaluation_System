import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

const InstallPWA = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            // 1. Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // 2. Stash the event so it can be triggered later.
            setPromptInstall(e);
            // 3. Reveal the install button
            setSupportsPWA(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const onClick = (evt) => {
        evt.preventDefault();
        if (!promptInstall) {
            return;
        }
        // 4. Show the install prompt
        promptInstall.prompt();

        // 5. Wait for the user to respond to the prompt
        promptInstall.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            setPromptInstall(null);
            setSupportsPWA(false);
        });
    };

    if (!supportsPWA) {
        return null; // Don't show button if already installed or not supported
    }

    return (
        <button
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all animate-pulse"
            onClick={onClick}
        >
            <Download className="w-4 h-4" />
            Install App
        </button>
    );
};

export default InstallPWA;
