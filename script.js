// A simple table, which fetches data from endpoints and after resolving
// all the requests, presents them in the table

const loading = document.querySelector(".loading");
const startBtn = document.querySelector(".start");
const tableBody = document.querySelector("tbody");
const select = document.querySelector("select");
const resetBtn = document.querySelector(".reset");
let dataObjects;
let dataObjectsOrigin;

async function createData(url) {
  loading.style.visibility = "visible";
  const timeStampSent = Date.now();
  const response = await fetch(url);
  const timeStampEnd = Date.now();
  loading.style.visibility = "hidden";
  const responseStatus = response.status;
  const requestDuration = timeStampEnd - timeStampSent + " ms";

  return {
    url: url,
    responseStatus: responseStatus,
    timeStampSent: timeStampSent,
    timeStampEnd: timeStampEnd,
    requestDuration: requestDuration,
  };
}

function createRow(data) {
  let row = document.createElement("tr");
  tableBody.appendChild(row);
  addCell(row, data.url);
  addCell(row, data.responseStatus);
  addCell(row, data.timeStampSent);
  addCell(row, data.timeStampEnd);
  addCell(row, data.requestDuration);
  return row;
}

async function createAll() {
  const urls = [
    "https://api.dictionaryapi.dev/api/v2/entries/en/pancake",
    "https://api.dictionaryapi.dev/api/v2/entries/en/cook",
    "https://api.dictionaryapi.dev/api/v2/entries/en/car",
    "https://api.dictionaryapi.dev/api/v2/entries/en/tree",
    "https://api.dictionaryapi.dev/api/v2/entries/en/house",
    "https://api.dictionaryapi.dev/api/v2/entries/en/mouse",
  ];
  tableBody.innerHTML = "";
  startBtn.disabled = true;

  const promises = urls.map((u) => createData(u));
  dataObjects = await Promise.all(promises);
  dataObjectsOrigin = [...dataObjects];
  console.log(dataObjects);

  dataObjects.map((d) => createRow(d));
  startBtn.disabled = false;
}
function addCell(row, value) {
  const cell = document.createElement("td");
  row.appendChild(cell);
  cell.textContent = value;
}

searchChangeHandler = (event) => {
  const selectedOption = event.target.value;
  if (selectedOption == "url") {
    dataObjects.sort((d1, d2) => customSort(d1.url, d2.url));
  } else if (selectedOption == "responseStatus") {
    dataObjects.sort((d1, d2) =>
      customSort(d1.responseStatus, d2.responseStatus)
    );
  } else if (selectedOption == "timeStampSent") {
    dataObjects.sort((d1, d2) =>
      customSort(d1.timeStampSent, d2.timeStampSent)
    );
  } else if (selectedOption == "timeStampEnd") {
    dataObjects.sort((d1, d2) => customSort(d1.timeStampEnd, d2.timeStampEnd));
  } else if (selectedOption == "requestDuration") {
    dataObjects.sort((d1, d2) =>
      customSort(d1.requestDuration, d2.requestDuration)
    );
  }
  tableBody.innerHTML = "";
  dataObjects.map((d) => createRow(d));
};

const customSort = (obj1, obj2) => {
  if (obj1 < obj2) {
    return -1;
  } else if (obj1 > obj2) {
    return 1;
  } else return 0;
};

const resetHandler = () => {
  console.log(tableBody);
  if (dataObjectsOrigin == undefined || dataObjectsOrigin == null) {
    return;
  }
  tableBody.innerHTML = "";
  dataObjectsOrigin.map((d) => createRow(d));
};

startBtn.addEventListener("click", createAll);
select.addEventListener("change", searchChangeHandler);
resetBtn.addEventListener("click", resetHandler);

// -------------Form Validator----------------------

const username = document.querySelector("#username");
const pass = document.querySelector("#password");
const pass2 = document.querySelector("#password2");
const email = document.querySelector("#email");
const sendBtn = document.querySelector(".send");
const clearBtn = document.querySelector(".clear");
const popup = document.querySelector(".popup");

const showError = (input, msg) => {
  const formBox = input.parentElement;
  const errorMsg = formBox.querySelector(".error-text");

  formBox.classList.add("error");
  errorMsg.textContent = msg;
};

const clearError = (input) => {
  const formBox = input.parentElement;
  formBox.classList.remove("error");
};

const checkForm = (input) => {
  input.forEach((el) => {
    if (el.value === "") {
      showError(el, el.placeholder);
    } else {
      clearError(el);
    }
  });
};

// INPUT is holding our input array
// EL arg refers to every input

const checkLength = (input, min) => {
  if (input.value.length < min) {
    showError(
      input,
      `${input.previousElementSibling.innerText.slice(
        0,
        -1
      )} Must have at least ${min} chars`
    );
  }
};

const checkPassword = (pass1, pass2) => {
  if (pass1.value !== pass2.value) {
    showError(pass2, "Both passwords aren't the same");
  }
};

const checkMail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (re.test(email.value)) {
    clearError(email);
  } else {
    showError(email, "Wrong e-mail !");
  }
};

const checkErrors = () => {
  const allInputs = document.querySelectorAll(".form-box");
  let errorCount = 0;

  allInputs.forEach((el) => {
    if (el.classList.contains("error")) {
      errorCount++;
    }
  });

  if (errorCount === 0) {
    popup.classList.add("show-popup");
  }
};

sendBtn.addEventListener("click", (e) => {
  e.preventDefault();

  checkForm([username, pass, pass2, email]);
  checkLength(username, 6);
  checkLength(pass, 8);
  checkPassword(pass, pass2);
  checkMail(email);
  checkErrors();
});

clearBtn.addEventListener("click", (e) => {
  e.preventDefault();

  [username, pass, pass2, email].forEach((el) => {
    el.value = "";
    clearError(el);
  });
});

//--------DogAPI------------------------
const URL = "https://dog.ceo/api/breeds/image/random";
const apiBtn = document.querySelector(".btn-danger");
const apiImg = document.querySelector(".api-img");

apiBtn.addEventListener("click", () => {
  fetch(URL)
    .then((res) => res.json())
    .then((data) => apiImg.setAttribute("src", data.message))
    .catch((err) => console.log(err));
});
