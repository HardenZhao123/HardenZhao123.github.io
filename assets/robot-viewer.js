import * as THREE from "./vendor/three.module.min.js";
import { OrbitControls } from "./vendor/OrbitControls.js";
import { GLTFLoader } from "./vendor/GLTFLoader.js";
import { MeshoptDecoder } from "./vendor/meshopt_decoder.module.js";

const viewers = Array.from(document.querySelectorAll("[data-robot-viewer]"));
if (viewers.length === 0) throw new Error("Robot viewers are missing.");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);

const PANDA_BODIES = [
  { name: "link0" },
  { name: "link1", parent: "link0", pos: [0, 0, 0.333], axis: [0, 0, 1] },
  { name: "link2", parent: "link1", quat: [1, -1, 0, 0], axis: [0, 0, 1] },
  { name: "link3", parent: "link2", pos: [0, -0.316, 0], quat: [1, 1, 0, 0], axis: [0, 0, 1] },
  { name: "link4", parent: "link3", pos: [0.0825, 0, 0], quat: [1, 1, 0, 0], axis: [0, 0, 1] },
  { name: "link5", parent: "link4", pos: [-0.0825, 0.384, 0], quat: [1, -1, 0, 0], axis: [0, 0, 1] },
  { name: "link6", parent: "link5", quat: [1, 1, 0, 0], axis: [0, 0, 1] },
  { name: "link7", parent: "link6", pos: [0.088, 0, 0], quat: [1, 1, 0, 0], axis: [0, 0, 1] },
  { name: "hand", parent: "link7", pos: [0, 0, 0.107], quat: [0.9238795, 0, 0, -0.3826834] },
  { name: "left_finger", parent: "hand", pos: [0, 0.03, 0.0584] },
  { name: "right_finger", parent: "hand", pos: [0, -0.03, 0.0584], quat: [0, 0, 0, 1] },
];

const PANDA_HOME = [0, 0.2, 0, -1.9, 0, 2, 0.785];
const PANDA_PALETTE = {
  body: 0xf4f5f6,
  light: 0xe2e6e9,
  accent: 0x178fca,
  dark: 0x303337,
};

const ROBOTS = {
  franka: {
    url: "./assets/models/franka-panda.glb",
    prepare: preparePanda,
    cameraDirection: new THREE.Vector3(1.15, 0.55, 1.4),
    fit: 1.03,
  },
  aloha: {
    url: "./assets/models/mobile-aloha.glb",
    prepare: prepareMobileAloha,
    cameraDirection: new THREE.Vector3(1.3, 0.75, 1.7),
    fit: 1.08,
  },
};

function makeMaterial(color, key) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: key === "body" ? 0.14 : 0.04,
    roughness: key === "dark" ? 0.55 : 0.34,
  });
}

function preparePanda(gltf) {
  const parts = new Map();

  gltf.scene.traverse((object) => {
    if (!object.isMesh) return;
    const [body, paletteKey = "body"] = object.name.split("__");
    object.material = makeMaterial(
      PANDA_PALETTE[paletteKey] ?? PANDA_PALETTE.body,
      paletteKey
    );
    object.castShadow = true;
    object.receiveShadow = true;
    if (!parts.has(body)) parts.set(body, []);
    parts.get(body).push(object);
  });

  const frames = new Map();
  const joints = [];
  let root = null;

  PANDA_BODIES.forEach((body) => {
    const fixed = new THREE.Group();
    if (body.pos) fixed.position.fromArray(body.pos);
    if (body.quat) {
      fixed.quaternion
        .set(body.quat[1], body.quat[2], body.quat[3], body.quat[0])
        .normalize();
    }

    const frame = new THREE.Group();
    fixed.add(frame);
    frames.set(body.name, frame);
    if (body.parent) frames.get(body.parent).add(fixed);
    else root = fixed;

    (parts.get(body.name) || []).forEach((mesh) => frame.add(mesh));
    if (body.axis) {
      joints.push({
        frame,
        axis: new THREE.Vector3().fromArray(body.axis).normalize(),
      });
    }
  });

  joints.forEach((joint, index) => {
    joint.frame.quaternion.setFromAxisAngle(joint.axis, PANDA_HOME[index]);
  });

  const model = new THREE.Group();
  model.rotation.x = -Math.PI / 2;
  model.rotation.z = 0.08;
  model.add(root);
  model.userData.update = (elapsed) => {
    if (reducedMotion.matches) return;
    joints.forEach((joint, index) => {
      const amplitude = index === 3 || index === 5 ? 0.025 : 0.014;
      const angle =
        PANDA_HOME[index] +
        Math.sin(elapsed * 0.42 + index * 0.7) * amplitude;
      joint.frame.quaternion.setFromAxisAngle(joint.axis, angle);
    });
  };
  return model;
}

