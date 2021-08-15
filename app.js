const createTaskSection = document.querySelector(".newtask");
const inputNameField = createTaskSection.querySelector(".newtask__name");
const addTaskButton = createTaskSection.querySelector(".newtask__create");
const setDateBtn = createTaskSection.querySelector("#setDateBtn");
const setTimeBtn = createTaskSection.querySelector("#setTimeBtn");
const taskListInDOM = document.querySelector(".list");

const createNewTask = () => {
   const taskName = inputNameField.value.trim();
   if (!taskName) return;

   const taskListName = "Main Task List";
   const taskIsDone = false;
   const taskDate = createTaskSection.querySelector('input[type="date"]')?.value || null;
   const taskTime = createTaskSection.querySelector('input[type="time"]')?.value || null;

   saveTaskInStorage(taskListName, taskName, taskIsDone, taskDate, taskTime);
   revealTaskInDOM(taskListName, taskName, taskIsDone, taskDate, taskTime);
   //e.target.blur();
   inputNameField.value = "";
};

function saveTaskInStorage(taskListName, taskName, taskIsDone, taskDate, taskTime) {
   let taskObj = {
      taskName,
      taskIsDone,
      taskDate,
      taskTime,
   };
   let tasksInTaskList = JSON.parse(localStorage.getItem(taskListName)) || [];
   tasksInTaskList.push(taskObj);
   localStorage.setItem(taskListName, JSON.stringify(tasksInTaskList));
}

function revealTaskInDOM(taskListName, taskName, taskIsDone, taskDate, taskTime) {
   let newTask = document.createElement("li");
   newTask.classList.add("list__item");
   newTask.innerHTML = `
		<label>
			<input type="checkbox" />
		</label>
      <div class="list__item_main">
         <div class="list__item_name">${taskName}</div>
      </div>
      <div class="list__item_buttons">
         <button class="list__item_delete">X</button>
      </div>
   `;
   taskListInDOM.appendChild(newTask);

   if (taskIsDone) {
      newTask.setAttribute("done", "");
      newTask.querySelector("label input").checked = true;
   }

   if (taskDate) {
      let dateDiv = document.createElement("div");
      dateDiv.classList.add("list__item_date");
      dateDiv.innerHTML = taskDate;
      newTask.querySelector(".list__item_main").appendChild(dateDiv);
   }

   if (taskTime) {
      let timeDiv = document.createElement("div");
      timeDiv.classList.add("list__item_date");
      timeDiv.innerHTML = taskTime;
      newTask.querySelector(".list__item_main").appendChild(timeDiv);
   }

   // initialize task buttons
   let deleteButton = newTask.querySelector(".list__item_delete");
   let doneButton = newTask.querySelector("label input");
   deleteButton.onclick = deleteTask;
   doneButton.onclick = doneTask;
}

const deleteTask = (e) => {
   const task = e.target.closest(".list__item");
   const taskListName = "Main Task List";
   const taskId = Array.from(task.parentElement.children).indexOf(task);
   task.remove();

   let taskListFromStorage = JSON.parse(localStorage.getItem(taskListName));
   taskListFromStorage.splice(taskId, 1);
   localStorage.setItem(taskListName, JSON.stringify(taskListFromStorage));
};

const doneTask = (e) => {
   const task = e.target.parentElement.parentElement;
   const taskListName = "Main Task List";
   const taskId = Array.from(task.parentElement.children).indexOf(task);
   task.toggleAttribute("done");

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

      let taskName = taskData.taskName,
         taskIsDone = taskData.taskIsDone,
         taskDate = taskData.taskDate,
         taskTime = taskData.taskTime;

      revealTaskInDOM(taskListName, taskName, taskIsDone, taskDate, taskTime);
   }
};

addTaskButton.onclick = createNewTask;
inputNameField.onkeydown = (e) => {
   if (e.keyCode === "13") createNewTask(e);
   if (e.key === "Escape") inputNameField.blur();
};

setDateBtn.onclick = (e) => {
   const inputDate = createTaskSection.querySelector(`input[type="date"]`);
   inputDate.style.display = "inline-block";
   setTimeBtn.style.display = "inline-block";
   e.target.style.display = "none";
};

setTimeBtn.onclick = (e) => {
   const inputTime = createTaskSection.querySelector(`input[type="time"]`);
   inputTime.style.display = "inline-block";
   e.target.style.display = "none";
};

loadTaskList("Main Task List");

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
