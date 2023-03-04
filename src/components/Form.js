import {
  Input,
  loginFormData,
  registerFormData,
  taskFormData,
} from "./Input.js";
import { urlLogin, urlRegister, urlSelf, urlTask, API } from "./API.js";

import { logoutBlock, renderLogoutBlock, getTasks, isLogin } from "../index.js";
import { TaskCard } from "./Task.js";

export const formRegisterBlock = document.getElementById("form_Register");
export const formLoginBlock = document.getElementById("form_Login");

export const btnTitle = document.getElementById("login_Register");

export const formTask = document.getElementsByClassName("form_add_task");
export const boardTask = document.getElementById("board");
export const formAddTaskBlock = document.getElementById("form_add_task");
export const tasksBlock = document.getElementById("tasks-board");

export class Form {
  constructor(options) {
    const {
      inputs,
      name,
      textBtnTitle,
      textLabelTitle,
      textBtnSubmit,
      onSubmit,
      url,
    } = options;

    this.inputs = inputs;
    this.onSubmit = onSubmit;
    this.name = name;
    this.url = url;

    this.form = document.createElement("form");
    const btnSubmit = document.createElement("button");

    this.textLabelTitle = textLabelTitle;
    this.textBtnSubmit = textBtnSubmit;

    this.form.className = "form";
    this.formContainer = document.createElement("div");
    this.formContainer.className = "form_container";

    this.labelTitle = document.createElement("h1");
    btnSubmit.type = "submit";
    btnSubmit.className = "btn-form";
    btnSubmit.innerText = textBtnSubmit;
    btnTitle.innerText = textBtnTitle;

    this.labelTitle.innerText = textLabelTitle;
    btnTitle.className = "button";
    btnTitle.className = "btn_title";
    this.labelTitle.className = "label_title";
   
    this.inputs.forEach((input) => {
      input.render(this.form);
    });

    function getFormValues(inputs) {
      return inputs.reduce((values, input) => {
        values[input.name] = input.value;
        return values;
      }, {});
    }
    btnTitle.addEventListener("click", () => {
      if (btnTitle.innerText === "REGISTER") {
        formLogin.remove(formLoginBlock);
        btnTitle.innerText = "LOGIN";
        formRegister.render(formRegisterBlock);
      } else {
        btnTitle.innerText = "REGISTER";
        formRegister.remove(formRegisterBlock);
        formLogin.render(formLoginBlock);
      }
    });
    
    this.form.addEventListener("submit", async (event) => {
     
      event.preventDefault();

      this.formValues = JSON.stringify(getFormValues(this.inputs));

      const errName = Object.entries(getFormValues(this.inputs));

      errName.forEach((item) => {
        if (item[1] === "") {
          const message = `"${item[0]}" is required`;
          const erroredInput = this.inputs.find((input) => {
            return input.name === item[0];
          });
          erroredInput.updateErrorMessage(message);
        }
      });
     
      btnSubmit.setAttribute('disabled', true);
      await onSubmit(this.formValues, event);

      btnSubmit.removeAttribute("disabled");
      const q1 = btnSubmit.hasAttribute('disabled')
    });
    this.form.append(btnSubmit);
  }

  render(container) {
    this.formContainer.append(btnTitle, this.labelTitle, this.form);
    container.append(this.formContainer);
  }
  remove() {
    this.formContainer.remove();
  }
}

class addTaskForm extends Form {
  constructor(options) {
    super(options);

    boardTask.className = "board";
  }
  render(container) {
    btnTitle.remove();
    this.formContainer.classList.remove("form_container");
    this.formContainer.classList.add("task-form");
    this.formContainer.append(this.labelTitle, this.form);
    container.append(this.formContainer);
  }
}

export const formAddTask = new addTaskForm({
  inputs: taskFormData.map((input) => new Input(input)),
  name: "addTask",
  type: "text",
  textLabelTitle: "ADD TASK",
  textBtnSubmit: "ADD",
  url: urlTask,
  onSubmit: async (formValues) => {
    const api = new API(formValues);
    const createdTask = api.createTask(formValues);
    createdTask.then((res) => {
      const task = new TaskCard(res);
      task.renderTaskCard(tasksBlock);
    });
  },
});
export const formRegister = new Form({
  inputs: registerFormData.map((input) => new Input(input)),
  name: "register",
  type: "register",
  textBtnTitle: "LOGIN",
  textLabelTitle: "REGISTER",
  textBtnSubmit: "SUBMIT",
  url: urlRegister,
  onSubmit: (values) => {
    const api = new API(values);
    const sendDataRegister = api.sendData(urlRegister, values);
    sendDataRegister.then(() => {
      formLogin.render(formLoginBlock);
      formRegister.remove();
    });
  },
});
export const formLogin = new Form({
  inputs: loginFormData.map((input) => new Input(input)),
  name: "login",
  type: "login",
  textBtnTitle: "REGISTER",
  textLabelTitle: "LOGIN",
  textBtnSubmit: "SUBMIT",
  url: urlLogin,

  onSubmit: (values) => {
    const api = new API(values);
    const sendDataLogin = api.sendData(urlLogin, values);
    sendDataLogin.then((response) => {
      const token = response.token;
      localStorage.setItem("token", token);
      const self = new API(token);
      const sendSelf = self.getData(urlSelf, token);
      sendSelf.then((response) => {
        const firstLetterName = response.name[0].toUpperCase();
        renderLogoutBlock(logoutBlock, firstLetterName);
        formLogin.remove();
        formAddTask.render(formAddTaskBlock);
        if (!isLogin) {
          getTasks();
        }
      });
    });
  },
});
