// Obtener tareas desde el servidor y mostrarlas en la página
const obtenerTareas = async () => {
  try {
      // Realiza una solicitud GET al servidor para obtener todas las tareas
      const response = await fetch('http://localhost:3000/tareas');
      if (!response.ok) {
          throw new Error(`Error HTTP! status: ${response.status}`);
      }

      // Convierte la respuesta en JSON
      const data = await response.json();

      // Limpia la lista de tareas antes de agregar las nuevas
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';

      // Recorre las tareas obtenidas y agrégalas a la lista en la interfaz
      data.tareas.forEach((tarea) => {
          agregarTareaALista(tarea);
      });
  } catch (error) {
      console.error('Error al obtener las tareas:', error);
  }
};

// Función para agregar una nueva tarea en la interfaz
const agregarTareaALista = (tarea) => {
  const taskList = document.getElementById('taskList');

  // Crea el elemento de la lista para la tarea
  const li = document.createElement('li');
  li.classList.add('list-group-item');

  // Crea un checkbox para marcar la tarea como completada
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('checkbox-completed');
  checkbox.checked = tarea.completada === 1;

  // Marca la tarea como completada o no completada
  checkbox.addEventListener('change', function() {
      li.classList.toggle('completed');
  });

  // Crea un span para mostrar el texto de la tarea
  const taskTextSpan = document.createElement('span');
  taskTextSpan.classList.add('task-text');
  taskTextSpan.textContent = tarea.descripcion;

  // Crea el botón para eliminar la tarea
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Eliminar';
  deleteBtn.classList.add('delete-btn');

  // Evento para eliminar la tarea cuando se haga clic en el botón
  deleteBtn.addEventListener('click', function() {
      eliminarTarea(tarea.id, li);
  });

  // Añade el checkbox, el texto de la tarea y el botón de eliminar a la lista
  li.appendChild(checkbox);
  li.appendChild(taskTextSpan);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
};

// Función para enviar una nueva tarea al servidor
const agregarTarea = async () => {
  const descripcion = document.querySelector('#taskInput').value.trim();
  if (descripcion === '') {
      alert('Por favor, ingresa una descripción para la tarea');
      return;
  }

  try {
      // Envía la nueva tarea al servidor mediante POST
      const response = await fetch('http://localhost:3000/tareas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ descripcion }),
      });

      if (!response.ok) {
          throw new Error('Error al agregar la tarea');
      }

      // Convierte la respuesta en JSON y agrega la tarea a la lista
      const tarea = await response.json();
      agregarTareaALista(tarea);

      // Limpia el campo de entrada
      document.querySelector('#taskInput').value = '';
  } catch (error) {
      console.error('Error al agregar la tarea:', error);
  }
};

// Función para eliminar una tarea del servidor y de la interfaz
const eliminarTarea = async (id, li) => {
  try {
      // Envía una solicitud DELETE al servidor para eliminar la tarea
      const response = await fetch(`http://localhost:3000/tareas/${id}`, {
          method: 'DELETE',
      });

      if (!response.ok) {
          throw new Error('Error al eliminar la tarea');
      }

      // Elimina el elemento de la lista en la interfaz
      li.remove();
  } catch (error) {
      console.error('Error al eliminar la tarea:', error);
  }
};

// Evento que se ejecuta cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', obtenerTareas);

// Evento para agregar tarea cuando se envía el formulario
document.getElementById('taskForm').addEventListener('submit', function(event) {
  event.preventDefault();
  agregarTarea();
});
