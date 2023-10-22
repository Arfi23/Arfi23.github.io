document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const game = document.querySelector(".game");
  const grid = document.querySelector(".grid");
  const gameover = document.querySelector(".game-over");
  const scoreDisplay = document.getElementById("score");
  const scoreGameOver = document.getElementById("final-score");
  const logoutButton = document.getElementById("logout-button");

  // Fungsi untuk menampilkan halaman permainan dan menyembunyikan formulir
  function showGamePage() {
    loginForm.style.display = "none";
    signupForm.style.display = "none";
    game.style.display = "block";
  }

  function postData(url, data) {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(function (response) {
      return response.json();
    });
  }

  // Menambahkan getUser data (tetapi belum berhasil)
  function getUserData() {
    fetch("localhost:9001/users/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Handle data response here
        console.log("Data user dari API:", data);
      })
      .catch(function (error) {
        console.error("Error fetching user data:", error);
      });
  }

  function login() {
    var email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const loginData = {
      email: email,
      password: password,
    };

    postData("https://ets-pemrograman-web-f.cyclic.app/users/login", loginData)
      .then(function (response) {
        alert("Data login dari API");
        console.log(response);
        // Simpan login state ke localStorage saat login berhasil
        localStorage.setItem("isLoggedIn", "true");
        showGamePage();
        getUserData();
      })
      .catch(function (error) {
        console.error("Error during login:", error);
      });
  }
  document.getElementById("login-link").addEventListener("click", login);

  logoutButton.addEventListener("click", logout);
  // Fungsi untuk logout
  function logout() {
    // Hapus login state dari localStorage
    localStorage.removeItem("isLoggedIn");
    // Tampilkan formulir login setelah logout
    showLoginForm();
  }
  // Menambahkan event listener ke tombol logout
  logoutButton.addEventListener("click", logout);

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    showGamePage();
  } else {
    showLoginForm();
  }

  // Fungsi ketika tombol Signup di-klik
  function signup() {
    var newUsername = document.getElementById("new-username").value;
    var newEmail = document.getElementById("new-email").value;
    var newPassword = document.getElementById("new-password").value;

    // Validasi Email
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(newEmail)) {
      alert("Email tidak valid. Gunakan format email yang benar.");
      return;
    }

    // Validasi Password
    var passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{4,}$/;
    if (!passwordRegex.test(newPassword)) {
      alert("Password tidak memenuhi kriteria. Pastikan ada minimal 1 huruf besar, 1 huruf kecil, 1 angka, dan 1 simbol.");
      return;
    }

    // Validasi Nama
    if (newUsername.trim() === "") {
      alert("Nama tidak boleh kosong.");
      return;
    }

    const signupData = {
      nama: newUsername,
      email: newEmail,
      password: newPassword,
    };

    postData("https://ets-pemrograman-web-f.cyclic.app/users/register", signupData)
      .then(function (response) {
        // Handle response from the API (e.g., display message, redirect to another page)
        alert("Data terkirim ke API");
        console.log(response);
      })
      .catch(function (error) {
        console.error("Error during signup:", error);
      });

    alert("Account created for username " + newUsername);
    showLoginForm();
  }
  // Fungsi untuk menampilkan form signup
  function showSignupForm() {
    loginForm.style.display = "none";
    gameover.style.display = "none";
    signupForm.style.display = "block";
  }
  // Fungsi untuk menampilkan form login
  function showLoginForm() {
    loginForm.style.display = "block";
    gameover.style.display = "none";
    signupForm.style.display = "none";

    // Cek apakah pengguna sudah login sebelumnya
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      // Jika sudah login sebelumnya, langsung tampilkan halaman permainan
      showGamePage();
    }
  }
  document.getElementById("signup-link").addEventListener("click", showSignupForm);
  document.getElementById("login-link").addEventListener("click", showLoginForm);

  // Menambahkan event listener ke login button
  document.querySelector("#login-form button").addEventListener("click", login);

  // Menambahkan event listener ke signup button
  document.querySelector("#signup-form button").addEventListener("click", signup);

  function showGameOver() {
    clearInterval(timerInterval);
    game.style.display = "none";
    gameover.style.display = "block";
    scoreGameOver.innerHTML = score;
  }

  // Countdown Timer
  const timerDisplay = document.getElementById("timer");
  let timeLeft = 120; // waktu dalam detik (misalnya 3600 detik untuk 1 jam)

  // Fungsi untuk mengupdate dan menampilkan sisa waktu dalam format MM:SS
  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    // Menambahkan 0 di depan angka tunggal untuk format MM:SS
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timerDisplay.innerHTML = minutes + ":" + seconds;
    timeLeft--;

    // Cek apakah waktu sudah habis
    if (timeLeft < 0) {
      endGame(); // Panggil fungsi endGame() ketika waktu habis
      // showGameOver();
    }
  }

  // Memulai countdown timer setiap 1 detik
  const timerInterval = setInterval(updateTimer, 1000);

  function endGame() {
    clearInterval(timerInterval); // Hentikan interval timer
    // alert("Game Over! Your final score is: " + score); // Tampilkan skor akhir
    showGameOver();
    // Tambahkan logika penyimpanan skor dan nama pemain di sini (misalnya menggunakan localStorage)
  }

  const width = 8;
  const squares = [];
  let score = 0;

  const proLangs = [
    // "red", // Ruby
    "url(img/red_ruby.png)",
    // "yellow", // Javascript
    "url(img/yellow_js.png)",
    // "orange", // Swift
    "url(img/orange_swift.png)",
    // "purple", // C-Sharp
    "url(img/purple_csharp.png)",
    // "green", // python
    "url(img/green_python.png)",
    // "blue", // C++
    "url(img/blue_cpp.png)",
  ];

  // Membuat papan
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);
      let randomColor = Math.floor(Math.random() * proLangs.length);
      square.style.backgroundImage = proLangs[randomColor];
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard();

  // Saat melakukan drag
  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  squares.forEach((square) => square.addEventListener("dragstart", dragStart));
  squares.forEach((square) => square.addEventListener("dragend", dragEnd));
  squares.forEach((square) => square.addEventListener("dragover", dragOver));
  squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
  squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
  squares.forEach((square) => square.addEventListener("drop", dragDrop));

  function dragStart() {
    colorBeingDragged = this.style.backgroundImage;
    squareIdBeingDragged = parseInt(this.id);
    // console.log(colorBeingDragged);
    console.log(this.id, "dragstart");
  }

  function dragOver(e) {
    e.preventDefault();
    console.log(this.id, "dragover");
  }

  function dragEnter(e) {
    e.preventDefault();
    console.log(this.id, "dragenter");
  }

  function dragLeave() {
    console.log(this.id, "dragleave");
  }

  function dragDrop() {
    console.log(this.id, "dragdrop");
    colorBeingReplaced = this.style.backgroundImage;
    squareIdBeingReplaced = parseInt(this.id);
    this.style.backgroundImage = colorBeingDragged;
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
  }

  function dragEnd() {
    console.log(this.id, "dragend");
    // gerakan yang valid
    let validMoves = [squareIdBeingDragged - 1, squareIdBeingDragged - width, squareIdBeingDragged + 1, squareIdBeingDragged + width];

    let validMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && validMove) {
      squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !validMove) {
      squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    } else {
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    }
  }

  // Menurunkan stack ketika terjadi kekosongan
  function moveDownStack() {
    for (i = 0; i < 55; i++) {
      if (squares[i + width].style.backgroundImage === "") {
        // proses penurunan square di tumpukan atas
        squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = "";

        // proses generate random stack baru untuk mengisi ulang kekosongan
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);
        if (isFirstRow && squares[i].style.backgroundImage === "") {
          let randomColor = Math.floor(Math.random() * proLangs.length);
          squares[i].style.backgroundImage = proLangs[randomColor];
        }
      }
    }
  }

  // Kecocokan warna
  // cek baris dengan 4 match
  function checkRowForFour() {
    for (i = 0; i <= 60; i++) {
      let rowOfFour = [i, i + 1, i + 2, i + 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
      if (notValid.includes(i)) continue;

      // periksa apakah terdapat 4 warna yang sama dengan acuannya decidedColor
      if (rowOfFour.every((index) => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        score += 4;
        scoreDisplay.innerHTML = score;
        rowOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkRowForFour();

  // cek kolom dengan 4 match
  function checkColumnForFour() {
    for (i = 0; i < 39; i++) {
      let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      // periksa apakah terdapat 4 warna yang sama dengan acuannya decidedColor
      if (columnOfFour.every((index) => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        score += 4;
        scoreDisplay.innerHTML = score;
        columnOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkColumnForFour();

  // cek baris dengan 3 match
  function checkRowForThree() {
    for (i = 0; i <= 61; i++) {
      let rowOfThree = [i, i + 1, i + 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if (notValid.includes(i)) continue;

      // periksa apakah terdapat 3 warna yang sama dengan acuannya decidedColor
      if (rowOfThree.every((index) => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        score += 3;
        scoreDisplay.innerHTML = score;
        rowOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkRowForThree();

  // cek kolom dengan 3 match
  function checkColumnForThree() {
    for (i = 0; i < 47; i++) {
      let columnOfThree = [i, i + width, i + width * 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      // periksa apakah terdapat 3 warna yang sama dengan acuannya decidedColor
      if (columnOfThree.every((index) => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        score += 3;
        scoreDisplay.innerHTML = score;
        columnOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }
  checkColumnForThree();

  window.setInterval(function () {
    moveDownStack();
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
  }, 100);
});
