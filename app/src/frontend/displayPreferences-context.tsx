import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { LayerEnablementState, MapTheme } from './config/map-config';

interface DisplayPreferencesContextState {
    showOverlayList: (e: React.FormEvent<HTMLFormElement>) => void;
    resetLayersAndHideTheirList: (e: React.FormEvent<HTMLFormElement>) => void;

    vista: LayerEnablementState;
    vistaSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    vistaSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    flood: LayerEnablementState;
    floodSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    floodSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    creative: LayerEnablementState;
    creativeSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    creativeSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    housing: LayerEnablementState;
    housingSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    housingSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    conservation: LayerEnablementState;
    conservationSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    conservationSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    parcel: LayerEnablementState;
    parcelSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    parcelSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    borough: LayerEnablementState;
    boroughSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    boroughSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    historicData: LayerEnablementState;
    historicDataSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    historicDataSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    historicMap: LayerEnablementState;
    historicMapSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    historicMapSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    historicMapLeicestershire: LayerEnablementState;
    historicMapLeicestershireSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    historicMapLeicestershireSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    aerialPhotosMap: LayerEnablementState;
    aerialPhotosMapSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    aerialPhotosMapSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    historicalFootprints: LayerEnablementState;
    historicalFootprintsSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    historicalFootprintsSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    historicalMapAndFootprintsWithoutFill: LayerEnablementState;
    historicalMapAndFootprintsWithoutFillSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    historicalMapAndFootprintsWithoutFillSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    openStreetMap: LayerEnablementState;
    openStreetMapSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    openStreetMapSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    regions: LayerEnablementState;
    regionsSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    regionsSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    ceremonialCounties: LayerEnablementState;
    ceremonialCountiesSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    ceremonialCountiesSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    motorways: LayerEnablementState;
    motorwaysSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    motorwaysSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    greenbelt: LayerEnablementState;
    greenbeltSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    greenbeltSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    editableBuildings: LayerEnablementState;
    editableBuildingsSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    editableBuildingsSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    darkLightTheme: MapTheme;
    darkLightThemeSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    darkLightThemeSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;

    showLayerSelection: LayerEnablementState;
    showLayerSelectionSwitch: (e: React.FormEvent<HTMLFormElement>) => void;
    showLayerSelectionSwitchOnClick: React.MouseEventHandler<HTMLButtonElement>;
}

const stub = (): never => {
    throw new Error('DisplayPreferencesProvider not set up');
};

export const DisplayPreferencesContext = createContext<DisplayPreferencesContextState>({
    showOverlayList: stub,
    resetLayersAndHideTheirList: stub,

    vista: undefined,
    vistaSwitch: stub,
    vistaSwitchOnClick: undefined,

    flood: undefined,
    floodSwitch: stub,
    floodSwitchOnClick: undefined,

    creative: undefined,
    creativeSwitch: stub,
    creativeSwitchOnClick: undefined,

    housing: undefined,
    housingSwitch: stub,
    housingSwitchOnClick: undefined,

    conservation: undefined,
    conservationSwitch: stub,
    conservationSwitchOnClick: undefined,

    parcel: undefined,
    parcelSwitch: stub,
    parcelSwitchOnClick: undefined,

    borough: undefined,
    boroughSwitch: stub,
    boroughSwitchOnClick: undefined,

    historicData: undefined,
    historicDataSwitch: stub,
    historicDataSwitchOnClick: undefined,

    historicMap: undefined,
    historicMapSwitch: stub,
    historicMapSwitchOnClick: undefined,

    historicMapLeicestershire: undefined,
    historicMapLeicestershireSwitch: stub,
    historicMapLeicestershireSwitchOnClick: undefined,

    aerialPhotosMap: undefined,
    aerialPhotosMapSwitch: stub,
    aerialPhotosMapSwitchOnClick: undefined,

    historicalFootprints: undefined,
    historicalFootprintsSwitch: stub,
    historicalFootprintsSwitchOnClick: undefined,

    historicalMapAndFootprintsWithoutFill: undefined,
    historicalMapAndFootprintsWithoutFillSwitch: stub,
    historicalMapAndFootprintsWithoutFillSwitchOnClick: undefined,

    regions: undefined,
    regionsSwitch: stub,
    regionsSwitchOnClick: undefined,

    ceremonialCounties: undefined,
    ceremonialCountiesSwitch: stub,
    ceremonialCountiesSwitchOnClick: undefined,

    greenbelt: undefined,
    greenbeltSwitch: stub,
    greenbeltSwitchOnClick: undefined,
    
    motorways: undefined,
    motorwaysSwitch: stub,
    motorwaysSwitchOnClick: undefined,
    
    openStreetMap: undefined,
    openStreetMapSwitch: stub,
    openStreetMapSwitchOnClick: undefined,

    editableBuildings: undefined,
    editableBuildingsSwitch: stub,
    editableBuildingsSwitchOnClick: undefined,

    darkLightTheme: undefined,
    darkLightThemeSwitch: stub,
    darkLightThemeSwitchOnClick: undefined,

    showLayerSelection: undefined,
    showLayerSelectionSwitch: stub,
    showLayerSelectionSwitchOnClick: undefined,
});

