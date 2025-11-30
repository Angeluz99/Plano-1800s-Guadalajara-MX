document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. SELECCIÓN DE ELEMENTOS (¡FIXED! Usando .querySelector)
    // -------------------------------------------------------------
    const toggleButton = document.querySelector('.toggleButton');
    const mapOriginal = document.querySelector('.mapaoriginal');
    const mapContainer = document.querySelector('.map-container');
    
    const legendListItems = document.querySelectorAll('.legend-list li');
    const allHotspots = document.querySelectorAll('.hotspot');


    // Comprobación de seguridad para evitar el error 'null'
    if (!toggleButton || !mapOriginal || !mapContainer) {
        console.error("Faltan elementos HTML cruciales: '.toggleButton', '.mapaoriginal' o '.map-container'.");
        return; 
    }

    // -------------------------------------------------------------
    // 2. LÓGICA DE VISIBILIDAD (Toggle) - Mantiene la corrección del doble-clic
    // -------------------------------------------------------------
    toggleButton.addEventListener('click', () => {
        // Comprobar el estado actual del mapa original a través de su clase.
        const isOriginalMapVisible = mapOriginal.classList.contains('visible');

        if (!isOriginalMapVisible) {
            // Estado actual: Mapa Hotspots visible. Acción: Mostrar Mapa Original.
            
            // 1. Ocultar mapa con hotspots y mostrar mapa original
            mapContainer.classList.add('hidden'); // Ocultar hotspots
            mapOriginal.classList.add('visible'); // Mostrar original
            
            // 2. Actualizar texto del botón
            toggleButton.textContent = 'VER LOCACIONES';
        } else {
            // Estado actual: Mapa Original visible. Acción: Mostrar Mapa Hotspots.
            
            // 1. Ocultar mapa original y mostrar mapa con hotspots
            mapOriginal.classList.remove('visible'); // Ocultar original
            mapContainer.classList.remove('hidden'); // Mostrar hotspots
            
            // 2. Actualizar texto del botón
            toggleButton.textContent = 'VER MAPA ORIGINAL';
        }
    });


    // -------------------------------------------------------------
    // 3. LÓGICA UNIFICADA DE ACTIVACIÓN DE HOTSPOT
    // -------------------------------------------------------------

    /**
     * Limpia el estado 'active' de todos los hotspots y aplica el estado 'active'
     * al hotspot/s especificado por el selector.
     * @param {string} hotspotSelector El selector CSS del hotspot a activar.
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

        // 3. Mostrar mapa de hotspots (en caso de que estuviera el original) y hacer scroll
        mapOriginal.classList.remove('visible'); // Ocultar original
        mapContainer.classList.remove('hidden'); // Mostrar hotspots
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
});