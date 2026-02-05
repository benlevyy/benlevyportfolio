// ==========================================
// S.E.S.H. HERO: FINAL PRO (V10)
// ==========================================

if (typeof THREE === 'undefined') {
  console.error('Three.js is strictly required.');
}

// 1. SETUP
const canvas = document.querySelector('#hero-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.fog = new THREE.Fog(0xffffff, 20, 60);

const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 0, 24);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: false 
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// 2. MATERIALS
const gloveMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a, 
  roughness: 0.8,
  metalness: 0.1,
});

const jammerHousingMat = new THREE.MeshPhysicalMaterial({
  color: 0xeef5ff,    
  transmission: 0.2, 
  opacity: 1,
  roughness: 0.3,
  metalness: 0.0,
  thickness: 1.5,
  clearcoat: 0.5
});

const layerMat = new THREE.MeshStandardMaterial({
  color: 0xd0d0d0, 
  roughness: 0.6,
});

const tubeMat = new THREE.MeshPhysicalMaterial({
  color: 0x3B82F6, 
  transmission: 0.8,
  opacity: 0.4,
  roughness: 0.2,
  transparent: true
});

const hudMaterial = new THREE.MeshBasicMaterial({
  color: 0x3B82F6,
  transparent: true,
  opacity: 0.3,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

// 3. GEOMETRY BUILDER
const handGroup = new THREE.Group();
scene.add(handGroup);

const partsToExplode = []; 
const tubeUpdateList = [];

// --- Helper: Build a Finger ---
function buildFinger(x, y, scale, rotationZ, name) {
    const fingerGroup = new THREE.Group();
    fingerGroup.position.set(x, y, 0);
    fingerGroup.rotation.z = rotationZ;

    // Finger Capsule
    const len = 3.5 * scale;
    const rad = 0.45 * scale;
    const geo = new THREE.CapsuleGeometry(rad, len, 4, 16);
    const mesh = new THREE.Mesh(geo, gloveMaterial);
    mesh.position.y = len / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    fingerGroup.add(mesh);

    // Jammer Group
    const jammerGroup = new THREE.Group();
    jammerGroup.position.set(0, len * 0.4, rad * 0.85);
    jammerGroup.userData.origin = jammerGroup.position.clone();
    jammerGroup.userData.explodeVec = new THREE.Vector3(0, 0.5, 2.5); 
    fingerGroup.add(jammerGroup);
    partsToExplode.push(jammerGroup);

    // Jammer Geometry (Longer)
    const w = rad * 1.8;
    const h = len * 0.65; // Increased length (was 0.5)
    
    // Layer 1
    const l1 = new THREE.Mesh(new THREE.BoxGeometry(w*0.9, h*0.9, 0.05), layerMat);
    l1.position.z = 0.1;
    jammerGroup.add(l1);
    
    // Layer 2
    const l2 = new THREE.Mesh(new THREE.BoxGeometry(w*0.9, h*0.9, 0.05), layerMat);
    l2.position.z = 0.18;
    l2.userData.isLayer = true; 
    jammerGroup.add(l2);

    // Shell
    const shell = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.3), jammerHousingMat);
    shell.position.z = 0.35;
    shell.userData.isShell = true;
    shell.castShadow = true;
    jammerGroup.add(shell);

    // Tube Anchor
    const connector = new THREE.Object3D();
    connector.position.set(0, -h/2, 0); 
    jammerGroup.add(connector);

    return { fingerGroup, connector };
}

// --- Assembly ---
// 1. Palm (SMALLER)
const palmGeo = new THREE.CapsuleGeometry(1.6, 2.4, 4, 16); 
const palm = new THREE.Mesh(palmGeo, gloveMaterial);
palm.scale.set(1.0, 1.0, 0.4); 
palm.position.y = -0.5;
palm.castShadow = true;
palm.receiveShadow = true;
handGroup.add(palm);

// 2. Fingers
const f_index  = buildFinger(-1.2, 1.25, 0.9, 0.2, 'index');
const f_middle = buildFinger(-0.35, 1.55, 1.0, 0.05, 'middle');
const f_ring   = buildFinger( 0.45, 1.45, 0.95, -0.05, 'ring');
const f_pinky  = buildFinger( 1.2, 1.0, 0.8, -0.25, 'pinky');

handGroup.add(f_index.fingerGroup);
handGroup.add(f_middle.fingerGroup);
handGroup.add(f_ring.fingerGroup);
handGroup.add(f_pinky.fingerGroup);

// 3. Thumb (SHORTER)
const thumbGroup = new THREE.Group();
thumbGroup.position.set(-1.7, -1.1, 0.2); 
thumbGroup.rotation.z = Math.PI / 4; 
thumbGroup.rotation.y = -0.3; 
const t_build = buildFinger(0, 0, 0.88, 0, 'thumb');
thumbGroup.add(t_build.fingerGroup);
handGroup.add(thumbGroup);

// 4. Manifold & HUD
const manifold = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 0.5), jammerHousingMat);
manifold.position.set(0, -2.8, 0.8); 
manifold.castShadow = true;
handGroup.add(manifold);

const hudRingGeo = new THREE.RingGeometry(1.2, 1.25, 64);
const hudRing = new THREE.Mesh(hudRingGeo, hudMaterial);
hudRing.position.set(0, -2.8, 0.8);
hudRing.rotation.x = -0.2;
handGroup.add(hudRing);

