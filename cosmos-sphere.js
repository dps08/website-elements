// Initialize Three.js Scene
let scene, camera, renderer, sphere, particleSystem, controls;
let mouseX = 0, mouseY = 0;
let scrollProgress = 0;

// Initialize the scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Create renderer
    const canvas = document.getElementById('cosmos-canvas');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create cosmos sphere
    createCosmosSphere();

    // Create particle system
    createParticles();

    // Setup controls
    setupControls();

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x667eea, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x764ba2, 1.5);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('scroll', onScroll);
    document.addEventListener('mousemove', onMouseMove);

    // Start animation
    animate();
}

// Create the cosmos sphere
function createCosmosSphere() {
    const geometry = new THREE.SphereGeometry(2, 64, 64);

    // Create custom shader material for cosmos effect
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x667eea) },
            color2: { value: new THREE.Color(0x764ba2) },
            color3: { value: new THREE.Color(0x0a0a0a) }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float time;

            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;

                vec3 pos = position;
                float displacement = sin(pos.x * 2.0 + time) *
                                   cos(pos.y * 2.0 + time) * 0.05;
                pos += normal * displacement;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            uniform float time;
            varying vec3 vNormal;
            varying vec3 vPosition;

            void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);

                float pattern = sin(vPosition.x * 10.0 + time) *
                              cos(vPosition.y * 10.0 + time) *
                              sin(vPosition.z * 10.0 + time);

                vec3 color = mix(color3, color1, intensity);
                color = mix(color, color2, pattern * 0.5 + 0.5);

                // Add glow effect
                float glow = intensity * 0.8;
                color += glow * color1;

                gl_FragColor = vec4(color, 1.0);
            }
        `,
        wireframe: false
    });

    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
}

// Create particle system for stars
function createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;

    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Random position in a sphere
        const radius = Math.random() * 15 + 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);

        // Random colors (blue-purple spectrum)
        const colorChoice = Math.random();
        if (colorChoice < 0.33) {
            colors[i] = 0.4 + Math.random() * 0.3;
            colors[i + 1] = 0.5 + Math.random() * 0.3;
            colors[i + 2] = 0.9 + Math.random() * 0.1;
        } else if (colorChoice < 0.66) {
            colors[i] = 0.5 + Math.random() * 0.3;
            colors[i + 1] = 0.3 + Math.random() * 0.2;
            colors[i + 2] = 0.7 + Math.random() * 0.3;
        } else {
            colors[i] = 0.9 + Math.random() * 0.1;
            colors[i + 1] = 0.9 + Math.random() * 0.1;
            colors[i + 2] = 1.0;
        }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
}

// Setup mouse controls
function setupControls() {
    // Simple orbit controls implementation
    controls = {
        enabled: true,
        rotateSpeed: 0.5,
        autoRotate: true,
        autoRotateSpeed: 0.5
    };
}

// Handle mouse movement
function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Handle scroll
function onScroll() {
    scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;

    // Update sphere shader
    if (sphere.material.uniforms) {
        sphere.material.uniforms.time.value = time * 0.5;
    }

    // Rotate sphere based on mouse position
    if (controls.enabled) {
        sphere.rotation.y += (mouseX * 0.5 - sphere.rotation.y) * 0.05;
        sphere.rotation.x += (mouseY * 0.3 - sphere.rotation.x) * 0.05;

        // Auto-rotation when mouse is not moving much
        if (controls.autoRotate) {
            sphere.rotation.y += 0.002;
        }
    }

    // Rotate particle system slowly
    particleSystem.rotation.y += 0.0002;
    particleSystem.rotation.x += 0.0001;

    // Scroll-based effects
    const scrollScale = 1 + scrollProgress * 2;
    camera.position.z = 5 + scrollProgress * 3;

    // Particle animation
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        positions[i + 1] += Math.sin(time + x) * 0.001;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;

    // Add camera subtle movement
    camera.position.x = Math.sin(time * 0.2) * 0.5;
    camera.position.y = Math.cos(time * 0.3) * 0.3;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Mouse drag for rotation
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', (e) => {
    isDragging = true;
    controls.autoRotate = false;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    setTimeout(() => {
        controls.autoRotate = true;
    }, 2000);
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        sphere.rotation.y += deltaX * 0.01;
        sphere.rotation.x += deltaY * 0.01;
    }

    previousMousePosition = {
        x: e.clientX,
        y: e.clientY
    };
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', init);
