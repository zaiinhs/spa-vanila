let state = {
  inputValueSearchPosts: localStorage.getItem("inputValueSearchPosts") ?? "",
  posts: [],
  isLoading: false,
  errorMessage: "",
  limitPost: 2,
  skipPost: 0,
  total: 0,
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
    setState({ skipPost: 0 });
  }

  if (
    prevState.inputValueSearchPosts !== nextState.inputValueSearchPosts ||
    prevState.skipPost !== nextState.skipPost ||
    prevState.limitPost !== nextState.limitPost
  ) {
    localStorage.setItem(
      "inputValueSearchPosts",
      nextState.inputValueSearchPosts
    );
    const POSTS_JSON_API = `https://dummyjson.com/posts/search?limit=${nextState.limitPost}&skip=${nextState.skipPost}&select=title,body&q=${nextState.inputValueSearchPosts}`;

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
        setState({
          posts: dataPosts,
          total: json.total,
          isLoading: false,
          errorMessage: "",
        });
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
  inputSearch.oninput = function (event) {
    setState({ inputValueSearchPosts: event.target.value });
    // console.log(event.target.value);
  };

  const buttonClear = document.createElement("button");
  buttonClear.textContent = "Clear";
  buttonClear.onclick = function () {
    setState({ inputValueSearchPosts: "" });
  };

  const div = document.createElement("div");
  const wrapperAction = document.createElement("div");
  wrapperAction.style.marginTop = "20px";

  const buttonPrev = document.createElement("button");
  buttonPrev.textContent = "<--Prev";
  buttonPrev.disabled = state.skipPost <= 0 || state.isLoading;
  buttonPrev.onclick = () => {
    setState({ skipPost: state.skipPost - state.limitPost });
  };

  const buttonNext = document.createElement("button");
  buttonNext.textContent = "Next-->";
  const maxSkip = state.total - state.limitPost;
  buttonNext.disabled = state.skipPost >= maxSkip || state.isLoading;
  buttonNext.onclick = () => {
    setState({ skipPost: state.skipPost + state.limitPost });
  };

  const labelLimit = document.createElement("label");
  labelLimit.textContent = "Limit";
  labelLimit.style.marginLeft = "10px";

  const selectLimit = document.createElement("select");

  selectLimit.disabled = state.isLoading;
  selectLimit.onchange = (e) => {
    setState({ limitPost: Number(e.target.value) });
    // console.log(typeof e.target.value);
  };

  const list = [5, 10, 20];
  list.forEach((item) => {
    const option = document.createElement("option");
    option.textContent = item;
    option.value = item;
    selectLimit.appendChild(option);
  });

  // ini agar tampil ketika option nya dipilih
  selectLimit.value = state.limitPost;

  const listWrapper = document.createElement("ul");
  listWrapper.textContent = "Lists Posts";

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
  div.append(wrapperAction);
  div.append(listWrapper);

  wrapperAction.appendChild(buttonPrev);
  wrapperAction.appendChild(buttonNext);
  wrapperAction.appendChild(labelLimit);
  wrapperAction.appendChild(selectLimit);

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
