import React from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import { Gift } from 'lucide-react';

export default function Giveaways() {
  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <PageHeader
        title="Giveaways"
        subtitle="Exclusive rewards for the community"
      />

      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-8 rounded-full mb-6"
        >
            <Gift className="w-16 h-16 text-amber-400" />
        </motion.div>

        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Coming Soon</h2>
        <p className="text-[var(--text-secondary)] max-w-xs mx-auto">
            We are preparing some amazing rewards for our dedicated practitioners. Stay tuned!
        </p>
      </div>
    </div>
  );
}
