//i dont need globally unique ids for nodes, so start id from 0 each time
const uniqueId = (() => {
  function* uniqueIdGenerator() {
    let id = 0;
    while (true) {
      yield id++;
    }
  }
  const gen = uniqueIdGenerator();
  return () => gen.next().value;
})();

class Tree {
  #children = new Map();
  #parent = null;
  #id = uniqueId();
  #title = "";
  #content = {
    preliminaries: [],
    materials: [],
    test: null,
    liveContent: null,
  };
  constructor(title) {
    this.#title = title;
  }
  set content(newContent) {
    this.#content = { ...newContent };
  }
  get content() {
    return this.#content;
  }
  get identifier() {
    return this.#id;
  }
  set identifier(newId) {
    if (newId) this.#id = newId;
  }
  get children() {
    return Array.from(this.#children.values());
  }

  get parentNode() {
    return this.#parent;
  }

  get childrenCount() {
    return this.#children.size;
  }

  createChildNode(title) {
    const newNode = new Tree(title);
    this.#children.set(newNode.identifier, newNode);
    newNode.#parent = this;
    return newNode;
  }

  #getTreeString(node, spaceCount = 0) {
    let str = "\n";
    node.children.forEach(child => {
      str += `${" ".repeat(spaceCount)}${child.#title}${this.#getTreeString(
        child,
        spaceCount
      )}`;
    });
    return str;
  }

  getChildNode(Id) {
    for (let child of this.children) if (child.identifier === Id) return child;
    return null;
  }

  print() {
    return `${this.#title}${this.#getTreeString(this, 1)}`;
  }

  //traverse all leaves of "this" and run cb function, Depth first search
  traverse(callBackFunc) {
    for (let child of this.children)
      if (callBackFunc(child) || child.traverse(callBackFunc)) return true;
    return false;
  }

  //find by ID
  findNodeByTitle(title) {
    let foundNode = null;
    if (this.#title === title) return this;
    this.traverse(node => {
      if (node.#title === title) {
        foundNode = node;
        return foundNode;
      }
    });
    return foundNode;
  }
}

const textArray = document.querySelector(".text").value.split("\n");

const pathTree = new Tree("Path");
const parents = [pathTree];
let currentParent = 0;
let prevNode = pathTree;
try {
  textArray.forEach((item, index) => {
    console.log(index);
    if (item.trim() === "") return;
    const indent = item.length - item.trimStart().length;
    if (indent > currentParent + 1) throw new Error(`${index + 1}`);
    if (indent === currentParent + 1) {
      parents.push(prevNode);
      currentParent++;
    } else if (indent < currentParent) {
      while (currentParent !== indent) {
        parents.push(prevNode);
        currentParent--;
      }
    }
    if (indent === currentParent)
      prevNode = parents[currentParent].createChildNode(item);
  });
} catch (err) {
  console.log("Error at line:", err.message);
}

console.log(pathTree.print());
console.log(pathTree.findNodeByTitle("A.C.A.B"));
