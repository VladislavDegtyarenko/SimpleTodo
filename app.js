const createTaskSection = document.querySelector(".newtask"),
   taskListInDOM = document.querySelector(".list__items"),
   taskListName = "Main Task List",
   taskListControlBtns = document.querySelector(".list__buttons");
let today = new Date();

const createNewTask = (input) => {
   const taskName = input.value.trim();
   if (!taskName) return;

   const taskIsDone = false;
   const taskPriority = createTaskSection.querySelector("#priority").value;
   const taskDate = createTaskSection.querySelector(".dateMenu").getAttribute("data-date"),
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
   input.value = "";
   //input.blur();
};

const saveTaskInStorage = (taskData) => {
   let tasksInTaskList = JSON.parse(localStorage.getItem(taskListName)) || [];
   tasksInTaskList.push(taskData);
   localStorage.setItem(taskListName, JSON.stringify(tasksInTaskList));
};

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

const revealTaskInDOM = (taskData) => {
   let { taskName, taskIsDone, taskDate, taskTime, taskPriority } = taskData;

   let taskDiv = document.createElement("li");
   taskDiv.classList.add("list__item");
   taskDiv.setAttribute("data-priority", taskPriority);
   taskDiv.innerHTML = `
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
   taskListInDOM.appendChild(taskDiv);

   if (taskIsDone) {
      taskDiv.setAttribute("done", "");
      taskDiv.querySelector("label input").checked = true;
   }

   if (taskDate) {
      taskDiv.setAttribute("data-date", taskDate);
      let listItemMainDiv = taskDiv.querySelector(".list__item_name");

      let dateDiv = document.createElement("div");
      dateDiv.classList.add("list__item_date");

      let relativeDate = fullDateToRelative(taskDate);
      dateDiv.innerHTML = relativeDate;

      insertAfter(dateDiv, listItemMainDiv);
   }

   if (taskTime) {
      let timeDiv = document.createElement("div");
      let dateDiv = taskDiv.querySelector(".list__item_date");
      timeDiv.classList.add("list__item_date");
      timeDiv.innerHTML = taskTime;
      insertAfter(timeDiv, dateDiv);
   }

   // initialize task buttons
   let deleteButton = taskDiv.querySelector(".list__item_delete");
   let doneButton = taskDiv.querySelector("label input");
   deleteButton.onclick = deleteTask;
   doneButton.onclick = doneTask;
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

const showShortDatesInMenu = (dateMenu) => {
   const dropdownItems = dateMenu.querySelectorAll(".dateMenu__item");

   dropdownItems.forEach((item) => {
      let relativeDate = item.querySelector(".relativeDate").textContent,
         textDate = item.querySelector(".shortDate");
      let dateConverted = relativeToShortDate(relativeDate);
      textDate.innerHTML = dateConverted;
   });
};

const relativeToFullDate = (relativeDate) => {
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
};

const relativeToShortDate = (relativeDate) => {
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

   if (relativeDate === "This Weekend") return "Sat";

   if (relativeDate === "Next Week") {
      let nextMonday = new Date(dateToday.setDate(dateToday.getDate() + ((1 + 7 - dateToday.getDay()) % 7)));
      let nextMondayShort = nextMonday.toLocaleString("default", {
         weekday: "short",
         day: "numeric",
         month: "short",
      });
      return nextMondayShort;
   }
};

const fullDateToRelative = (fullDate) => {
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

   return someDate.toLocaleString("default", {
      year: "numeric",
      month: "short",
      day: "numeric",
   });
};

const insertAfter = (newNode, existingNode) => {
   existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
};

const calendarInit = (calendar) => {
   let selectedDate = new Date(today);

   updateCalendarTitle(selectedDate);
   fillCalendarGrid(selectedDate);

   calendar.onclick = (e) => {
      const prevMonthClick = e.target.matches(`[data-action="prev-month"]`);
      const currentMonthClick = e.target.matches(`[data-action="current-month"]`);
      const nextMonthClick = e.target.matches(`[data-action="next-month"]`);

      if (prevMonthClick) goToPrevMonth();
      if (currentMonthClick) goToCurrentMonth();
      if (nextMonthClick) goToNextMonth();
   };

   function goToPrevMonth() {
      selectedDate.setMonth(selectedDate.getMonth() - 1);
      updateCalendarTitle(selectedDate);
      fillCalendarGrid(selectedDate);
   }

   function goToCurrentMonth() {
      selectedDate = new Date(today);
      updateCalendarTitle(selectedDate);
      fillCalendarGrid(selectedDate);
   }

   function goToNextMonth() {
      selectedDate.setMonth(selectedDate.getMonth() + 1);
      updateCalendarTitle(selectedDate);
      fillCalendarGrid(selectedDate);
   }

   function updateCalendarTitle() {
      let monthAndYear = selectedDate.toLocaleString("default", { month: "short", year: "numeric" });

      const calendarTitle = calendar.querySelector(".calendar__header_title");
      calendarTitle.textContent = monthAndYear;
   }

   function fillCalendarGrid(selectedDate) {
      let year = selectedDate.getFullYear();
      let month = selectedDate.getMonth();
      let firstDayOfWeek = new Date(year, month, 1).getDay();
      let daysInMonth = new Date(year, month + 1, 0).getDate();
      let lastWeekdayInMonth = new Date(year, month, daysInMonth).getDay();
      const calendarGrid = calendar.querySelector(".calendar__grid");
      calendarGrid.innerHTML = "";

      // fill previous month
      for (let i = firstDayOfWeek; i > 0; i--) {
         const dayCell = document.createElement("div");
         const date = new Date(year, month, -i + 1);
         const day = date.getDate();
         const fullDate = date.toLocaleString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
         });
         dayCell.textContent = day;
         dayCell.style.opacity = "0.3";
         dayCell.setAttribute("data-date", fullDate);
         dayCell.onclick = (e) => {
            pickDay(e);
            goToPrevMonth();
         };
         calendarGrid.appendChild(dayCell);
      }

      // fill current momnth
      for (let i = 1; i <= daysInMonth; i++) {
         const dayCell = document.createElement("div");
         const date = new Date(year, month, i);
         const day = date.getDate();
         const fullDate = date.toLocaleString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
         });
         dayCell.textContent = day;
         dayCell.setAttribute("data-date", fullDate);
         dayCell.onclick = (e) => {
            pickDay(e);
         };
         calendarGrid.appendChild(dayCell);
      }

      // fill next month
      let addSixthRow = firstDayOfWeek + daysInMonth <= 35 ? 7 : 0;
      let daysForNextMonth = 6 - lastWeekdayInMonth + addSixthRow;
      for (let i = 0; i < daysForNextMonth; i++) {
         const dayCell = document.createElement("div");
         const date = new Date(year, month, daysInMonth + i + 1);
         const day = date.getDate();
         const fullDate = date.toLocaleString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
         });
         dayCell.textContent = day;
         dayCell.style.opacity = "0.3";
         dayCell.setAttribute("data-date", fullDate);
         dayCell.onclick = (e) => {
            pickDay(e);
            goToNextMonth();
         };
         calendarGrid.appendChild(dayCell);
      }
   }

   function pickDay(e) {
      const dayCell = e.target;
      const dateMenu = dayCell.closest(".dateMenu");
      const dateMenuPlaceholder = dateMenu.querySelector(".dateMenu__selected");
      thisDate = dayCell.getAttribute("data-date");
      thisMonth = dateMenuPlaceholder.textContent = thisDate;
      dateMenu.setAttribute("data-date", thisDate);
      const input = dateMenu.closest(".newtask").querySelector(".newtask__name");
      input.focus();
   }
};

const initCreateTaskSection = () => {
   const input = createTaskSection.querySelector(".newtask__name");
   const priority = createTaskSection.querySelector("#priority");
   const dateMenu = createTaskSection.querySelector(".dateMenu");
   const calendar = createTaskSection.querySelector(".calendar");

   showShortDatesInMenu(dateMenu);
   calendarInit(calendar, dateMenu);

   createTaskSection.onclick = (e) => {
      const dateMenuClick = e.target.closest(".dateMenu");
      const dateMenuItemClick = e.target.matches(".dateMenu__item");
      const createTaskBtnClick = e.target.matches(".newtask__create");
      const calendarDatePick = e.target.matches(".calendar__grid div");

      dateMenuClick ? dateMenu.setAttribute("opened", "") : dateMenu.removeAttribute("opened");

      if (dateMenuItemClick) {
         const clickedMenuItemText = e.target.querySelector(".relativeDate").textContent;
         const menuPlaceholder = dateMenu.querySelector(".dateMenu__selected");
         const fullDateConverted = relativeToFullDate(clickedMenuItemText);
         menuPlaceholder.textContent = clickedMenuItemText;
         dateMenu.setAttribute("data-date", fullDateConverted);
         dateMenu.removeAttribute("opened");
         input.focus();
      }

      if (calendarDatePick) dateMenu.removeAttribute("opened");

      if (createTaskBtnClick) {
         dateMenu.removeAttribute("opened");
         createNewTask(input);
      }

      input.onkeydown = (e) => {
         const enterKey = e.key === "Enter" || e.code === "NumpadEnter" || e.code === 13;
         const escapeKey = e.key === "Escape";

         if (enterKey) createNewTask(input);
         if (escapeKey) input.blur();
      };

      priority.onchange = () => input.focus();
   };
};

taskListControlBtns.onclick = (e) => {
   const sortBtn = e.target.classList.contains("sortBtn"),
      clearListBtn = e.target.id === "clearList";

   if (sortBtn) {
      let sortBtn = e.target;
      let isReverse = e.target.hasAttribute("reverse");
      sortTasks(sortBtn, isReverse);
   }

   if (clearListBtn) clearList();
};

document.onload = initTaskList();
document.onload = initCreateTaskSection();
