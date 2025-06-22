import React, { useEffect, useState } from 'react';
import { my_project_backend } from 'declarations/my_project_backend';

function App() {
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState('');
  const [updateData, setUpdateData] = useState({ id: '', name: '' });

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    my_project_backend.read_items().then(setItems);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName) return;

    my_project_backend.create_item(newName).then(() => {
      setNewName('');
      fetchItems();
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const { id, name } = updateData;
    if (!id || !name) return;

    my_project_backend.update_item(Number(id), name).then(() => {
      setUpdateData({ id: '', name: '' });
      fetchItems();
    });
  };

  const handleDelete = (id) => {
    my_project_backend.delete_item(id).then(() => {
      fetchItems();
    });
  };

  return (
    <main style={{ fontFamily: 'Arial', padding: '20px' }}>
      <h1>Item Manager (CRUD)</h1>

      <section style={{ marginBottom: '2em' }}>
        <h2>Create New Item</h2>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Item name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      </section>

      <section style={{ marginBottom: '2em' }}>
        <h2>Update Item</h2>
        <form onSubmit={handleUpdate}>
          <input
            type="number"
            placeholder="ID"
            value={updateData.id}
            onChange={(e) => setUpdateData({ ...updateData, id: e.target.value })}
          />
          <input
            type="text"
            placeholder="New name"
            value={updateData.name}
            onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
          />
          <button type="submit">Update</button>
        </form>
      </section>

      <section>
        <h2>All Items</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <strong>ID:</strong> {item.id}, <strong>Name:</strong> {item.name} &nbsp;
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
