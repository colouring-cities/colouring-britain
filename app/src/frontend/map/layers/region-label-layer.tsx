import React from 'react';
import { useDisplayPreferences } from '../../displayPreferences-context';
import { BuildingBaseLayerAllZoom } from './building-base-layer-all-zoom';

export function RegionLabelLayer({}) {
    const { regions } = useDisplayPreferences();

    if(regions == "enabled") {
        return <BuildingBaseLayerAllZoom theme="region_labels" />;
    } else {
        return <></>
    }
}

