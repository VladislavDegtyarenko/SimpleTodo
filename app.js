const createTaskSection = document.querySelector(".newtask");
const inputNameField = createTaskSection.querySelector(".newtask__name");
const addTaskButton = createTaskSection.querySelector(".newtask__create");
const setDateBtn = createTaskSection.querySelector("#setDateBtn");
const setTimeBtn = createTaskSection.querySelector("#setTimeBtn");
const taskListInDOM = document.querySelector(".list__items");
const sortByPriorityBtn = document.querySelector("#sortByPriority");
const taskListName = "Main Task List";

const createNewTask = () => {
   const taskName = inputNameField.value.trim();
   if (!taskName) return;

   const taskListName = "Main Task List";
   const taskIsDone = false;
   const taskDate = createTaskSection.querySelector('input[type="date"]')?.value || null;
   const taskTime = createTaskSection.querySelector('input[type="time"]')?.value || null;
   const taskPriority = createTaskSection.querySelector("#priority").value;

   saveTaskInStorage(taskListName, taskName, taskIsDone, taskDate, taskTime, taskPriority);
   revealTaskInDOM(taskListName, taskName, taskIsDone, taskDate, taskTime, taskPriority);
   //e.target.blur();
   inputNameField.value = "";
};

function saveTaskInStorage(taskListName, taskName, taskIsDone, taskDate, taskTime, taskPriority) {
   let taskObj = {
      taskName,
      taskIsDone,
      taskDate,
      taskTime,
      taskPriority,
   };
   let tasksInTaskList = JSON.parse(localStorage.getItem(taskListName)) || [];
   tasksInTaskList.push(taskObj);
   localStorage.setItem(taskListName, JSON.stringify(tasksInTaskList));
}

function revealTaskInDOM(taskListName, taskName, taskIsDone, taskDate, taskTime, taskPriority) {
   let newTask = document.createElement("li");
   newTask.classList.add("list__item");
   newTask.setAttribute("data-priority", taskPriority);
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
      newTask.setAttribute("done", "");
      newTask.querySelector("label input").checked = true;
   }

   if (taskDate) {
      let dateDiv = document.createElement("div");
      let taskNameDiv = newTask.querySelector(".list__item_name");
      dateDiv.classList.add("list__item_date");
      dateDiv.innerHTML = taskDate;
      insertAfter(dateDiv, taskNameDiv);
   }

   if (taskTime) {
      let timeDiv = document.createElement("div");
      let dateDiv = newTask.querySelector(".list__item_date");
      timeDiv.classList.add("list__item_date");
      timeDiv.innerHTML = taskTime;
      insertAfter(timeDiv, dateDiv);
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
   const taskId = Array.from(task.parentElement.children).indexOf(task) - 1;
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
         taskTime = taskData.taskTime,
         taskPriority = taskData.taskPriority;

      revealTaskInDOM(taskListName, taskName, taskIsDone, taskDate, taskTime, taskPriority);
   }
};

const sortByPriority = () => {
   if (!localStorage[taskListName]) return;
   let taskList = JSON.parse(localStorage[taskListName]);
   let taskListSorted = [];
   let prioritiesArray = ["Priority 1", "Priority 2", "Priority 3", "Priority 4"];
   sortByPriorityBtn.hasAttribute("reverse") ? prioritiesArray.reverse() : prioritiesArray;
   sortByPriorityBtn.toggleAttribute("reverse");

   taskListInDOM.innerHTML = "";

   for (let priority of prioritiesArray) {
      for (let i = 0; i < taskList.length; i++) {
         let taskData = taskList[i];

         let taskName = taskData.taskName,
            taskIsDone = taskData.taskIsDone,
            taskDate = taskData.taskDate,
            taskTime = taskData.taskTime,
            taskPriority = taskData.taskPriority;

         if (taskPriority == priority) {
            revealTaskInDOM(taskListName, taskName, taskIsDone, taskDate, taskTime, taskPriority);
            taskListSorted.push({
               taskName,
               taskIsDone,
               taskDate,
               taskTime,
               taskPriority,
            });
         }
      }
   }

   localStorage.setItem(taskListName, JSON.stringify(taskListSorted));
};

addTaskButton.onclick = createNewTask;
inputNameField.onkeydown = (e) => {
   if (e.key === "Enter") createNewTask(e);
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

sortByPriorityBtn.onclick = sortByPriority;

function insertAfter(newNode, existingNode) {
   existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

loadTaskList("Main Task List");
