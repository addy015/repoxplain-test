import axios from "axios";
/**
 * Helper function to build a nested tree structure from a flat list of paths.
 */
function buildTree(paths) {
  const root = [];

  for (const item of paths) {
    const parts = item.path.split('/');
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1 && item.type === "blob";
      
      let existing = currentLevel.find(el => el.name === part);

      if (!existing) {
        existing = {
          name: part,
          type: isFile ? "file" : "dir",
        };
        if (!isFile) {
           existing.children = [];
        }
        currentLevel.push(existing);
      }
      
      if (!isFile) {
         currentLevel = existing.children;
      }
    }
  }
  return root;
}

/**
 * FUNCTION: getRepoStructure
 * PURPOSE: GitHub repo ka poora folder structure nikalna (using Trees API for better memory management).
 * 
 * @param {string} owner - GitHub repository owner (username)
 * @param {string} repo - Repository name
 * @returns {Array} - Folder aur files ka nested array
 */
export const getRepoStructure = async (owner, repo) => {
  try {
    const headers = {
        Authorization: `token ${process.env.GITHUB_TOKEN}`
    };

    // 1. Get Repo Details to find the default branch (e.g., main or master)
    const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const repoResponse = await axios.get(repoUrl, { headers });
    const defaultBranch = repoResponse.data.default_branch;

    // 2. Fetch the entire tree in one request (recursive)
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`;
    const treeResponse = await axios.get(treeUrl, { headers });
    
    // Arrays/Folders to ignore to save memory and clutter
    const ignoredPaths = ['.git', 'node_modules', '.venv', 'venv', 'dist', 'build', '.next'];

    // Filter out paths we don't care about
    const validItems = treeResponse.data.tree.filter(item => {
        const parts = item.path.split('/');
        return !parts.some(part => ignoredPaths.includes(part));
    });

    // 3. Convert flat path list into nested JSON structure matching the old API
    const structure = buildTree(validItems);

    return structure;
  } catch (error) {
    if (error.response?.status === 404) {
      const err = new Error("Invalid repo link");
      err.status = 404;
      throw err;
    }
    console.log("Error fetching repository structure:", error.message);
    return [];
  }
};

/**
 * FUNCTION: getFileContent
 * PURPOSE: GitHub se kisi specific file ka content download karna.
 * 
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @param {string} path - File path
 * @returns {string} - File content (text)
 */
export const getFileContent = async (owner, repo, path) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw", // Direct raw content mangenge
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error fetching file content:", error.message);
    return null;
  }
};
