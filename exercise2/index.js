let state = {
  products: JSON.parse(localStorage.getItem("productItem")) || [],
  inputPrice: "",
  inputName: "",
};

function setState(newState) {
  const prevState = { ...state };
  const nextState = { ...state, ...newState };
  state = nextState;

  render();
  onStageChange(prevState, nextState);
}

function onStageChange(prevState, nextState) {
  if (prevState.products !== nextState.products) {
    localStorage.setItem("productItem", JSON.stringify(nextState.products));
  }
}

function HomeScreen() {
  const formInput = document.createElement("form");
  formInput.style.display = "inline-grid";

  const labelNameItem = document.createElement("label");
  labelNameItem.textContent = "Nama Barang";

  const inputNameItem = document.createElement("input");
  inputNameItem.placeholder = "ketik nama barang";
  inputNameItem.type = "text";

  const labelPriceItem = document.createElement("label");
  labelPriceItem.texsettContent = "Harga";

  const inputPriceItem = document.createElement("input");
  inputPriceItem.placeholder = "ketik harga";

  const submitItem = document.createElement("input");
  submitItem.value = "Submit";
  submitItem.type = "submit";

  formInput.addEventListener("submit", (e) => {
    e.preventDefault();

    setState({
      inputName: inputNameItem.value,
      inputPrice: inputPriceItem.value,
    });

    if (state.inputName && state.inputPrice !== "") {
      let product = {
        nameItem: state.inputName,
        priceItem: state.inputPrice,
      };

      const mergedArray = state.products.concat(product);
      setState({ products: mergedArray });
    }
  });

  const titleItem = document.createElement("h3");
  titleItem.textContent = "List barang";

  const wrapperListItem = document.createElement("ul");

  state.products.forEach((item, index) => {
    const wrapperItem = document.createElement("li");
    wrapperItem.style.display = "flex";
    wrapperItem.style.justifyContent = "space-evenly";

    const listItemName = document.createElement("p");
    listItemName.style.margin = "0";
    listItemName.textContent = item.nameItem;

    const listItemPrice = document.createElement("span");
    listItemPrice.textContent = item.priceItem;

    const deleteItem = document.createElement("button");
    deleteItem.textContent = "Hapus";
    deleteItem.onclick = () => {
      const result = state.products;
      const indexToRemove = index;

      if (indexToRemove >= 0 && indexToRemove < result.length) {
        const newArray = result.filter((obj, index) => index !== indexToRemove);

        setState({ products: newArray });
      }
    };

    wrapperListItem.appendChild(wrapperItem);
    wrapperItem.appendChild(listItemName);
    wrapperItem.appendChild(listItemPrice);
    wrapperItem.appendChild(deleteItem);
  });

  const div = document.createElement("div");

  div.append(formInput);
  div.append(titleItem);
  div.append(wrapperListItem);

  formInput.appendChild(labelNameItem);
  formInput.appendChild(inputNameItem);
  formInput.appendChild(labelPriceItem);
  formInput.appendChild(inputPriceItem);
  formInput.appendChild(submitItem);

  return div;
}

function App() {
  const home = HomeScreen();
  return home;
}

function render() {
  const root = document.getElementById("root");
  const app = App();

  root.innerHTML = "";
  root.append(app);
}

render();
