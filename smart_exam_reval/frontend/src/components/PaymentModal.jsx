import React, { useState } from 'react';
import { X, CreditCard, Lock, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentModal = ({ isOpen, onClose, amount, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('form'); // 'form' | 'success'

    // Mock Form State
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Processing Secure Payment...");

        try {
            // Simulate Network Request
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success("Payment Successful!", { id: toastId });
            setStep('success');

            // Wait a bit before closing/triggering success callback
            setTimeout(() => {
                onSuccess();
                // onClose(); // usually onSuccess handles closing or next steps, but we can close it here if needed
            }, 1000);

        } catch (error) {
            toast.error("Payment Failed. Try again.", { id: toastId });
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden z-10"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
                            Secure Payment
                        </h3>
                        <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {step === 'form' ? (
                            <form onSubmit={handlePayment} className="space-y-4">
                                <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/40 dark:to-slate-900 p-4 rounded-xl border border-indigo-200 dark:border-indigo-500/20 mb-6 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Amount</p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">${amount || '0.00'}</p>
                                    </div>
                                    <div className="h-10 w-10 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center">
                                        <CreditCard className="h-5 w-5 text-white" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-500 mb-1 uppercase">Cardholder Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={cardName}
                                        onChange={e => setCardName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-500 mb-1 uppercase">Card Number</label>
                                    <input
                                        type="text"
                                        required
                                        value={cardNumber}
                                        onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-500 mb-1 uppercase">Expiry</label>
                                        <input
                                            type="text"
                                            required
                                            value={expiry}
                                            onChange={e => setExpiry(e.target.value)}
                                            placeholder="MM/YY"
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-500 mb-1 uppercase">CVV</label>
                                        <input
                                            type="password"
                                            required
                                            value={cvv}
                                            onChange={e => setCvv(e.target.value.substring(0, 3))}
                                            placeholder="123"
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Pay Now"
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="h-20 w-20 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-6"
                                >
                                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Payment Confirmed!</h3>
                                <p className="text-slate-600 dark:text-slate-400">Your transaction was successful.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
