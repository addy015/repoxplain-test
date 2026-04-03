import { useState } from "react";
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown } from "lucide-react";

const TreeNode = ({ node }) => {
  const [open, setOpen] = useState(false);
  const isDir = node.type === "dir";

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
          isDir
            ? "cursor-pointer hover:bg-white/10 text-gray-200 font-medium"
            : "hover:bg-white/5 text-gray-400"
        }`}
        onClick={() => isDir && setOpen(!open)}
      >
        <span className="flex shrink-0 items-center justify-center w-5 h-5 text-gray-500">
          {isDir ? (
            open ? (
              <ChevronDown size={16} className="text-blue-400 transition-transform duration-200" />
            ) : (
              <ChevronRight size={16} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
            )
          ) : (
            <span className="w-4"></span> // Spacer for file alignment
          )}
        </span>
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
        <span className={`select-none text-sm tracking-wide truncate ${isDir ? 'text-gray-200' : 'text-gray-400'}`}>
          {node.name}
        </span>
      </div>

      {isDir && open && node.children && (
        <div className="ml-5 border-l border-white/10 pl-3 mt-1 flex flex-col gap-1 relative before:absolute before:top-0 before:bottom-0 before:-left-px before:w-px before:bg-linear-to-b before:from-blue-500/20 before:to-transparent">
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;