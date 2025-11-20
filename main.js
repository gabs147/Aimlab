document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log("Inicializando aplicación...");
    
    // Variables 
    let velocidad = 0.1;
    let contador = 0;
    let t = 0;
    let isActive = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Crear esfera
    const geometry = new THREE.SphereGeometry(3, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x4D27F5 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // cursor personalizado
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Inicializar raycaster y mouse
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Función para actualizar contador
    function actualizarContador() {
        const elementoContador = document.getElementById('contador');
        if (elementoContador) {
            elementoContador.textContent = `Clicks: ${contador} - Velocidad: ${velocidad.toFixed(2)}`;
        }
    }

    // Función para crear
    function createSphere() {
        if (!sphere.parent) {
            scene.add(sphere);
        }
        sphere.position.x = (Math.random() - 0.5) * 50;
        sphere.position.y = 0;
    }

    // Función de disparo
    function Disparo(objeto) {
        scene.remove(objeto);
        // Aumentar velocidad y contador
        velocidad += 0.1;
        contador++;
        actualizarContador();
        
        setTimeout(() => {
            createSphere();
        }, 100);
    }

    camera.position.z = 50;

    // Activar interacción después de un breve delay
    setTimeout(() => {
        console.log("Ya se puede mover la esfera");
        isActive = true;
    }, 100);

    // Manejador de movimiento del mouse
    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Mover cursor personalizado
        if (cursor) {
            cursor.style.left = event.clientX + 'px';
            cursor.style.top = event.clientY + 'px';
        }
    }

    // Manejador de clic
    function onMouseClick(event) {
        if (!isActive) return;
        
        console.log("Click - Velocidad actual: " + velocidad.toFixed(2));
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const firstIntersectedObject = intersects[0].object;
            Disparo(firstIntersectedObject);
            
            // Efecto visual en el cursor
            if (cursor) {
                cursor.classList.add('active');
                setTimeout(() => {
                    cursor.classList.remove('active');
                }, 100);
            }
        }
    }

    // Manejar la carga de la imagen de fondo
    function manejarFondo() {
        const fondo = document.getElementById('fondo');
        if (fondo) {
            fondo.onload = function() {
                console.log("Imagen de fondo cargada correctamente");
            };
            fondo.onerror = function() {
                console.log("Error cargando la imagen de fondo");
                // El color de respaldo en CSS ya está establecido
            };
        }
    }

    // Función de animación
    function animate() {
        requestAnimationFrame(animate);
        
        // Movimiento oscilatorio vertical
        sphere.position.y = 10 * Math.sin(t * 0.04 * velocidad);
        
        // Rotación
        sphere.rotation.x += 0.01 * velocidad;
        sphere.rotation.y += 0.01 * velocidad;
        
        t += 1;
        
        renderer.render(scene, camera);
    }

    // Configurar event listeners
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onMouseClick, false);
    
    // Manejar redimensionado
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Inicializar
    actualizarContador();
    createSphere();
    manejarFondo();
    animate();
    
    console.log("Aplicación inicializada correctamente");
}
