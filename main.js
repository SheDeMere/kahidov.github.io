// Tailwind Configuration
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      colors: {
        brand: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        clinical: {
          cyan: '#06B6D4',
          teal: '#14B8A6',
          dark: '#0F172A',
          slate: '#334155',
          muted: '#64748B',
          surface: '#FFFFFF',
          card: '#F8FAFC',
          border: '#E2E8F0',
        }
      },
      boxShadow: {
        'pure': '0 10px 30px -5px rgba(2, 132, 199, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03)',
        'pure-hover': '0 20px 40px -8px rgba(2, 132, 199, 0.16), 0 8px 16px -4px rgba(15, 23, 42, 0.06)',
        'glow-cyan': '0 0 35px -5px rgba(14, 165, 233, 0.35)',
        'gold': '0 0 15px rgba(245, 158, 11, 0.3)',
      }
    }
  }
};

// --- Mobile Menu Toggle ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.toggle('hidden');
  }
}
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// --- Interactive 3D Tilt Effect on Doctor Photo Card ---
const doctorCard = document.getElementById('doctor-card');
if (doctorCard) {
  doctorCard.addEventListener('mousemove', (e) => {
    const rect = doctorCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    doctorCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  });

  doctorCard.addEventListener('mouseleave', () => {
    doctorCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

// --- Interactive Symptoms Checker Widget ---
let selectedSymptomsCount = 0;
function toggleSymptom(btn) {
  btn.classList.toggle('bg-brand-50');
  btn.classList.toggle('border-brand-500');
  btn.classList.toggle('shadow-sm');

  const indicator = btn.querySelector('.symptom-indicator');
  if (btn.classList.contains('border-brand-500')) {
    indicator.textContent = '✓';
    indicator.classList.remove('border-slate-300');
    indicator.classList.add('bg-brand-500', 'border-brand-500');
    selectedSymptomsCount++;
  } else {
    indicator.textContent = '';
    indicator.classList.add('border-slate-300');
    indicator.classList.remove('bg-brand-500', 'border-brand-500');
    selectedSymptomsCount--;
  }

  const statusEl = document.getElementById('checker-status');
  const subtextEl = document.getElementById('checker-subtext');

  if (selectedSymptomsCount === 0) {
    statusEl.textContent = 'Отметьте симптомы выше для персонального совета';
    subtextEl.textContent = 'Ранняя диагностика предупреждает инфаркты и хроническую сердечную недостаточность.';
  } else if (selectedSymptomsCount <= 2) {
    statusEl.textContent = `Выбрано симптомов: ${selectedSymptomsCount}. Рекомендована плановая консультация`;
    subtextEl.textContent = 'Показан базовый осмотр врача-кардиолога с записью ЭКГ и скринингом липидного спектра.';
  } else {
    statusEl.textContent = `Внимание: выбрано ${selectedSymptomsCount} симптомов. Не откладывайте обследование`;
    subtextEl.textContent = 'Высокая вероятность перегрузки миокарда или аритмии. Рекомендовано выполнить ЭхоКГ и УЗИ сосудов шеи.';
  }
}

// --- THREE.JS 3D BACKGROUND SIMULATION (Pulsing 3D Particle Heart / Biomorphic Sphere) ---
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create Heart / Pulse Shape using 3D parametric particles
  const particleCount = 1800;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const originalPositions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color(0x0ea5e9); // Clinical Sky
  const color2 = new THREE.Color(0x06b6d4); // Cyan
  const color3 = new THREE.Color(0x38bdf8); // Light azure

  for (let i = 0; i < particleCount; i++) {
    // Parametric 3D heart / organic torus distribution
    const t = (i / particleCount) * Math.PI * 2;
    const u = Math.random() * Math.PI;
    
    // 3D Heart math formulation
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    const z = (Math.sin(u) - 0.5) * 8 * Math.sin(t);

    const scale = 0.55;
    positions[i * 3] = x * scale + (Math.random() - 0.5) * 1.5;
    positions[i * 3 + 1] = y * scale + (Math.random() - 0.5) * 1.5;
    positions[i * 3 + 2] = z * scale + (Math.random() - 0.5) * 1.5;

    originalPositions[i * 3] = positions[i * 3];
    originalPositions[i * 3 + 1] = positions[i * 3 + 1];
    originalPositions[i * 3 + 2] = positions[i * 3 + 2];

    // Gradient Colors for particles
    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular Point Texture for smooth soft particles
  const pointCanvas = document.createElement('canvas');
  pointCanvas.width = 32;
  pointCanvas.height = 32;
  const ctx = pointCanvas.getContext('2d');
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(14, 165, 233, 1)');
  grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.45)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  const pointTexture = new THREE.CanvasTexture(pointCanvas);

  const material = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    map: pointTexture,
    transparent: true,
    opacity: 0.75,
    blending: THREE.NormalBlending,
    depthWrite: false
  });

  const heartMesh = new THREE.Points(geometry, material);
  heartMesh.position.set(6, 0, 0);
  scene.add(heartMesh);

  // Light ambient wireframe cage
  const cageGeo = new THREE.IcosahedronGeometry(11, 2);
  const cageMat = new THREE.MeshBasicMaterial({
    color: 0x0284C7,
    wireframe: true,
    transparent: true,
    opacity: 0.04
  });
  const cageMesh = new THREE.Mesh(cageGeo, cageMat);
  cageMesh.position.set(6, 0, 0);
  scene.add(cageMesh);

  // Cursor interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
  });

  // Window resize adaptation
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerWidth < 1024) {
      heartMesh.position.set(0, 4, 0);
      cageMesh.position.set(0, 4, 0);
    } else {
      heartMesh.position.set(6, 0, 0);
      cageMesh.position.set(6, 0, 0);
    }
  });

  if (window.innerWidth < 1024) {
    heartMesh.position.set(0, 4, 0);
    cageMesh.position.set(0, 4, 0);
  }

  // Animation Loop with rhythmic heartbeat pulse
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    const pulseCycle = (elapsedTime * 2.2) % (Math.PI * 2);
    let pulse = Math.sin(pulseCycle);
    if (pulse > 0) {
      pulse = Math.pow(pulse, 4) * 0.14;
    } else {
      pulse = 0;
    }

    const scale = 1 + pulse;
    heartMesh.scale.set(scale, scale, scale);
    cageMesh.scale.set(scale, scale, scale);

    heartMesh.rotation.y = elapsedTime * 0.25;
    heartMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.12;
    cageMesh.rotation.y = -elapsedTime * 0.1;

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 12;
    camera.position.y = -targetY * 12;
    camera.lookAt(heartMesh.position.x * 0.4, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
});
