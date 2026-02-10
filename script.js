document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.toggleButton');
    const mapOriginal = document.querySelector('.mapaoriginal');
    const mapContainer = document.querySelector('.map-container');
    const allHotspots = document.querySelectorAll('.hotspot');
    const legendListItems = document.querySelectorAll('.legend-list li');

    if (!toggleButton || !mapOriginal || !mapContainer) return;

    // --- NUEVA LÓGICA: CARGA BAJO DEMANDA (Lazy Load Manual) ---
    let isOriginalMapLoaded = false;

    function loadOriginalMap() {
        if (isOriginalMapLoaded) return; // Si ya se cargó, no hacer nada

        const sources = mapOriginal.querySelectorAll('source');
        const img = mapOriginal.querySelector('img');

        // Pasar los datos de los atributos "data-" a los atributos reales
        sources.forEach(source => {
            if (source.dataset.srcset) {
                source.srcset = source.dataset.srcset;
            }
        });

        if (img && img.dataset.src) {
            img.src = img.dataset.src;
        }

        isOriginalMapLoaded = true;
        console.log("Cargando mapa original por primera vez...");
    }

    // --- FUNCIÓN PARA DESACTIVAR TODO ---
    function deactivateAllHotspots() {
        allHotspots.forEach(h => h.classList.remove('active'));
    }

    // --- 1. LÓGICA DE VISIBILIDAD (Mapa Original / Locaciones) ---
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation(); 
        const isOriginalMapVisible = mapOriginal.classList.contains('visible');

        if (!isOriginalMapVisible) {
            // ACTIVAR CARGA: Solo cuando el usuario quiere ver el mapa original
            loadOriginalMap();

            mapContainer.classList.add('hidden');
            mapOriginal.classList.add('visible');
            toggleButton.textContent = 'VER LOCACIONES';
            deactivateAllHotspots(); 
        } else {
            mapOriginal.classList.remove('visible');
            mapContainer.classList.remove('hidden');
            toggleButton.textContent = 'VER MAPA ORIGINAL';
        }
    });

    // --- 2. FUNCIÓN DE ACTIVACIÓN ---
    function setActiveHotspot(hotspotSelector) {
        deactivateAllHotspots();
        const targetHotspots = document.querySelectorAll(hotspotSelector);
        targetHotspots.forEach(hotspot => hotspot.classList.add('active'));

        mapOriginal.classList.remove('visible');
        mapContainer.classList.remove('hidden');
        toggleButton.textContent = 'VER MAPA ORIGINAL';
    }

    // --- 3. EVENTOS DE CLIC ---

    // A) Click en la Leyenda
    legendListItems.forEach((item, index) => {
        let num = index + 1;
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            let selector = (num === 33) ? '.point-33, .point-33a, .point-33b' : 
                           (num === 36) ? '.point-36, .point-36a, .point-36b' : 
                           `.point-${num}`;
            setActiveHotspot(selector);
        });
    });

    // B) Click en el Mapa (Hotspots)
    allHotspots.forEach(hotspot => {
        hotspot.addEventListener('click', (event) => {
            event.stopPropagation();
            if (!hotspot.classList.contains('active')) {
                const pointClass = Array.from(hotspot.classList).find(cls => cls.startsWith('point-'));
                setActiveHotspot(`.${pointClass}`);
            }
        });

        // C) Evitar que el tooltip se cierre al hacer clic dentro de sus textos/imágenes
        const tooltip = hotspot.querySelector('.tooltip');
        if (tooltip) {
            tooltip.addEventListener('click', (e) => {
                e.stopPropagation(); 
            });    
        }

        // D) Lógica del botón de cerrar (X)
        const closeBtn = hotspot.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deactivateAllHotspots();
            });
        }
    });

    // E) CLIC FUERA (Cerrar todo al tocar cualquier otra parte de la pantalla)
    document.addEventListener('click', () => {
        deactivateAllHotspots();
    });
});