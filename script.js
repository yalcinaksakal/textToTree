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
  constructor(content) {
    this.#content = { ...content };
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

  createChildNode(content) {
    const newNode = new Tree(content);
    this.#children.set(newNode.identifier, newNode);
    newNode.parentNode = this;
    return newNode;
  }

  #getTreeString(node, spaceCount = 0) {
    let str = "\n";
    node.children.forEach(child => {
      str += `${" ".repeat(spaceCount)}${child.name}${this.#getTreeString(
        child,
        spaceCount + 2
      )}`;
    });
    return str;
  }

  getChildNode(Id) {
    for (let child of this.children) if (child.identifier === Id) return child;
    return null;
  }

  print() {
    return `${this.name}${this.#getTreeString(this, 2)}`;
  }

  //traverse all leaves of "this" and run cb function, Depth first search
  traverse(callBackFunc) {
    for (let child of this.children)
      if (callBackFunc(child) || child.traverse(callBackFunc)) return true;
    return false;
  }

  //find by ID
  findNodeByID(ID) {
    let foundNode = null;
    if (this.identifier === ID) return this;
    this.traverse(node => {
      if (node.identifier === ID) {
        foundNode = node;
        return foundNode;
      }
    });
    return foundNode;
  }
}

const getSampleTree = () => {
  const sampleTree = new Tree("Root");
  sampleTree
    .createChildNode("Level 1")
    .parentNode.createChildNode("Level 1")
    .parentNode.createChildNode("Level 1")
    .parentNode.createChildNode("Level 1")
    .parentNode.createChildNode("Level 1")
    .createChildNode("Level 2")
    .createChildNode("Level 3")
    .parentNode.createChildNode("Level 3")
    .createChildNode("Level 4")
    .parentNode.parentNode.createChildNode("Level 3")
    .createChildNode("Level 4")
    .createChildNode("Level 5")
    .createChildNode("Level 6")
    .parentNode.createChildNode("Level 6")
    .parentNode.createChildNode("Level 6")
    .createChildNode("Level 7")
    .parentNode.createChildNode("Level 7")
    .parentNode.parentNode.createChildNode("Level 6")
    .parentNode.createChildNode("Level 6")
    .parentNode.parentNode.parentNode.parentNode.parentNode.createChildNode(
      "Level 2"
    )
    .parentNode.createChildNode("Level 2")
    .createChildNode("Level 3")
    .parentNode.createChildNode("Level 3")
    .parentNode.createChildNode("Level 3");
  return sampleTree;
};

const textArray = document.querySelector(".text").value.split("\n");

const pathTree = new Tree({
  preliminaries: [],
  materials: [],
  test: null,
  liveContent: null,
});
console.log(pathTree);
// const nodesArray = textArray.console.log(textArray);
