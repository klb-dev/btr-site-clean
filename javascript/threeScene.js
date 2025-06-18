export function setupThreeJS() {
  // setup Three.js scene
  const canvas = document.getElementById("hero-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: true, 
    alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  // lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
  //skateboard 
  const skateboards = [];
  const createSkateboard = (x, y, z) => {
    const shape = new THREE.Shape();
    const width = 2.6, height = 0.7, radius = 0.2;
    shape.moveTo(-width/2+radius, -height/2);
    shape.lineTo(width/2-radius, -height/2);
    shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2+radius);
    shape.lineTo(width/2, height/2-radius);
    shape.quadraticCurveTo(width/2, height/2, width/2-radius, height/2);
    shape.lineTo(-width/2+radius, height/2);
    shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2-radius);
    shape.lineTo(-width/2, -height/2+radius);
    shape.quadraticCurveTo(-width/2, -height/2, -width/2+radius, -height/2);

    const deckGeometry = new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false });
    const deckMaterial = new THREE.MeshStandardMaterial({ color: Math.random() < 0.5 ? 0x2ecc71 : 0x3498db, roughness: 0.5 });
    const deck = new THREE.Mesh(deckGeometry, deckMaterial);
    deck.rotation.x = Math.PI / 2;
    deck.rotation.z = Math.PI / 2;

    const truckGeometry = new THREE.BoxGeometry(1, 0.15, 0.25);
    const truckMaterial = new THREE.MeshStandardMaterial({ color: 0xbdc3c7 });
    const frontTruck = new THREE.Mesh(truckGeometry, truckMaterial);
    const backTruck = new THREE.Mesh(truckGeometry, truckMaterial);
    frontTruck.position.set(0, -0.125, 0.9);
    backTruck.position.set(0, -0.125, -0.9);

    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0xf39c12 });
    const wheels = [];
    [ [0.5, -0.25, 0.9], [-0.5, -0.25, 0.9], [0.5, -0.25, -0.9], [-0.5, -0.25, -0.9] ].forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, y, z);
      wheels.push(wheel);
    });

    const skateboard = new THREE.Group();
    skateboard.add(deck, frontTruck, backTruck, ...wheels);
    skateboard.position.set(x, y, z);
    skateboard.rotation.y = Math.random() * Math.PI * 2;
    skateboard.userData = {
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      moveDirection: new THREE.Vector3((Math.random()-0.5)*0.05, (Math.random()-0.5)*0.02, (Math.random()-0.5)*0.05),
    };
    scene.add(skateboard);
    return skateboard;
  };

  for (let i = 0; i < 5; i++) {
    skateboards.push(createSkateboard(Math.random()*10 - 5, 1, Math.random()*10 - 5));
  }
  // skater
  const createSkater = () => {
    const skater = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.3), new THREE.MeshStandardMaterial({ color: 0x3498db }));
    body.position.y = 0.4;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), new THREE.MeshStandardMaterial({ color: 0xf1c40f }));
    head.position.y = 1;
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db });
    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), armMaterial);
    const rightArm = leftArm.clone();
    leftArm.position.set(0.45, 0.4, 0);
    rightArm.position.set(-0.45, 0.4, 0);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), legMaterial);
    const rightLeg = leftLeg.clone();
    leftLeg.position.set(0.2, -0.3, 0);
    rightLeg.position.set(-0.2, -0.3, 0);
    const skateboard = createSkateboard(0, -0.65, 0);
    skateboard.scale.set(0.8, 0.8, 0.8);
    skater.add(body, head, leftArm, rightArm, leftLeg, rightLeg, skateboard);
    skater.position.set(0, 0, -10);
    skater.rotation.y = Math.PI;
    scene.add(skater);
    return skater;
  };

  const skater = createSkater();
  camera.position.set(0, 1, 5);
  // movement
  let jumpDirection = 2, jumpHeight = 5;
  const animate = () => {
    requestAnimationFrame(animate);
    skateboards.forEach(sk => {
      sk.rotation.y += sk.userData.rotationSpeed;
      sk.position.add(sk.userData.moveDirection);
      if (Math.abs(sk.position.x) > 15) sk.userData.moveDirection.x *= -1;
      if (Math.abs(sk.position.y) > 10) sk.userData.moveDirection.y *= -1;
      if (sk.position.z > 5 || sk.position.z < -25) sk.userData.moveDirection.z *= -1;
      sk.children.slice(3).forEach(wheel => wheel.rotation.x += 0.1);
    });
    jumpHeight += 0.05 * jumpDirection;
    if (jumpHeight > 1) jumpDirection = -1;
    else if (jumpHeight < 0) jumpDirection = 1;
    skater.position.y = jumpHeight * 0.2;
    skater.rotation.z = jumpHeight * 0.2;
    skater.position.x = Math.sin(Date.now() * 0.001) * 5;
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}