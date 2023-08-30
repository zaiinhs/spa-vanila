let state = {
  products: JSON.parse(localStorage.getItem("productItem")) || [],
};

// function setState(newState) {
//   const prevState = { ...state };
//   const nextState = { ...state, ...newState };
//   state = nextState;
//   render();
//   onStageChange(prevState, nextState);
// }

// function onStageChange(prevState, nextState) {
//   if (prevState.product !== nextState.product) {
//   }
// }

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
    const inputName = inputNameItem.value;
    const inputPrice = inputPriceItem.value;

    if ((inputName && inputPrice) !== "") {
      const product = {
        name: inputName,
        price: inputPrice,
      };

      state.products.push(product);
      localStorage.setItem("productItem", JSON.stringify(state.products));
      formInput.reset();
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
    listItemName.textContent = item.name;

    const listItemPrice = document.createElement("span");
    listItemPrice.textContent = item.price;

    const hapusData = document.createElement("button");
    hapusData.textContent = "Hapus";
    hapusData.onclick = () => {
      console.log(index);
    };

    wrapperListItem.appendChild(wrapperItem);
    wrapperItem.appendChild(listItemName);
    wrapperItem.appendChild(listItemPrice);
    wrapperItem.appendChild(hapusData);
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
