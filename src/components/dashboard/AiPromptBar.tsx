import React, { useState } from 'react';
import { Sparkles, Mic, Send, RefreshCw, Check } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export const AiPromptBar: React.FC = () => {
  const { addItineraryItem, addGroupNote } = useTrip();
  const [prompt, setPrompt] = useState(
    'Plan Day 2 with a morning climb at Batu Caves, photography at Petronas Skybridge, and a relaxed street food dinner at Jalan Alor.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addItineraryItem(
        2,
        'KL Street Photography & Golden Hour',
        'Capture golden hour reflections near Saloma Bridge and Petronas Towers',
        'Saloma Link Bridge',
        '17:30',
        '19:00',
        0
      );
      addGroupNote(`AI Recommendation: ${prompt}`);
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2500);
    }, 700);
  };

  const handleQuickSuggest = (topic: string) => {
    if (topic === 'food') {
      setPrompt('Recommend the top 3 halal street food gems near Bukit Bintang and Petaling Street Chinatown.');
    } else if (topic === 'culture') {
      setPrompt('Suggest a scenic walking route covering Sultan Abdul Samad building and Central Market.');
    } else if (topic === 'rearrange') {
      setPrompt('Optimize Day 2 travel routes to avoid Kuala Lumpur rush hour traffic between 5 PM and 7 PM.');
    }
  };

  return (
    <div className="space-y-3">
      {/* Upper row: Quick Suggestion Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-text-muted">Quick Prompts:</span>
          <button
            onClick={() => handleQuickSuggest('food')}
            className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-secondary border border-border text-text-secondary hover:text-text-primary transition-colors text-[11px] font-medium"
          >
            Halal Food Guide
          </button>
          <button
            onClick={() => handleQuickSuggest('culture')}
            className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-secondary border border-border text-text-secondary hover:text-text-primary transition-colors text-[11px] font-medium"
          >
            Heritage Walking Route
          </button>
          <button
            onClick={() => handleQuickSuggest('rearrange')}
            className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-secondary border border-border text-text-secondary hover:text-text-primary transition-colors text-[11px] font-medium"
          >
            Traffic Optimization
          </button>
        </div>
      </div>

      {/* Main Restrained Command Prompt Box */}
      <form
        onSubmit={handleSend}
        className="relative rounded-xl bg-surface border border-border focus-within:border-brand-blue/50 p-3 transition-colors shadow-subtle group"
      >
        <textarea
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask 4G Trip planner to organize itineraries, calculate budget splits, or find places..."
          className="w-full bg-transparent text-xs sm:text-sm text-text-primary placeholder:text-text-muted outline-none resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors"
              title="Voice Input"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 rounded-lg text-brand-blue hover:bg-surface-secondary transition-colors"
              title="Assistant"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting || !prompt.trim()}
              className="px-3.5 py-1.5 rounded-full bg-brand-accent hover:bg-blue-400 text-background text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              {isSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-background" />
                  <span>Added to Plan!</span>
                </>
              ) : isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Planning...</span>
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
