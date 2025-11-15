import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../app/storage.js";
import "../../app/styles.css";

export default function ListsPage() {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [newName, setNewName] = useState("");

  const currentUserId = db.getData().currentUserId;

  useEffect(() => {
    setLists(db.getLists());
  }, []);

  function handleAdd() {
    if (!newName.trim()) return;
    db.addList(newName, currentUserId);
    setNewName("");
    setLists(db.getLists());
  }

  function handleOpen(id) {
    navigate(`/list/${id}`);
  }

  function handleDelete(id) {
    if (confirm("Do you really want to delete this list?")) {
      db.deleteList(id);
      setLists(db.getLists());
    }
  }

  function handleArchive(id) {
    db.archiveList(id);
    setLists(db.getLists());
  }

  return (
    <div>
      <div className="pill">🛒 My shopping lists</div>

      <div className="card-list">
        {lists.length === 0 && <div className="empty">No active lists yet.</div>}

        {lists.map((list) => (
          <div key={list.id} className="card">
            <div>
              <div><strong>{list.name}</strong></div>
              <div className="meta">
                Owner: {db.getData().users.find(u => u.id === list.ownerId)?.name || "Unknown"}
              </div>
            </div>
            <div className="actions">
              <button className="btn ghost" onClick={() => handleOpen(list.id)}>Open</button>
              {list.ownerId === currentUserId && (
                <>
                  <button className="btn dark" onClick={() => handleArchive(list.id)}>Archive</button>
                  <button className="btn dark" onClick={() => handleDelete(list.id)}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="add-row" style={{ marginTop: "20px", display: "flex", gap: "8px", alignItems: "center", background: "#d1d5db", padding: "10px 12px", borderRadius: "10px", maxWidth: "400px" }}>
        <input
          type="text"
          className="add-input"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New list name..."
        />
        <button className="btn dark" onClick={handleAdd}>+ Add</button>
      </div>
    </div>
  );
}