const noop = () => {};

export const DisplayPreferencesProvider: React.FC<{}> = ({children}) => {
    const defaultVista = 'disabled'
    const defaultFlood = 'disabled'
    const defaultCreative = 'disabled'
    const defaultHousing = 'disabled'
    const defaultBorough = 'enabled'
    const defaultParcel = 'disabled'
    const defaultConservation = 'disabled'
    const defaultHistoricData = 'disabled'
    const defaultHistoricMap = 'disabled'
    const defaultHistoricMapLeicestershire = 'disabled'
    const defaultaerialPhotosMap = 'disabled'
    const defaultHistoricalFootprints = 'disabled'
    const defaultHistoricalMapAndFootprintsWithoutFill = 'disabled'
    const defaultRegions = 'disabled'
    const defaultCeremonialCounties = 'disabled'
    const defaultGreenbelt = 'disabled'
    const defaultMotorways = 'disabled'
    const defaultOpenStreetMap = 'disabled'
    const defaultEditableBuildings = 'enabled'
    const defaultShowLayerSelection = 'disabled'
    const [vista, setVista] = useState<LayerEnablementState>(defaultVista);
    const [flood, setFlood] = useState<LayerEnablementState>(defaultFlood);
    const [creative, setCreative] = useState<LayerEnablementState>(defaultCreative);
    const [housing, setHousing] = useState<LayerEnablementState>(defaultHousing);
    const [borough, setBorough] = useState<LayerEnablementState>(defaultBorough);
    const [parcel, setParcel] = useState<LayerEnablementState>(defaultParcel);
    const [conservation, setConservation] = useState<LayerEnablementState>(defaultConservation);
    const [historicData, setHistoricData] = useState<LayerEnablementState>(defaultHistoricData);
    const [historicMap, setHistoricMap] = useState<LayerEnablementState>(defaultHistoricMap);
    const [historicMapLeicestershire, setHistoricMapLeicestershire] = useState<LayerEnablementState>(defaultHistoricMapLeicestershire);
    const [aerialPhotosMap, setaerialPhotosMap] = useState<LayerEnablementState>(defaultaerialPhotosMap);
    const [historicalFootprints, setHistoricalFootprints] = useState<LayerEnablementState>(defaultHistoricalFootprints);
    const [historicalMapAndFootprintsWithoutFill, setHistoricalMapAndFootprintsWithoutFill] = useState<LayerEnablementState>(defaultHistoricalMapAndFootprintsWithoutFill);
    const [regions, setRegions] = useState<LayerEnablementState>(defaultRegions);
    const [ceremonialCounties, setCeremonialCounties] = useState<LayerEnablementState>(defaultCeremonialCounties);
    const [greenbelt, setGreenbelt] = useState<LayerEnablementState>(defaultGreenbelt);
    const [motorways, setMotorways] = useState<LayerEnablementState>(defaultMotorways);
    const [openStreetMap, setOpenStreetMapMap] = useState<LayerEnablementState>(defaultOpenStreetMap);
    const [editableBuildings, setEditableBuildings] = useState<LayerEnablementState>(defaultEditableBuildings);
    const [darkLightTheme, setDarkLightTheme] = useState<MapTheme>('night');
    const [showLayerSelection, setShowLayerSelection] = useState<LayerEnablementState>(defaultShowLayerSelection);

    const showOverlayList = useCallback(
        (e) => {
            setShowLayerSelection('enabled')
        },
        []
    )

    const resetLayersAndHideTheirList = useCallback(
        (e) => {
            setOpenStreetMapMap(defaultOpenStreetMap);
            setVista(defaultVista);
            setFlood(defaultFlood);
            setCreative(defaultCreative);
            setHousing(defaultHousing);
            setBorough(defaultBorough)
            setParcel(defaultParcel);
            setConservation(defaultConservation);
            setHistoricData(defaultHistoricData);
            setHistoricMap(defaultHistoricMap);
            setHistoricMapLeicestershire(defaultHistoricMapLeicestershire);
            setaerialPhotosMap(defaultaerialPhotosMap);
            setHistoricalFootprints(defaultHistoricalFootprints);
            setHistoricalMapAndFootprintsWithoutFill(defaultHistoricalMapAndFootprintsWithoutFill);
            setRegions(defaultRegions);
            setCeremonialCounties(defaultCeremonialCounties);
            setGreenbelt(defaultGreenbelt);
            setMotorways(defaultMotorways);
            setEditableBuildings(defaultEditableBuildings)
            setShowLayerSelection(defaultShowLayerSelection); // reset layers + hiding this panel is integrated into one action
            //setDarkLightTheme('night'); // reset only layers
    },
        []
    )

    function anyLayerModifiedState() {
        if(vista != defaultVista) {
            return true;
        }
        if(flood != defaultFlood) {
            return true;
        }
        if(creative != defaultCreative) {
            return true;
        }
        if(housing != defaultHousing) {
            return true;
        }
        if(borough != defaultBorough) {
            return true;
        }
        if(parcel != defaultParcel) {
            return true;
        }
        if(conservation != defaultConservation) {
            return true;
        }
        if(historicData != defaultHistoricData) {
            return true;
        }
        if(historicMap != defaultHistoricMap) {
            return true;
        }
        if(historicMapLeicestershire != defaultHistoricMapLeicestershire) {
            return true;
        }
        if(aerialPhotosMap != defaultaerialPhotosMap) {
            return true;
        }
        if(historicalFootprints != defaultHistoricalFootprints) {
            return true;
        }
        if(historicalMapAndFootprintsWithoutFill != defaultHistoricalMapAndFootprintsWithoutFill) {
            return true;
        }
        if(regions != defaultRegions) {
            return true;
        }
        if(ceremonialCounties != defaultCeremonialCounties) {
            return true;
        }
        if(motorways != defaultMotorways) {
            return true;
        }
        if(greenbelt != defaultGreenbelt) {
            return true;
        }
        if(openStreetMap != defaultOpenStreetMap) {
            return true;
        }
        if(editableBuildings != defaultEditableBuildings) {
            return true;
        }
        setEditableBuildings
        //darkLightTheme not handled here
        return false;
    }

    const vistaSwitch = useCallback(
        (e) => {
            e.preventDefault();
            const newVista = (vista === 'enabled')? 'disabled' : 'enabled';
            setVista(newVista);
        },
        [vista],
    )

    const vistaSwitchOnClick = (e) => {
            e.preventDefault();
            const newVista = (vista === 'enabled')? 'disabled' : 'enabled';
            setVista(newVista);
    }

    const floodSwitch = useCallback(
        (e) => {
            e.preventDefault();
            const newFlood = (flood === 'enabled')? 'disabled' : 'enabled';
            setFlood(newFlood);
        },
        [flood],
    )

    const floodSwitchOnClick = (e) => {
        e.preventDefault();
        const newFlood = (flood === 'enabled')? 'disabled' : 'enabled';
        setFlood(newFlood);
    }

    const housingSwitch = useCallback(
        (e) => {
            e.preventDefault();
            const newHousing = (housing === 'enabled')? 'disabled' : 'enabled';
            setHousing(newHousing);
        },
        [housing],
    )

    const housingSwitchOnClick = (e) => {
        e.preventDefault();
        const newHousing = (housing === 'enabled')? 'disabled' : 'enabled';
        setHousing(newHousing);
    }

    const creativeSwitch = useCallback(
        (e) => {
            e.preventDefault();
            const newCreative = (creative === 'enabled')? 'disabled' : 'enabled';
            setCreative(newCreative);
        },
        [creative],
    )

    const creativeSwitchOnClick = (e) => {
        e.preventDefault();
        const newCreative = (creative === 'enabled')? 'disabled' : 'enabled';
        setCreative(newCreative);
    }

    const boroughSwitch = useCallback(
        (e) => {
            flipBorough(e)
        },
        [borough],
    )
    const boroughSwitchOnClick = (e) => {
        flipBorough(e)
    }
    function flipBorough(e) {
        e.preventDefault();
        const newBorough = (borough === 'enabled')? 'disabled' : 'enabled';
        setBorough(newBorough);
    }

    const parcelSwitch = useCallback(
        (e) => {
            flipParcel(e)
        },
        [parcel],
    )
    const parcelSwitchOnClick = (e) => {
        flipParcel(e)
    }
    function flipParcel(e) {
        e.preventDefault();
        const newParcel = (parcel === 'enabled')? 'disabled' : 'enabled';
        setParcel(newParcel);
    }

    const conservationSwitch = useCallback(
        (e) => {
            flipConservation(e)
        },
        [conservation],
    )
    const conservationSwitchOnClick = (e) => {
        flipConservation(e)
    }
    function flipConservation(e) {
        e.preventDefault();
        const newConservation = (conservation === 'enabled')? 'disabled' : 'enabled';
        setConservation(newConservation);
    }

    const historicDataSwitch = useCallback(
        (e) => {
            if (historicMap === 'enabled') {
                flipHistoricMap(e);
            }
            if (historicalFootprints === 'enabled') {
                flipHistoricFootprints(e);
            }
            flipHistoricData(e);
        },
        [historicData, historicMap, historicalFootprints],
    )
    const historicDataSwitchOnClick = (e) => {
        flipHistoricData(e)
    }
    function flipHistoricData(e) {
        e.preventDefault();
        const newHistoric = (historicData === 'enabled')? 'disabled' : 'enabled';
        setHistoricData(newHistoric);
    }

    const historicMapSwitch = useCallback(
        (e) => {
            if (historicData === 'enabled') {
                flipHistoricData(e);
            }
            if (historicalFootprints === 'enabled') {
                flipHistoricFootprints(e);
            }
            flipHistoricMap(e);
        },
        [historicMap, historicData, historicalFootprints],
    )
    const historicMapSwitchOnClick = (e) => {
        flipHistoricMap(e)
    }
    function flipHistoricMap(e) {
        e.preventDefault();
        const newHistoric = (historicMap === 'enabled')? 'disabled' : 'enabled';
        
        setHistoricMap(newHistoric);
    }

    const historicMapLeicestershireSwitch = useCallback(
        (e) => {
            if (historicData === 'enabled') {
                flipHistoricData(e);
            }
            if (historicalFootprints === 'enabled') {
                flipHistoricFootprints(e);
            }
            flipHistoricMapLeicestershire(e);
        },
        [historicMapLeicestershire, historicData, historicalFootprints],
    )
    const historicMapLeicestershireSwitchOnClick = (e) => {
        flipHistoricMapLeicestershire(e)
    }
    function flipHistoricMapLeicestershire(e) {
        e.preventDefault();
        const newHistoricLeicestershire = (historicMapLeicestershire === 'enabled')? 'disabled' : 'enabled';
        
        setHistoricMapLeicestershire(newHistoricLeicestershire);
    }

    const aerialPhotosMapSwitch = useCallback(
        (e) => {
            flipaerialPhotosMap(e);
        },
        [aerialPhotosMap],
    )
    const aerialPhotosMapSwitchOnClick = (e) => {
        flipaerialPhotosMap(e)
    }
    function flipaerialPhotosMap(e) {
        e.preventDefault();
        const newHistoric = (aerialPhotosMap === 'enabled')? 'disabled' : 'enabled';
        setaerialPhotosMap(newHistoric);
    }

    const historicalFootprintsSwitch = useCallback(
        (e) => {
            if (historicMap === 'enabled') {
                flipHistoricMap(e);
            }
            if (historicData === 'enabled') {
                flipHistoricData(e);
            }
            flipHistoricFootprints(e)
        },
        [historicMap, historicData, historicalFootprints],
    )
    const historicalFootprintsSwitchOnClick = (e) => {
        flipHistoricFootprints(e)
    }
    function flipHistoricFootprints(e) {
        e.preventDefault();
        const newFootprints = (historicalFootprints === 'enabled')? 'disabled' : 'enabled';
        setHistoricalFootprints(newFootprints);
    }

    const historicalMapAndFootprintsWithoutFillSwitch = useCallback(
        (e) => {
            if (historicMap === 'enabled') {
                flipHistoricMap(e);
            }
            if (historicData === 'enabled') {
                flipHistoricData(e);
            }
            if (historicalFootprints === 'enabled') {
                flipHistoricFootprints(e);
            }
            flipHistoricalMapAndFootprintsWithoutFill(e)
        },
        [historicMap, historicData, historicalFootprints],
    )
    const historicalMapAndFootprintsWithoutFillSwitchOnClick = (e) => {
        flipHistoricalMapAndFootprintsWithoutFill(e)
    }
    function flipHistoricalMapAndFootprintsWithoutFill(e) {
        e.preventDefault();
        const newHistoricalMapMapAndFootprintsWithoutFill = (historicalMapAndFootprintsWithoutFill === 'enabled')? 'disabled' : 'enabled';
        setHistoricalMapAndFootprintsWithoutFill(newHistoricalMapMapAndFootprintsWithoutFill);
    }

    const openStreetMapSwitch = useCallback(
        (e) => {
            flipOpenStreetMap(e);
        },
        [openStreetMap],
    )
    const openStreetMapSwitchOnClick = (e) => {
        flipOpenStreetMap(e)
    }
    function flipOpenStreetMap(e) {
        e.preventDefault();
        const newOpenStreetMap = (openStreetMap === 'enabled')? 'disabled' : 'enabled';
        setOpenStreetMapMap(newOpenStreetMap);
    }

    const editableBuildingsSwitch = useCallback(
        (e) => {
            flipEditableBuildings(e)
        },
        [editableBuildings],
    )
    const editableBuildingsSwitchOnClick = (e) => {
        flipEditableBuildings(e)
    }
    function flipEditableBuildings(e) {
        e.preventDefault();
        const newValue = (editableBuildings === 'enabled')? 'disabled' : 'enabled';
        setEditableBuildings(newValue);
    }

    const regionsSwitch = useCallback(
        (e) => {
            flipRegions(e)
        },
        [regions],
    )
    const regionsSwitchOnClick = (e) => {
        flipRegions(e)
    }
    function flipRegions(e) {
        e.preventDefault();
        const newRegions = (regions === 'enabled')? 'disabled' : 'enabled';
        setRegions(newRegions);
    }

    const ceremonialCountiesSwitch = useCallback(
        (e) => {
            flipCeremonialCounties(e)
        },
        [ceremonialCounties],
    )
    const ceremonialCountiesSwitchOnClick = (e) => {
        flipCeremonialCounties(e)
    }
    function flipCeremonialCounties(e) {
        e.preventDefault();
        const newCeremonialCounties = (ceremonialCounties === 'enabled')? 'disabled' : 'enabled';
        setCeremonialCounties(newCeremonialCounties);
    }

    const motorwaysSwitch = useCallback(
            (e) => {
                flipMotorways(e)
            },
            [motorways],
        )
    const motorwaysSwitchOnClick = (e) => {
        flipMotorways(e)
    }
    function flipMotorways(e) {
        e.preventDefault();
        const newMotorways = (motorways === 'enabled')? 'disabled' : 'enabled';
        setMotorways(newMotorways);
    }

    const greenbeltSwitch = useCallback(
        (e) => {
            flipGreenbelt(e)
        },
        [greenbelt],
    )
    const greenbeltSwitchOnClick = (e) => {
        flipGreenbelt(e)
    }
    function flipGreenbelt(e) {
        e.preventDefault();
        const newGreenbelt = (greenbelt === 'enabled')? 'disabled' : 'enabled';
        setGreenbelt(newGreenbelt);
    }

    const darkLightThemeSwitch = useCallback(
        (e) => {
            flipDarkLightTheme(e)
        },
        [darkLightTheme],
    )
    const darkLightThemeSwitchOnClick = (e) => {
        flipDarkLightTheme(e)
    }
    function flipDarkLightTheme(e) {
        e.preventDefault();
        const newDarkLightTheme = (darkLightTheme === 'light')? 'night' : 'light';
        setDarkLightTheme(newDarkLightTheme);
    }

    const showLayerSelectionSwitch = useCallback(
        (e) => {
            flipShowLayerSelection(e)
        },
        [showLayerSelection],
    )
    const showLayerSelectionSwitchOnClick = (e) => {
        flipShowLayerSelection(e)
    }
    function flipShowLayerSelection(e) {
        e.preventDefault();
        const newShowLayerSelection = (showLayerSelection === 'enabled')? 'disabled' : 'enabled';
        setShowLayerSelection(newShowLayerSelection);
    }


    return (
        <DisplayPreferencesContext.Provider value={{
            showOverlayList,
            resetLayersAndHideTheirList,

            vista,
            vistaSwitch,
            vistaSwitchOnClick,
            flood,
            floodSwitch,
            floodSwitchOnClick,
            creative,
            creativeSwitch,
            creativeSwitchOnClick,
            housing,
            housingSwitch,
            housingSwitchOnClick,
            conservation,
            conservationSwitch,
            conservationSwitchOnClick,
            parcel,
            parcelSwitch,
            parcelSwitchOnClick,
        
            borough,
            boroughSwitch,
            boroughSwitchOnClick,
        
            historicData,
            historicDataSwitch,
            historicDataSwitchOnClick,

            historicMap,
            historicMapSwitch,
            historicMapSwitchOnClick,

            historicMapLeicestershire,
            historicMapLeicestershireSwitch,
            historicMapLeicestershireSwitchOnClick,

            aerialPhotosMap,
            aerialPhotosMapSwitch,
            aerialPhotosMapSwitchOnClick,

            historicalFootprints,
            historicalFootprintsSwitch,
            historicalFootprintsSwitchOnClick,

            historicalMapAndFootprintsWithoutFill,
            historicalMapAndFootprintsWithoutFillSwitch,
            historicalMapAndFootprintsWithoutFillSwitchOnClick,

            regions,
            regionsSwitch,
            regionsSwitchOnClick,

            ceremonialCounties,
            ceremonialCountiesSwitch,
            ceremonialCountiesSwitchOnClick,

            motorways,
            motorwaysSwitch,
            motorwaysSwitchOnClick,
            
            greenbelt,
            greenbeltSwitch,
            greenbeltSwitchOnClick,

            openStreetMap,
            openStreetMapSwitch,
            openStreetMapSwitchOnClick,

            editableBuildings,
            editableBuildingsSwitch,
            editableBuildingsSwitchOnClick,

            darkLightTheme,
            darkLightThemeSwitch,
            darkLightThemeSwitchOnClick,

            showLayerSelection,
            showLayerSelectionSwitch,
            showLayerSelectionSwitchOnClick
        }}>
            {children}
        </DisplayPreferencesContext.Provider>
    );
};

export const useDisplayPreferences = (): DisplayPreferencesContextState => {
    return useContext(DisplayPreferencesContext);
};