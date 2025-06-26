import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';

// Coordinates for Santiago, Chile to center the map
const CHILE_COORDINATES = { lat: -33.4489, lng: -70.6693, altitude: 2 };

const Chile3DMap: React.FC = () => {
  const globeEl = useRef<GlobeMethods | undefined>();
  const [countries, setCountries] = useState<{ features: any[] }>({ features: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch country polygons
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching country data:", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Aim at Chile
    if (globeEl.current && !isLoading && countries.features.length > 0) {
      globeEl.current.pointOfView(CHILE_COORDINATES, 1000);
      // globeEl.current.controls().autoRotate = true;
      // globeEl.current.controls().autoRotateSpeed = 0.3;
    }
  }, [isLoading, countries]);
  
  const chilePolygon = useMemo(() => {
    if (isLoading || !countries.features) return null;
    return countries.features.find(f => f.properties.ISO_A2 === 'CL');
  }, [countries, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-gray-800">
        <p className="text-white text-xl">Loading Globe...</p>
      </div>
    );
  }

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      
      polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')} // Exclude Antarctica for better visuals
      polygonCapColor={feat => feat === chilePolygon ? 'rgba(52, 211, 153, 0.7)' : 'rgba(255,255,255,0.2)'}
      polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'}
      polygonStrokeColor={() => '#6b7280'} // gray-500
      polygonAltitude={feat => feat === chilePolygon ? 0.06 : 0.01}
      
      onPolygonHover={hoverD => {
        if (globeEl.current) {
          const controls = globeEl.current.controls();
          if (controls && controls.domElement) {
            controls.domElement.style.cursor = hoverD ? 'pointer' : 'grab';
          }
        }
      }}
      polygonsTransitionDuration={300}

      // Atmosphere
      atmosphereColor="lightskyblue"
      atmosphereAltitude={0.25}

      // Quality settings
      rendererConfig={{ antialias: true, alpha: true }}
    />
  );
};

export default Chile3DMap;