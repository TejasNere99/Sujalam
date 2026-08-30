# Official FPO Data Source Documentation

## Source Information
- **Organization**: Small Farmers' Agribusiness Consortium (SFAC) / Ministry of Corporate Affairs (MCA)
- **Official URL**: https://sfacindia.com / https://www.mca.gov.in
- **Dataset Name**: SFAC Promoted FPOs Directory (Maharashtra Region)
- **Data Extracted**: Manually extracted real, registered Farmer Producer Companies.

## Fields Available
- `name` (Official Registered Name)
- `state`
- `district`
- `village` / `city`
- `registration_number` (CIN)

## Fields Unavailable (Left Null)
- `latitude` / `longitude` (Official registry does not provide exact GIS coordinates)
- `phone` / `email` (Often redacted or outdated in public portals)
- `member_count` (Dynamic, not statically published)
- `services` (Requires individual FPO portal verification)

## Extraction Rules
- Missing fields are strictly set to `null` or `undefined`.
- Coordinates are NOT guessed or blindly geocoded.
- "Verified" is set to `true` for these officially incorporated entities.
