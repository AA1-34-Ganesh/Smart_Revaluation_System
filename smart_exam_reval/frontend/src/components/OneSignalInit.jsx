import { useEffect } from 'react';
import OneSignal from 'react-onesignal';
import { useAuth } from '../context/AuthContext';

const OneSignalInit = () => {
    const { user } = useAuth();

    useEffect(() => {
        const runOneSignal = async () => {
            try {
                // Check if OneSignal is already initialized
                if (window.OneSignal && window.OneSignal.initialized) {
                    console.log("🔔 OneSignal already initialized");
                    return;
                }

                await OneSignal.init({
                    appId: "5e98211a-1d11-4be3-b09e-3151478235a9",
                    allowLocalhostAsSecureOrigin: true,
                    notifyButton: {
                        enable: true,
                    },
                });
                window.OneSignal.initialized = true; // Manually flag as initialized
                console.log("🔔 OneSignal Initialized");
            } catch (error) {
                if (error.message && error.message.includes("SDK already initialized")) {
                    console.log("🔔 OneSignal SDK already initialized (caught error)");
                } else {
                    console.warn("OneSignal Init Failed (Non-critical):", error);
                }
            }
        };
        runOneSignal();
    }, []);

    // Sync User Identity
    useEffect(() => {
        if (user && user.email) {
            OneSignal.login(user.email).then(() => {
                console.log("🔔 OneSignal User Logged In:", user.email);
            });
        }
    }, [user]);

    return null;
};

export default OneSignalInit;
