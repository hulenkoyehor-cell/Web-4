import { useState } from 'react';

function TodoItem({ task, onDelete, onEdit, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const startEdit = () => {
    setDraft(task.title);
    setIsEditing(true);
  };

  const save = () => {
    if (draft.trim()) {
      onEdit(task.id, draft.trim());
      setIsEditing(false);
    }
  };

  const cancel = () => {
    setDraft(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  };

  return (
    <li className='task-item'>
      <input
        type='checkbox'
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.title}" as done`}
      />

      {isEditing ? (
        <>
          <input
            className='edit-input'
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button onClick={save}>Save</button>
          <button onClick={cancel}>Cancel</button>
        </>
      ) : (
        <>
          <span className={task.completed ? 'task-title done' : 'task-title'}>
            {task.title}
          </span>
          <button onClick={startEdit}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </>
      )}
    </li>
  );
}

export default TodoItem;
