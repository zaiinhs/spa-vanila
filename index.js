let state = {
  inputValue: localStorage.getItem("inputValue") ?? "",
  hash: location.hash,
};

function setState(newState) {
  const prevState = { ...state };
  const nextState = { ...state, ...newState };
  state = nextState;
  render();
  onStageChange(prevState, nextState);
}

// Ini adalah sideEffect, dimana sebuah function yg akan dijalankan ketika state nya berubah
function onStageChange(prevState, nextState) {
  if (prevState.inputValue !== nextState.inputValue) {
    localStorage.setItem("inputValue", nextState.inputValue);
  }

  if (prevState.hash !== nextState.hash) {
    history.pushState(null, "", nextState.hash);
  }
}

function Link(props) {
  const link = document.createElement("a");
  link.href = props.href;
  link.textContent = props.label;

  link.onclick = function (event) {
    event.preventDefault();
    const url = new URL(event.target.href);
    setState({ hash: url.hash });
    // history.pushState(null, "", event.target.href);
    render();
  };

  return link;
}

function NavBar() {
  const linkHome = Link({
    href: "#home",
    label: "Home",
  });

  const linkAbout = Link({
    href: "#about",
    label: "About",
  });

  const div = document.createElement("div");
  div.append(linkHome);
  div.append(linkAbout);

  return div;
}

function AboutScreen() {
  const linkHome = Link({
    href: "#home",
    label: "Kembali ke Home",
  });

  const textAbout = document.createElement("h1");
  textAbout.textContent = "Ini Halaman About";

  const div = document.createElement("div");
  div.append(linkHome);
  div.append(textAbout);

  return div;
}

function HomeScreen() {
  const navbar = NavBar();
  const textPreview = document.createElement("p");
  textPreview.textContent = state.inputValue;

  const input = document.createElement("input");
  input.id = "input";
  input.value = state.inputValue;
  input.oninput = function (event) {
    setState({ inputValue: event.target.value });
  };
  input.placeholder = "Input your name";

  const searchProduct = state.inputValue;
  const titleProduct = document.createElement("ol");
  titleProduct.textContent = "Daftar Produk";
  titleProduct.style.fontSize = "20px";

  const DUMMY_JSON_API = `https://dummyjson.com/products/search?q=${searchProduct}`;

  fetch(DUMMY_JSON_API)
    .then((response) => response.json())
    .then((json) => {
      const dataProducts = json.products;
      // console.log(dataProducts);
      dataProducts.map((item) => {
        // console.log(item.title);
        const titleProductList = document.createElement("li");
        titleProductList.textContent = item.title;

        const categoryProduct = document.createElement("span");
        categoryProduct.textContent = item.category;
        titleProduct.append(titleProductList);
        titleProduct.append(categoryProduct);
        // console.log(categoryProduct);
      });
    })
    .catch((error) => console.log(error));

  const buttonClear = document.createElement("button");
  buttonClear.textContent = "Clear";
  buttonClear.onclick = function () {
    setState({ inputValue: "" });
    // localStorage.setItem("inputValue", event.target.value);
    // state.inputValue = "";
    // render();
    // input.value = "";
    // textPreview.textContent = "";
  };

  const div = document.createElement("div");

  div.append(navbar);
  div.append(input);
  div.append(buttonClear);
  // div.append(textPreview);
  div.append(titleProduct);

  return div;
}

function App() {
  const homeScreen = HomeScreen();
  const aboutScreen = AboutScreen();

  if (state.hash === "#about") {
    return aboutScreen;
  } else if (state.hash === "#home") {
    return homeScreen;
  }
}

function render() {
  const root = document.getElementById("root");
  const app = App();

  const focusedElementId = document.activeElement.id;
  const focusedElementSelectionStart = document.activeElement.selectionStart;
  const focusedElementSelectionEnd = document.activeElement.selectionEnd;

  root.innerHTML = "";
  root.append(app);
  if (focusedElementId) {
    const focusedElement = document.getElementById(focusedElementId);
    focusedElement.focus();
    focusedElement.selectionStart = focusedElementSelectionStart;
    focusedElement.selectionEnd = focusedElementSelectionEnd;
  }
}

render();
