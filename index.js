const validity = createValidityObject();

const checkInputIsValid = (input) => {
  const inputValue = input.value;
  const id = input.id;
  if (isValidInput(inputValue, id)) {
    if (input.classList.contains("invalid")) {
      input.classList.remove("invalid");
    }
    if (!input.classList.contains("valid")) {
      input.classList.add("valid");
    }
    removeErrorMessage(input);
    return;
  }
  if (input.classList.contains("valid")) {
    input.classList.remove("valid");
  }
  if (!input.classList.contains("invalid")) {
    input.classList.add("invalid");
  }
  addErrorMessage(input);
};

const isValidInput = (userInput, id) => {
  if (userInput === undefined) {
    return false;
  }
  if (id === "name") {
    if (!userInput.includes(" ")) {
      validity.nameIsValid = false;
      return false;
    }
    const regex = /^[A-Za-z]+ [A-Za-z][A-Za-z ]*$/;
    if (!regex.test(userInput)) {
      validity.nameIsValid = false;
      return false;
    }
    validity.nameIsValid = true;
  }
  if (id === "email") {
    if (!userInput.includes("@")) {
      validity.emailIsValid = false;
      return false;
    }
    if (!userInput.includes(".")) {
      validity.emailIsValid = false;
      return false;
    }
    const nonStandardCharRegex = /[^\x00-\x7F]/;
    if (nonStandardCharRegex.test(userInput)) {
      validity.emailIsValid = false;
      return false;
    }
    const emailRegex = /^[^@.]+@[^@.]+\.[^@.]+$/;
    if (!emailRegex.test(userInput)) {
      validity.emailIsValid = false;
      return false;
    }
    validity.emailIsValid = true;
  }
  if (id === "cc-number") {
    if (!isValidCCNumber(userInput)) {
      validity.ccNumberIsValid = false;
      return false;
    }
  }
  validity.ccNumberIsValid = true;
  return true;
};

const isValidCCNumber = (num) => {
  if (num.length < 12 || num.length > 19) {
    return false;
  }

  const numAsArray = Array.from(num, Number).reverse();
  const productsArray = [];

  numAsArray.forEach((digit, index) => {
    if (index % 2 !== 0) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    productsArray.push(digit);
  });

  const sumOfProducts = productsArray.reduce((sum, digit) => sum + digit, 0);
  return sumOfProducts % 10 === 0;
};

const addInputValidityChecks = () => {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", (event) => {
      checkInputIsValid(event.target);
    });
  });
};

function createValidityObject() {
  let nameIsValid = false;
  let emailIsValid = false;
  let ccNumberIsValid = false;
  let canSubmit = false;

  return {
    get nameIsValid() {
      return nameIsValid;
    },
    set nameIsValid(value) {
      if (typeof value === "boolean") {
        nameIsValid = value;
        this.updateCanSubmit();
      }
    },

    get emailIsValid() {
      return emailIsValid;
    },
    set emailIsValid(value) {
      if (typeof value === "boolean") {
        emailIsValid = value;
        this.updateCanSubmit();
      }
    },

    get ccNumberIsValid() {
      return ccNumberIsValid;
    },
    set ccNumberIsValid(value) {
      if (typeof value === "boolean") {
        ccNumberIsValid = value;
        this.updateCanSubmit();
      }
    },

    get canSubmit() {
      return canSubmit;
    },

    updateCanSubmit() {
      canSubmit = nameIsValid && emailIsValid && ccNumberIsValid;
    },
  };
}

const canFormSubmit = () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    if (!validity.canSubmit) {
      event.preventDefault();
      console.log("Form cannot be submitted, as information is not valid");
      return;
    }
    event.preventDefault();
    console.log("Form data submitted successfully");
    logData(event);
  });
};

const logData = (data) => {
  const formData = data.srcElement;
  for (let i = 0; i < 3; i++) {
    console.log(`${formData[i].id}: ${formData[i].value}`);
  }
};

//SHOULD REFACTOR THESE TWO FUNCTIONS AS THEY ARE REPEATED - COMBINE INTO A TOGGLE MESSAGE FUNCTION
const removeErrorMessage = (input) => {
  const id = input.id;
  const errorMessage = document.querySelector(`.${id}-invalid`);
  if (!errorMessage.classList.contains("hidden")) {
    errorMessage.classList.add("hidden");
  }
};

const addErrorMessage = (input) => {
  const id = input.id;
  const errorMessage = document.querySelector(`.${id}-invalid`);
  if (errorMessage.classList.contains("hidden")) {
    errorMessage.classList.remove("hidden");
  }
};

window.onload = () => {
  addInputValidityChecks();
  canFormSubmit();
};
