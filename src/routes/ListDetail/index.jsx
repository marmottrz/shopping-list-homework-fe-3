import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../app/storage.js";
import "./styles.css";

export default function ListDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [newItem, setNewItem] = useState("");
  const [newMember, setNewMember] = useState("");
  const [showDone, setShowDone] = useState(false);

  const currentUserId = db.getData().currentUserId;
  const currentUser = db.getData().users.find(u => u.id === currentUserId);

  useEffect(() => {
    const found = db.getList(id);
    if (!found) return navigate("/lists");
    setList(found);
  }, [id]);

  if (!list) return <div>Loading…</div>;

  const isOwner = list.ownerId === currentUserId;
  const members = db.getData().users.filter(u => list.memberIds.includes(u.id));

  const visibleItems = showDone ? list.items : list.items.filter(i => !i.done);

  function refresh() {
    setList({ ...db.getList(id) });
  }

  function handleRename() {
    const newName = prompt("New list name:", list.name);
    if (newName && newName.trim()) {
      db.renameList(list.id, newName.trim());
      refresh();
    }
  }

  function handleAddItem() {
    if (!newItem.trim()) return;
    db.addItem(list.id, newItem.trim());
    setNewItem("");
    refresh();
  }

  function handleToggleItem(itemId) {
    db.toggleItem(list.id, itemId);
    refresh();
  }

  function handleRemoveItem(itemId) {
    db.removeItem(list.id, itemId);
    refresh();
  }

  function handleAddMember() {
    const user = db.getData().users.find(u => u.name.toLowerCase() === newMember.toLowerCase());
    if (!user) {
      alert("User not found");
      return;
    }
    db.addMember(list.id, user.id);
    setNewMember("");
    refresh();
  }

  function handleRemoveMember(userId) {
    db.removeMember(list.id, userId);
    refresh();
  }

  function handleLeave() {
    db.leaveList(list.id, currentUserId);
    navigate("/lists");
  }

  return (
    <div>
      <div className="pill list-header">
        📝 {list.name}
        {isOwner && (
          <>
            <button className="btn ghost" onClick={handleRename}>Rename</button>
            <button className="btn ghost" onClick={() => { db.archiveList(list.id); navigate("/lists"); }}>
              Archive
            </button>
            <button className="btn dark" onClick={() => { db.deleteList(list.id); navigate("/lists"); }}>
              Delete
            </button>
          </>
        )}
      </div>

      <section className="section">
        <div className="pill">🧺 Items</div>
        {list.items.length === 0 && <div className="empty">No items yet.</div>}

        <ul className="item-list">
          {visibleItems.map(item => (
            <li key={item.id} className={`item-row ${item.done ? "done" : ""}`}>
              <label>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => handleToggleItem(item.id)}
                />
                {item.name}
              </label>
              <button className="btn dark" onClick={() => handleRemoveItem(item.id)}>X</button>
            </li>
          ))}

          <li className="item-row add-row">
            <input
              className="add-input"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add a new item..."
            />
            <button className="btn dark" onClick={handleAddItem}>Add</button>
          </li>
        </ul>

        <div style={{ marginTop: 8 }}>
          <label>
            <input
              type="checkbox"
              checked={showDone}
              onChange={() => setShowDone(!showDone)}
            />{" "}
            Show completed items
          </label>
        </div>
      </section>

      <section className="section">
        <div className="pill">👥 Members</div>

        <ul className="member-list">
          {members.map(m => (
            <li key={m.id} className="member-row">
              <span>
                {m.name}
                {m.id === list.ownerId && !m.name.toLowerCase().includes("(owner)") ? " (owner)" : ""}
              </span>
              {isOwner && m.id !== list.ownerId && (
                <button className="btn dark" onClick={() => handleRemoveMember(m.id)}>Remove</button>
              )}
              {!isOwner && m.id === currentUserId && (
                <button className="btn dark" onClick={handleLeave}>Leave</button>
              )}
            </li>
          ))}

          {isOwner && (
            <li className="member-row add-row">
              <input
                className="add-input"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder="Add member by name..."
              />
              <button className="btn dark" onClick={handleAddMember}>Add</button>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
