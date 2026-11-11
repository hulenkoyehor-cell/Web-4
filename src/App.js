import './App.css';
import TodoList from './components/todoList';
import UpdateList from './components/updateList';
import { useState, useEffect } from 'react';
import { fetchTasks, createTask, updateTask, patchTask, deleteTask } from './api/todosApi';

function App() {
  const [tasks, updateTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Завантажуємо задачі один раз, після першого рендеру
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        updateTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // jsonplaceholder знає лише задачі з id 1–200. Задачі, створені нами,
  // існують тільки локально, тому PUT/PATCH/DELETE для них не надсилаємо.
  const isOnServer = (task) => !task.isLocal;

  const addTask = async (title) => {
    try {
      const created = await createTask(title);
      console.log('POST response:', created);
      // сервер завжди повертає id 201, тому для унікальності беремо власний id
      const newTask = { id: Date.now(), title, completed: false, isLocal: true };
      updateTasks((prev) => [...prev, newTask]);
      setError(null);
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to add task');
    }
  };

  const removeTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    updateTasks((prev) => prev.filter((t) => t.id !== id));
    if (!task || !isOnServer(task)) return;
    try {
      await deleteTask(id);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task on server');
    }
  };

  const editTask = async (id, newTitle) => {
    const task = tasks.find((t) => t.id === id);
    updateTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t)));
    if (!task || !isOnServer(task)) return;
    try {
      const updated = await updateTask({ ...task, title: newTitle });
      console.log('PUT response:', updated);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to save changes on server');
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    updateTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    if (!task || !isOnServer(task)) return;
    try {
      await patchTask(id, { completed: !task.completed });
    } catch (err) {
      console.error('Error toggling task:', err);
      setError('Failed to update status on server');
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className='container'>
      <h2>Tasks list</h2>

      {error && <p className='error'>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className='stats'>
            Completed: {completedCount} of {tasks.length}
          </p>
          <UpdateList onAddTask={addTask} />
          <TodoList
            tasks={tasks}
            onDelete={removeTask}
            onEdit={editTask}
            onToggle={toggleTask}
          />
        </>
      )}
    </div>
  );
}

export default App;
