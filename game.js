
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

// SOCCER AMAZING 2026
// Primer escenario 3D

const loading = document.getElementById('loading');
const container = document.getElementById('game-container');

container.style.height = '70vh';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x83bce8);
scene.fog = new THREE.Fog(0x83bce8, 100, 230);

const camera = new THREE.PerspectiveCamera(
  55,
  container.clientWidth / container.clientHeight,
  0.1,
  500
);

camera.position.set(0, 55, 75);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);

// ILUMINACIÓN

const ambient = new THREE.HemisphereLight(
  0xffffff,
  0x386044,
  2
);

scene.add(ambient);

const sunlight = new THREE.DirectionalLight(0xffffff, 2.5);
sunlight.position.set(-30, 70, 30);
sunlight.castShadow = true;
scene.add(sunlight);

// CAMPO DE FÚTBOL

const grass = new THREE.Mesh(
  new THREE.PlaneGeometry(68, 105),
  new THREE.MeshStandardMaterial({
    color: 0x238b42,
    roughness: 0.9
  })
);

grass.rotation.x = -Math.PI / 2;
grass.receiveShadow = true;
scene.add(grass);

// FRANJAS DEL CÉSPED

for (let i = 0; i < 10; i++) {
  const stripe = new THREE.Mesh(
    new THREE.PlaneGeometry(68, 10.5),
    new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0x238b42 : 0x299849
    })
  );

  stripe.rotation.x = -Math.PI / 2;
  stripe.position.set(0, 0.015, -47.25 + i * 10.5);
  scene.add(stripe);
}

// LÍNEAS DEL CAMPO

const lineMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff
});

function line(x, z, width, depth) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    lineMaterial
  );

  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.035, z);
  scene.add(mesh);
}

// Límites

line(0, -52, 68, 0.18);
line(0, 52, 68, 0.18);
line(-34, 0, 0.18, 105);
line(34, 0, 0.18, 105);

// Medio campo

line(0, 0, 68, 0.18);

// Círculos

function circle(radius, x, z) {
  const geometry = new THREE.RingGeometry(
    radius - 0.09,
    radius,
    80
  );

  const mesh = new THREE.Mesh(geometry, lineMaterial);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.04, z);
  scene.add(mesh);
}

circle(9.15, 0, 0);
circle(0.18, 0, 0);

// Áreas de penalti

function rectangle(x, z, width, depth) {
  line(x, z - depth / 2, width, 0.15);
  line(x, z + depth / 2, width, 0.15);
  line(x - width / 2, z, 0.15, depth);
  line(x + width / 2, z, 0.15, depth);
}

rectangle(0, -43, 40.3, 16.5);
rectangle(0, 43, 40.3, 16.5);
rectangle(0, -47.5, 18.3, 5.5);
rectangle(0, 47.5, 18.3, 5.5);

circle(0.18, 0, -43);
circle(0.18, 0, 43);

// PORTERÍAS

function createGoal(z) {
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5
  });

  function post(x, y, zPosition, width, height, depth) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      material
    );

    mesh.position.set(x, y, zPosition);
    mesh.castShadow = true;
    scene.add(mesh);
  }

  post(-3.66, 1.22, z, 0.15, 2.44, 0.15);
  post(3.66, 1.22, z, 0.15, 2.44, 0.15);
  post(0, 2.44, z, 7.45, 0.15, 0.15);

  // Fondo de la portería
  const net = new THREE.Mesh(
    new THREE.BoxGeometry(7.3, 2.3, 2.5),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    })
  );

  net.position.set(0, 1.2, z + (z > 0 ? 1.2 : -1.2));
  scene.add(net);
}

createGoal(-52.5);
createGoal(52.5);

// BALÓN 3D

const ball = new THREE.Group();

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.65, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.55
  })
);

sphere.castShadow = true;
ball.add(sphere);

// Detalles negros decorativos
const patchMaterial = new THREE.MeshStandardMaterial({
  color: 0x111111
});

for (let i = 0; i < 5; i++) {
  const patch = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 12, 12),
    patchMaterial
  );

  const angle = i * Math.PI * 2 / 5;
  patch.position.set(
    Math.cos(angle) * 0.55,
    0.12,
    Math.sin(angle) * 0.55
  );

  ball.add(patch);
}

ball.position.set(0, 0.65, 0);
scene.add(ball);

// GRADAS SIMPLES

function createStand(z) {
  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(90, 8, 12),
    new THREE.MeshStandardMaterial({
      color: 0x253b4a
    })
  );

  stand.position.set(0, 4, z);
  stand.castShadow = true;
  scene.add(stand);
}

createStand(-62);
createStand(62);

// MARCADOR

const scoreboard = new THREE.Group();

