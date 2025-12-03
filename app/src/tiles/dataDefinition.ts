import { strictParseInt } from "../parse";

import { DataConfig } from "./types";

const LAYER_QUERIES = {
    base_light: `
        SELECT
            geometry_id
        FROM
            buildings`,
    base_night: `
        SELECT
            geometry_id
        FROM
            buildings`,
    base_night_outlines: `
        SELECT
            geometry_id
        FROM
            buildings`,
    base_boroughs: `
        SELECT
            geometry_id,
            name
        FROM
            external_data_borough_boundary`,
    base_region_labels: `
        SELECT
            geometry_id,
            prominence,
            name
        FROM
            external_data_regional_labels`,
    number_labels:`
        SELECT
            geometry_id,
            location_number
        FROM
            buildings`,
    highlight: `
        SELECT
            geometry_id
        FROM
            buildings
        WHERE building_id = !@highlight!`,
    date_year: `
        SELECT
            geometry_id,
            date_year
        FROM
            buildings
        WHERE date_year IS NOT NULL`,
    age_epc_estimated: `
        SELECT
            geometry_id,
            (date_epc_lower_bound + date_epc_upper_bound)/2 AS epc_year_estimated
        FROM
            buildings
        WHERE date_epc_lower_bound IS NOT NULL AND date_epc_upper_bound IS NOT NULL`,
    date_year_completed: `
        SELECT
            geometry_id,
            date_year_completed
        FROM
            buildings
        WHERE date_year_completed IS NOT NULL`,
    cladding_year: `
        SELECT
            geometry_id,
            age_cladding_date::smallint AS date_year
        FROM
            buildings
        WHERE age_cladding_date IS NOT NULL`,
    extension_year: `
        SELECT
            geometry_id,
            age_extension_date::smallint AS date_year
        FROM
            buildings
        WHERE age_extension_date IS NOT NULL`,
    retrofit_year: `
        SELECT
            geometry_id,
            age_retrofit_date::smallint AS date_year
        FROM
            buildings
        WHERE age_retrofit_date IS NOT NULL`,
    size_storeys: `
        SELECT
            geometry_id,
            (
                coalesce(size_storeys_attic, 0) +
                coalesce(size_storeys_core, 0)
            ) AS size_storeys
        FROM
            buildings
        WHERE
            size_storeys_attic IS NOT NULL OR size_storeys_core IS NOT NULL`,
    size_height: `
        SELECT
            geometry_id,
            size_height_apex AS size_height
        FROM
            buildings
        WHERE
            size_height_apex IS NOT NULL`,
    size_total_floors: `
        SELECT
            geometry_id,
            (size_storeys_core + size_storeys_attic + size_storeys_basement) AS size_total_floors
        FROM
            buildings
        WHERE
            size_storeys_core IS NOT NULL 
            AND
            size_storeys_attic IS NOT NULL 
            AND
            size_storeys_basement IS NOT NULL`,
    size_storeys_basement: `
        SELECT
            geometry_id,
            size_storeys_basement AS size_storeys_basement
        FROM
            buildings
        WHERE
            size_storeys_basement IS NOT NULL
            AND
            size_storeys_basement != 0`,
    size_floor_area_ground: `
        SELECT
            geometry_id,
            size_floor_area_ground AS size_floor_area_ground
        FROM
            buildings
        WHERE
            size_floor_area_ground IS NOT NULL
            AND
            size_floor_area_ground != 0`,
    construction_core_material: `
        SELECT
            geometry_id,
            construction_core_material::text AS construction_core_material
        FROM
            buildings
        WHERE
            construction_core_material IS NOT NULL`,
    construction_structural_system: `
        SELECT
            geometry_id,
            construction_structural_system::text AS construction_structural_system
        FROM
            buildings
        WHERE
            construction_structural_system IS NOT NULL`,
    construction_foundation: `
        SELECT
            geometry_id,
            construction_foundation::text AS construction_foundation
        FROM
            buildings
        WHERE
            construction_foundation IS NOT NULL`,
    construction_roof_shape: `
        SELECT
            geometry_id,
            construction_roof_shape::text AS construction_roof_shape
        FROM
            buildings
        WHERE
            construction_roof_shape IS NOT NULL`,
    construction_roof_covering: `
        SELECT
            geometry_id,
            construction_roof_covering::text AS construction_roof_covering
        FROM
            buildings
        WHERE
            construction_roof_covering IS NOT NULL`,
    construction_material_window_frame: `
        SELECT
            geometry_id,
            construction_material_window_frame
        FROM
            buildings
        WHERE
            construction_material_window_frame IS NOT NULL`,
    location: `
        SELECT blds_with_data.* 
        FROM (
            SELECT
                    geometry_id,
                    (
                        case when location_name IS NULL then 0 else 1 end +
                        case when location_number IS NULL then 0 else 1 end +
                        case when location_street IS NULL then 0 else 1 end +
                        case when location_line_two IS NULL then 0 else 1 end +
                        case when location_town IS NULL then 0 else 1 end +
                        case when location_postcode IS NULL then 0 else 1 end +
                        case when location_latitude IS NULL then 0 else 1 end +
                        case when location_longitude IS NULL then 0 else 1 end +
                        case when ref_toid IS NULL then 0 else 1 end +
                        case when ref_osm_id IS NULL then 0 else 1 end
                    ) AS location_info_count
                FROM
                    buildings
            ) AS blds_with_data
        WHERE blds_with_data.location_info_count > 0`,
    building_footprint_issues: `
        SELECT blds_with_data.* 
            FROM (
                SELECT 
                    geometry_id,
                    CASE
                        WHEN building_footprint_issues IS NULL OR array_length(building_footprint_issues, 1) = 0 THEN NULL
                        ELSE building_footprint_issues[1]
                    END AS building_footprint_issues
                FROM buildings
                WHERE
                    building_footprint_issues IS NOT NULL
            ) AS blds_with_data`,
    team: `
        SELECT blds_with_data.* 
        FROM (
            SELECT
                    geometry_id,
                    (
                        case when has_extension IS NULL then 0 else 1 end +
                        case when extension_year IS NULL then 0 else 1 end +
                        case when developer_type IS NULL then 0 else 1 end +
                        case when developer_name IS NULL then 0 else 1 end +
                        case when developer_source_link IS NULL then 0 else 1 end +
                        case when designers IS NULL then 0 else 1 end +
                        case when designers_source_link IS NULL then 0 else 1 end +
                        case when lead_designer_type IS NULL then 0 else 1 end +
                        case when designer_awards IS NULL then 0 else 1 end +
                        case when awards_source_link IS NULL then 0 else 1 end +
                        case when builder IS NULL then 0 else 1 end +
                        case when builder_source_link IS NULL then 0 else 1 end +
                        case when other_team IS NULL then 0 else 1 end +
                        case when other_team_source_link IS NULL then 0 else 1 end +
                        case when date_year IS NULL then 0 else 1 end
                    ) AS team_info_count
                FROM
                    buildings
            ) AS blds_with_data
        WHERE blds_with_data.team_info_count > 0`,
    is_domestic: `
        SELECT
            geometry_id,
            is_domestic
        FROM
            buildings
        WHERE
            is_domestic IS NOT NULL`,
    survival_status: `
        SELECT
            geometry_id,
            survival_status
        FROM
            buildings
        WHERE
        survival_status IS NOT NULL`,
    survival_source: `
        SELECT
            geometry_id,
            survival_source
        FROM
            buildings
        WHERE
        survival_source IS NOT NULL`,
    likes: `
        SELECT
            geometry_id,
            likes_total AS likes
        FROM
            buildings
        WHERE
            is_domestic <> 'yes'
            AND
            likes_total > 0`,
    typology_likes: `
        SELECT
            geometry_id,
            community_type_worth_keeping_total AS likes
        FROM
            buildings
        WHERE
            community_type_worth_keeping_total > 0`,
    community_local_significance_total: `
        SELECT
            geometry_id,
            community_local_significance_total
        FROM
            buildings
        WHERE
            community_local_significance_total > 0
    `,
    community_building_hominess_count: `
        SELECT
            geometry_id,
            community_building_hominess_count
        FROM
            buildings
        WHERE
            community_building_hominess_count > 0
    `,
    community_building_coherence_count: `
        SELECT
            geometry_id,
            community_building_coherence_count
        FROM
            buildings
        WHERE
            community_building_coherence_count > 0
    `,
    community_building_fascination_count: `
        SELECT
            geometry_id,
            community_building_fascination_count
        FROM
            buildings
        WHERE
            community_building_fascination_count > 0
    `,
    community_streetscape_hominess_count: `
        SELECT
            geometry_id,
            community_streetscape_hominess_count
        FROM
            buildings
        WHERE
            community_streetscape_hominess_count > 0
    `,
    community_streetscape_coherence_count: `
        SELECT
            geometry_id,
            community_streetscape_coherence_count
        FROM
            buildings
        WHERE
            community_streetscape_coherence_count > 0
    `,
    community_streetscape_fascination_count: `
        SELECT
            geometry_id,
            community_streetscape_fascination_count
        FROM
            buildings
        WHERE
            community_streetscape_fascination_count > 0
    `,
    community_building_hominess_avg: `
        SELECT
            geometry_id,
            community_building_hominess_avg
        FROM
            buildings
        WHERE
            community_building_hominess_avg > 0
    `,
    community_building_coherence_avg: `
        SELECT
            geometry_id,
            community_building_coherence_avg
        FROM
            buildings
        WHERE
            community_building_coherence_avg > 0
    `,
    community_building_fascination_avg: `
        SELECT
            geometry_id,
            community_building_fascination_avg
        FROM
            buildings
        WHERE
            community_building_fascination_avg > 0
    `,
    community_building_neuroaesthetic_avg: `
        SELECT
            geometry_id,
            (community_building_hominess_avg +
            community_building_coherence_avg +
            community_building_fascination_avg) / 3 as community_building_neuroaesthetic_avg
        FROM
            buildings
        WHERE
            community_building_hominess_avg > 0 AND
            community_building_coherence_avg > 0 AND
            community_building_fascination_avg > 0

    `,
    community_streetscape_hominess_avg: `
        SELECT
            geometry_id,
            community_streetscape_hominess_avg
        FROM
            buildings
        WHERE
            community_streetscape_hominess_avg > 0
    `,
    community_streetscape_coherence_avg: `
        SELECT
            geometry_id,
            community_streetscape_coherence_avg
        FROM
            buildings
        WHERE
            community_streetscape_coherence_avg > 0
    `,
    community_streetscape_fascination_avg: `
        SELECT
            geometry_id,
            community_streetscape_fascination_avg
        FROM
            buildings
        WHERE
            community_streetscape_fascination_avg > 0
    `,
    community_streetscape_neuroaesthetic_avg: `
        SELECT
            geometry_id,
            (community_streetscape_hominess_avg +
            community_streetscape_coherence_avg +
            community_streetscape_fascination_avg) / 3 as community_streetscape_neuroaesthetic_avg
        FROM
            buildings
        WHERE
            community_streetscape_hominess_avg > 0 AND
            community_streetscape_coherence_avg > 0 AND
            community_streetscape_fascination_avg > 0

    `,
    community_expected_planning_application_total: `
        SELECT
            geometry_id,
            community_expected_planning_application_total
        FROM
            buildings
        WHERE
        community_expected_planning_application_total > 0
    `,
    community_in_public_ownership: `
        SELECT
            geometry_id,
            CASE
                WHEN community_public_ownership = 'Not in public/community ownership' THEN false
                ELSE true
            END AS in_public_ownership
        FROM
            buildings
        WHERE
            community_public_ownership IS NOT NULL
    `,
    planning_applications_status_all: `SELECT 
        buildings.geometry_id, building_properties.uprn, building_properties.building_id, planning_data.status AS status, planning_data.uprn
        FROM building_properties
        INNER JOIN planning_data ON building_properties.uprn = planning_data.uprn
        INNER JOIN buildings ON building_properties.building_id = buildings.building_id`,
    planning_applications_status_recent: `SELECT 
        buildings.geometry_id, building_properties.uprn, building_properties.building_id, planning_data.status AS status, planning_data.uprn, 
        planning_data.days_since_decision_date_cached AS days_since_decision_date,
        planning_data.days_since_registration_cached AS days_since_registered_with_local_authority_date
        FROM building_properties
        INNER JOIN planning_data ON building_properties.uprn = planning_data.uprn
        INNER JOIN buildings ON building_properties.building_id = buildings.building_id`,
    planning_applications_status_very_recent: `SELECT 
        buildings.geometry_id, building_properties.uprn, building_properties.building_id, planning_data.status AS status, planning_data.uprn, 
        planning_data.days_since_decision_date_cached AS days_since_decision_date,
        planning_data.days_since_registration_cached AS days_since_registered_with_local_authority_date
        FROM building_properties
        INNER JOIN planning_data ON building_properties.uprn = planning_data.uprn
        INNER JOIN buildings ON building_properties.building_id = buildings.building_id`,
    planning_combined: `
        SELECT
            geometry_id,
            (
                CASE
                    WHEN planning_list_grade = 'I' THEN 'Grade I Listed'
                    WHEN planning_list_grade = 'II*' THEN 'Grade II* Listed'
                    WHEN planning_list_grade = 'II' THEN 'Grade II Listed'
                    WHEN planning_local_list_url <> '' THEN 'Locally Listed'
                    WHEN planning_heritage_at_risk_url <> '' THEN 'Heritage at Risk'
                    WHEN planning_world_list_id IS NOT NULL THEN 'In World Heritage Site'
                    WHEN planning_in_apa_url <> '' THEN 'In Archaeological Priority Area'
                    ELSE 'None'
                END
            ) AS listing_type,
            planning_in_conservation_area_url <> '' AS planning_in_conservation_area
        FROM buildings
        WHERE
            planning_list_grade IS NOT NULL
            OR planning_in_conservation_area_url <> ''
            OR planning_local_list_url <> ''
            OR planning_world_list_id IS NOT NULL
            OR planning_heritage_at_risk_url <> ''
            OR planning_in_apa_url <> ''
            `,
    team_known_designer: `
            SELECT
                geometry_id,
                (
                    CASE
                        WHEN array_length(designers,1) > 0 THEN true
                        WHEN array_length(designers_links,1) > 0 THEN true
                        ELSE false
                    END
                ) AS team_known_designer
            FROM buildings
            WHERE
                designers IS NOT NULL
                OR designers IS NOT NULL
                `,
    conservation_area: `
        SELECT
            geometry_id
        FROM
            buildings
        WHERE
            planning_in_conservation_area_url = true`,
    sust_dec: `
        SELECT
            geometry_id,
            sust_dec::text AS sust_dec
        FROM
            buildings
        WHERE
            sust_dec IS NOT NULL`,
    building_attachment_form: `
        SELECT
            geometry_id,
            building_attachment_form::text AS building_attachment_form
        FROM
            buildings
        WHERE
            building_attachment_form IS NOT NULL`,
    landuse: `
        SELECT
            geometry_id,
            current_landuse_order,
            current_landuse_group[1] as current_landuse_group,
            current_landuse_verified
        FROM
            buildings
        WHERE
            current_landuse_order IS NOT NULL`,
    landuse_scat: `
    SELECT
        geometry_id,
        current_landuse_order_scat,
        current_landuse_group_scat[1] AS current_landuse_group_scat,
        (current_landuse_order_scat IS NULL AND current_landuse_order IS NOT NULL AND current_landuse_group[1] <> 'Vacant' AND current_landuse_group[1] <> 'Unclassified, presumed non-residential') AS missing_data
    FROM
        buildings
    WHERE
        current_landuse_order_scat IS NOT NULL OR current_landuse_order IS NOT NULL`,
    landuse_scat_residential: `
    SELECT
        geometry_id,
        'Residential' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Dwelling/Single-family home' = ANY(current_landuse_group_scat)
        OR
        'Dwelling/Building with multiple flats' = ANY(current_landuse_group_scat)
        OR
        'Residential Institutions' = ANY(current_landuse_group_scat)
        OR
        'Residential Garden Buildings' = ANY(current_landuse_group_scat)`,
    landuse_scat_places_of_worship: `
    SELECT
        geometry_id,
        'Places of Worship' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Abbeys' = ANY(current_landuse_group_scat)
        OR
        'Cathedrals' = ANY(current_landuse_group_scat)
        OR
        'Chapels' = ANY(current_landuse_group_scat)
        OR
        'Churches' = ANY(current_landuse_group_scat)
        OR
        'Dargahs' = ANY(current_landuse_group_scat)
        OR
        'Gurdwaras' = ANY(current_landuse_group_scat)
        OR
        'Halls' = ANY(current_landuse_group_scat)
        OR
        'Mandirs' = ANY(current_landuse_group_scat)
        OR
        'Mausolea/Large Tombs' = ANY(current_landuse_group_scat)
        OR
        'Meeting Houses' = ANY(current_landuse_group_scat)
        OR
        'Monasteries' = ANY(current_landuse_group_scat)
        OR
        'Mosques' = ANY(current_landuse_group_scat)
        OR
        'Synagogues' = ANY(current_landuse_group_scat)
        OR
        'Temples' = ANY(current_landuse_group_scat)
        OR
        'Other Spiritual Sites' = ANY(current_landuse_group_scat)`,
    landuse_scat_accomodation_and_food: `
    SELECT
        geometry_id,
        'Accommodation & Food' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Beach Huts' = ANY(current_landuse_group_scat)
        OR
        'Caravan Parks (Leisure) (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Caravan Sites and Pitches (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Chalet Parks (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Inns' = ANY(current_landuse_group_scat)
        OR
        'Country House Hotels' = ANY(current_landuse_group_scat)
        OR
        'Drive-In Restaurants' = ANY(current_landuse_group_scat)
        OR
        'Drive-Thru Restaurants' = ANY(current_landuse_group_scat)
        OR
        'Food Courts' = ANY(current_landuse_group_scat)
        OR
        'Guest & Boarding Houses' = ANY(current_landuse_group_scat)
        OR
        'Traveller Sites' = ANY(current_landuse_group_scat)
        OR
        'Holiday Centres' = ANY(current_landuse_group_scat)
        OR
        'Holiday Homes (Self Catering)' = ANY(current_landuse_group_scat)
        OR
        'Hostels' = ANY(current_landuse_group_scat)
        OR
        'Hotels (3 Star And Under)' = ANY(current_landuse_group_scat)
        OR
        'Hotels (4 Star & Above) & Major Chain Operated ( includes 3* & above consortium hotels)' = ANY(current_landuse_group_scat)
        OR
        'Lodges (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Public Houses/Pub Restaurants (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Public Houses/Pub Restaurants (Inc. Lodge) (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Restaurants' = ANY(current_landuse_group_scat)
        OR
        'Roadside Restaurants (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Timeshare Complexes (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Wine Bars' = ANY(current_landuse_group_scat)
        OR
        'Cafes' = ANY(current_landuse_group_scat)
        OR
        'Takeaway Food Outlet (Predominantly Off Premises)' = ANY(current_landuse_group_scat)
        OR
        'Cafes/Restaurants Within/Part of Specialist Property' = ANY(current_landuse_group_scat)
        OR
        'Restaurant With Letting Accomodation' = ANY(current_landuse_group_scat)
        OR
        'Cafe/Restaurants Within/Part of NonSpecialist Properties' = ANY(current_landuse_group_scat)
        OR
        'Serviced Appartments' = ANY(current_landuse_group_scat)
        OR
        'Holiday Home Self Catering (Complexs)' = ANY(current_landuse_group_scat)`,
    landuse_scat_agriculture_forestry_and_fishing: `
    SELECT
        geometry_id,
        'Agriculture, Forestry & Fishing' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Baling Plants' = ANY(current_landuse_group_scat)
        OR
        'Cattle Breeding Centres' = ANY(current_landuse_group_scat)
        OR
        'Fish Farms' = ANY(current_landuse_group_scat)
        OR
        'Game Farms' = ANY(current_landuse_group_scat)
        OR
        'Hatcheries/Poultry Farms' = ANY(current_landuse_group_scat)
        OR
        'Stables and Loose Boxes' = ANY(current_landuse_group_scat)
        OR
        'Stud Farms' = ANY(current_landuse_group_scat)
        OR
        'Vineyards/Wineries' = ANY(current_landuse_group_scat)
        OR
        'Plant Nurseries' = ANY(current_landuse_group_scat)`,
    landuse_scat_arts_sport_and_recreation: `
    SELECT
        geometry_id,
        'Arts, Sport & Recreation' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Amusement Arcades' = ANY(current_landuse_group_scat)
        OR
        'Amusement Parks' = ANY(current_landuse_group_scat)
        OR
        'Arenas' = ANY(current_landuse_group_scat)
        OR
        'Betting Offices' = ANY(current_landuse_group_scat)
        OR
        'Bingo Halls (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Bird Sanctuaries' = ANY(current_landuse_group_scat)
        OR
        'Bowling Alleys' = ANY(current_landuse_group_scat)
        OR
        'Bowling Centres (Indoor)' = ANY(current_landuse_group_scat)
        OR
        'Bowling Greens (Outdoor)' = ANY(current_landuse_group_scat)
        OR
        'Casinos and Gambling Clubs' = ANY(current_landuse_group_scat)
        OR
        'Clubhouses' = ANY(current_landuse_group_scat)
        OR
        'Licensed Sports, Social & Private Members Clubs' = ANY(current_landuse_group_scat)
        OR
        'Concert Halls (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Cricket Centres' = ANY(current_landuse_group_scat)
        OR
        'Cricket Grounds (County)' = ANY(current_landuse_group_scat)
        OR
        'Cricket Grounds/Pitches (Non- County)' = ANY(current_landuse_group_scat)
        OR
        'Football Grounds' = ANY(current_landuse_group_scat)
        OR
        'Football Pitches' = ANY(current_landuse_group_scat)
        OR
        'Football Stadia' = ANY(current_landuse_group_scat)
        OR
        'Go Kart Rinks' = ANY(current_landuse_group_scat)
        OR
        'Golf Courses' = ANY(current_landuse_group_scat)
        OR
        'Golf Driving Ranges' = ANY(current_landuse_group_scat)
        OR
        'Greyhound Racetracks' = ANY(current_landuse_group_scat)
        OR
        'Horse Racecourses' = ANY(current_landuse_group_scat)
        OR
        'Ice Rinks' = ANY(current_landuse_group_scat)
        OR
        'Lakes With Water Sport Facilities' = ANY(current_landuse_group_scat)
        OR
        'Libraries' = ANY(current_landuse_group_scat)
        OR
        'Model Villages' = ANY(current_landuse_group_scat)
        OR
        'Motor Racetracks' = ANY(current_landuse_group_scat)
        OR
        'Museums and Art Galleries (Contractors)' = ANY(current_landuse_group_scat)
        OR
        'Museums and Art Galleries (NonContractors)' = ANY(current_landuse_group_scat)
        OR
        'Night Clubs & Discotheques' = ANY(current_landuse_group_scat)
        OR
        'Pavilions' = ANY(current_landuse_group_scat)
        OR
        'Pleasure Piers' = ANY(current_landuse_group_scat)
        OR
        'Point to Point and Eventing Courses' = ANY(current_landuse_group_scat)
        OR
        'Polo Grounds' = ANY(current_landuse_group_scat)
        OR
        'Public Conveniences (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Public Halls' = ANY(current_landuse_group_scat)
        OR
        'Racing Stables (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Rifle and Weapons Ranges' = ANY(current_landuse_group_scat)
        OR
        'Roller Skating Rinks' = ANY(current_landuse_group_scat)
        OR
        'Royal Palaces' = ANY(current_landuse_group_scat)
        OR
        'Rugby League Grounds' = ANY(current_landuse_group_scat)
        OR
        'Rugby Union Grounds' = ANY(current_landuse_group_scat)
        OR
        'Showhouses (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Ski Centres' = ANY(current_landuse_group_scat)
        OR
        'Snooker Halls/Clubs' = ANY(current_landuse_group_scat)
        OR
        'Speedway Racetracks' = ANY(current_landuse_group_scat)
        OR
        'Sporting Rights' = ANY(current_landuse_group_scat)
        OR
        'Sports & Leisure Centres (LA) (Dry Only) (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Sports & Leisure Centres (LA) (Wet & Dry) (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Sports & Leisure Centres (Private)(Dry Only)' = ANY(current_landuse_group_scat)
        OR
        'Sports & Leisure Centres (Private)(Wet & Dry)' = ANY(current_landuse_group_scat)
        OR
        'Sports Grounds' = ANY(current_landuse_group_scat)
        OR
        'Sports Stadia' = ANY(current_landuse_group_scat)
        OR
        'Squash Courts' = ANY(current_landuse_group_scat)
        OR
        'Stately Homes & Historic Houses (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Swimming Pools (Local Authority)' = ANY(current_landuse_group_scat)
        OR
        'Swimming Pools (Private)' = ANY(current_landuse_group_scat)
        OR
        'Tennis Centres' = ANY(current_landuse_group_scat)
        OR
        'Tennis Courts/Clubs' = ANY(current_landuse_group_scat)
        OR
        'Theatres (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Theme Parks' = ANY(current_landuse_group_scat)
        OR
        'Totalisators On Horse Racecourses' = ANY(current_landuse_group_scat)
        OR
        'Tourist Attractions/Dark Rides' = ANY(current_landuse_group_scat)
        OR
        'War Games Courses/Misc Ag. Use' = ANY(current_landuse_group_scat)
        OR
        'Zoos & Safari Parks' = ANY(current_landuse_group_scat)
        OR
        'Aquaria' = ANY(current_landuse_group_scat)
        OR
        'Archives' = ANY(current_landuse_group_scat)
        OR
        'Changing Rooms' = ANY(current_landuse_group_scat)
        OR
        'Gymnasia/Fitness Suites' = ANY(current_landuse_group_scat)
        OR
        'Miniature Railways' = ANY(current_landuse_group_scat)
        OR
        'Pitch and Putt/Putting Greens' = ANY(current_landuse_group_scat)
        OR
        'Gymnasia/Fitness Suites Within/Part of Specialist Property' = ANY(current_landuse_group_scat)
        OR
        'Sports & Leisure Centres Within/Part of Specialist Property' = ANY(current_landuse_group_scat)
        OR
        'Football Training Grounds' = ANY(current_landuse_group_scat)
        OR
        'Historic Property (National Trust/English Heritage)' = ANY(current_landuse_group_scat)
        OR
        'Soccer Centres' = ANY(current_landuse_group_scat)
        OR
        'Leisure Miscellaneous' = ANY(current_landuse_group_scat)`,
    landuse_scat_education: `
    SELECT
        geometry_id,
        'Education' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Colleges of Further Education (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Dance Schools & Centres' = ANY(current_landuse_group_scat)
        OR
        'Day Nurseries/Play Schools' = ANY(current_landuse_group_scat)
        OR
        'Field Study, Activity and Adventure Centres' = ANY(current_landuse_group_scat)
        OR
        'Local Authority Schools (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Oxbridge Colleges' = ANY(current_landuse_group_scat)
        OR
        'Public and Independent Schools (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Riding Schools & Livery Stables (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Training Centre (Non Residential)' = ANY(current_landuse_group_scat)
        OR
        'Training Centre (Residential)' = ANY(current_landuse_group_scat)
        OR
        'Universities (Excluding Oxbridge) (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Police Training Colleges' = ANY(current_landuse_group_scat)
        OR
        'University - Ancillary Land or Buildings' = ANY(current_landuse_group_scat)
        OR
        'University Occupation Within Hospitals' = ANY(current_landuse_group_scat)
        OR
        'Nurseries/Creches Within/Part of Specialist Property' = ANY(current_landuse_group_scat)
        OR
        'Educational Miscellaneous' = ANY(current_landuse_group_scat)`,
    landuse_scat_health: `
    SELECT
        geometry_id,
        'Health' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Community Day Centres' = ANY(current_landuse_group_scat)
        OR
        'Health Farms' = ANY(current_landuse_group_scat)
        OR
        'Hospitals & Clinics NHS (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Hospitals & Clinics (Private) (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Nursing Homes (Inc. Old Peoples Homes)' = ANY(current_landuse_group_scat)
        OR
        'Surgeries, Clinics, Health Centre (incl Dentists etc)' = ANY(current_landuse_group_scat)
        OR
        'Surgeries, Clinics, Health Centres (Contractors Valuation)' = ANY(current_landuse_group_scat)
        OR
        'Surgeries, Clinics, Health Centres (Rental Valuation)' = ANY(current_landuse_group_scat)
        OR
        'Secure Childrens Homes' = ANY(current_landuse_group_scat)
        OR
        'NHS Clinics & Health Centres (Contractors)' = ANY(current_landuse_group_scat)
        OR
        'NHS Clinics & Health Centres (Rentals)' = ANY(current_landuse_group_scat)
        OR
        'Surgeries (Other Than GP/NHS) (Contractors)' = ANY(current_landuse_group_scat)
        OR
        'Surgeries (Other Than GP/NHS) (Rentals)' = ANY(current_landuse_group_scat)
        OR
        'GP Surgeries (Contractors)' = ANY(current_landuse_group_scat)
        OR
        'GP Surgeries (Rentals)' = ANY(current_landuse_group_scat)`,
    landuse_scat_industry_and_business: `
    SELECT
        geometry_id,
        'Industry & Business' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Aircraft Works With Airfields' = ANY(current_landuse_group_scat)
        OR
        'Aluminum Smelting Works' = ANY(current_landuse_group_scat)
        OR
        'Artificial Fibre Works' = ANY(current_landuse_group_scat)
        OR
        'Asphalt Plants' = ANY(current_landuse_group_scat)
        OR
        'ATMs' = ANY(current_landuse_group_scat)
        OR
        'Banks/Insurance/Building Society Offices & Other A2 Uses' = ANY(current_landuse_group_scat)
        OR
        'Beet Sugar Factories' = ANY(current_landuse_group_scat)
        OR
        'Boat Yards' = ANY(current_landuse_group_scat)
        OR
        'Breweries (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Brickworks (Traditional), Clay Tile/Pipe Works' = ANY(current_landuse_group_scat)
        OR
        'Bullion/Money Stores (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Cement Tile Works' = ANY(current_landuse_group_scat)
        OR
        'Cement Works' = ANY(current_landuse_group_scat)
        OR
        'Chemical Works' = ANY(current_landuse_group_scat)
        OR
        'Coking and Carbonising Plants' = ANY(current_landuse_group_scat)
        OR
        'Concrete Batching Plants' = ANY(current_landuse_group_scat)
        OR
        'Concrete Block Works' = ANY(current_landuse_group_scat)
        OR
        'Concrete Product Works' = ANY(current_landuse_group_scat)
        OR
        'Conference & Exhibition Centres' = ANY(current_landuse_group_scat)
        OR
        'Contractors Huts & Compounds' = ANY(current_landuse_group_scat)
        OR
        'Creameries' = ANY(current_landuse_group_scat)
        OR
        'Distilleries' = ANY(current_landuse_group_scat)
        OR
        'Factories, Workshops and Warehouses (Incl Bakeries & Dairies)' = ANY(current_landuse_group_scat)
        OR
        'Flour Mills (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Food Processing Centres' = ANY(current_landuse_group_scat)
        OR
        'Hospital Let Outs' = ANY(current_landuse_group_scat)
        OR
        'Iron and/or Steel Works' = ANY(current_landuse_group_scat)
        OR
        'Maltings - Non Trad' = ANY(current_landuse_group_scat)
        OR
        'Maltings - Trad' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Heredtament With Tunnel Kiln' = ANY(current_landuse_group_scat)
        OR
        'Motor Vehicle Works' = ANY(current_landuse_group_scat)
        OR
        'Newspaper Printing Works (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Nuclear Establishments' = ANY(current_landuse_group_scat)
        OR
        'Oil Refineries' = ANY(current_landuse_group_scat)
        OR
        'Paper Mills' = ANY(current_landuse_group_scat)
        OR
        'Potteries' = ANY(current_landuse_group_scat)
        OR
        'Provender Mills (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Scrap Metal/Breakers Yard' = ANY(current_landuse_group_scat)
        OR
        'Sea Dredged Aggregate Processing Plants & Depots' = ANY(current_landuse_group_scat)
        OR
        'Ship Building Yards' = ANY(current_landuse_group_scat)
        OR
        'Ship Repair Yards' = ANY(current_landuse_group_scat)
        OR
        'Station Let Outs' = ANY(current_landuse_group_scat)
        OR
        'Tanneries' = ANY(current_landuse_group_scat)
        OR
        'Wafer Fabrications (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Abattoirs & Slaughter Houses (Contractors Valuation)' = ANY(current_landuse_group_scat)
        OR
        'Abattoirs & Slaughter Houses (Rental Valuation)' = ANY(current_landuse_group_scat)
        OR
        'Business Units' = ANY(current_landuse_group_scat)
        OR
        'Information/Visitor Centres' = ANY(current_landuse_group_scat)
        OR
        'Pack Houses' = ANY(current_landuse_group_scat)
        OR
        'Sales Offices' = ANY(current_landuse_group_scat)
        OR
        'Offices Within/Part of Specialist Property' = ANY(current_landuse_group_scat)
        OR
        'Workshops Within/Part of Specialist Property' = ANY(current_landuse_group_scat)
        OR
        'Serviced Offices' = ANY(current_landuse_group_scat)
        OR
        'Bagging Plant & Premises' = ANY(current_landuse_group_scat)
        OR
        'Builders Merchant' = ANY(current_landuse_group_scat)
        OR
        'Industrial Miscellaneous' = ANY(current_landuse_group_scat)`,
    landuse_scat_mining_and_quarrying: `
    SELECT
        geometry_id,
        'Mining & Quarrying' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Heredits Used For Primary Treatment/Processing Of Minerals' = ANY(current_landuse_group_scat)
        OR
        'Mineral Depot and Premises' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Blockstone' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Brine' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Chalk' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - China Clay' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Clay' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Coal' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Fluorspar' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Gas' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Hardrock' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Inert' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Oil' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Other Mineral Category' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Putrescible' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Sand and Gravel' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Sand' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Shale Unburnt' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament - Slate' = ANY(current_landuse_group_scat)
        OR
        'Mineral Producing Hereditament With Batching Plant' = ANY(current_landuse_group_scat)
        OR
        'Spoil Heap Workings' = ANY(current_landuse_group_scat)
        OR
        'Peat Fields' = ANY(current_landuse_group_scat)
        OR
        'Pumping Mines' = ANY(current_landuse_group_scat)
        OR
        'Minerals Miscellaneous' = ANY(current_landuse_group_scat)`,
    landuse_scat_other: `
    SELECT
        geometry_id,
        'Other' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'AA/RAC Service Centres and Boxes' = ANY(current_landuse_group_scat)
        OR
        'Car Washes (Stand Alone)' = ANY(current_landuse_group_scat)
        OR
        'Cemeteries (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Wedding & Function Venues' = ANY(current_landuse_group_scat)
        OR
        'Crematoria (With & Without Cemeteries) (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Exhaust and Tyre Centres' = ANY(current_landuse_group_scat)
        OR
        'Funeral Parlours/Chapels Of Rest' = ANY(current_landuse_group_scat)
        OR
        'Mortuaries' = ANY(current_landuse_group_scat)
        OR
        'Studios' = ANY(current_landuse_group_scat)
        OR
        'Vehicle Repair Workshops & Garages' = ANY(current_landuse_group_scat)
        OR
        'Village Halls, Scout Huts, Cadet Huts Etc' = ANY(current_landuse_group_scat)
        OR
        'Hairdressing/Beauty Salons' = ANY(current_landuse_group_scat)
        OR
        'Pet Grooming Parlours' = ANY(current_landuse_group_scat)
        OR
        'Religious Retreats/Study Centres (Residential)' = ANY(current_landuse_group_scat)
        OR
        'Salons/Clinics Within/Part of Specialist Property' = ANY(current_landuse_group_scat)
        OR
        'Car Washes (Stand Alone - Hand Car Wash)' = ANY(current_landuse_group_scat)
        OR
        'Wedding and Function Venue' = ANY(current_landuse_group_scat)
        OR
        'Miscellaneous' = ANY(current_landuse_group_scat)`,
    landuse_scat_professional_scientific_and_technical_activities: `
    SELECT
        geometry_id,
        'Professional, Scientific & Technical activities' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Advertising Right' = ANY(current_landuse_group_scat)
        OR
        'Animal Boarding' = ANY(current_landuse_group_scat)
        OR
        'Kennels and Catteries' = ANY(current_landuse_group_scat)
        OR
        'Laboratories' = ANY(current_landuse_group_scat)
        OR
        'Land Used For Advertising' = ANY(current_landuse_group_scat)
        OR
        'Observatories' = ANY(current_landuse_group_scat)
        OR
        'Offices (Inc Computer Centres)' = ANY(current_landuse_group_scat)
        OR
        'Offices (Headquarters/Institutional)' = ANY(current_landuse_group_scat)
        OR
        'Photographic Booths' = ANY(current_landuse_group_scat)
        OR
        'Vehicle Testing Centres (With Test Tracks)' = ANY(current_landuse_group_scat)
        OR
        'Vehicle Testing Centres (Without Test Tracks)' = ANY(current_landuse_group_scat)
        OR
        'Veterinary Clinics / Animal Clinics' = ANY(current_landuse_group_scat)
        OR
        'Agricultural Research Centres' = ANY(current_landuse_group_scat)
        OR
        'Land Used for Display' = ANY(current_landuse_group_scat)
        OR
        'Telescope Sites' = ANY(current_landuse_group_scat)
        OR
        'Sponsored Roundabout Advertising Displays' = ANY(current_landuse_group_scat)
        OR
        'Driving Standards Agency Centre' = ANY(current_landuse_group_scat)
        OR
        'Advertising Displays On Pavements & Bus Shelters' = ANY(current_landuse_group_scat)
        OR
        'Advertising Displays At Superstores' = ANY(current_landuse_group_scat)
        OR
        'Advertising Displays From Phone Booths' = ANY(current_landuse_group_scat)
        OR
        'Advertising Displays From Agricultural Land' = ANY(current_landuse_group_scat)
        OR
        'Equestrian Hospitals' = ANY(current_landuse_group_scat)`,
    landuse_scat_public_administration_defence_and_security: `
    SELECT
        geometry_id,
        'Public Admin, Defence & Security' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Ambulance Stations' = ANY(current_landuse_group_scat)
        OR
        'Army Hereditaments' = ANY(current_landuse_group_scat)
        OR
        'Civic and Public Buildings (Local Authority Occupations)' = ANY(current_landuse_group_scat)
        OR
        'Civic Amenity Sites' = ANY(current_landuse_group_scat)
        OR
        'Fire Stations' = ANY(current_landuse_group_scat)
        OR
        'MOD Hereditaments' = ANY(current_landuse_group_scat)
        OR
        'Navy Hereditaments' = ANY(current_landuse_group_scat)
        OR
        'Police Stations' = ANY(current_landuse_group_scat)
        OR
        'Prison Service Hereditaments' = ANY(current_landuse_group_scat)
        OR
        'RAF Hereditaments' = ANY(current_landuse_group_scat)
        OR
        'Coastguard Stations' = ANY(current_landuse_group_scat)
        OR
        'Courts (Contractors Valuation)' = ANY(current_landuse_group_scat)
        OR
        'Courts (Rental Valuation)' = ANY(current_landuse_group_scat)
        OR
        'Lifeboat Stations' = ANY(current_landuse_group_scat)
        OR
        'Crown Miscellaneous' = ANY(current_landuse_group_scat)`,
    landuse_scat_retail: `
    SELECT
        geometry_id,
        'Retail' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Agricultural Showgrounds (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Auction Rooms' = ANY(current_landuse_group_scat)
        OR
        'Car Auction Buildings/Sites' = ANY(current_landuse_group_scat)
        OR
        'Car Showrooms' = ANY(current_landuse_group_scat)
        OR
        'Car Supermarkets' = ANY(current_landuse_group_scat)
        OR
        'Car/Caravan Sales/Display/Hiring Sites' = ANY(current_landuse_group_scat)
        OR
        'Departmental and Walk Round Stores (Large)' = ANY(current_landuse_group_scat)
        OR
        'Factory Shops' = ANY(current_landuse_group_scat)
        OR
        'Farm Shops' = ANY(current_landuse_group_scat)
        OR
        'Convenience Store' = ANY(current_landuse_group_scat)
        OR
        'Garden Centres' = ANY(current_landuse_group_scat)
        OR
        'Hypermarkets/Superstores (over 2500m²)' = ANY(current_landuse_group_scat)
        OR
        'Land Used For Car Boot Sales' = ANY(current_landuse_group_scat)
        OR
        'Large Food Stores (750 - 2500m²)' = ANY(current_landuse_group_scat)
        OR
        'Large Shops (750 - 1850m²)' = ANY(current_landuse_group_scat)
        OR
        'Large Shops (Over 1850m²)' = ANY(current_landuse_group_scat)
        OR
        'Livestock Markets (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Markets (Other Than Livestock)' = ANY(current_landuse_group_scat)
        OR
        'Petrol Filling Stations (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Pharmacies' = ANY(current_landuse_group_scat)
        OR
        'Retail Warehouses and Foodstores' = ANY(current_landuse_group_scat)
        OR
        'Sales Kiosks' = ANY(current_landuse_group_scat)
        OR
        'Shops' = ANY(current_landuse_group_scat)
        OR
        'Showrooms' = ANY(current_landuse_group_scat)
        OR
        'Stores' = ANY(current_landuse_group_scat)
        OR
        'Pharmacies Within/Adjacent to Surgery/Health Centre' = ANY(current_landuse_group_scat)
        OR
        'Pitches for Stalls, Sales or Promotions' = ANY(current_landuse_group_scat)
        OR
        'Kiosks Within/Part of Specialist Property' = ANY(current_landuse_group_scat)
        OR
        'Shops Within/Part of Specialist Property' = ANY(current_landuse_group_scat)
        OR
        'Stores Within/Part of Specialist Property' = ANY(current_landuse_group_scat)
        OR
        'Residual Shopping Mall' = ANY(current_landuse_group_scat)
        OR
        'Land Used For Seasonal Markets & Events' = ANY(current_landuse_group_scat)
        OR
        'Market Stall (Not Pitch)' = ANY(current_landuse_group_scat)
        OR
        'Dark Retailing/Internet Sites' = ANY(current_landuse_group_scat)
        OR
        'Residual Mall' = ANY(current_landuse_group_scat)
        OR
        'LPG Service Station' = ANY(current_landuse_group_scat)
        OR
        'Battery Store' = ANY(current_landuse_group_scat)`,
    landuse_scat_telecommunication_computing_broadcasting_and_publishing: `
    SELECT
        geometry_id,
        'Telecoms., Computing, Broadcasting & Publishing' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Cable Head End Buildings' = ANY(current_landuse_group_scat)
        OR
        'Cinemas (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Communication Stations (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Film and TV Studios' = ANY(current_landuse_group_scat)
        OR
        'Interactive Telephone Kiosks' = ANY(current_landuse_group_scat)
        OR
        'Public Telephone Kiosks (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Recording Studios' = ANY(current_landuse_group_scat)
        OR
        'Telecommunications Cable Networks (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Telecommunications Switching Centres' = ANY(current_landuse_group_scat)
        OR
        'Telecommunications Large Broadcast Sites' = ANY(current_landuse_group_scat)`,
    landuse_scat_transport_and_storage: `
    SELECT
        geometry_id,
        'Transport & Storage' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Air Ports (Minor) (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Air Strips (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Airport Let Outs' = ANY(current_landuse_group_scat)
        OR
        'Bulk Cement Storage Depots' = ANY(current_landuse_group_scat)
        OR
        'Bus Garages' = ANY(current_landuse_group_scat)
        OR
        'Bus Stations' = ANY(current_landuse_group_scat)
        OR
        'Car Parks (Multi-Storey)' = ANY(current_landuse_group_scat)
        OR
        'Car Parks (Surfaced Open)' = ANY(current_landuse_group_scat)
        OR
        'Car Parks (Unsurfaced Open)' = ANY(current_landuse_group_scat)
        OR
        'Car Spaces' = ANY(current_landuse_group_scat)
        OR
        'Civil Airports' = ANY(current_landuse_group_scat)
        OR
        'Cold Stores' = ANY(current_landuse_group_scat)
        OR
        'Docks and Harbours (Non-Statutory)' = ANY(current_landuse_group_scat)
        OR
        'Garages (Transport and Commercial)' = ANY(current_landuse_group_scat)
        OR
        'Grain Silos' = ANY(current_landuse_group_scat)
        OR
        'Granaries and Intervention Stores' = ANY(current_landuse_group_scat)
        OR
        'Heliports' = ANY(current_landuse_group_scat)
        OR
        'Heritage Railways' = ANY(current_landuse_group_scat)
        OR
        'High Tech Warehouses' = ANY(current_landuse_group_scat)
        OR
        'Land Used For Storage' = ANY(current_landuse_group_scat)
        OR
        'Large Distribution Warehouses' = ANY(current_landuse_group_scat)
        OR
        'Liquid Bulk Storage (Incl Petrol & Oil) (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Lorry Parks' = ANY(current_landuse_group_scat)
        OR
        'Marinas (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Moorings (Floating Hereditaments)' = ANY(current_landuse_group_scat)
        OR
        'Motorway Service Area Let Outs' = ANY(current_landuse_group_scat)
        OR
        'Motorway and Major Road Service Areas' = ANY(current_landuse_group_scat)
        OR
        'Pipelines' = ANY(current_landuse_group_scat)
        OR
        'Post Office Sorting Centres' = ANY(current_landuse_group_scat)
        OR
        'Railways & Tramways (Non Leisure)' = ANY(current_landuse_group_scat)
        OR
        'Storage Depots' = ANY(current_landuse_group_scat)
        OR
        'Tolls (Ferries, Roads And Bridges)' = ANY(current_landuse_group_scat)
        OR
        'Truck Stops' = ANY(current_landuse_group_scat)
        OR
        'Wholesale Warehouses' = ANY(current_landuse_group_scat)
        OR
        'Boathouses' = ANY(current_landuse_group_scat)
        OR
        'Bus Garages (Contractors Valuation)' = ANY(current_landuse_group_scat)
        OR
        'Bus Garages (Rental Valuation)' = ANY(current_landuse_group_scat)
        OR
        'Cold Stores (Contractors Valuation)' = ANY(current_landuse_group_scat)
        OR
        'Cold Stores (Rental Valuation)' = ANY(current_landuse_group_scat)
        OR
        'Post Offices' = ANY(current_landuse_group_scat)
        OR
        'Statutory Docks and Harbours (Formula)' = ANY(current_landuse_group_scat)
        OR
        'Statutory Docks and Harbours (Non- Formula, Prescribed)' = ANY(current_landuse_group_scat)
        OR
        'Statutory Docks and Harbours (Other)' = ANY(current_landuse_group_scat)
        OR
        'Weighbridges' = ANY(current_landuse_group_scat)
        OR
        'Car Parking Within/Part of Specialist Property' = ANY(current_landuse_group_scat)
        OR
        'Garages Within/Part of Specialist Property' = ANY(current_landuse_group_scat)
        OR
        'Warehouses Within/Part of Specialist Property' = ANY(current_landuse_group_scat)
        OR
        'Rail Freight Depots' = ANY(current_landuse_group_scat)
        OR
        'Bicycle Folding Box Site' = ANY(current_landuse_group_scat)
        OR
        'Rail Maintenance Depots' = ANY(current_landuse_group_scat)
        OR
        'Delivery Box Site & Premises' = ANY(current_landuse_group_scat)
        OR
        'Electric Charge Stations' = ANY(current_landuse_group_scat)
        OR
        'Self Storage Facility' = ANY(current_landuse_group_scat)
        OR
        'Street Points (eg Cycle Docking Stations)' = ANY(current_landuse_group_scat)
        OR
        'Park & Ride Car Parks' = ANY(current_landuse_group_scat)
        OR
        'Click & Collect Locker Site' = ANY(current_landuse_group_scat)
        OR
        'Ferry Terminal' = ANY(current_landuse_group_scat)`,
    landuse_scat_utilities: `
    SELECT
        geometry_id,
        'Utilities' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'District Heating Undertakings & Networks' = ANY(current_landuse_group_scat)
        OR
        'Domestic Fuel Installations' = ANY(current_landuse_group_scat)
        OR
        'Mine Water Treatment Plant and Premises' = ANY(current_landuse_group_scat)
        OR
        'Electricity Undertakings (Non- Statutory)' = ANY(current_landuse_group_scat)
        OR
        'Gas Processing Plants' = ANY(current_landuse_group_scat)
        OR
        'Landfill Gas Generator Sites' = ANY(current_landuse_group_scat)
        OR
        'Land used for Waste Composting' = ANY(current_landuse_group_scat)
        OR
        'Power Generators' = ANY(current_landuse_group_scat)
        OR
        'Property used for Secondary Aggregate Processing' = ANY(current_landuse_group_scat)
        OR
        'Refuse Destructor Plants/Disposal Sites' = ANY(current_landuse_group_scat)
        OR
        'Sewage Works (National Scheme)' = ANY(current_landuse_group_scat)
        OR
        'Waste Incinerator Plants' = ANY(current_landuse_group_scat)
        OR
        'Waste Recycling Plants' = ANY(current_landuse_group_scat)
        OR
        'Water Undertakings (Non-Statutory)' = ANY(current_landuse_group_scat)
        OR
        'Windmills' = ANY(current_landuse_group_scat)
        OR
        'Waste Anaerobic Digestion Plants' = ANY(current_landuse_group_scat)
        OR
        'Renewable Generators - Mixed Technologies' = ANY(current_landuse_group_scat)
        OR
        'Biomass Biological (Crop & Slurry Based Anaerobic Digestors, Incl Gas to Grid)' = ANY(current_landuse_group_scat)
        OR
        'Biomass Thermal (Incl Combustion, Gasification and Pyrolysis)' = ANY(current_landuse_group_scat)
        OR
        'Independent Gas Transport (IGT)' = ANY(current_landuse_group_scat)
        OR
        'Independent Distribution Network Operators (IDNO)' = ANY(current_landuse_group_scat)
        OR
        'Renewable Power Generators - Photovoltaic' = ANY(current_landuse_group_scat)
        OR
        'Renewable Power Generators – Wind' = ANY(current_landuse_group_scat)
        OR
        'Renewable Power Generators – Other' = ANY(current_landuse_group_scat)
        OR
        'Renewable Power Generators - Hydro' = ANY(current_landuse_group_scat)
        OR
        'Fossil Fuel Power Stations' = ANY(current_landuse_group_scat)
        OR
        'Nuclear Power Stations' = ANY(current_landuse_group_scat)
        OR
        'Underground Gas Storage Facility' = ANY(current_landuse_group_scat)`,
    landuse_scat_mixed_use: `
    SELECT
        geometry_id,
        'Mixed Use' AS current_landuse_order_scat
    FROM
        buildings
    WHERE
        'Mixed Use' = current_landuse_order_scat`,
    planning_classes_display: `
    SELECT
        geometry_id,
        current_landuse_order_scat,
        current_landuse_group_scat[1] AS current_landuse_group_scat
    FROM
        buildings
    WHERE
        current_landuse_order_scat IS NOT NULL OR current_landuse_order IS NOT NULL`,
    isic_level_one_display: `
    SELECT
        geometry_id,
        current_landuse_order_scat,
        current_landuse_group_scat[1] AS current_landuse_group_scat
    FROM
        buildings
    WHERE
        current_landuse_order_scat IS NOT NULL OR current_landuse_order IS NOT NULL`,
    original_landuse: `
        SELECT
            geometry_id,
            typology_original_use_order,
            typology_original_use[1] as typology_original_use,
            typology_original_use_verified
        FROM
            buildings
        WHERE typology_original_use IS NOT NULL`,
    disaster_severity: `
        SELECT
            geometry_id,
            disaster_severity
        FROM
            buildings
        WHERE disaster_severity IS NOT NULL`,
    dynamics_demolished_count: `
        SELECT
            geometry_id,
            jsonb_array_length(demolished_buildings) as demolished_buildings_count,
            dynamics_has_demolished_buildings
        FROM
            buildings
        WHERE jsonb_array_length(demolished_buildings) > 0 OR dynamics_has_demolished_buildings = FALSE`,
    typology_classification: `
        SELECT
            geometry_id,
            typology_classification
        FROM
            buildings
        WHERE typology_classification IS NOT NULL`,
    typology_style_period: `
        SELECT
            geometry_id,
            CASE
                WHEN date_year >= 43 AND date_year < 410 THEN '43AD-410 (Roman)'
                WHEN date_year >= 410 AND date_year < 1485 THEN '410-1485 (Medieval)'
                WHEN date_year >= 1485 AND date_year < 1603 THEN '1485-1603 (Tudor)'
                WHEN date_year >= 1603 AND date_year < 1714 THEN '1603-1714 (Stuart)'
                WHEN date_year >= 1714 AND date_year < 1837 THEN '1714-1837 (Georgian)'
                WHEN date_year >= 1837 AND date_year < 1901 THEN '1837-1901 (Victorian)'
                WHEN date_year >= 1901 AND date_year < 1914 THEN '1901-1914 (Edwardian)'
                WHEN date_year >= 1914 AND date_year <= 1945 THEN '1914-1945 (WWI-WWII)'
                WHEN date_year >= 1946 AND date_year <= 1979 THEN '1946-1979 (Post war)'
                WHEN date_year >= 1980 AND date_year <= 1999 THEN '1980-1999 (Late 20th Century)'
                WHEN date_year >= 2000 AND date_year <= 2025 THEN '2000-2025 (Early 21st Century)'
                WHEN typology_style_period IS NOT NULL THEN  typology_style_period
            END AS typology_style_period
        FROM
            buildings
        WHERE typology_style_period IS NOT NULL OR (date_year >= 43 AND date_year <= 2025)`,
    typology_dynamic_classification: `
        SELECT
            geometry_id,
            typology_dynamic_classification
        FROM
            buildings
        WHERE typology_dynamic_classification IS NOT NULL`,
    context_back_garden: `
        SELECT
            geometry_id,
            context_back_garden
        FROM
            buildings
        WHERE context_back_garden IS NOT NULL`,
    context_street_width: `
        SELECT
            geometry_id,
            context_street_width
        FROM
            buildings
        WHERE context_street_width IS NOT NULL`,
    designer_awards: `
        SELECT
            geometry_id,
            designer_awards
        FROM
            buildings
        WHERE designer_awards IS NOT NULL`,
    energy_solar: `
        SELECT
            geometry_id,
            energy_solar
        FROM
            buildings
        WHERE energy_solar IS NOT NULL`,
    energy_green_roof: `
        SELECT
            geometry_id,
            energy_green_roof
        FROM
            buildings
        WHERE energy_green_roof IS NOT NULL`,
    sust_aggregate_estimate_epc: `
        SELECT
            geometry_id,
            sust_aggregate_estimate_epc::text AS sust_aggregate_estimate_epc
        FROM
            buildings`,
    context_walkability_index: `
        SELECT
            geometry_id,
            context_walkability_index
        FROM
            buildings
        WHERE context_walkability_index IS NOT NULL`,
};

