# Car Bucket Extraction Testing

## Goal

Improve extraction against classes of automotive websites rather than accumulating dealer-specific patches.

## Required test layers

1. Structured data: JSON-LD / Schema.org Vehicle, Car, Product, Offer.
2. Semantic DOM: labels, itemprop, aria/data attributes, nearby value relationships.
3. Embedded application state: common JSON state objects and VIN-anchored records.
4. Same-origin loaded resources: inventory JSON/API responses already loaded by the page.
5. Platform-level logic only when a recurring platform signature is established.
6. Conservative fallback text extraction.

## Field rules

- VIN is an identity anchor and must be validated as a 17-character VIN pattern.
- Price must represent the vehicle/listing price, not a monthly payment, APR, rebate, fee, MSRP, or financing amount.
- Stock number must not be silently substituted with SKU/MPN unless the source explicitly establishes that relationship.
- Mileage must distinguish miles from kilometers.
- Year/make/model/trim should preserve source detail while normalizing obvious terminology.
- Unknown is preferable to a guessed high-cost field.

## Regression rule

Every meaningful extractor change should be evaluated against the corpus in `tests/extraction-cases/corpus.json`.

A failure should first be classified as:

- retrieval/rendering
- structured-data gap
- semantic DOM gap
- embedded-state gap
- resource/API gap
- platform-pattern gap
- normalization/validation bug

Only add a platform adapter when the same platform pattern appears across multiple domains/cases.

## Inventory pages

Search/inventory URLs are intentionally included. They are not expected to produce one vehicle record unless the page exposes a clearly selected vehicle. They test page classification and prevent the extractor from treating arbitrary search-result prices as the saved vehicle price.
