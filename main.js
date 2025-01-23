// -----------------------------------nav
const toggleBtn = document.querySelector(".navbar_tool");
const menu = document.querySelector(".navbar_menu");
const icon = document.querySelector(".navbar_icons");

toggleBtn.addEventListener("click", () => {
  menu.classList.toggle("active");
  icon.classList.toggle("active");
});

// -------------------------------------slide
function Slider(target, type) {
  let index = 1;
  let isMoved = true;
  const speed = 1000;

  const transform = "transform " + speed / 1000 + "s";
  let translate = (i) => "translateX(-" + 100 * i + "%)";

  const slider = document.querySelector(".slider");
  const sliderRects = slider.getClientRects()[0];
  slider.style["overflow"] = "hidden";

  const container = document.createElement("div");
  container.style["display"] = "flex";
  container.style["width"] = sliderRects.width + "px";
  container.style["height"] = sliderRects.height + "px";
  container.style["transform"] = translate(index);

  // 슬라이더 화면 목록
  let boxes = [].slice.call(slider.children);
  boxes = [].concat(boxes[boxes.length - 1], boxes, boxes[0]);

  // 슬라이더 화면 스타일
  const size = boxes.length;
  for (let i = 0; i < size; i++) {
    const box = boxes[i];
    box.style["flex"] = "none";
    box.style["flex-wrap"] = "wrap";
    box.style["height"] = "100%";
    box.style["width"] = "100%";
    container.appendChild(box.cloneNode(true));
  }

  container.addEventListener("transitionstart", function () {
    isMoved = false;
    setTimeout(() => {
      isMoved = true;
    }, speed);
  });
  container.addEventListener("transitionend", function () {
    // 처음으로 순간이동
    if (index === size - 1) {
      index = 1;
      container.style["transition"] = "none";
      container.style["transform"] = translate(index);
    }
  });

  slider.innerHTML = "";
  slider.appendChild(container);

  return {
    //   move: function (i) {
    //     if (isMoved === true) {
    //       index = i;
    //       container.style["transition"] = transform;
    //       container.style["transform"] = translate(index);
    //     }
    //   },
    next: function () {
      if (isMoved === true) {
        index = (index + 1) % size;
        container.style["transition"] = transform;
        container.style["transform"] = translate(index);
      }
    },
  };
}

const s1 = new Slider("#slider1", "H");

setInterval(() => {
  s1.next();
}, 2500);

//----------------------------games-----------
function loadItems() {
  return fetch("/data.json")
    .then((response) => response.json())
    .then((json) => json.items);
}

function displayItems(items) {
  const container = document.querySelector(".games");
  container.innerHTML = items.map((item) => createHTMLString(item)).join("");
}

function createHTMLString(item) {
  return `
    <li><a href="${item.link}"><img src="${item.image}" alt=""> <h2 class="title">${item.title}</h2></a></li>
    `;
}

function onButtonsClick(event, items) {
  const dataset = event.target.dataset;
  const key = dataset.key;
  const value = dataset.value;

  if (key == null || value == null) {
    return;
  }
  const filtered = items.filter((item) => item[key] === value);
  displayItems(filtered);
}

function setEventListners(items) {
  const all = document.querySelector(".all");
  const puzzle = document.querySelector(".puzzle");
  const arcade = document.querySelector(".arcade");
  all.addEventListener("click", () => displayItems(items));
  puzzle.addEventListener("click", (event) => onButtonsClick(event, items));
  arcade.addEventListener("click", (event) => onButtonsClick(event, items));
}

//main
loadItems()
  .then((items) => {
    displayItems(items);
    setEventListners(items);
  })
  .catch(console.log);
