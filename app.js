const matterContainer = document.getElementById("matter-container");
const nextFruitRef = document.querySelector(".next-fruit");

const bounciness = 0.5;

const schools = [
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

let objects = [];
let score = 0;
let daltons = 0;
let nextSchool = 9;
let canClick = true;

function chooseNextSchool() {
  nextSchool = 9 - Math.floor(Math.random() * 4);

  nextFruitRef.style.backgroundImage = `url(Images/${schools[nextSchool].name}.png)`;
  // change the width and height
  nextFruitRef.style.width =
    schools[nextSchool].size * 2 * (matterContainer.clientWidth / 416) + "px";
  nextFruitRef.style.height =
    schools[nextSchool].size * 2 * (matterContainer.clientWidth / 416) + "px";
}
chooseNextSchool();

function deleteSchool() {
  canClick = false;
  nextFruitRef.style.backgroundImage = `none`;

  //wait for 1 second
  setTimeout(() => {
    canClick = true;
    chooseNextSchool();
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

let engine = new Matter.Engine.create();
let render = Matter.Render.create({
  element: matterContainer,
  engine: engine,
  options: {
    width: matterContainer.clientWidth,
    height: matterContainer.clientHeight,
    wireframes: false,
    background: "white",
  },
});

// change gravity to double
engine.world.gravity.y = 2;

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
  ground,
  leftWall,
  rightWall,
  //   mouseConstraint,
  ...objects,
]);

Matter.Events.on(mouseConstraint, "mousedown", function (event) {
  if (!canClick) {
    return;
  }
  const school = schools[nextSchool];
  let body = Matter.Bodies.circle(
    event.mouse.position.x*2,
    40 * (matterContainer.clientWidth / 416),
    school.size * (matterContainer.clientWidth / 416),
    {
      restitution: bounciness,
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
  const pairs = event.pairs;

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];

    if (pair.bodyA.label === pair.bodyB.label) {
        // play sound
        // let audio = new Audio("Plop.mov");
        // audio.play();
        score += 10 - getSchoolIndex(pair.bodyA.label);
        document.querySelector(".score span").innerText = score;
      const newSchoolIndex = getSchoolIndex(pair.bodyA.label) - 1;
      const newSchoolRef = schools[newSchoolIndex];
      const newSchool = Matter.Bodies.circle(
        // average the x and y positions of the two colliding bodies
        (pair.bodyA.position.x + pair.bodyB.position.x) / 2,
        (pair.bodyA.position.y + pair.bodyB.position.y) / 2 - 15,
        newSchoolRef.size * (matterContainer.clientWidth / 416),
        {
          restitution: bounciness,
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
    }
  }
});

Matter.Runner.run(engine);
Matter.Render.run(render);
