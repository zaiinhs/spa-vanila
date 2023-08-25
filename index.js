let state = {
  inputValue: localStorage.getItem("inputValue") ?? "",
  hash: location.hash,
  products: [],
  limitPage: 10,
  skipPage: 0,
  total: 0,
  isLoading: false,
  errorMessage: "",
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

    // const DUMMY_JSON_API = `https://dummyjson.com/products/search?q=${nextState.inputValue}`;
    const DUMMY_JSON_API = `https://dummyjson.com/products/search?limit=${nextState.limitPage}&skip=${nextState.skipPage}&select=title,category&q=${nextState.inputValue}`;

    setState({ isLoading: true });
    fetch(DUMMY_JSON_API)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject({
            status: response.status,
          });
        }
      })
      .then((json) => {
        const dataProducts = json.products;
        console.log(json);
        setState({
          products: dataProducts,
          limitPage: json.limit,
          skipPage: json.skip,
          total: json.total,
          errorMessage: "",
          isLoading: false,
        });
      })
      .catch((error) => {
        setState({
          errorMessage: "error fetching",
          isLoading: false,
          products: [],
        });
      });
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

  const linkProducts = Link({
    href: "#products",
    label: "Products",
  });

  const div = document.createElement("div");
  div.append(linkHome);
  div.append(linkAbout);
  div.append(linkProducts);

  return div;
}

function ProductsScreen() {
  const linkHome = Link({
    href: "#home",
    label: "Kembali ke Home",
  });

  const textProducts = document.createElement("h1");
  textProducts.textContent = "Products All";

  const div = document.createElement("div");
  div.append(linkHome);
  div.append(textProducts);

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

  const buttonClear = document.createElement("button");
  buttonClear.textContent = "Clear";
  buttonClear.onclick = function () {
    setState({ inputValue: "" });
  };

  const wrapperPagination = document.createElement("div");
  const buttonPrevPagination = document.createElement("button");
  const buttonNextPagination = document.createElement("button");
  buttonPrevPagination.textContent = "<--Prev";
  buttonNextPagination.textContent = "Next-->";
  wrapperPagination.style.marginTop = "20px";

  console.log("data: ", state.products);
  console.log("Total data: ", state.total);
  console.log("Total limit: ", state.limitPage);
  console.log("Total skip: ", state.skipPage);

  const pageCount = Math.ceil(state.total / state.limitPage);

  console.log(pageCount);
  for (let i = 0; i < pageCount; i++) {
    const hasil = pageCount * state.skipPage - state.limitPage;
    // console.log(hasil);
  }

  const titleProduct = document.createElement("ol");
  titleProduct.textContent = "Daftar Produk";
  titleProduct.style.fontSize = "20px";

  if (state.isLoading) {
    const titleProductInfo = document.createElement("h1");
    titleProductInfo.textContent = "Loading...";
    titleProduct.append(titleProductInfo);
  } else if (state.errorMessage !== "") {
    const titleProductInfo = document.createElement("h1");
    titleProductInfo.textContent = state.errorMessage;
    titleProduct.append(titleProductInfo);
  } else if (state.products.length === 0) {
    const titleProductInfo = document.createElement("h1");
    titleProductInfo.textContent = "produk tidak ada";
    titleProduct.append(titleProductInfo);
  } else {
    state.products.forEach((item) => {
      const titleProductList = document.createElement("li");
      titleProductList.textContent = item.title;

      const categoryProduct = document.createElement("span");
      categoryProduct.textContent = item.category;
      titleProduct.append(titleProductList);
      titleProduct.append(categoryProduct);
    });
  }

  const div = document.createElement("div");

  div.append(navbar);
  div.append(input);
  div.append(buttonClear);
  div.append(wrapperPagination);
  div.append(titleProduct);

  wrapperPagination.appendChild(buttonPrevPagination);
  wrapperPagination.appendChild(buttonNextPagination);

  return div;
}

function App() {
  const homeScreen = HomeScreen();
  const aboutScreen = AboutScreen();
  const productsScreen = ProductsScreen();

  if (state.hash === "#about") {
    return aboutScreen;
  } else if (state.hash === "#home") {
    return homeScreen;
  } else if (state.hash === "#products") {
    return productsScreen;
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
