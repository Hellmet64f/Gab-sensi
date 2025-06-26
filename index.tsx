/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import Chile3DMap from './Chile3DMap';

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll<HTMLDivElement>('#slideshow-container .slide');
    const prevButton = document.getElementById('prev-slide') as HTMLButtonElement;
    const nextButton = document.getElementById('next-slide') as HTMLButtonElement;
    const slideIndicator = document.getElementById('slide-indicator') as HTMLSpanElement;

    const showMapButton = document.getElementById('show-map-button') as HTMLButtonElement;
    const mapContainer = document.getElementById('map-container') as HTMLDivElement;
    const reactGlobeContainer = document.getElementById('react-globe-container');

    let currentSlide = 0;
    const totalSlides = slides.length;
    let globeRoot: Root | null = null;

    function updateSlideIndicator() {
        if (slideIndicator) {
            slideIndicator.textContent = `${currentSlide + 1} / ${totalSlides}`;
        }
    }

    function showSlide(index: number) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        updateSlideIndicator();
    }

    function showNextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function showPrevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    if (slides.length > 0 && prevButton && nextButton && slideIndicator) {
        prevButton.addEventListener('click', showPrevSlide);
        nextButton.addEventListener('click', showNextSlide);
        showSlide(currentSlide); // Initialize first slide
    } else {
        console.warn('Slideshow elements not found.');
    }

    if (showMapButton && mapContainer && reactGlobeContainer) {
        showMapButton.addEventListener('click', () => {
            const isMapCurrentlyVisible = mapContainer.style.display === 'block';

            if (isMapCurrentlyVisible) { // If map is visible, hide it
                mapContainer.style.display = 'none';
                if (globeRoot) {
                    globeRoot.unmount();
                    globeRoot = null;
                }
                showMapButton.textContent = 'Ver Globo Terrestre Interativo';
            } else { // If map is hidden, show it
                mapContainer.style.display = 'block';
                if (!globeRoot) { // Only create root and render if it doesn't exist
                    globeRoot = createRoot(reactGlobeContainer);
                    globeRoot.render(React.createElement(Chile3DMap));
                }
                showMapButton.textContent = 'Esconder Globo';
                // Ensure the map container is scrolled into view smoothly
                // Needs to happen after display:block is set and component might take a moment to render
                setTimeout(() => {
                    mapContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    } else {
        console.warn('Map toggle elements or React globe container not found.');
        if (!reactGlobeContainer) console.error("react-globe-container not found in DOM.");
    }
});