// 5. Dynamic Tubing
function createTube(startObj, endObj) {
    const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0)
    ]);
    const geo = new THREE.TubeGeometry(path, 20, 0.06, 8, false);
    const mesh = new THREE.Mesh(geo, tubeMat);
    handGroup.add(mesh);
    
    const pulseGeo = new THREE.TubeGeometry(path, 20, 0.08, 8, false); 
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0 });
    const pulse = new THREE.Mesh(pulseGeo, pulseMat);
    handGroup.add(pulse);
    
    tubeUpdateList.push({ mesh, pulse, startObj, endObj });
}

createTube(manifold, f_index.connector);
createTube(manifold, f_middle.connector);
createTube(manifold, f_ring.connector);
createTube(manifold, f_pinky.connector);
createTube(manifold, t_build.connector);


// 4. LIGHTING
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbbb, 0.7);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.bias = -0.001;
scene.add(dirLight);

const rimLight = new THREE.SpotLight(0x3B82F6, 4.0);
rimLight.position.set(-10, 5, -5);
rimLight.lookAt(0,0,0);
scene.add(rimLight);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.ShadowMaterial({ opacity: 0.04 })
);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -6;
plane.receiveShadow = true;
scene.add(plane);


// 5. ANIMATION LOOP
let explosionState = 0;
let isHovering = false;
let time = 0;

// Wave animation state
let isWaving = true;
let waveStartTime = null;
const WAVE_DURATION = 2.0;      // Total wave duration in seconds
const WAVE_DELAY = 0.3;         // Delay before wave starts

canvas.addEventListener('mouseenter', () => isHovering = true);
canvas.addEventListener('mouseleave', () => isHovering = false);
canvas.addEventListener('touchstart', () => isHovering = true, {passive: true});
canvas.addEventListener('touchend', () => isHovering = false);

let mouseX = 0; 
let mouseY = 0;
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseX = x * 0.2; 
    mouseY = y * 0.2;
});

function animate() {
    requestAnimationFrame(animate);
    time += 0.015;

    const target = isHovering ? 1.0 : 0.0;
    explosionState += (target - explosionState) * 0.1;

    partsToExplode.forEach(group => {
        const origin = group.userData.origin;
        const vec = group.userData.explodeVec;
        group.position.copy(origin).addScaledVector(vec, explosionState);
        group.children.forEach(child => {
            if (child.userData.isLayer) child.position.z = 0.18 + (explosionState * 0.15);
            if (child.userData.isShell) child.position.z = 0.35 + (explosionState * 0.4);
        });
    });

    hudRing.rotation.z = time * 0.2;
    const hudScale = 1.0 + (explosionState * 0.2);
    hudRing.scale.setScalar(hudScale);
    hudRing.material.opacity = 0.2 + (explosionState * 0.3);

    handGroup.updateMatrixWorld();
    const worldStart = new THREE.Vector3();
    manifold.getWorldPosition(worldStart);
    worldStart.y += 0.4; 

    tubeUpdateList.forEach((item, idx) => {
        const worldEnd = new THREE.Vector3();
        item.endObj.getWorldPosition(worldEnd);
        const mid = new THREE.Vector3().lerpVectors(worldStart, worldEnd, 0.5);
        mid.z += 1.5 + (explosionState * 0.5); 
        mid.x += (item.endObj.id % 2 === 0 ? 0.2 : -0.2); 
        const curve = new THREE.QuadraticBezierCurve3(worldStart, mid, worldEnd);
        const points = curve.getPoints(20);
        const positions = item.mesh.geometry.attributes.position.array;
        let j = 0;
        for (let i = 0; i < points.length; i++) {
            positions[j++] = points[i].x;
            positions[j++] = points[i].y;
            positions[j++] = points[i].z;
        }
        item.mesh.geometry.attributes.position.needsUpdate = true;
        const pulseLoop = (time * 0.3 + (idx * 0.2)) % 1; 
        item.pulse.position.copy(curve.getPoint(pulseLoop));
        item.pulse.material.opacity = isHovering ? 0.8 : 0; 
        item.pulse.scale.setScalar(0.2); 
    });

    // Wave animation on startup
    let waveRotationZ = 0;
    if (isWaving) {
        if (waveStartTime === null) waveStartTime = time;
        const elapsed = (time - waveStartTime) * (1 / 0.015) / 60; // Convert to seconds

        if (elapsed > WAVE_DELAY) {
            const waveTime = elapsed - WAVE_DELAY;
            const progress = Math.min(waveTime / WAVE_DURATION, 1.0);

            // Damped sine wave: 3 oscillations that fade out
            const damping = 1 - progress;
            waveRotationZ = Math.sin(progress * Math.PI * 2 * 3) * damping * 0.25;

            if (progress >= 1.0) isWaving = false;
        }
    }

    const idleX = Math.sin(time * 0.5) * 0.05;
    const idleY = Math.cos(time * 0.4) * 0.05;
    handGroup.rotation.y = mouseX + idleX;
    handGroup.rotation.x = -mouseY + idleY;
    handGroup.rotation.z = waveRotationZ;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    const parent = canvas.parentElement;
    if (parent) {
        camera.aspect = parent.clientWidth / parent.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(parent.clientWidth, parent.clientHeight);
    }
});

animate();
