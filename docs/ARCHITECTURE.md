# Car Bucket Architecture

## Product direction

Car Bucket is a browser-first vehicle research tool.

- Chrome extension: capture vehicle data while browsing.
- Web application: account, cloud buckets, watching, history, analytics, sharing.
- Backend: monitoring and future market intelligence.
- Desktop is not a primary product target.

## Universal extraction

Dealer-specific adapters are exceptions, not the architecture.

Extraction order:

1. Schema.org / JSON-LD
2. Semantic DOM and label/value relationships
3. data-* attributes and structured HTML
4. VIN-anchored DOM blocks
5. Embedded application state
6. Same-origin page resources that the page already exposes
7. Conservative fallback

Every extracted field carries provenance and confidence.

The extractor must prefer correctness over completeness. Never turn a payment, MSRP, rebate, fee, down payment, or search distance into the vehicle asking price.

## VehicleRecord

Core normalized fields:

- year
- make
- model
- trim
- mileage
- price
- vin
- stock
- dealer
- location
- image
- url
- source
- capturedAt

Extraction diagnostics should additionally record:

- platform
- extractor path
- field confidence
- evidence/source
- unresolved fields

## Development rule

When a new site fails, first improve a general extraction rule that applies to many sites. Add a site-specific adapter only when the site has a genuinely unique protocol or data contract.
