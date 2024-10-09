document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const taskList = document.getElementById('task-list');

    loadTasks();

    addTaskBtn.addEventListener('click', () => {
        const taskTitle = taskTitleInput.value.trim();
        const taskDesc = taskDescInput.value.trim();

        if (!taskTitle) {
            alert('Please enter a task title.');
            return;
        }

        const task = {
            title: taskTitle,
            description: taskDesc,
            complete: false,
            important: false 
        };

        addTaskToList(task);
        saveTaskToLocalStorage(task);

        taskTitleInput.value = '';
        taskDescInput.value = '';
    });

    function addTaskToList(task) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (task.important) {
            taskItem.classList.add('important');
        }

        const taskHeader = document.createElement('div');
        taskHeader.classList.add('task-header');

        const starBtn = document.createElement('i');
        starBtn.classList.add('fa', task.important ? 'fa-star' : 'fa-star-o');
        starBtn.classList.add('important-btn');

        starBtn.addEventListener('click', () => {
            task.important = !task.important;
            starBtn.classList.toggle('fa-star', task.important);
            starBtn.classList.toggle('fa-star-o', !task.important);
            taskItem.classList.toggle('important', task.important);
            updateLocalStorage();
            reorderTasks(); // Reorder tasks to bring important ones to the top
        });

        // const taskExpFavOptionsDiv = document.createElement('div');
        // taskOptionsDiv.classList.add('task-exp-fav-options');
        
        const taskTitleDiv = document.createElement('div');
        taskTitleDiv.classList.add('task-title');
        taskTitleDiv.textContent = task.title;
        if (task.complete) {
            taskTitleDiv.classList.add('complete');
        }

        const taskOptionsDiv = document.createElement('div');
        taskOptionsDiv.classList.add('task-options');

        // Mark complete/incomplete button
        const completeBtn = document.createElement('button');
        completeBtn.classList.add('complete-btn');
        completeBtn.textContent = task.complete ? 'Mark Incomplete' : 'Mark Complete';

        completeBtn.addEventListener('click', () => {
            taskTitleDiv.classList.toggle('complete');
            task.complete = !task.complete;
            completeBtn.textContent = task.complete ? 'Mark Incomplete' : 'Mark Complete';
            updateLocalStorage();
        });

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.textContent = 'Edit';

        editBtn.addEventListener('click', () => {
            const newTitle = prompt('Edit Task Title', taskTitleDiv.textContent);
            const newDesc = prompt('Edit Task Description', taskDescDiv.textContent);
            if (newTitle) taskTitleDiv.textContent = newTitle;
            if (newDesc) taskDescDiv.textContent = newDesc;
            task.title = newTitle;
            task.description = newDesc;
            updateLocalStorage();
        });

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';

        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(taskItem);
            removeTaskFromLocalStorage(task);
        });

        taskOptionsDiv.appendChild(completeBtn);
        taskOptionsDiv.appendChild(editBtn);
        taskOptionsDiv.appendChild(deleteBtn);

        // Task description
        const taskDescDiv = document.createElement('div');
        taskDescDiv.classList.add('task-desc');
        taskDescDiv.textContent = task.description;

        // Down/Up arrow button
        const arrowBtn = document.createElement('i');
        arrowBtn.classList.add('fa', 'fa-chevron-down'); // Default is down arrow

        // Toggle task description visibility and arrow direction
        arrowBtn.addEventListener('click', () => {
            const isDescriptionVisible = taskDescDiv.style.display === 'block';
            taskDescDiv.style.display = isDescriptionVisible ? 'none' : 'block';
            arrowBtn.classList.toggle('fa-chevron-down', isDescriptionVisible);
            arrowBtn.classList.toggle('fa-chevron-up', !isDescriptionVisible);
        });

        taskHeader.appendChild(starBtn); // Add star button to the left
        taskHeader.appendChild(arrowBtn); // Add arrow button to the right
        taskHeader.appendChild(taskTitleDiv);
        taskHeader.appendChild(taskOptionsDiv);
        taskItem.appendChild(taskHeader);
        taskItem.appendChild(taskDescDiv);
        taskList.appendChild(taskItem);

        reorderTasks(); // Call reorder when adding new tasks
    }

    // Save task to localStorage
    function saveTaskToLocalStorage(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from localStorage and display them
    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToList(task));
    }

    // Update tasks in localStorage
    function updateLocalStorage() {
        let tasks = [];
        const taskItems = document.querySelectorAll('.task-item');
        taskItems.forEach(item => {
            const title = item.querySelector('.task-title').textContent;
            const description = item.querySelector('.task-desc').textContent;
            const complete = item.querySelector('.task-title').classList.contains('complete');
            const important = item.classList.contains('important');
            tasks.push({ title, description, complete, important });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Remove task from localStorage
    function removeTaskFromLocalStorage(taskToRemove) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.title !== taskToRemove.title);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Reorder tasks to bring important ones to the top
    function reorderTasks() {
        const taskItems = Array.from(document.querySelectorAll('.task-item'));
        taskItems.sort((a, b) => {
            const isImportantA = a.classList.contains('important');
            const isImportantB = b.classList.contains('important');
            if (isImportantA && !isImportantB) return -1;
            if (!isImportantA && isImportantB) return 1;
            return 0; // Keeps the rest sorted by time added
        });
        taskItems.forEach(item => taskList.appendChild(item));
    }
});
