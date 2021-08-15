const createTaskSection = document.querySelector('.newtask');
const inputNameField = createTaskSection.querySelector('.newtask__name');
const addTaskButton = createTaskSection.querySelector('.newtask__create');
const setDateBtn = createTaskSection.querySelector('#setDateBtn');
const setTimeBtn = createTaskSection.querySelector('#setTimeBtn');
const taskListInDOM = document.querySelector('.list');

const createNewTask = () => {
	const taskName = inputNameField.value.trim();
	if (!taskName) return;

	const taskListName = 'Main Task List';
	const taskIsDone = false;
	console.log(inputNameField.parentElement.querySelector('input[type="date"]'));
	const taskDate = createTaskSection.querySelector('input[type="date"]')?.value || 'not set';
	const taskTime = createTaskSection.querySelector('input[type="time"]')?.value || 'not set';

	saveTaskInStorage(taskListName, taskName, taskIsDone, taskDate, taskTime);
	revealTaskInDOM(taskListName, taskName, taskIsDone, taskDate, taskTime);
	//e.target.blur();
	inputNameField.value = '';
};

function saveTaskInStorage(taskListName, name) {
	let taskObj = {
		taskName: name,
		taskIsDone: false,
	};
	let tasksInTaskList = JSON.parse(localStorage.getItem(taskListName)) || [];
	tasksInTaskList.push(taskObj);
	localStorage.setItem(taskListName, JSON.stringify(tasksInTaskList));
}

function revealTaskInDOM(taskListName, taskName, taskIsDone, taskDate, taskTime) {
	let newTask = document.createElement('li');
	newTask.classList.add('list__item');
	if (taskIsDone) newTask.setAttribute('done', '');
	newTask.innerHTML = `
      <div class="list__item_main">
         <div class="list__item_name">${taskName}</div>
         <div class="list__item_deadline">
            <div class="list__item_date">${taskDate}</div>
            <div class="list__item_time">${taskTime}</div>
         </div>
      </div>
      <div class="list__item_buttons">
         <button class="list__item_delete">X</button>
         <button class="list__item_done">Done</button>
      </div>
   `;
	taskListInDOM.appendChild(newTask);

	// initialize task buttons
	let deleteButton = newTask.querySelector('.list__item_delete');
	let doneButton = newTask.querySelector('.list__item_done');
	deleteButton.onclick = deleteTask;
	doneButton.onclick = doneTask;
}

const deleteTask = (e) => {
	const task = e.target.closest('.list__item');
	const taskListName = 'Main Task List';
	const taskId = Array.from(task.parentElement.children).indexOf(task);
	task.remove();

	let taskListFromStorage = JSON.parse(localStorage.getItem(taskListName));
	taskListFromStorage.splice(taskId, 1);
	localStorage.setItem(taskListName, JSON.stringify(taskListFromStorage));
};

const doneTask = (e) => {
	const task = e.target.parentElement.parentElement;
	const taskListName = 'Main Task List';
	const taskId = Array.from(task.parentElement.children).indexOf(task);
	task.toggleAttribute('done');

	let taskListFromStorage = JSON.parse(localStorage.getItem(taskListName));
	let taskObj = taskListFromStorage[taskId];
	taskObj.taskIsDone = !taskObj.taskIsDone;
	taskListFromStorage.splice(taskId, 1, taskObj);
	localStorage.setItem(taskListName, JSON.stringify(taskListFromStorage));
};

const loadTaskList = (taskListName) => {
	if (!localStorage[taskListName]) return;
	let taskList = JSON.parse(localStorage[taskListName]);

	for (let i = 0; i < taskList.length; i++) {
		let taskData = taskList[i];

		let taskName = taskData.taskName;
		let taskIsDone = taskData.taskIsDone;

		//передаю данные для создания элемента в DOM
		revealTaskInDOM(taskListName, taskName, taskIsDone);
	}
};

addTaskButton.onclick = createNewTask;
inputNameField.onkeydown = (e) => {
	if (e.code === 'Enter') createNewTask(e);
	if (e.key === 'Escape') inputNameField.blur();
};

setDateBtn.onclick = (e) => {
	const inputDate = createTaskSection.querySelector(`input[type="date"]`);
	inputDate.style.display = 'inline-block';
	setTimeBtn.style.display = 'inline-block';
	e.target.style.display = 'none';
};

setTimeBtn.onclick = (e) => {
	const inputTime = createTaskSection.querySelector(`input[type="time"]`);
	inputTime.style.display = 'inline-block';
	e.target.style.display = 'none';
};

loadTaskList('Main Task List');

/* let taskListExample = [
	{
		taskName: 'cold shower',
		taskIsDone: false,
	},
	{
		taskName: 'drink water 2L',
		taskIsDone: false,
	},
]; */
