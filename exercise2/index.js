let state = {
  product: [],
};

function setState(newState) {
  const prevState = { ...state };
  const nextState = { ...state, ...newState };
  state = nextState;
  render();
  onStageChange(prevState, nextState);
}

function onStageChange(prevState, nextState) {
  // if (prevState.product !== nextState.product) {
  // }
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
      product: [
        {
          name: inputNameItem.value,
          price: inputPriceItem.value,
        },
      ],
    });
  });

  const hapusData = document.createElement("button");
  hapusData.textContent = "Hapus";
  hapusData.disabled = state.product.length === 0;

  hapusData.onclick = () => {
    setState({ product: [] });
  };

  const titleItem = document.createElement("h3");
  titleItem.textContent = "List barang";

  const wrapperListItem = document.createElement("ul");

  state.product.forEach((item) => {
    const listItemName = document.createElement("li");
    listItemName.textContent = item.name;

    const listItemPrice = document.createElement("span");
    listItemPrice.textContent = item.price;

    wrapperListItem.appendChild(listItemName);
    wrapperListItem.appendChild(listItemPrice);
  });

  const div = document.createElement("div");
  div.style.display = "inline-grid";

  div.append(formInput);
  div.append(hapusData);
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
