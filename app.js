document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const width = 8;
  const squares = [];

  const proLangs = [
    "red", // Ruby
    "yellow", // Javascript
    "orange", // Swift
    "purple", // C-Sharp
    "green", // python
    "blue", // C++
  ];

  // Membuat papan
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);
      let randomColor = Math.floor(Math.random() * proLangs.length);
      square.style.backgroundColor = proLangs[randomColor];
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard();
});
