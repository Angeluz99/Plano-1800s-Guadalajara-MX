// toggleButton toggles map container opacity
const toggleButton = document.querySelector('.toggleButton');
const mapContainer = document.querySelector('.map-container');

toggleButton.addEventListener('click', () => {
  if (mapContainer.style.opacity === '1') {
    mapContainer.style.opacity = '0';
    toggleButton.textContent = 'VER LOCACIONES';
  } else {
    mapContainer.style.opacity = '1';
    toggleButton.textContent = 'VER MAPA ORIGINAL';
  }
});

// -------------------------------------------------------------
// LÓGICA UNIFICADA DE ACTIVACIÓN DE HOTSPOT
// -------------------------------------------------------------
const legendListItems = document.querySelectorAll('.legend-list li');
const allHotspots = document.querySelectorAll('.hotspot');

/**
 * Limpia el estado 'active' de todos los hotspots y aplica el estado 'active'
 * al hotspot/s especificado por el selector.
 * @param {string} hotspotSelector El selector CSS del hotspot a activar (ej: '.point-1' o '.point-33, .point-33a, .point-33b').
 */
function setActiveHotspot(hotspotSelector) {
    // 1. Limpiar estado 'active' de TODOS los hotspots
    allHotspots.forEach(hotspot => {
        hotspot.classList.remove('active'); 
    });

    // 2. Encontrar y activar el hotspot/s objetivo
    const targetHotspots = document.querySelectorAll(hotspotSelector);

    targetHotspots.forEach(hotspot => {
        hotspot.classList.add('active'); 
    });

    // 3. Mostrar mapa y hacer scroll
    mapContainer.style.opacity = '1';
    toggleButton.textContent = 'VER MAPA ORIGINAL';
}


// A) Funcionalidad de la Leyenda (Click en <li>)
legendListItems.forEach((item, index) => {
    // El número de hotspot corresponde al índice + 1
    let hotspotNumber = index + 1;

    item.addEventListener('click', () => {
        let targetSelector;

        // Caso especial para el punto 33 (Las Garitas), que tiene 3 hotspots
        if (hotspotNumber === 33) {
            targetSelector = '.point-33, .point-33a, .point-33b';
        } else {
            targetSelector = `.point-${hotspotNumber}`;
        }

        setActiveHotspot(targetSelector);
    });
});

// B) Funcionalidad del Hotspot (Click directo en el mapa)
allHotspots.forEach(hotspot => {
    hotspot.addEventListener('click', (event) => {
        event.stopPropagation();
        
        const pointClass = Array.from(hotspot.classList).find(cls => cls.startsWith('point-'));

        if (!pointClass) return;

        // Si ya está activo, lo desactivamos (toggle off)
        if (hotspot.classList.contains('active')) {
             // Limpia el estado 'active' de todos los hotspots (desactivar)
             allHotspots.forEach(h => h.classList.remove('active')); 
        } else {
            // Si no está activo, lo activamos (y desactiva a los demás)
            
            // Determinamos el selector base para el caso especial 33
            const baseNumber = pointClass.replace('point-', '').replace('a', '').replace('b', '');
            
            let targetSelector;
            if (baseNumber === '33') {
                // Si se hace clic en cualquier parte de las Garitas, se resaltan TODAS.
                targetSelector = '.point-33, .point-33a, .point-33b';
            } else {
                // Para todos los demás, se resalta solo el punto específico
                targetSelector = `.${pointClass}`;
            }

            setActiveHotspot(targetSelector);
        }
    });
});