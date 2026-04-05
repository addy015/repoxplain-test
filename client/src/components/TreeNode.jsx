import { useState } from "react";
import axios from "axios";
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Loader2,
  ChevronUp,
  RefreshCw,
} from "lucide-react";

const TreeNode = ({ node, parentPath = "", owner, repo }) => {
  const [open, setOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [explanation, setExplanation] = useState(""); // Cached explanation text
  const [showExplanation, setShowExplanation] = useState(false);
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [isError, setIsError] = useState(false);


  const isDir = node.type === "dir";
  // Full path — e.g. "server/src/services/ai.service.js"
  const filePath = parentPath ? `${parentPath}/${node.name}` : node.name;

  // Typing animation helper
  const typeText = (fullText, setter) => {
    // Check if fullText is valid string
    const textToType = typeof fullText === 'string' ? fullText : String(fullText || "");
    
    let i = 0;
    setter("");
    const interval = setInterval(() => {
      if (i < textToType.length) {
        setter(textToType.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 10); // slightly slower (10ms) for stability
  };

  const handleExplain = async () => {
    // Already fetched successfully — just toggle visibility
    if (explanation && !isError) {
      setShowExplanation((prev) => !prev);
      return;
    }

    // First time or retrying — call API
    setLoadingExplain(true);
    setShowExplanation(true);
    setIsError(false);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await axios.post(`${baseUrl}/api/explain`, {
        filePath,
        owner,
        repo
      });
      typeText(response.data.explanation, setExplanation);
    } catch {
      setExplanation("Could not fetch explanation. Please try again.");
      setIsError(true);
    } finally {
      setLoadingExplain(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Row */}
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
          isDir
            ? "cursor-pointer hover:bg-white/10 text-gray-200 font-medium"
            : "hover:bg-white/5 text-gray-400"
        }`}
        onClick={() => {
          if (isDir) {
            setOpen(!open);
            if (!hasBeenOpened) setHasBeenOpened(true);
          }
        }}
      >
        {/* Chevron / spacer */}
        <span className="flex shrink-0 items-center justify-center w-5 h-5 text-gray-500">
          {isDir ? (
            open ? (
              <ChevronDown size={16} className="text-blue-400 transition-transform duration-200" />
            ) : (
              <ChevronRight size={16} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
            )
          ) : (
            <span className="w-4" />
          )}
        </span>

        {/* Icon */}
        <span className="shrink-0">
          {isDir ? (
            open ? (
              <FolderOpen size={20} className="text-blue-400/90 drop-shadow-sm" />
            ) : (
              <Folder size={20} className="text-blue-500/80 drop-shadow-sm" />
            )
          ) : (
            <FileText size={18} className="text-emerald-500/70 group-hover:text-emerald-400/90 transition-colors" />
          )}
        </span>

        {/* File / folder name */}
        <span className={`select-none text-sm tracking-wide truncate flex-1 ${isDir ? "text-gray-200" : "text-gray-400"}`}>
          {node.name}
        </span>

        {/* Explain button — only for files */}
        {!isDir && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // folder click se conflict na ho
              handleExplain();
            }}
            disabled={loadingExplain}
            title={explanation ? (showExplanation ? "Hide explanation" : "Show explanation") : "Explain this file"}
            className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-all duration-200
              bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300
              border border-emerald-500/20 hover:border-emerald-500/40
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loadingExplain ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                <span>Loading...</span>
              </>
            ) : explanation ? (
              <>
                {showExplanation ? <ChevronUp size={12} /> : <Sparkles size={12} />}
                <span>{showExplanation ? "Hide" : "Show"}</span>
              </>
            ) : (
              <>
                <Sparkles size={12} />
                <span>Explain</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Explanation Box — below the file row */}
      {!isDir && showExplanation && (
        <div className={`ml-12 mr-2 mb-2 px-4 py-3 rounded-lg border text-xs leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300 ${
          isError 
            ? "bg-red-950/30 border-red-500/20 text-red-200/80" 
            : "bg-emerald-950/30 border-emerald-500/20 text-emerald-100/80"
        }`}>
          {loadingExplain ? (
            <div className="flex items-center gap-2 text-emerald-400/70">
              <Loader2 size={13} className="animate-spin" />
              <span>Generating explanation...</span>
            </div>
          ) : (
            <div className="flex justify-between items-start gap-4">
              <p className="whitespace-pre-wrap">{explanation}</p>
              {isError && (
                <button 
                  onClick={handleExplain}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-colors shadow-sm cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Retry</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Children — folders */}
      {isDir && (open || hasBeenOpened) && node.children && (
        <div className={`ml-5 border-l border-white/10 pl-3 mt-1 flex-col gap-1 relative before:absolute before:top-0 before:bottom-0 before:-left-px before:w-px before:bg-linear-to-b before:from-blue-500/20 before:to-transparent ${open ? "flex" : "hidden"}`}>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} parentPath={filePath} owner={owner} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;