function prepareMobileAloha(gltf) {
  const model = gltf.scene;
  model.rotation.y = -0.14;
  model.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
  });
  return model;
}

function placeOnGround(model) {
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= box.min.y;
  model.updateMatrixWorld(true);
}

function addLighting(scene) {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x65717d, 1.9));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
  keyLight.position.set(4, 7, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -3;
  keyLight.shadow.camera.right = 3;
  keyLight.shadow.camera.top = 3;
  keyLight.shadow.camera.bottom = -3;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xa8c9ec, 1.15);
  rimLight.position.set(-4, 2.5, -4);
  scene.add(rimLight);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(3.4, 64),
    new THREE.ShadowMaterial({ opacity: 0.15 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
}

function initViewer(viewer) {
  const key = viewer.dataset.robotViewer;
  const spec = ROBOTS[key];
  const canvas = viewer.querySelector("[data-robot-canvas]");
  const loading = viewer.querySelector("[data-robot-loading]");
  if (!spec || !canvas || !loading) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch (error) {
    loading.textContent = "3D preview is unavailable.";
    viewer.classList.add("has-error");
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
  const controls = new OrbitControls(camera, canvas);
  const clock = new THREE.Clock();
  let model = null;
  let isVisible = false;
  let isLoaded = false;

  controls.enableDamping = true;
  controls.dampingFactor = 0.065;
  controls.enablePan = false;
  controls.autoRotate = !reducedMotion.matches;
  controls.autoRotateSpeed = 0.42;
  controls.minPolarAngle = Math.PI * 0.12;
  controls.maxPolarAngle = Math.PI * 0.54;

  addLighting(scene);

  function fitCamera() {
    if (!model || !viewer.clientWidth || !viewer.clientHeight) return;
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const size = box.getSize(new THREE.Vector3());
    const target = sphere.center.clone();
    target.y = box.min.y + size.y * 0.47;

    const verticalFov = THREE.MathUtils.degToRad(camera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
    const limitingFov = Math.min(verticalFov, horizontalFov);
    const distance =
      (sphere.radius / Math.sin(limitingFov / 2)) * spec.fit;

    camera.position
      .copy(target)
      .addScaledVector(spec.cameraDirection.clone().normalize(), distance);
    camera.near = Math.max(0.01, distance / 100);
    camera.far = distance * 12;
    camera.updateProjectionMatrix();
    controls.target.copy(target);
    controls.minDistance = distance * 0.58;
    controls.maxDistance = distance * 2.1;
    controls.update();
  }

  function resize() {
    const width = viewer.clientWidth;
    const height = viewer.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    fitCamera();
  }

  async function loadModel() {
    if (isLoaded) return;
    isLoaded = true;
    resize();
    try {
      const gltf = await loader.loadAsync(spec.url);
      model = spec.prepare(gltf);
      scene.add(model);
      placeOnGround(model);
      fitCamera();
      loading.hidden = true;
      viewer.classList.add("is-ready");
      renderer.render(scene, camera);
    } catch (error) {
      console.error(`Failed to load ${spec.url}:`, error);
      loading.textContent = "3D model could not be loaded.";
      viewer.classList.add("has-error");
    }
  }

  new ResizeObserver(resize).observe(viewer);
  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) loadModel();
      });
    },
    { rootMargin: "320px" }
  ).observe(viewer);

  function render() {
    requestAnimationFrame(render);
    if (!model || !isVisible || document.hidden) return;
    if (model.userData.update) model.userData.update(clock.getElapsedTime());
    controls.update();
    renderer.render(scene, camera);
  }

  render();
}

viewers.forEach(initViewer);
