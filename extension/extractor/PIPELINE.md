# Universal Extraction Pipeline

Car Bucket treats extraction as a layered pipeline rather than a collection of dealer-specific scrapers.

## Order
1. Page classification — vehicle-detail, inventory/search, or unknown.
2. Structured data — Schema.org JSON-LD, Product/Car/Vehicle, Offer.
3. Semantic DOM — labels, itemprop, nearby value relationships.
4. Attributes — data-vin, data-stock, data-price, data-mileage and equivalents.
5. Embedded state — application JSON and VIN-anchored state.
6. Loaded resources — same-origin inventory/API resources already exposed to the page.
7. Fallback — conservative visible-text extraction.

## Record contract
- identity: VIN, stock number, listing ID
- vehicle: year, make, model, trim, body style, drivetrain, engine, transmission
- condition: new/used, mileage
- pricing: asking price, MSRP, discount, rebates, price type
- dealer: name, city, state, phone
- media: primary image, images
- source: URL, domain, captured time, platform

## Evidence
Every populated high-value field should retain its source layer, evidence/reference, and confidence. Unknown is preferable to an unsupported guess.

## Page classification rule
Inventory/search pages must not become a vehicle record merely because they contain vehicle cards, prices, VINs, or stock numbers. A selected vehicle detail page can remain ambiguous when a site embeds inventory components around the VDP.

## Refactor rule
The existing v0.13 extractor remains the behavioral baseline. Refactors should move existing strategies behind clear layer boundaries before changing extraction semantics.