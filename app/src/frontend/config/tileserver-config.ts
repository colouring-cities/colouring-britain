/**
 * This file defines all the valid tileset names that can be obtained from the tilserver.
 * Adjust the values here if modifying the list of styles in the tileserver.
 */

export type BuildingMapTileset = 
    'date_year' | 
    'cladding_year' | 
    'extension_year' | 
    'retrofit_year' |
    'age_epc_estimated' |
    'size_height' |
    'size_total_floors' |
    'size_storeys_basement' |
    'size_floor_area_ground' |
    'construction_core_material' |
    'construction_structural_system' |
    'construction_foundation' |
    'construction_roof_shape' |
    'construction_roof_covering' |
    'construction_material_window_frame' |
    'location' |
    "building_footprint_issues" |
    'is_domestic' |
    'likes' |
    'typology_likes' |
    'community_local_significance_total' |
    'community_expected_planning_application_total' |
    'community_in_public_ownership' |
    'community_building_hominess_avg' |
    'community_building_coherence_avg' |
    'community_building_fascination_avg' |
    'community_building_neuroaesthetic_avg' |
    'community_streetscape_hominess_avg' |
    'community_streetscape_coherence_avg' |
    'community_streetscape_fascination_avg' |
    'community_streetscape_neuroaesthetic_avg' |
    'planning_applications_status_all' |
    'planning_applications_status_recent' |
    'planning_applications_status_very_recent' |
    'planning_combined' |
    'sust_dec' |
    'building_attachment_form' |
    'landuse' |
    'landuse_scat' |
    'landuse_scat_residential' |
    'landuse_scat_agriculture_forestry_and_fishing' |
    'landuse_scat_mining_and_quarrying' |
    'landuse_scat_accomodation_and_food' |
    'landuse_scat_transport_and_storage' |
    'landuse_scat_utilities' |
    'landuse_scat_public_administration_defence_and_security' |
    'landuse_scat_retail' |
    'landuse_scat_industry_and_business' |
    'landuse_scat_arts_sport_and_recreation' |
    'landuse_scat_telecommunication_computing_broadcasting_and_publishing' |
    'landuse_scat_education' |
    'landuse_scat_health' |
    'landuse_scat_professional_scientific_and_technical_activities' |
    'landuse_scat_places_of_worship' |
    'landuse_scat_other' |
    'landuse_scat_mixed_use' |
    'planning_classes_display' |
    'isic_level_one_display' |
    'original_landuse' |
    'dynamics_demolished_count' |
    'disaster_severity' |
    'team' |
    'team_known_designer' |
    'survival_status'|
    'typology_classification'|
    'typology_style_period' |
    'typology_dynamic_classification'|
    'context_back_garden'|
    'context_street_width'|
    'context_walkability_index' |
    'designer_awards' |
    'energy_solar' |
    'energy_green_roof' |
    'sust_aggregate_estimate_epc';
    

export type SpecialMapTileset = 'base_light' | 'base_night' | 'base_night_outlines' | 'highlight' | 'number_labels' | 'base_boroughs' | 'base_region_labels';

export type MapTileset = BuildingMapTileset | SpecialMapTileset;
