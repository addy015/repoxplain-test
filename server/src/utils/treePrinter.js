export const printTree = (nodes, indent = "") => {
  for (const node of nodes) {
    console.log(indent + "├── " + node.name);

    if (node.type === "dir" && node.children) {
      printTree(node.children, indent + "│   ");
    }
  }
};