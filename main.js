const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

// const car = new Car(road
const N = 1;
const cars = generateCars(N);

let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    // cars[i].brain = bestBrain; // best brain stored locally
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.25);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 1, getRandomColor()),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -800, 30, 50, "DUMMY", 1, getRandomColor()),
  new Car(road.getLaneCenter(1), -900, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 1, getRandomColor()),
  new Car(road.getLaneCenter(2), -1100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1400, 30, 50, "DUMMY", 1, getRandomColor()),
  new Car(road.getLaneCenter(0), -1800, 30, 50, "DUMMY", 1, getRandomColor()),
  new Car(road.getLaneCenter(0), -2000, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -2100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -2100, 30, 50, "DUMMY", 1, getRandomColor()),
  new Car(road.getLaneCenter(2), -2300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -2500, 30, 50, "DUMMY", 1, getRandomColor()),
  new Car(road.getLaneCenter(1), -2500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -2700, 30, 50, "DUMMY", 1, getRandomColor()),
  new Car(road.getLaneCenter(0), -2800, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -3000, 30, 50, "DUMMY", 1, getRandomColor()),
  new Car(road.getLaneCenter(0), -3200, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -3200, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -3400, 30, 50, "DUMMY", 1, getRandomColor()),
  new Car(road.getLaneCenter(1), -3400, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -3800, 30, 50, "DUMMY", 1, getRandomColor()),
  new Car(road.getLaneCenter(0), -4000, 30, 50, "DUMMY", 2, getRandomColor()),
]

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function saveInJson() {
  const bestBrain = JSON.parse(localStorage.getItem("bestBrain"));
  console.log(bestBrain);

  const jsonData = JSON.stringify(bestBrain, null, 2);

  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'bestBrain.json';
  link.click();

  URL.revokeObjectURL(url);
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    let car = cars[i];
    car.update(road.borders, traffic);
  }

  bestCar = cars.find(
    c => c.y == Math.min(
      ...cars.map(c => c.y)
    )
  );

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();

  carCtx.translate(0, -bestCar.y + carCanvas.height*0.7);
  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    let car = cars[i];
    car.draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time/50;

  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
