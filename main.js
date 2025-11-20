document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log("Inicializando aplicación...");

    let velocidad = 0.1;
    let contador = 0;
    let t = 0;
    let isActive = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Fondo como plano con textura
    const loader = new THREE.TextureLoader();
    loader.load('blanco.jpg', function(texture) {
        const bgGeometry = new THREE.PlaneGeometry(160, 90); 
        const bgMaterial = new THREE.MeshBasicMaterial({ map: texture });
        const backgroundMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        backgroundMesh.position.z = -10; 
        backgroundMesh.userData.isBackground = true; 
        scene.add(backgroundMesh);
    });

    // Esfera
    const geometry = new THREE.SphereGeometry(3, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x4D27F5 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Cursor personalizado
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function actualizarContador() {
        const elementoContador = document.getElementById('contador');
        if (elementoContador) {
            elementoContador.textContent = `Clicks: ${contador} - Velocidad: ${velocidad.toFixed(2)}`;
        }
    }

    function createSphere() {
        if (!sphere.parent) {
            scene.add(sphere);
        }
        sphere.position.x = (Math.random() - 0.5) * 50;
        sphere.position.y = 0;
    }

    function Disparo(objeto) {
        scene.remove(objeto);
        velocidad += 0.1;
        contador++;
        actualizarContador();

        setTimeout(() => {
            createSphere();
        }, 100);
    }

    camera.position.z = 50;

    setTimeout(() => {
        console.log("Ya se puede mover la esfera");
        isActive = true;
    }, 100);

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (cursor) {
            cursor.style.left = event.clientX + 'px';
            cursor.style.top = event.clientY + 'px';
        }
    }

    function onMouseClick(event) {
        if (!isActive) return;

        console.log("Click - Velocidad actual: " + velocidad.toFixed(2));
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const firstIntersectedObject = intersects[0].object;

            // Evita disparar al fondo
            if (firstIntersectedObject.userData.isBackground) return;

            Disparo(firstIntersectedObject);

            if (cursor) {
                cursor.classList.add('active');
                setTimeout(() => {
                    cursor.classList.remove('active');
                }, 100);
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        sphere.position.y = 10 * Math.sin(t * 0.04 * velocidad);
        sphere.rotation.x += 0.01 * velocidad;
        sphere.rotation.y += 0.01 * velocidad;

        t += 1;

        renderer.render(scene, camera);
    }

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onMouseClick, false);

    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    actualizarContador();
    createSphere();
    animate();

    console.log("Aplicación inicializada correctamente");
}
