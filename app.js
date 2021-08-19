const createTaskSection = document.querySelector(".newtask"),
   createTaskInput = createTaskSection.querySelector(".newtask__name"),
   setDateBtn = createTaskSection.querySelector("#setDateBtn"),
   setTimeBtn = createTaskSection.querySelector("#setTimeBtn"),
   setDateMenu = createTaskSection.querySelector(".setDateMenu"),
   addTaskButton = createTaskSection.querySelector(".newtask__create");

const taskListInDOM = document.querySelector(".list__items"),
   taskListName = "Main Task List",
   listButtons = document.querySelector(".list__buttons");

const createNewTask = () => {
   const taskName = createTaskInput.value.trim();
   if (!taskName) return;

   const taskIsDone = false;
   //const taskDate = createTaskSection.querySelector('input[type="date"]')?.value || null;
   //const taskTime = createTaskSection.querySelector('input[type="time"]')?.value || null;
   const taskPriority = createTaskSection.querySelector("#priority").value;
   const taskDate = setDateMenu.getAttribute("data-date"),
      taskTime = null;

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
   createTaskInput.value = "";
};

function saveTaskInStorage(taskData) {
   let tasksInTaskList = JSON.parse(localStorage.getItem(taskListName)) || [];
   tasksInTaskList.push(taskData);
   localStorage.setItem(taskListName, JSON.stringify(tasksInTaskList));
}

function revealTaskInDOM(taskData) {
   let { taskName, taskIsDone, taskDate, taskTime, taskPriority } = taskData;

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
      newTask.setAttribute("data-date", taskDate);
      let listItemMainDiv = newTask.querySelector(".list__item_name");

      let dateDiv = document.createElement("div");
      dateDiv.classList.add("list__item_date");

      let relativeDate = fullDateToRelative(taskDate);
      dateDiv.innerHTML = relativeDate;

      insertAfter(dateDiv, listItemMainDiv);
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
   const thisTask = e.target.closest(".list__item");
   const taskId = Array.from(thisTask.parentElement.children).indexOf(thisTask);
   thisTask.remove();

   let taskListFromStorage = JSON.parse(localStorage.getItem(taskListName));
   taskListFromStorage.splice(taskId, 1);
   localStorage.setItem(taskListName, JSON.stringify(taskListFromStorage));
};

const doneTask = (e) => {
   const thisTask = e.target.parentElement.parentElement;
   const taskId = Array.from(thisTask.parentElement.children).indexOf(thisTask);
   thisTask.toggleAttribute("done");

   let taskListFromStorage = JSON.parse(localStorage.getItem(taskListName));
   let taskObj = taskListFromStorage[taskId];
   taskObj.taskIsDone = !taskObj.taskIsDone;
   taskListFromStorage.splice(taskId, 1, taskObj);
   localStorage.setItem(taskListName, JSON.stringify(taskListFromStorage));
};

const revealAllTasksLoop = (taskList) => {
   for (let i = 0; i < taskList.length; i++) {
      let taskData = taskList[i];
      revealTaskInDOM(taskData);
   }
};

const initTaskList = () => {
   if (!localStorage[taskListName]) return;
   let taskList = JSON.parse(localStorage[taskListName]);
   revealAllTasksLoop(taskList);
};

const sortTasks = (sortBtn, isReverse) => {
   if (!localStorage[taskListName]) return;
   const taskList = JSON.parse(localStorage[taskListName]),
      sortBtnId = sortBtn.id,
      sortOrder = isReverse ? -1 : 1,
      sortingParameter = (function () {
         if (sortBtnId === "sortByName") return "taskName";
         if (sortBtnId === "sortByPriority") return "taskPriority";
         if (sortBtnId === "sortByDeadline") return "taskDate";
      })();

   taskList.sort(function (a, b) {
      a = a[sortingParameter].toLowerCase();
      b = b[sortingParameter].toLowerCase();
      if (a > b) return 1 * sortOrder;
      if (a == b) return 0 * sortOrder;
      if (a < b) return -1 * sortOrder;
   });

   sortBtn.toggleAttribute("reverse");
   localStorage.setItem(taskListName, JSON.stringify(taskList));

   taskListInDOM.innerHTML = "";
   revealAllTasksLoop(taskList);
};

const clearList = () => {
   taskListInDOM.innerHTML = "";
   localStorage.removeItem(taskListName);
};

listButtons.onclick = (e) => {
   if (e.target.matches("button")) {
      if (e.target.classList.contains("sortBtn")) {
         let sortBtn = e.target;
         let isReverse = e.target.hasAttribute("reverse");
         sortTasks(sortBtn, isReverse);
      }
      if (e.target.id === "clearList") {
         clearList();
      }
   }
};

/* setDateBtn.onclick = (e) => {
	const inputDate = createTaskSection.querySelector(`input[type="date"]`);
	inputDate.style.display = 'inline-block';
	setTimeBtn.style.display = 'inline-block';
	e.target.style.display = 'none';
};

setTimeBtn.onclick = (e) => {
	const inputTime = createTaskSection.querySelector(`input[type="time"]`);
	inputTime.style.display = 'inline-block';
	e.target.style.display = 'none';
}; */

