// HELPER CONSTANTS
const WRAPPER_HEADING = document.getElementById("wrapper-heading");
const WRAPPER_DATA = document.getElementById("wrapper-data");
const INPUT_FIELD = document.getElementById("input-field");
const SUBMIT_BUTTON = document.getElementById("form-btn");
let IS_EDITING = false;
let EDITING_TASK_ID = null;

// INITIALIZE THE APPLICATION
window.onload = () => {
  INPUT_FIELD.focus();
  IS_EDITING = false;
  EDITING_TASK_ID = null;
  updateHeading();
  renderDataFromLocalStorage();
};

// UPDATE HEADING WITH CURRENT DAY
const updateHeading = () => {
  const day = new Date().toLocaleString("default", { weekday: "long" });
  WRAPPER_HEADING.textContent = `Hello User Today Is ${day}`;
};

// HANDLE FORM SUBMISSION
const handleSubmit = (event) => {
  event.preventDefault();
  const taskInput = event.target[0].value.trim();
  if (!taskInput) return triggerShakeAnimation();
  if (IS_EDITING) {
    updateTask(EDITING_TASK_ID, taskInput);
  } else {
    pushDataToLocalStorage(taskInput);
  }
  resetForm();
};

// RESET FORM AFTER SUBMISSION OR CANCEL
const resetForm = () => {
  INPUT_FIELD.value = "";
  IS_EDITING = false;
  EDITING_TASK_ID = null;
};

// TRIGGER INPUT FIELD SHAKE ANIMATION
const triggerShakeAnimation = () => {
  INPUT_FIELD.classList.add("shake");
  setTimeout(() => INPUT_FIELD.classList.remove("shake"), 300);
  INPUT_FIELD.focus();
};

// CREATE - READ - UPDATE - DELETE
// CREATE
const pushDataToLocalStorage = (task) => {
  const tasks = getTasksFromLocalStorage();
  tasks.push({ id: Date.now(), task });
  saveTasksToLocalStorage(tasks);
};

// READ
const renderDataFromLocalStorage = () => {
  WRAPPER_DATA.innerHTML = "";
  const tasks = getTasksFromLocalStorage();
  tasks.forEach(({ id, task }) => {
    const taskElement = createTaskElement(id, task);
    WRAPPER_DATA.appendChild(taskElement);
  });
};
// DELETE
const deleteTask = (id) => {
  if (confirm("Do You Want To Delete The Data : ")) {
    const tasks = getTasksFromLocalStorage().filter(
      (element) => element.id !== id
    );
    saveTasksToLocalStorage(tasks);
  }
};

// UPDATE
const editTask = (id) => {
  const tasks = getTasksFromLocalStorage();
  tasks.forEach((element) => {
    if (element.id === id) {
      INPUT_FIELD.value = element.task;
      SUBMIT_BUTTON.innerText = "UPDATE";
      IS_EDITING = true;
      INPUT_FIELD.focus();
      EDITING_TASK_ID = id;
    }
  });
};

const updateTask = (EDITING_TASK_ID, taskInput) => {
  const tasks = getTasksFromLocalStorage();
  let taskIndex = tasks.findIndex((task) => task.id === EDITING_TASK_ID);
  tasks[taskIndex].task = taskInput;
  saveTasksToLocalStorage(tasks);
  EDITING_TASK_ID = null;
  IS_EDITING = false;
  SUBMIT_BUTTON.innerText = "ADD";
};

///////////////////////////////////////////////////////////
// MAKING HTML
// CREATE A SINGLE TASK ELEMENT
const createTaskElement = (id, task) => {
  const taskElement = document.createElement("p");
  taskElement.textContent = task;

  const editButton = createButton("Edit", "edit-btn", () => editTask(id));
  const deleteButton = createButton("Delete", "delete-btn", () =>
    deleteTask(id)
  );

  taskElement.append(editButton, deleteButton);
  return taskElement;
};
// CREATE A BUTTON ELEMENT
const createButton = (text, className, onClick) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add(className);
  button.onclick = onClick;
  return button;
};
///////////////////////////////////////////////////////////
// LOCAL STORAGE GET SET
const getTasksFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("tasks")) || [];
};

const saveTasksToLocalStorage = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderDataFromLocalStorage();
};
///////////////////////////////////////////////////////////
