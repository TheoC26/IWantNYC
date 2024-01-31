const matterContainer = document.getElementById("matter-container");
const nextFruitRef = document.querySelector(".next-fruit");

const bounciness = 0.5;
const friction = 0.6;

const schools = [
  {
    name: "nyc",
    size: 110,
    scaler: 0.0034,
  },
  {
    name: "Dalton",
    size: 100,
    scaler: 0.00225,
  },
  {
    name: "Trinity",
    size: 85,
    scaler: 0.0031,
  },
  {
    name: "Collegiate",
    size: 70,
    scaler: 0.00183,
  },
  {
    name: "Hackley",
    size: 60,
    scaler: 0.0085,
  },
  {
    name: "Fieldston",
    size: 50,
    scaler: 0.00252,
  },
  {
    name: "Horace",
    size: 45,
    scaler: 0.0064,
  },
  {
    name: "Poly",
    size: 40,
    scaler: 0.0067,
  },
  {
    name: "Riverdale",
    size: 35,
    scaler: 0.0092,
  },
  {
    name: "Brearly",
    size: 30,
    scaler: 0.00325,
  },
  {
    name: "Chapin",
    size: 20,
    scaler: 0.00925,
  },
];

let engine = new Matter.Engine.create();
let render = Matter.Render.create({
  element: matterContainer,
  engine: engine,
  options: {
    width: matterContainer.clientWidth,
    height: matterContainer.clientHeight,
    wireframes: false,
    background: "transparent",
  },
});

let objects = [];
let score = 0;
let nycs = 0;
let nextSchool = 10;
let canClick = true;
let gameOver = false;

let localStorageModel = {
  highScore: 0,
  nycs: 0,
  score: 0,
  nextSchool: 10,
  objects: [],
};

// if there is no high score in local storage, then set the high score to 0
// if (!localStorage.getItem("highScore")) {
//   localStorage.setItem("highScore", 0);
// } else {
//   document.querySelector(".high-score span").innerText =
//     localStorage.getItem("highScore");
// }
// if (!localStorage.getItem("nycs")) {
//   localStorage.setItem("nycs", 0);
// } else {
//   console.log(localStorage.getItem("nycs"));
//   document.querySelector(".nycs span").innerText = localStorage.getItem("nycs");
// }

if (!localStorage.getItem("IWANTNYC")) {
  localStorage.setItem("IWANTNYC", JSON.stringify(localStorageModel));
} else {
  let local = JSON.parse(localStorage.getItem("IWANTNYC"));
  console.log(local);
  document.querySelector(".high-score span").innerText = local.highScore;
  document.querySelector(".nycs span").innerText = local.nycs;
  document.querySelector(".score span").innerText = local.score;
  let tempObjects = local.objects;
//   score = local.score;
  nycs = local.nycs;
//   nextSchool = local.nextSchool;

  console.log(tempObjects.length);

//   for (let i = 0; i < tempObjects.length; i++) {
//     let school = schools[getSchoolIndex(tempObjects[i].label)];

//     let body = Matter.Bodies.circle(
//       tempObjects[i].position.x,
//       tempObjects[i].position.y,
//       tempObjects[i].circleRadius,
//       {
//         restitution: bounciness,
//         friction: friction,
//         label: tempObjects[i].label,
//         render: {
//           sprite: {
//             texture: "Images/" + tempObjects[i].label + ".png",
//             xScale:
//               school.scaler * school.size * (matterContainer.clientWidth / 416),
//             yScale:
//               school.scaler * school.size * (matterContainer.clientWidth / 416),
//           },
//         },
//       }
//     );
    // objects[i] = body;
    // console.log(body);
    // Matter.World.add(engine.world, body);
//   }
  chooseNextSchool();
}

function chooseNextSchool() {
  console.log(nextSchool);
  nextFruitRef.style.backgroundImage = `url(Images/${schools[nextSchool].name}.png)`;
  // change the width and height
  nextFruitRef.style.width =
    schools[nextSchool].size * 2 * (matterContainer.clientWidth / 416) + "px";
  nextFruitRef.style.height =
    schools[nextSchool].size * 2 * (matterContainer.clientWidth / 416) + "px";

  // save everything to local storage
  let local = JSON.parse(localStorage.getItem("IWANTNYC"));
  local.score = score;
  local.objects = objects;
  local.nextSchool = nextSchool;

  const circularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    };
  };

  console.log(local);

  localStorage.setItem("IWANTNYC", JSON.stringify(local, circularReplacer()));

  //   localStorage.setItem("IWANTNYC", JSON.stringify(local));
}
chooseNextSchool();

function deleteSchool() {
  canClick = false;
  nextFruitRef.style.backgroundImage = `none`;

  //wait for 1 second
  setTimeout(() => {
    canClick = true;
    checkGameOver();
    if (!gameOver) {
      nextSchool = 10 - Math.floor(Math.random() * 4);
      chooseNextSchool();
    } else {
    }
  }, 1250);
}

// function that gets the index of a school based on its name
function getSchoolIndex(label) {
  for (let i = 0; i < schools.length; i++) {
    if (schools[i].name === label) {
      return i;
    }
  }
  return -1;
}

// check game over by looping through all of the objects and if any of them are above the screen, then the game is over
function checkGameOver() {
  for (let i = 0; i < objects.length; i++) {
    if (
      objects[i].position.y - objects[i].circleRadius <
      215 * (matterContainer.clientWidth / 831) + 800
    ) {
      gameOver = true;
      gameOverState();
    }
  }
}

