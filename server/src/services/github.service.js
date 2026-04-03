import axios from "axios";
/**
 * FUNCTION: getRepoStructure
 * PURPOSE: GitHub repo ka poora folder structure nikalna (recursive approach use karke).
 * 
 * @param {string} owner - GitHub repository ka owner (username)
 * @param {string} repo - Repository ka naam
 * @param {string} path - Current folder ka path (default empty for root)
 * @returns {Array} - Folder aur files ka nested array
 */
export const getRepoStructure = async (owner, repo, path = "") => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    });

    const items = response.data;

    // Promise.all is used to make parallel requests to the GitHub API
    const results = await Promise.all(
      items.map(async (item) => {
        if (item.type === "dir") {
          // recursion
          // Agar type 'dir' (directory/folder) hai, 
          // toh recursion use karke iske andar ka content bhi layenge
          const children = await getRepoStructure(owner, repo, item.path);

          return {
            name: item.name,
            type: "dir",
            children
          };
        } else {
          return {
            name: item.name,
            type: "file"
          };
        }
      })
    );

    return results;
  } catch (error) {
    if (error.response?.status === 404 && path === "") {
      const err = new Error("Invalid repo link");
      err.status = 404;
      throw err;
    }
    console.log("Error at path", path);
    return [];
  }
};