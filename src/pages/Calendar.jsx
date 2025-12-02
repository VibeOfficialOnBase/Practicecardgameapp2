import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '../contexts/AuthContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Calendar as CalendarIcon, Star, Edit2, Trash2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

export default function Calendar() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewingEntry, setViewingEntry] = useState(null);

  // Fetch practice entries for the current month
  const { data: practices = [] } = useQuery({
    queryKey: ['practices', user?.email, format(currentMonth, 'yyyy-MM')],
    queryFn: async () => {
      const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
      return base44.entities.DailyPractice.filter({
        created_by: user?.email,
        created_date: { $gte: start, $lte: end } // Mock filter syntax, depends on base44
      });
    },
    enabled: !!user
  });

  // Fetch Card History for indicators
  // In a real app, this might be joined or separate. Assuming DailyPractice has 'practice_card_id'

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getDayStatus = (day) => {
    const practice = practices.find(p => isSameDay(new Date(p.created_date), day));
    if (!practice) return null;
    return practice.completed ? 'completed' : 'missed';
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const selectedPractice = practices.find(p => isSameDay(new Date(p.created_date), selectedDate));

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <PageHeader
        title="Journal"
        subtitle="Your journey in time"
      />

      {/* Calendar Widget */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button onClick={handleNextMonth} className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-[var(--text-secondary)] uppercase opacity-50">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const status = getDayStatus(day);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <motion.button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.01 }}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center relative
                  ${isSelected ? 'bg-[var(--accent-primary)] text-white shadow-lg' : 'hover:bg-[var(--bg-secondary)]'}
                  ${isToday && !isSelected ? 'border border-[var(--accent-primary)] text-[var(--accent-primary)]' : ''}
                `}
              >
                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                  {format(day, 'd')}
                </span>
                {status === 'completed' && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-green-500'}`} />
                )}
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Selected Day Detail */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)] px-2">
          {isSameDay(selectedDate, new Date()) ? 'Today' : format(selectedDate, 'MMMM do')}
        </h3>

        {selectedPractice ? (
          <Card className="p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-emerald-500" />
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <Star className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-[var(--text-primary)]">Practice Complete</p>
                        <p className="text-xs text-[var(--text-secondary)]">{format(new Date(selectedPractice.created_date), 'h:mm a')}</p>
                    </div>
                </div>
                <button onClick={() => setViewingEntry(selectedPractice)} className="text-xs font-medium text-[var(--accent-primary)] hover:underline">
                    View Entry
                </button>
            </div>
            {selectedPractice.reflection && (
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 italic">
                    "{selectedPractice.reflection}"
                </p>
            )}
          </Card>
        ) : (
          <div className="p-8 text-center rounded-[32px] border-2 border-dashed border-[var(--text-secondary)]/20">
            <p className="text-[var(--text-secondary)] text-sm">No practice recorded for this day.</p>
          </div>
        )}
      </div>

      {/* Entry Modal */}
      <Modal
        isOpen={!!viewingEntry}
        onClose={() => setViewingEntry(null)}
        title="Reflection Entry"
      >
        {viewingEntry && (
            <div className="space-y-6">
                <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-2 block">Date</label>
                    <p className="text-[var(--text-primary)]">{format(new Date(viewingEntry.created_date), 'MMMM do, yyyy • h:mm a')}</p>
                </div>

                <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-2 block">Mood</label>
                    <div className="flex gap-4">
                        <div className="bg-[var(--bg-secondary)] px-3 py-1 rounded-full text-sm">
                            Before: {viewingEntry.before_mood || 'N/A'}
                        </div>
                        <div className="bg-[var(--bg-secondary)] px-3 py-1 rounded-full text-sm">
                            After: {viewingEntry.after_mood || 'N/A'}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-2 block">Journal</label>
                    <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl text-sm leading-relaxed text-[var(--text-primary)] italic">
                        "{viewingEntry.reflection}"
                    </div>
                </div>

                {/* Edit/Delete Placeholder actions - would require mutations */}
                <div className="flex gap-2 pt-4">
                    <Button variant="secondary" className="flex-1">
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="secondary" className="flex-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
}
