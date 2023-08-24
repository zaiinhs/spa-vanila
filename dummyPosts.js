let state = {
  inputValueSearchPosts: localStorage.getItem("inputValueSearchPosts") ?? "",
  posts: [],
  isLoading: false,
  errorMessage: "",
};

function setState(newState) {
  const prevState = { ...state };
  const nextState = { ...state, ...newState };

  state = nextState;
  render();
  onStateChange(prevState, nextState);
}

//   This is side effect = adalah sebuah function yg akan dijalankan ketika state nya
function onStateChange(prevState, nextState) {
  if (prevState.inputValueSearchPosts !== nextState.inputValueSearchPosts) {
    localStorage.setItem(
      "inputValueSearchPosts",
      nextState.inputValueSearchPosts
    );
    const POSTS_JSON_API = `https://dummyjson.com/posts/search?q=${nextState.inputValueSearchPosts}`;

    setState({ isLoading: true });
    fetch(POSTS_JSON_API)
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
        const dataPosts = json.posts;
        setState({ posts: dataPosts, isLoading: false, errorMessage: "" });
        // console.log(json);
      })
      .catch((error) => {
        console.log(error);
        setState({
          errorMessage: "❌Error COK❌",
          isLoading: false,
          posts: [],
        });
      });
  }
}

function HomeScreen() {
  const title = document.createElement("h1");
  title.textContent = "Posts Dummy";
  const inputSearch = document.createElement("input");
  inputSearch.value = state.inputValueSearchPosts;
  inputSearch.placeholder = "Search Posts";
  inputSearch.id = "input-search";
  const listWrapper = document.createElement("ol");
  listWrapper.textContent = "Lists Posts";
  const buttonClear = document.createElement("button");
  buttonClear.textContent = "Clear";
  const div = document.createElement("div");

  inputSearch.oninput = function (event) {
    setState({ inputValueSearchPosts: event.target.value });
    // console.log(event.target.value);
  };

  buttonClear.onclick = function () {
    setState({ inputValueSearchPosts: "" });
  };

  if (state.isLoading) {
    const titleLoading = document.createElement("h1");
    titleLoading.textContent = "Loading....";
    listWrapper.append(titleLoading);
  } else if (state.errorMessage !== "") {
    const titleError = document.createElement("h1");
    titleError.textContent = state.errorMessage;
    listWrapper.append(titleError);
  } else if (state.posts.length === 0) {
    const titleEmpty = document.createElement("h1");
    titleEmpty.textContent = "Postingan yang dicari tidak ada!";
    listWrapper.append(titleEmpty);
  } else {
    state.posts.forEach((itemPosts) => {
      const listPosts = document.createElement("li");
      const titlePosts = document.createElement("p");
      const descriptionPosts = document.createElement("span");

      titlePosts.textContent = itemPosts.title;
      descriptionPosts.textContent = itemPosts.body;
      listWrapper.appendChild(listPosts);
      listPosts.appendChild(titlePosts);
      listPosts.appendChild(descriptionPosts);
    });
  }

  div.append(title);
  div.append(inputSearch);
  div.append(buttonClear);
  div.append(listWrapper);

  return div;
}

function App() {
  const homeScreen = HomeScreen();
  return homeScreen;
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
