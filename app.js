const createTaskSection = document.querySelector(".create");
const inputField = createTaskSection.querySelector(".create__input");
const addTaskButton = createTaskSection.querySelector(".create__button");
const taskList = document.querySelector(".list");

const createNewTask = () => {
   const taskName = inputField.value.trim();
   let taskListName = "Main Task List";
   if (!taskName) return;

   // save task to localStorage
   saveTaskInStorage(taskListName, taskName);

   // reveal new task in DOM
   //revealTaskInDOM(taskName, taskId);
   //e.target.blur();

   inputField.value = "";
};

function saveTaskInStorage(taskListName = [], name) {
   let taskObj = {
      taskName: name,
      taskIsDone: false,
   };
   let tasksInTaskList = JSON.parse(localStorage.getItem(taskListName));
   tasksInTaskList.push(taskObj);
   localStorage.setItem(taskListName, JSON.stringify(tasksInTaskList));
}

function revealTaskInDOM(taskListName, taskName, taskIsDone) {
   let newTask = document.createElement("li");
   newTask.classList.add("list__item");
   if (taskIsDone) newTask.setAttribute("done", "");
   newTask.innerHTML = `
      <div class="list__item_name">${taskName}</div>
      <div class="list__item_buttons">
         <button class="list__item_delete">X</button>
         <button class="list__item_done">Done</button>
      </div>
   `;
   taskList.appendChild(newTask);

   // initialize task buttons
   let deleteButton = newTask.querySelector(".list__item_delete");
   let doneButton = newTask.querySelector(".list__item_done");
   deleteButton.onclick = deleteTask;
   doneButton.onclick = doneTask;
}

const deleteTask = (e) => {
   const task = e.target.closest(".list__item");
   const taskId = task.getAttribute("data-task-id");
   task.remove();
   //delete localStorage[taskId];
};

const doneTask = (e) => {
   const task = e.target.parentElement.parentElement;
   const taskId = task.getAttribute("data-task-id");
   task.toggleAttribute("done");
   const taskDataFromLS = JSON.parse(localStorage.getItem(taskId));
   let state = taskDataFromLS.taskDone;
   taskDataFromLS.taskDone = !state;
   localStorage.setItem(taskId, JSON.stringify(taskDataFromLS));
   console.log(taskDataFromLS);
};

const loadTaskList = () => {
   if (localStorage.length === 0) return;

   let taskList = Object.assign(localStorage);
   console.log(taskList);

   for (let i = 0; i < taskList.length; i++) {
      // ключ - это id и порядковый номер задачи туду листа
      let taskId = taskList.key(i);
      let taskData = JSON.parse(taskList.getItem(taskList.key(i)));

      let taskName = taskData.taskName;
      let taskDone = taskData.taskDone;

      //передаю данные для создания элемента в DOM
      revealTaskInDOM(taskName, taskId, taskIsDone);
   }
};

loadTaskList();
addTaskButton.onclick = createNewTask;
inputField.onkeydown = (e) => {
   if (e.code === "Enter") createNewTask(e);
   if (e.key === "Escape") inputField.blur();
};

let taskListExample = [
   {
      taskName: "cold shower",
      taskIsDone: false,
   },
   {
      taskName: "drink water 2L",
      taskIsDone: false,
   },
];
