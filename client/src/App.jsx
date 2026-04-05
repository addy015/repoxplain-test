import { useState } from "react";
import axios from "axios";
import TreeNode from "./components/TreeNode";
import { GitBranch, Search, Loader2 } from "lucide-react";

const App = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!repoUrl) return;
    
    setLoading(true);
    setError("");
    setData(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await axios.post(`${baseUrl}/api/analyze`, { repoUrl });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to analyze repository. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#191818] text-[#f9f2f2] px-4 py-12 md:py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Header section */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4 bg-white/5 border border-white/10 px-4 py-2 rounded-full shadow-lg">
            <GitBranch size={20} className="text-gray-300" />
            <span className="text-sm font-semibold tracking-wider uppercase text-gray-300">Repository Analyzer</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-emerald-400 to-green-400 drop-shadow-sm">
            RepoXplain
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
            Instantly decode, understand, and explore any GitHub repository's structure with just a link.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="w-full max-w-2xl mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* Input Box */}
            <div className="relative group flex-1">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-emerald-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all shadow-xl h-full">
                <div className="pl-4 text-gray-400 hidden sm:block">
                  <Search size={22} />
                </div>
                <input
                  type="text"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full bg-transparent p-4 sm:pl-3 outline-none text-gray-200 placeholder:text-gray-500 text-lg"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !repoUrl}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold flex items-center justify-center px-8 py-4 rounded-xl transition-colors shadow-lg cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Analyze"}
            </button>
            
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="w-full max-w-3xl bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl mb-8 text-center font-medium">
            {error}
          </div>
        )}

        {/* Content Area */}
        {data && data.structure && (
          <div className="w-full max-w-4xl bg-[#1e1e1e]/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/20 p-2 rounded-lg">
                  <GitBranch size={22} className="text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-100">
                  Repository Structure
                </h2>
              </div>
            </div>
            
            <div className="bg-[#121212] rounded-xl p-6 border border-white/5 overflow-x-auto shadow-inner">
              <div className="flex flex-col gap-1 min-w-[300px]">
                {data.structure.map((node, index) => (
                  <TreeNode key={index} node={node} parentPath="" owner={data.owner} repo={data.repo} />
                ))}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;