insertAfter = (newNode, existingNode) => {
   existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
};

createTaskInput.onkeydown = (e) => {
   if (e.key === "Enter") createNewTask(e);
   if (e.key === "Escape") createTaskInput.blur();
};
addTaskButton.onclick = createNewTask;
document.onload = initTaskList();

setDateMenu.onclick = (e) => {
   const dropdownItems = setDateMenu.querySelectorAll(".setDateMenu__dropdown_item");

   dropdownItems.forEach((item) => {
      let relativeDate = item.querySelector(".relativeDate").textContent,
         textDate = item.querySelector(".shortDate");
      let dateConverted = relativeToShortDate(relativeDate);
      textDate.innerHTML = dateConverted;
   });

   if (e.target.matches(".setDateMenu__dropdown_item")) {
      let clickedMenuItemText = e.target.querySelector(".relativeDate").textContent;
      let menuPlaceholder = setDateMenu.querySelector(".setDateMenu__selected");
      menuPlaceholder.textContent = clickedMenuItemText;
      let fullDateConverted = relativeToFullDate(clickedMenuItemText);
      setDateMenu.setAttribute("data-date", fullDateConverted);
   }
   setDateMenu.toggleAttribute("opened");
};

function relativeToFullDate(relativeDate) {
   if (relativeDate === "No Date") return "";

   let dateToday = new Date();

   if (relativeDate === "Today") {
      let year = dateToday.getFullYear(),
         month = dateToday.getMonth() + 1,
         day = dateToday.getDate();
      return `${year}-${month}-${day}`;
   }

   if (relativeDate === "Tomorrow") {
      let year = dateToday.getFullYear(),
         month = dateToday.getMonth() + 1,
         day = dateToday.getDate() + 1;
      return `${year}-${month}-${day}`;
   }

   if (relativeDate === "This Weekend") {
      let year = dateToday.getFullYear(),
         month = dateToday.getMonth() + 1,
         dayOfTheWeek = (function () {
            let day = dateToday.getDay();
            if (day == 0) {
               day = 7;
            }
            return day;
         })(),
         day = dateToday.getDate() + 6 - dayOfTheWeek;

      return `${year}-${month}-${day}`;
   }

   if (relativeDate === "Next Week") {
      let year = dateToday.getFullYear(),
         month = dateToday.getMonth() + 1,
         dayOfTheWeek = (function () {
            let day = dateToday.getDay();
            if (day == 0) {
               day = 7;
            }
            return day;
         })(),
         day = dateToday.getDate() + 8 - dayOfTheWeek;

      return `${year}-${month}-${day}`;
   }
}

function relativeToShortDate(relativeDate) {
   if (relativeDate === "No Date") return null;

   let dateToday = new Date();

   if (relativeDate === "Today") {
      let weekdayShort = dateToday.toLocaleString("default", { weekday: "short" });
      return weekdayShort;
   }

   if (relativeDate === "Tomorrow") {
      let nextDay = new Date(dateToday.setDate(dateToday.getDate() + 1));
      let nextDayShort = nextDay.toLocaleString("default", { weekday: "short" });
      return nextDayShort;
   }

   if (relativeDate === "This Weekend") {
      /* let dayOfTheWeek = (function () {
         let day = dateToday.getDay();
         if (day == 0) {
            day = 7;
         }
         return day;
      })();
      let daysToSaturday = 6 - dayOfTheWeek;
      let weekendDay = new Date(dateToday.setDate(dateToday.getDate() + daysToSaturday));
      return weekendDay.toLocaleString("default", { weekday: "short" }); */
      return "Sat";
   }

   if (relativeDate === "Next Week") {
      /*       let dayOfTheWeek = (function () {
         let day = dateToday.getDay();
         if (day == 0) {
            day = 7;
         }
         return day;
      })();
      let daysToNextWeek = 6 - dayOfTheWeek;
      let weekendDay = new Date(dateToday.setDate(dateToday.getDate() + daysToNextWeek));
      let weekendDayShort = weekendDay.toLocaleString("default", { weekday: "short", day: "numeric", month: "short" });
      return weekendDayShort; */
      return "Mon";
   }
}

function fullDateToRelative(fullDate) {
   let dateToday = new Date(),
      someDate = new Date(fullDate);

   if (
      someDate.getDate() == dateToday.getDate() &&
      someDate.getMonth() == dateToday.getMonth() &&
      someDate.getFullYear() == dateToday.getFullYear()
   ) {
      return "Today";
   }

   if (
      someDate.getDate() == dateToday.getDate() + 1 &&
      someDate.getMonth() == dateToday.getMonth() &&
      someDate.getFullYear() == dateToday.getFullYear()
   ) {
      return "Tomorrow";
   }

   let daysToWeekend = 6 - dateToday.getDate();
   let daysToNextWeek = 8 - dateToday.getDate();

   if (daysToWeekend < 6 && someDate.getDay() == 6) {
      return "This Weekend";
   }

   if (daysToWeekend < 8 && someDate.getDay() == 1) {
      return "Next Week";
   }
}