const GEOMETRY_FIELD = 'geometry_geom';

function getBuildingLayerNames() {
    return Object.keys(LAYER_QUERIES);
}

function getAllLayerNames() {
    return ['highlight', ...getBuildingLayerNames()];
}

function getDataConfig(tileset: string): DataConfig {
    const table = LAYER_QUERIES[tileset];

    if(table == undefined) {
        throw new Error('Invalid tileset requested');
    }

    if(tileset == 'base_boroughs') {
        const query = `(
            SELECT
            d.*,
            g.geometry_geom
        FROM (
            ${table}
        ) AS d
        JOIN
            geometries AS g
        ON d.geometry_id = g.geometry_id
        JOIN
            external_data_borough_boundary AS b
        ON d.geometry_id = b.geometry_id
    ) AS data
        `;

        return {
            geometry_field: GEOMETRY_FIELD,
            table: query
        };
    }

    if(tileset == 'base_region_labels') {
        const query = `(
            SELECT
            d.*,
            g.geometry_geom
        FROM (
            ${table}
        ) AS d
        JOIN
            geometries AS g
        ON d.geometry_id = g.geometry_id
        JOIN
            external_data_regional_labels AS b
        ON d.geometry_id = b.geometry_id
    ) AS data
        `;
    
        return {
            geometry_field: GEOMETRY_FIELD,
            table: query
        };    
    }

    const query = `(
        SELECT
            d.*,
            g.geometry_geom
        FROM (
            ${table}
        ) AS d
        JOIN
            geometries AS g
        ON d.geometry_id = g.geometry_id
        JOIN
            buildings AS b
        ON d.geometry_id = b.geometry_id
        WHERE
            b.latest_demolish_date IS NULL
    ) AS data
    `;

    return {
        geometry_field: GEOMETRY_FIELD,
        table: query
    };
}

function getLayerVariables(tileset: string, dataParams: any): object {
    if(tileset == 'highlight') {
        let { highlight, base } = dataParams;

        highlight = strictParseInt(highlight);
        base = base || 'default';

        if(isNaN(highlight) || base.match(/^\w+$/) == undefined) {
            throw new Error('Bad parameters for highlight layer');
        }

        return {
            highlight,
            base_data_layer: base
        };
    }

    return {};
}

export {
    getBuildingLayerNames,
    getAllLayerNames,
    getDataConfig,
    getLayerVariables
};
