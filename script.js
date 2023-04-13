// Global Variables
let turn = "X";
let win_x = 0;
let win_o = 0;

const win_sequence = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Initialization
$(window).on("load", init);
$(document).on("click", "#restart", init);
$(document).on("click", "#board button:not(.activated)", mark);

function init() {
  $("#board button").text("?").removeClass("activated o x");
  $("#restart").addClass("inactive");
  turn = "X";

  check();
}

function mark() {
  $(this).addClass("activated");

  if (turn === "X") {
    $(this).text("X").addClass("x");
    turn = "O";
  } else {
    $(this).text("O").addClass("o");
    turn = "X";
  }

  check();

  if (turn === "O") {
    robot();
  }
}

function check() {
  let data_x = getIndices("x");
  let data_o = getIndices("o");
  let winner = checkWinner(data_x, data_o);

  if (winner) {
    updateWinner(winner);
    $("#board button").addClass("activated");
    $("#restart").addClass("active").removeClass("inactive");
  } else if ($("#board button:not(.activated)").length === 0) {
    console.log("NO WINNER");
    $("#restart").addClass("active").removeClass("inactive");
  } else {
    $("restart").addClass("inactive").removeClass("active");
  }
}

function getIndices(playerClass) {
  let indices = [];

  $(`#board button.${playerClass}`).each(function () {
    indices.push($(this).index("button"));
  });

  return indices;
}

function checkWinner(data_x, data_o) {
  for (const seq of win_sequence) {
    if (seq.every((val) => data_x.includes(val))) {
      return "X";
    }
    if (seq.every((val) => data_o.includes(val))) {
      return "O";
    }
  }

  return null;
}

function updateWinner(winner) {
  console.log(`WINNER: ${winner}`);

  if (winner === "X") {
    win_x++;
    $("#score_x").text(win_x);
  } else {
    win_o++;
    $("#score_o").text(win_o);
  }
}

function robot() {
  let data_free = getFreeIndices();
  let target = selectTarget(data_free);

  $("#board button:eq(" + target + ")").click();
}

function getFreeIndices() {
  let freeIndices = [];

  $("#board button:not(.activated)").each(function () {
    freeIndices.push($(this).index("button"));
  });

  return freeIndices;
}

function selectTarget(data_free) {
  const corners = [0, 2, 6, 8];
  const center = 4;

  if (data_free.includes(center)) {
    return center;
  }

  const availableCorners = corners.filter((corner) =>
    data_free.includes(corner)
  );
  if (availableCorners.length > 0) {
    return availableCorners[
      Math.floor(Math.random() * availableCorners.length)
    ];
  }

  return data_free[Math.floor(Math.random() * data_free.length)];
}
