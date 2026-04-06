import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Youtube, 
  Search, 
  Sparkles, 
  TrendingUp, 
  Image as ImageIcon, 
  Eye, 
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Copy,
  Check,
  Download
} from "lucide-react";
import { generateVideoIdeas } from "./services/geminiService";
import { VideoIdea } from "./types";

export default function App() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateVideoIdeas(niche);
      setIdeas(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (idea: VideoIdea, index: number) => {
    const text = `Title: ${idea.title}\nThumbnail: ${idea.thumbnailConcept}\nConcept: ${idea.concept}\nViews: ${idea.estimatedViews}\nTrending Reason: ${idea.trendingReason}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const exportToCSV = () => {
    if (ideas.length === 0) return;

    const headers = ["Title", "Thumbnail Concept", "Video Concept", "Estimated Views", "Trending Reason"];
    const rows = ideas.map(idea => [
      `"${idea.title.replace(/"/g, '""')}"`,
      `"${idea.thumbnailConcept.replace(/"/g, '""')}"`,
      `"${idea.concept.replace(/"/g, '""')}"`,
      `"${idea.estimatedViews.replace(/"/g, '""')}"`,
      `"${idea.trendingReason.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `youtube-ideas-${niche.toLowerCase().replace(/\s+/g, "-")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-sm mb-6"
          >
            <TrendingUp size={14} className="text-red-500" />
            <span>Powered by Real-time Trend Analysis</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
          >
            Viral Idea <span className="text-red-600">Engine</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Stop guessing. Generate 10 high-potential video concepts based on current trending data in your niche.
          </motion.p>
        </header>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto mb-20"
        >
          <form onSubmit={handleGenerate} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-50" />
            <div className="relative flex items-center bg-slate-900 rounded-xl border border-slate-800 p-2 shadow-2xl">
              <div className="pl-4 text-slate-500">
                <Youtube size={24} />
              </div>
              <input 
                type="text" 
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Enter your niche (e.g. AI Tech, Minimalist Cooking, Gaming News)"
                className="w-full bg-transparent border-none focus:ring-0 text-lg px-4 py-3 placeholder:text-slate-600"
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={loading || !niche.trim()}
                className="bg-red-600 hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shrink-0"
              >
                {loading ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <>
                    <span>Generate</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3"
            >
              <AlertCircle size={20} />
              <p>{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-red-600/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin" />
                <Sparkles className="absolute inset-0 m-auto text-red-500 animate-pulse" size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Analyzing Trends...</h3>
              <p className="text-slate-500 text-center max-w-sm">
                Scanning current data for {niche}, checking competitor performance, and identifying high-CTR patterns.
              </p>
            </motion.div>
          ) : ideas.length > 0 ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="text-red-500" size={24} />
                  Top 10 Ideas for {niche}
                </h2>
                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all text-sm font-medium"
                >
                  <Download size={16} />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ideas.map((idea, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:bg-slate-900 hover:border-slate-700 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Idea #{index + 1}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded">
                          <Eye size={14} />
                          <span>{idea.estimatedViews} est. views</span>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(idea, index)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedIndex === index ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-500 transition-colors">
                      {idea.title}
                    </h3>

                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2 uppercase tracking-tighter">
                          <ImageIcon size={14} className="text-blue-500" />
                          <span>Thumbnail Concept</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {idea.thumbnailConcept}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2 uppercase tracking-tighter">
                          <ChevronRight size={14} className="text-purple-500" />
                          <span>Video Concept</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {idea.concept}
                        </p>
                      </div>

                      <div className="flex items-start gap-2 pt-2 border-t border-slate-800">
                        <TrendingUp size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-500 italic">
                          <span className="font-semibold text-slate-400 not-italic">Why it's trending:</span> {idea.trendingReason}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl"
            >
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-700">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-medium text-slate-400">Enter your niche above to start generating</h3>
              <p className="text-slate-600 mt-2">We'll find the best opportunities for your channel.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-32 pt-8 border-t border-slate-900 text-center text-slate-600 text-sm">
          <p>© 2026 Viral Idea Engine • Built for Creators</p>
        </footer>
      </div>
    </div>
  );
}
