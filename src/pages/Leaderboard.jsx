import React from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import DailyPracticeLeaderboard from '../components/leaderboards/DailyPracticeLeaderboard';
import CustomChallengeLeaderboard from '../components/leaderboards/CustomChallengeLeaderboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Leaderboard() {
  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <PageHeader
        title="Leaderboard"
        subtitle="Top practitioners and challengers"
      />

      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-[var(--bg-secondary)] p-1 rounded-2xl mb-6">
            <TabsTrigger value="practice" className="rounded-xl data-[state=active]:bg-[var(--bg-primary)] data-[state=active]:shadow-sm">Daily Practice</TabsTrigger>
            <TabsTrigger value="challenges" className="rounded-xl data-[state=active]:bg-[var(--bg-primary)] data-[state=active]:shadow-sm">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="practice">
            <DailyPracticeLeaderboard />
        </TabsContent>

        <TabsContent value="challenges">
            <CustomChallengeLeaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
