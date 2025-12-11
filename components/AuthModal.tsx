import React, { useState } from 'react';
import { X, Mail, Wallet, ArrowRight } from 'lucide-react';
import Button from './Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void | Promise<void>;
  onSignUp?: (payload?: { email?: string; username?: string; password?: string }) => void | Promise<void>;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'SELECT' | 'EMAIL'>('SELECT');

  if (!isOpen) return null;

  const handleLogin = async () => {
    await Promise.resolve(onLogin());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#09090b] border border-zinc-800 w-full max-w-sm rounded-xl p-6 shadow-lg animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-black transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#BEFF1D] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-zinc-800 data-[state=open]:text-zinc-500"
        >
          <X size={16} className="text-zinc-400" />
        </button>

        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
            <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
                {step === 'SELECT' ? 'Enter Normis' : 'Email Login'}
            </h2>
            <p className="text-sm text-zinc-400">
                {step === 'SELECT' ? 'Connect to start trading.' : 'We will send a magic link.'}
            </p>
        </div>

        {step === 'SELECT' ? (
            <div className="space-y-3">
            <button 
                onClick={handleLogin}
                className="w-full flex items-center justify-between p-3 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF1D]"
            >
                <div className="flex items-center gap-3">
                <div className="bg-zinc-800 p-2 rounded-md text-white">
                    <Wallet size={16} />
                </div>
                <span className="font-medium text-sm text-zinc-300 group-hover:text-white transition-colors">Crypto Wallet</span>
                </div>
                <ArrowRight size={16} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            <button 
                onClick={() => setStep('EMAIL')}
                className="w-full flex items-center justify-between p-3 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF1D]"
            >
                <div className="flex items-center gap-3">
                <div className="bg-zinc-800 p-2 rounded-md text-white">
                    <Mail size={16} />
                </div>
                <span className="font-medium text-sm text-zinc-300 group-hover:text-white transition-colors">Email Address</span>
                </div>
                <ArrowRight size={16} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="flex h-9 w-full rounded-md border border-zinc-800 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BEFF1D] disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <Button fullWidth onClick={handleLogin} variant="primary">
                    Continue
                </Button>
                <button 
                    onClick={() => setStep('SELECT')}
                    className="w-full text-center text-sm text-zinc-500 hover:text-white hover:underline underline-offset-4"
                >
                    Back
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;