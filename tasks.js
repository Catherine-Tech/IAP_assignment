// Query for the submit button and input task field
const submit = document.getElementById('submit');
const newTask = document.getElementById('newTask');

// Disable the submit button by default
submit.disabled = true;

// Listen for input to be typed into the input field
newTask.addEventListener('input', function() {
    submit.disabled = !newTask.value.trim();
});

// Function to load task history from localStorage
function loadHistory() {
    const historyContainer = document.getElementById('taskHistory');
    historyContainer.innerHTML = '';
    const taskHistory = JSON.parse(localStorage.getItem('taskHistory')) || {};
    
    Object.keys(taskHistory).forEach(date => {
        const dateHeading = document.createElement('h3');
        dateHeading.textContent = date;
        historyContainer.appendChild(dateHeading);
        
        const taskList = document.createElement('ul');
        taskHistory[date].forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = task;

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', function() {
                deleteTask(date, index);
            });

            listItem.appendChild(deleteButton);
            taskList.appendChild(listItem);
        });
        
        historyContainer.appendChild(taskList);
    });
}

// Function to add a task to the history
function addTaskToHistory(taskText, formattedDate) {
    const taskHistory = JSON.parse(localStorage.getItem('taskHistory')) || {};
    
    if (!taskHistory[formattedDate]) {
        taskHistory[formattedDate] = [];
    }
    
    taskHistory[formattedDate].push(taskText);
    localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
}

// Function to format date as "Day, Month Date"
function formatDateString(date) {
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

// Function to delete a task from the history
function deleteTask(date, index) {
    const taskHistory = JSON.parse(localStorage.getItem('taskHistory')) || {};
    taskHistory[date].splice(index, 1); // Remove the task

    if (taskHistory[date].length === 0) {
        delete taskHistory[date]; // Remove the date if no tasks are left
    }

    localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
    loadHistory();
}

// Load task history on page load
loadHistory();

document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Find the task the user just submitted
    const taskText = newTask.value.trim();
    if (taskText) {
        // Get the current date and format it
        const now = new Date();
        const formattedDate = formatDateString(now);

        // Create a list item for the new task and add the task to it
        const listItem = document.createElement('li');
        listItem.textContent = taskText;

        // Add new element to our unordered list
        document.getElementById('taskList').appendChild(listItem);

        // Record the task in the history with the formatted date
        addTaskToHistory(taskText, formattedDate);

        // Load history to reflect new changes
        loadHistory();

        // Clear the input field and disable the submit button
        newTask.value = '';
        submit.disabled = true;
    }

    return false; // Prevent form from submitting in the traditional way
});
