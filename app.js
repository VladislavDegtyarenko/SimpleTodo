const createTaskSection = document.querySelector('.newtask'),
	inputNameField = createTaskSection.querySelector('.newtask__name'),
	addTaskButton = createTaskSection.querySelector('.newtask__create'),
	setDateBtn = createTaskSection.querySelector('#setDateBtn'),
	setTimeBtn = createTaskSection.querySelector('#setTimeBtn'),
	taskListInDOM = document.querySelector('.list__items'),
	sortByNameBtn = document.querySelector('#sortByName'),
	sortByPriorityBtn = document.querySelector('#sortByPriority'),
	sortByDeadlineBtn = document.querySelector('#sortByDeadline'),
	clearListBtn = document.querySelector('#clearList'),
	taskListName = 'Main Task List';

const createNewTask = () => {
	const taskName = inputNameField.value.trim();
	if (!taskName) return;

	const taskIsDone = false;
	const taskDate = createTaskSection.querySelector('input[type="date"]')?.value || null;
	const taskTime = createTaskSection.querySelector('input[type="time"]')?.value || null;
	const taskPriority = createTaskSection.querySelector('#priority').value;

	const taskData = {
		taskName,
		taskIsDone,
		taskDate,
		taskTime,
		taskPriority,
	};

	saveTaskInStorage(taskData);
	revealTaskInDOM(taskData);
	//e.target.blur();
	inputNameField.value = '';
};

function saveTaskInStorage(taskData) {
	let tasksInTaskList = JSON.parse(localStorage.getItem(taskListName)) || [];
	tasksInTaskList.push(taskData);
	localStorage.setItem(taskListName, JSON.stringify(tasksInTaskList));
}

function revealTaskInDOM(taskData) {
	let { taskName, taskIsDone, taskDate, taskTime, taskPriority } = taskData;

	let newTask = document.createElement('li');
	newTask.classList.add('list__item');
	newTask.setAttribute('data-priority', taskPriority);
	newTask.innerHTML = `
		<label>
			<input type="checkbox" />
		</label>
      <div class="list__item_main">
         <div class="list__item_name">${taskName}</div>
		 <div class="list__item_priority">${taskPriority}</div>

      </div>
      <div class="list__item_buttons">
         <button class="list__item_delete">X</button>
      </div>
   `;
	taskListInDOM.appendChild(newTask);

	if (taskIsDone) {
		newTask.setAttribute('done', '');
		newTask.querySelector('label input').checked = true;
	}

	if (taskDate) {
		let dateDiv = document.createElement('div');
		let taskNameDiv = newTask.querySelector('.list__item_name');
		dateDiv.classList.add('list__item_date');
		dateDiv.innerHTML = taskDate;
		insertAfter(dateDiv, taskNameDiv);
	}

	if (taskTime) {
		let timeDiv = document.createElement('div');
		let dateDiv = newTask.querySelector('.list__item_date');
		timeDiv.classList.add('list__item_date');
		timeDiv.innerHTML = taskTime;
		insertAfter(timeDiv, dateDiv);
	}

	// initialize task buttons
	let deleteButton = newTask.querySelector('.list__item_delete');
	let doneButton = newTask.querySelector('label input');
	deleteButton.onclick = deleteTask;
	doneButton.onclick = doneTask;
}

const deleteTask = (e) => {
	const thisTask = e.target.closest('.list__item');
	const taskId = Array.from(thisTask.parentElement.children).indexOf(thisTask);
	thisTask.remove();

	let taskListFromStorage = JSON.parse(localStorage.getItem(taskListName));
	taskListFromStorage.splice(taskId, 1);
	localStorage.setItem(taskListName, JSON.stringify(taskListFromStorage));
};

const doneTask = (e) => {
	const thisTask = e.target.parentElement.parentElement;
	const taskId = Array.from(thisTask.parentElement.children).indexOf(thisTask) - 1;
	thisTask.toggleAttribute('done');

	let taskListFromStorage = JSON.parse(localStorage.getItem(taskListName));
	let taskObj = taskListFromStorage[taskId];
	taskObj.taskIsDone = !taskObj.taskIsDone;
	taskListFromStorage.splice(taskId, 1, taskObj);
	localStorage.setItem(taskListName, JSON.stringify(taskListFromStorage));
};

const loadTaskList = () => {
	if (!localStorage[taskListName]) return;
	let taskList = JSON.parse(localStorage[taskListName]);

	for (let i = 0; i < taskList.length; i++) {
		let taskData = taskList[i];
		revealTaskInDOM(taskData);
	}
};

