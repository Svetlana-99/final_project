export const loginFormData = [
  {
    name: "email",
    placeholder: "Enter email",
    label: "Email",
  },
  {
    name: "password",
    placeholder: "Enter password",
    label: "Password",
    type: "password",
  },
];

export const registerFormData = [
  {
    name: "email",
    placeholder: "Enter email",
    label: "Email",
  },
  {
    name: "name",
    placeholder: "Your name",
    label: "Name",
  },
  {
    name: "password",
    placeholder: "Enter password",
    label: "Password",
    type: "password",
  },
];

export const taskFormData = [
  {
    name: "name",
    placeholder: "Task name",
    label: "Name",
  },
  {
    name: "description",
    placeholder: "Task description",
    label: "Description",
  },
];

export class Input {
  constructor(options) {
    const {
      name,
      placeholder,
      label,
      type = "text",
      onInput,
      onChange,
    } = options;

    this.input = document.createElement("input");
    this.errorMessageElement = document.createElement("span");

    this.name = name;
    this.label = label;
    this.input.name = name;
    this.input.type = type;

    this.input.placeholder = placeholder;
    this.value = this.input.value;
    this.control = this.createControl(onInput, onChange);
  }

  createControl(onInput, onChange) {
    const containerInput = document.createElement("div");
    const label = document.createElement("label");

    const inputId = `_${this.name}`;

    containerInput.className = "div_input";
    this.errorMessageElement.classList.add("error");
    this.input.className = "input";

    this.input.id = inputId;
    label.setAttribute("for", inputId);

    label.innerText = this.label;
    this.errorMessageElement.innerText = "";

    containerInput.append(label, this.input, this.errorMessageElement);

    this.input.addEventListener("input", (event) => {
      this.value = event.target.value;
      if (this.value) {
        this.updateErrorMessage("");
      }
      if (onInput) {
        onInput(event);
      }
    });

    if (onChange) {
      this.input.addEventListener("change", (event) => {
        onChange(event);
      });
    }

    return containerInput;
  }
  updateErrorMessage(message) {
    this.errorMessageElement.innerText = message;
  }
  render(container) {
    container.append(this.control);
  }
}