function gameOverState() {
  console.log("Game Over");
  // loop through all of the objects and remove them but wait one second before removing each one
  for (let i = objects.length - 1; i >= 0; i--) {
    setTimeout(() => {
      score += 11 - getSchoolIndex(objects[i].label);
      Matter.World.remove(engine.world, objects[i]);
      document.querySelector(".score span").innerText = score;
    }, i * 500);
  }
  setTimeout(() => {
    let local = JSON.parse(localStorage.getItem("IWANTNYC"));
    if (score > local.highScore) {
      local.highScore = score;
      document.querySelector(".high-score span").innerText = score;
    }
    localStorage.setItem("IWANTNYC", JSON.stringify(local));
    // reset the game
    objects = [];
    score = 0;
    document.querySelector(".score span").innerText = score;
    gameOver = false;
    canClick = true;
    nextSchool = 10;
    chooseNextSchool();
  }, objects.length * 500);
}

// change gravity to double
engine.world.gravity.y = 2;

console.log(matterContainer.clientWidth);

let ceiling = Matter.Bodies.rectangle(
  matterContainer.clientWidth / 2,
  -20,
  27184,
  20,
  { isStatic: true, label: "ceiling", render: { fillStyle: "transparent" } }
);

// make the color of the ground transparent
let ground = Matter.Bodies.rectangle(
  matterContainer.clientWidth / 2,
  matterContainer.clientHeight + 30,
  27184,
  60,
  { isStatic: true, label: "ground", render: { fillStyle: "transparent" } }
);
let leftWall = Matter.Bodies.rectangle(
  -30,
  matterContainer.clientHeight / 2,
  60,
  27184,
  { isStatic: true, label: "leftWall", render: { fillStyle: "transparent" } }
);
let rightWall = Matter.Bodies.rectangle(
  matterContainer.clientWidth + 30,
  matterContainer.clientHeight / 2,
  60,
  27184,
  { isStatic: true, label: "rightWall", render: { fillStyle: "transparent" } }
);

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    render: { visible: false },
  },
});
render.mouse = mouse;

Matter.World.add(engine.world, [
  ceiling,
  ground,
  leftWall,
  rightWall,
  //   mouseConstraint,
  ...objects,
]);

Matter.Events.on(mouseConstraint, "mousedown", function (event) {
  if (!canClick || gameOver) {
    return;
  }
  const school = schools[nextSchool];
  let body = Matter.Bodies.circle(
    event.mouse.position.x * 2,
    40 * (matterContainer.clientWidth / 416),
    school.size * (matterContainer.clientWidth / 416),
    {
      restitution: bounciness,
      friction: friction,
      label: school.name,
      render: {
        // fillStyle: colors[Math.floor(Math.random() * colors.length)],
        sprite: {
          texture: "Images/" + school.name + ".png",
          xScale:
            school.scaler * school.size * (matterContainer.clientWidth / 416),
          yScale:
            school.scaler * school.size * (matterContainer.clientWidth / 416),
        },
      },
    }
  );
  objects.push(body);
  Matter.World.add(engine.world, body);
  deleteSchool();
});
Matter.Events.on(engine, "collisionStart", function (event) {
  if (gameOver) {
    return;
  }
  const pairs = event.pairs;

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];

    if (pair.bodyA.label === pair.bodyB.label) {
      console.log("collision!");
      // play sound
      // let audio = new Audio("Plop.mov");
      // audio.play();
      score += 11 - getSchoolIndex(pair.bodyA.label);
      document.querySelector(".score span").innerText = score;

      // if the pair.bodyA.label is nyc, then add 1 to nycs and also wait 1 second and then delete the nyc
      if (pair.bodyA.label === "nyc") {
        nycs++;
        localStorage.setItem("nycs", nycs);
        document.querySelector(".nycs span").innerText = nycs;
        setTimeout(() => {
          Matter.World.remove(engine.world, pair.bodyA);
        }, 1000);
      }

      const newSchoolIndex = getSchoolIndex(pair.bodyA.label) - 1;
      const newSchoolRef = schools[newSchoolIndex];
      const newSchool = Matter.Bodies.circle(
        // average the x and y positions of the two colliding bodies
        (pair.bodyA.position.x + pair.bodyB.position.x) / 2,
        (pair.bodyA.position.y + pair.bodyB.position.y) / 2 - 15,
        newSchoolRef.size * (matterContainer.clientWidth / 416),
        {
          restitution: bounciness,
          friction: friction,
          label: newSchoolRef.name,
          render: {
            sprite: {
              texture: "Images/" + newSchoolRef.name + ".png",
              xScale:
                newSchoolRef.scaler *
                newSchoolRef.size *
                (matterContainer.clientWidth / 416),
              yScale:
                newSchoolRef.scaler *
                newSchoolRef.size *
                (matterContainer.clientWidth / 416),
            },
          },
        }
      );

      Matter.World.remove(engine.world, pair.bodyA);
      Matter.World.remove(engine.world, pair.bodyB);
      Matter.World.add(engine.world, newSchool);
      objects.push(newSchool);
      // delete the old schools
      objects = objects.filter(
        (object) => object !== pair.bodyA && object !== pair.bodyB
      );
      //   console.log(objects);
    }
  }
});

Matter.Runner.run(engine);
Matter.Render.run(render);
