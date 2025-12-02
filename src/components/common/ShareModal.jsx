import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ShareModal({ card, onClose }) {
  const [copied, setCopied] = React.useState(false);

  const shareUrl = `${window.location.origin}/share/${card.id}`; // Mock URL
  const shareText = `Check out this daily practice card: "${card.title}" - ${card.affirmation}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: card.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[var(--bg-primary)] rounded-[32px] p-6 w-full max-w-sm shadow-2xl border border-white/10"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Share Card</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl p-6 mb-6 text-center border border-white/10">
            <h4 className="text-lg font-bold text-white mb-2">{card.title}</h4>
            <p className="text-white/80 italic">"{card.affirmation}"</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleNativeShare}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 h-12 text-lg rounded-xl"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Now
            </Button>

            <Button
              variant="outline"
              onClick={handleCopy}
              className="w-full h-12 rounded-xl border-white/20 hover:bg-white/5"
            >
              {copied ? <Check className="w-5 h-5 mr-2 text-green-400" /> : <Copy className="w-5 h-5 mr-2" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
