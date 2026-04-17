const renderTodo = (todo: {
  id: number;
  name: string;
  isCompleted: boolean;
}) => {
  return `
    <li class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2" data-todo-id="${todo.id}">
        <div class="d-flex align-items-center">
            <input class="form-check-input me-2" type="checkbox" aria-label="" ${todo.isCompleted ? "checked" : ""} onchange="handleTodoUpdate(event);" />
            <input type="text" class="form-focusable" value="${todo.name}" onchange="handleTodoUpdate(event);" />
        </div>
        <a href="#" data-mdb-tooltip-init title="Supprimer la tâche" onclick="handleTodoDelete(event);">
            <i class="fas fa-times text-primary"></i>
        </a>
    </li>
`;
};
