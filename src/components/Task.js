import { api, API } from "./API.js";

function getFormatDate(data) {
  const date = data.toLocaleDateString();
  const time = data.toLocaleTimeString();

  return `${date}  ${time}`;
}
function addOptionalZero(value) {
  return value > 9 ? value : `0${value}`;
}
function getFormatTimeTracked(timeTracked) {
  const timeTrackedSeconds = Math.floor(timeTracked / 1000);
  const hours = Math.floor(timeTrackedSeconds / 3600);
  const minutes = Math.floor((timeTrackedSeconds - hours * 3600) / 60);
  const seconds = timeTrackedSeconds - hours * 3600 - minutes * 60;

  return `${addOptionalZero(hours)}:${addOptionalZero(
    minutes
  )}:${addOptionalZero(seconds)}`;
}

const taskCardAll = document.createElement("div");

export class TaskCard {
  constructor(options) {
    const {
      createdAt,
      description,
      isActive,
      isFinished,
      name,
      timeTracked,
      updatedAt,
      _id,
    } = options;
    this.createdAt = new Date(createdAt);
    this.description = description;
    this.isActive = isActive;
    this.isFinished = isFinished;
    this.name = name;
    this.timeTracked = timeTracked;
    this.updatedAt = updatedAt;
    this.id = _id;

    this.taskCard = document.createElement("div");
    this.deleteBtn = document.createElement("button");
    this.timerBtn = document.createElement("button");
    this.timeTrackedElement = document.createElement("span");
    this.markAsDoneBtn = document.createElement("button");
    this.timeTrakedIntervalId = null;
  }

  renderTaskCard(container) {
    const titleElement = document.createElement("h3");
    const descriptionElement = document.createElement("p");
    const timeTracker = document.createElement("div");
    const dateElement = document.createElement("p");

    titleElement.classList.add("task_title");
    descriptionElement.classList.add("task_description");
    timeTracker.classList.add("time_tracker");
    dateElement.classList.add("task_date");

    this.taskCard.classList.add("task_card");
    this.deleteBtn.classList.add("task_delete_btn");
    this.timerBtn.classList.add("timer_btn");
    this.markAsDoneBtn.classList.add("btn", "btn-form", "btn-small");

    if (this.isFinished) {
      this.timerBtn.setAttribute("disabled", "");
      this.taskCard.classList.add("task_finished");
      this.markAsDoneBtn.innerText = "Restart";
    } else {
      this.timerBtn.classList.add(
        this.isActive ? "timer_btn_stop" : "timer_btn_play"
      );
      this.markAsDoneBtn.innerText = "Mark as done";
    }
    titleElement.innerText = this.name;
    descriptionElement.innerText = this.description;
    dateElement.innerText = getFormatDate(this.createdAt);
    this.timeTrackedElement.innerText = getFormatTimeTracked(this.timeTracked);
    this.deleteBtn.innerHTML = '<i class="fas fa-times"></i>';

    if (this.isActive) {
      this.timerBtn.innerHTML = `<i class="fas fa-pause"></i>`;
      this.startTimer();
    } else {
      this.timerBtn.innerHTML = `<i class="fas fa-play"></i>`;
    }

    timeTracker.append(this.timerBtn, this.timeTrackedElement);
    this.taskCard.append(
      titleElement,
      descriptionElement,
      timeTracker,
      dateElement,
      this.markAsDoneBtn,
      this.deleteBtn
    );
    taskCardAll.append(this.taskCard);
    container.append(taskCardAll);
    this.timerBtn.addEventListener("click", this.toggleTimeTracker);
    this.deleteBtn.addEventListener("click", this.removeTaskCard);
    this.markAsDoneBtn.addEventListener("click", this.toggleTaskFinished);
  }
  removeTaskCard = async () => {
    const delTask = new API(this.id);
    await delTask.deleteTask(this.id);
    this.taskCard.remove();
  };
  toggleTaskFinished = async () => {
    this.isFinished = !this.isFinished;

    const taskFinish = new API(this.id, { isFinished: this.isFinished });
    await taskFinish.editTask(this.id, { isFinished: this.isFinished });

    this.taskCard.classList.toggle("task_finished");

    if (this.isFinished) {
      this.timerBtn.setAttribute("disabled", "");
      this.markAsDoneBtn.innerText = "Restart";
      this.stopTimer();
    } else {
      this.timerBtn.removeAttribute("disabled");
      this.markAsDoneBtn.innerText = "Mark as done";
    }
  };
  toggleTimeTracker = async () => {
    this.isActive = !this.isActive;

    const editTask = new API(this.id, { isActive: this.isActive });
    await editTask.editTask(this.id, { isActive: this.isActive });

    if (this.isActive) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  };
  startTimer() {
    this.timerBtn.classList.remove("timer_btn_play");
    this.timerBtn.classList.add("timer_btn_stop");
    this.timerBtn.innerHTML = `<i class="fas fa-pause"></i>`;

    this.timeTrakedIntervalId = setInterval(() => {
      this.timeTracked += 1000;
      this.updateTimeTracker();
    }, 1000);
  }
  stopTimer() {
    this.timerBtn.classList.add("timer_btn_play");
    this.timerBtn.classList.remove("timer_btn_stop");
    this.timerBtn.innerHTML = `<i class="fas fa-play"></i>`;
    clearInterval(this.timeTrakedIntervalId);
  }
  updateTimeTracker() {
    const formattedTime = getFormatTimeTracked(this.timeTracked);
    this.timeTrackedElement.innerText = formattedTime;
  }
}