const sortByPriority = () => {
	if (!localStorage[taskListName]) return;
	let taskList = JSON.parse(localStorage[taskListName]);
	//let prioritiesArray = ['Priority 1', 'Priority 2', 'Priority 3', 'Priority 4'];
	/* sortByPriorityBtn.hasAttribute('reverse') ? prioritiesArray.reverse() : prioritiesArray;
	sortByPriorityBtn.toggleAttribute('reverse'); */

	/* 	for (let priority of prioritiesArray) {
		for (let i = 0; i < taskList.length; i++) {
			let taskData = taskList[i];
			let taskPriority = taskData.taskPriority;

			if (taskPriority == priority) {
				revealTaskInDOM(taskData);
				taskListSorted.push(taskData);
			}
		}
	} */

	sortByPriorityBtn.hasAttribute('reverse')
		? taskList.sort(comparePriorityReverse)
		: taskList.sort(comparePriority);
	sortByPriorityBtn.toggleAttribute('reverse');

	localStorage.setItem(taskListName, JSON.stringify(taskList));

	taskListInDOM.innerHTML = '';
	for (let i = 0; i < taskList.length; i++) {
		let taskData = taskList[i];
		revealTaskInDOM(taskData);
	}
};

const sortByName = () => {
	if (!localStorage[taskListName]) return;
	let taskList = JSON.parse(localStorage[taskListName]);

	sortByNameBtn.hasAttribute('reverse')
		? taskList.sort(compareNamesReverse)
		: taskList.sort(compareNames);
	sortByNameBtn.toggleAttribute('reverse');

	localStorage.setItem(taskListName, JSON.stringify(taskList));

	taskListInDOM.innerHTML = '';
	for (let i = 0; i < taskList.length; i++) {
		let taskData = taskList[i];
		revealTaskInDOM(taskData);
	}
};

const sortByDeadline = () => {
	if (!localStorage[taskListName]) return;
	let taskList = JSON.parse(localStorage[taskListName]);

	sortByDeadlineBtn.hasAttribute('reverse')
		? taskList.sort(compareDLReverse)
		: taskList.sort(compareDL);
	localStorage.setItem(taskListName, JSON.stringify(taskList));
	sortByDeadlineBtn.toggleAttribute('reverse');

	taskListInDOM.innerHTML = '';
	for (let i = 0; i < taskList.length; i++) {
		let taskData = taskList[i];
		revealTaskInDOM(taskData);
	}
};

const clearList = () => {
	taskListInDOM.innerHTML = '';
	localStorage.removeItem(taskListName);
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

insertAfter = (newNode, existingNode) => {
	existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
};

const compareNames = (a, b) => {
	a = a.taskName.toLowerCase();
	b = b.taskName.toLowerCase();
	if (a > b) return 1;
	if (a == b) return 0;
	if (a < b) return -1;
};

const compareNamesReverse = (a, b) => {
	a = a.taskName.toLowerCase();
	b = b.taskName.toLowerCase();
	if (a > b) return -1;
	if (a == b) return 0;
	if (a < b) return 1;
};

const comparePriority = (a, b) => {
	a = a.taskPriority;
	b = b.taskPriority;
	if (a > b) return 1;
	if (a == b) return 0;
	if (a < b) return -1;
};

const comparePriorityReverse = (a, b) => {
	a = a.taskPriority;
	b = b.taskPriority;
	if (a > b) return -1;
	if (a == b) return 0;
	if (a < b) return 1;
};

const compareDL = (a, b) => {
	a = a.taskDate || -1;
	b = b.taskDate || -1;
	if (a > b) return 1;
	if (a == b) return 0;
	if (a < b) return -1;
};

const compareDLReverse = (a, b) => {
	a = a.taskDate || -1;
	b = b.taskDate || -1;
	if (a > b) return -1;
	if (a == b) return 0;
	if (a < b) return 1;
};

inputNameField.onkeydown = (e) => {
	if (e.key === 'Enter') createNewTask(e);
	if (e.key === 'Escape') inputNameField.blur();
};
addTaskButton.onclick = createNewTask;

sortByNameBtn.onclick = sortByName;
sortByPriorityBtn.onclick = sortByPriority;
sortByDeadlineBtn.onclick = sortByDeadline;
clearListBtn.onclick = clearList;
document.onload = loadTaskList();
