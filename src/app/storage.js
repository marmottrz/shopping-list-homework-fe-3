const KEY = "shopping_list_data_v1";

const defaultData = {
  currentUserId: "u1",
  users: [
    { id: "u1", name: "Me (owner)" },
    { id: "u2", name: "Lucie" },
    { id: "u3", name: "Anna" },
  ],
  lists: [
    {
      id: "l1",
      name: "Weekend groceries",
      ownerId: "u1",
      memberIds: ["u1", "u2"],
      archived: false,
      items: [
        { id: "i1", name: "Milk", done: false },
        { id: "i2", name: "Eggs", done: true },
        { id: "i3", name: "Bread", done: false },
      ],
    },
    {
      id: "l2",
      name: "BBQ Party",
      ownerId: "u1",
      memberIds: ["u1", "u3"],
      archived: true,
      items: [
        { id: "i4", name: "Steak", done: false },
        { id: "i5", name: "Coal", done: true },
      ],
    },
  ],
};

function load() {
  const json = localStorage.getItem(KEY);
  return json ? JSON.parse(json) : defaultData;
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export const db = {
  getData() {
    return load();
  },

  getLists() {
    return load().lists.filter((l) => !l.archived);
  },

  getArchived() {
    return load().lists.filter((l) => l.archived);
  },

  getList(id) {
    return load().lists.find((l) => l.id === id);
  },

  addList(name, ownerId) {
    const data = load();
    const newList = {
      id: "l" + Date.now(),
      name,
      ownerId,
      memberIds: [ownerId],
      archived: false,
      items: [],
    };
    data.lists.push(newList);
    save(data);
    return newList;
  },

  renameList(id, newName) {
    const data = load();
    const list = data.lists.find((l) => l.id === id);
    if (list) list.name = newName;
    save(data);
  },

  deleteList(id) {
    const data = load();
    data.lists = data.lists.filter((l) => l.id !== id);
    save(data);
  },

  archiveList(id) {
    const data = load();
    const list = data.lists.find((l) => l.id === id);
    if (list) list.archived = true;
    save(data);
  },

  restoreList(id) {
    const data = load();
    const list = data.lists.find((l) => l.id === id);
    if (list) list.archived = false;
    save(data);
  },

  addItem(listId, name) {
    const data = load();
    const list = data.lists.find((l) => l.id === listId);
    if (list) list.items.push({ id: "i" + Date.now(), name, done: false });
    save(data);
  },

  toggleItem(listId, itemId) {
    const data = load();
    const list = data.lists.find((l) => l.id === listId);
    if (list) {
      const item = list.items.find((i) => i.id === itemId);
      if (item) item.done = !item.done;
    }
    save(data);
  },

  removeItem(listId, itemId) {
    const data = load();
    const list = data.lists.find((l) => l.id === listId);
    if (list) list.items = list.items.filter((i) => i.id !== itemId);
    save(data);
  },

  addMember(listId, userId) {
    const data = load();
    const list = data.lists.find((l) => l.id === listId);
    if (list && !list.memberIds.includes(userId)) list.memberIds.push(userId);
    save(data);
  },

  removeMember(listId, userId) {
    const data = load();
    const list = data.lists.find((l) => l.id === listId);
    if (list) list.memberIds = list.memberIds.filter((id) => id !== userId);
    save(data);
  },

  leaveList(listId, userId) {
    const data = load();
    const list = data.lists.find((l) => l.id === listId);
    if (list) list.memberIds = list.memberIds.filter((id) => id !== userId);
    save(data);
  },
};
