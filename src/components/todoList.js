import TodoItem from './todoItem';

function TodoList({ tasks = [], onDelete, onEdit, onToggle }) {
  if (tasks.length === 0) {
    return <p className='empty'>No tasks yet</p>;
  }

  return (
    <ul className='task-list'>
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}

export default TodoList;