const board = new THREE.Mesh(
  new THREE.BoxGeometry(12, 4, 0.5),
  new THREE.MeshStandardMaterial({
    color: 0x101b26
  })
);

scoreboard.add(board);
scoreboard.position.set(0, 15, -65);
scene.add(scoreboard);

// CONTROLES DE CÁMARA

let dragging = false;
let previousX = 0;
let previousY = 0;
let angle = 0;
let height = 55;

renderer.domElement.addEventListener('pointerdown', (event) => {
  dragging = true;
  previousX = event.clientX;
  previousY = event.clientY;
  renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener('pointerup', () => {
  dragging = false;
});

renderer.domElement.addEventListener('pointermove', (event) => {
  if (!dragging) return;

  angle -= (event.clientX - previousX) * 0.005;
  height = THREE.MathUtils.clamp(
    height + (event.clientY - previousY) * 0.15,
    20,
    90
  );

  previousX = event.clientX;
  previousY = event.clientY;
});

function updateCamera() {
  camera.position.x = Math.sin(angle) * 75;
  camera.position.z = Math.cos(angle) * 75;
  camera.position.y = height;
  camera.lookAt(0, 0, 0);
}

// MENÚS Y CARRERA PROFESIONAL

const mainMenu = document.getElementById('main-menu');
const careerMenu = document.getElementById('career-menu');

document.getElementById('start-career').addEventListener('click', () => {
  mainMenu.hidden = true;
  careerMenu.hidden = false;
});

document.getElementById('create-player').addEventListener('click', () => {
  const name = document.getElementById('player-name').value.trim();
  const position = document.getElementById('player-position').value;

  if (!name) {
    alert('Escribe el nombre de tu futbolista.');
    return;
  }

  const player = {
    name: name,
    position: position,
    overall: 60,
    age: 18,
    club: 'Agente libre',
    season: 2026,
    goals: 0,
    assists: 0,
    appearances: 0
  };

  localStorage.setItem(
    'soccerAmazingCareer',
    JSON.stringify(player)
  );

  document.getElementById('career-info').textContent =
    `${player.name} | ${player.position} | Media ${player.overall} | ${player.club}`;

  document.getElementById('career-result').hidden = false;
  document.getElementById('open-market').hidden = false;
  console.log('Carrera creada:', player);
});

document.getElementById('back-menu').addEventListener('click', () => {
  careerMenu.hidden = true;
  mainMenu.hidden = false;
});
// MERCADO DE FICHAJES

const transferMarket = document.getElementById('transfer-market');

document.getElementById('open-market').addEventListener('click', () => {
  alert('EL BOTÓN BUSCAR CLUB FUNCIONA');
  
  careerMenu.hidden = true;
  transferMarket.hidden = false;

  const offers = [
    { club: 'Real Madrid', salary: 12000 },
    { club: 'FC Barcelona', salary: 11000 },
    { club: 'Manchester City', salary: 13000 },
    { club: 'Borussia Dortmund', salary: 8000 },
    { club: 'Atlético de Madrid', salary: 9500 }
  ];

  const offersContainer = document.getElementById('transfer-offers');

  offersContainer.innerHTML = '';

  offers.forEach((offer, index) => {
    const card = document.createElement('div');
    card.className = 'offer-card';

    card.innerHTML = `
      <h3>${offer.club}</h3>
      <p>Salario semanal: €${offer.salary.toLocaleString('es-ES')}</p>
      <button data-offer="${index}">FICHAR</button>
    `;

    offersContainer.appendChild(card);
  });

  offersContainer.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      const offer = offers[Number(button.dataset.offer)];

      const player = JSON.parse(
        localStorage.getItem('soccerAmazingCareer')
      );

      player.club = offer.club;
      player.salary = offer.salary;

      localStorage.setItem(
        'soccerAmazingCareer',
        JSON.stringify(player)
      );

      alert(`¡Has fichado por ${offer.club}!`);

      transferMarket.hidden = true;
      careerMenu.hidden = false;

      document.getElementById('career-info').textContent =
        `${player.name} | ${player.position} | Media ${player.overall} | ${player.club}`;
    });
  });
});

document.getElementById('back-career').addEventListener('click', () => {
  transferMarket.hidden = true;
  careerMenu.hidden = false;
});


// AJUSTAR PANTALLA

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(
    container.clientWidth,
    container.clientHeight
  );
});

// ANIMACIÓN

function animate() {
  requestAnimationFrame(animate);

  ball.rotation.y += 0.008;
  updateCamera();

  renderer.render(scene, camera);
}

animate();

loading.style.display = 'none';

console.log('SOCCER AMAZING 2026: ESTADIO 3D INICIADO');

