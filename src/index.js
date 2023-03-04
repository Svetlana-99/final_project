import "./styles/style.css";
import {
  formLogin,
  formAddTask,
  formLoginBlock,
  boardTask,
} from "./components/Form.js";
import { urlSelf, urlTask, API } from "./components/API.js";
import { TaskCard } from "./components/Task.js";
import { formAddTaskBlock, tasksBlock } from "./components/Form.js";

export let isLogin = false;

export const appWrapper = document.getElementById("app-wrapper");
const headerContainer = document.getElementById("header_container");

export const header = document.getElementById("header");
export const formAuthorization = document.getElementById("form_authorization");

// Створення шапки BYTE TASKS
const title = document.createElement("h1");
export const logoutBlock = document.createElement("div");
export const logoutButton = document.createElement("button");
export const logoutSpan = document.createElement("span");

title.innerText = "BYTE TASKS";

title.className = "title";
logoutButton.className = "btn_title";
logoutSpan.className = "btn_p";

header.append(title);
headerContainer.append(header);

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  formLoginBlock.className = "display_block";
  formLogin.render(formLoginBlock);
  logoutBlock.remove();
  boardTask.className = "display_none";
  isLogin=true;
  main();
});
export function renderLogoutBlock(logoutBlock, firstLetterName) {
  logoutButton.innerText = "LOGOUT";
  boardTask.className = "board";
  logoutSpan.innerText = firstLetterName;
  logoutBlock.append(logoutButton, logoutSpan);
  header.append(logoutBlock);
}
export function getTasks() {
  const taskAll = new API(urlTask);
  const taskAllCard = taskAll.getAllTasks(urlTask);
  taskAllCard.then((tasks) => {
    tasks.forEach((item) => {
      const task = new TaskCard(item);
      task.renderTaskCard(tasksBlock);
    });
  });
}

// Проверка на token:

function main() {
  const token = localStorage.getItem("token");
  if (token) {
    const login = new API(token);
    const isAuthorization = login.getData(urlSelf, token);
    isLogin = Boolean(login.getData(urlSelf, token));
    isAuthorization.then((response) => {
      const firstLetterName = response.name[0].toUpperCase();
      renderLogoutBlock(logoutBlock, firstLetterName);
      formAddTask.render(formAddTaskBlock);
      getTasks();
    });
  }

  if (!token || token === "undefined") {
    formLogin.render(formLoginBlock);
  }
}

main();
document.body.append(headerContainer, appWrapper);
