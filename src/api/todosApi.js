import axios from 'axios';

// Відкритий тестовий API для POST/PUT/PATCH/DELETE. Він приймає запити,
// але насправді нічого не зберігає — для лабораторної цього достатньо.
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

// GET — отримати список задач.
// jsonplaceholder повертає лише латинські тексти, тому українські задачі
// беремо з власного файлу public/tasks.json (він віддається тим самим сервером,
// що й застосунок — і локально, і після деплою).
export async function fetchTasks() {
  const res = await axios.get(`${process.env.PUBLIC_URL}/tasks.json`);
  // беремо лише потрібні поля
  return res.data.map((item) => ({
    id: item.id,
    title: item.title,
    completed: item.completed,
  }));
}

// POST — створити задачу
export async function createTask(title) {
  const res = await api.post('/todos', { title, completed: false, userId: 1 });
  return res.data;
}

// PUT — повністю оновити задачу (редагування)
export async function updateTask(task) {
  const res = await api.put(`/todos/${task.id}`, task);
  return res.data;
}

// PATCH — змінити одне поле (статус виконання)
export async function patchTask(id, fields) {
  const res = await api.patch(`/todos/${id}`, fields);
  return res.data;
}

// DELETE — видалити задачу
export async function deleteTask(id) {
  await api.delete(`/todos/${id}`);
}
