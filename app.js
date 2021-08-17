const createTaskSection = document.querySelector('.newtask'),
	createTaskInput = createTaskSection.querySelector('.newtask__name'),
	setDateBtn = createTaskSection.querySelector('#setDateBtn'),
	setTimeBtn = createTaskSection.querySelector('#setTimeBtn'),
	addTaskButton = createTaskSection.querySelector('.newtask__create');

const taskListInDOM = document.querySelector('.list__items'),
	sortByNameBtn = document.querySelector('#sortByName'),
	sortByPriorityBtn = document.querySelector('#sortByPriority'),
	sortByDeadlineBtn = document.querySelector('#sortByDeadline'),
	clearListBtn = document.querySelector('#clearList'),
	taskListName = 'Main Task List',
	listButtons = document.querySelector('.list__buttons');

const createNewTask = () => {
	const taskName = createTaskInput.value.trim();
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
	createTaskInput.value = '';
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

const sortTasks = (sortBtn, isReverse) => {
	if (!localStorage[taskListName]) return;
	const taskList = JSON.parse(localStorage[taskListName]),
		sortBtnId = sortBtn.id,
		sortOrder = isReverse ? -1 : 1,
		sortingParameter = (function () {
			if (sortBtnId === 'sortByName') return 'taskName';
			if (sortBtnId === 'sortByPriority') return 'taskPriority';
			if (sortBtnId === 'sortByDeadline') return 'taskDate';
		})();

	taskList.sort(function (a, b) {
		a = a[sortingParameter].toLowerCase();
		b = b[sortingParameter].toLowerCase();
		if (a > b) return 1 * sortOrder;
		if (a == b) return 0 * sortOrder;
		if (a < b) return -1 * sortOrder;
	});

	sortBtn.toggleAttribute('reverse');
	localStorage.setItem(taskListName, JSON.stringify(taskList));

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

listButtons.onclick = (e) => {
	if (e.target.matches('button')) {
		if (e.target.classList.contains('sortBtn')) {
			let sortBtn = e.target;
			let isReverse = e.target.hasAttribute('reverse');
			sortTasks(sortBtn, isReverse);
		}
		if (e.target.id === 'clearList') {
			clearList();
		}
	}
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

createTaskInput.onkeydown = (e) => {
	if (e.key === 'Enter') createNewTask(e);
	if (e.key === 'Escape') createTaskInput.blur();
};
addTaskButton.onclick = createNewTask;
document.onload = loadTaskList();
