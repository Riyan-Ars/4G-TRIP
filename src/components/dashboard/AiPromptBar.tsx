import React, { useState } from 'react';
import { 
  Sparkles, Mic, Send, RefreshCw, Compass, Lightbulb, Check 
} from 'lucide-react';
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
      // Add smart activity suggestions
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
    }, 800);
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
      {/* Upper row: Need More Ideas pill box & Quick Action Pills (matches ref image!) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Need more ideas card */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-card border border-card-border">
          <div className="w-7 h-7 rounded-lg bg-brand-mint/15 border border-brand-mint/30 flex items-center justify-center text-brand-mint">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Need more itinerary ideas?</div>
            <div className="text-[10px] text-text-muted">Generate activities tailored to your group savings</div>
          </div>
          <button
            onClick={() => handleQuickSuggest('food')}
            className="px-3 py-1 rounded-full bg-card-secondary hover:bg-card-border border border-card-border text-white text-[10px] font-bold transition-colors ml-2"
          >
            Auto Fill
          </button>
        </div>

        {/* Quick action pill badges (matches reference image: Suggest Activities, Rearrange) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuickSuggest('food')}
            className="pill-badge bg-card hover:bg-card-secondary border border-card-border text-text-secondary hover:text-white transition-all text-[11px]"
          >
            <Sparkles className="w-3 h-3 text-brand-mint" />
            <span>Food Ideas</span>
          </button>

          <button
            onClick={() => handleQuickSuggest('culture')}
            className="pill-badge bg-card hover:bg-card-secondary border border-card-border text-text-secondary hover:text-white transition-all text-[11px]"
          >
            <Sparkles className="w-3 h-3 text-brand-blue" />
            <span>Culture Tour</span>
          </button>

          <button
            onClick={() => handleQuickSuggest('rearrange')}
            className="pill-badge bg-card hover:bg-card-secondary border border-card-border text-text-secondary hover:text-white transition-all text-[11px]"
          >
            <RefreshCw className="w-3 h-3 text-brand-orange" />
            <span>Rearrange</span>
          </button>
        </div>
      </div>

      {/* Main Interactive AI Prompt Box (reproducing exact glowing dark box in ref image) */}
      <form
        onSubmit={handleSend}
        className="relative rounded-2xl bg-[#141414] border border-card-border hover:border-brand-mint/50 focus-within:border-brand-mint p-3.5 transition-all shadow-subtle group"
      >
        <textarea
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask 4G Trip to organize travel days, compare costs, or suggest destinations..."
          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-text-muted outline-none resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-card-secondary transition-colors"
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg text-brand-mint hover:bg-card-secondary transition-colors"
              title="AI Magic"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[10px] font-mono text-text-muted px-2 py-0.5 rounded bg-card-secondary border border-card-border">
              ⌘ + K
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !prompt.trim()}
              className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-200 text-black text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              {isSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Added!</span>
                </>
              ) : isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Planning...</span>
                </>
              ) : (
                <>
                  <span>Send</span>
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
