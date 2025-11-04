ALTER TABLE buildings ADD COLUMN IF NOT EXISTS date_epc_lower_bound integer NULL;
ALTER TABLE buildings ADD COLUMN IF NOT EXISTS date_epc_upper_bound integer NULL;
ALTER TABLE buildings ADD COLUMN IF NOT EXISTS date_epc_source_type text;
ALTER TABLE buildings ADD COLUMN IF NOT EXISTS date_epc_source_links text[];