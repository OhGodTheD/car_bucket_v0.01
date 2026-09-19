# Car Bucket 0.14 Development Build

This is the first maintainable source build of the universal extraction pipeline.

## Install locally

1. Download or clone the repository.
2. Open Chrome and go to `chrome://extensions`.
3. Enable Developer mode.
4. Choose **Load unpacked**.
5. Select the `extension/` directory.

## Pipeline

`page classification -> structured data -> semantic DOM -> attributes -> embedded state -> loaded resources -> fallback -> normalization/confidence`

## Design rule

No dealer-specific adapters are included. Platform detection is diagnostic and does not select a dealer-specific scraper.

## CI

Every change to `extension/` runs:
- manifest validation
- JavaScript syntax validation
- normalization smoke tests
- extension ZIP packaging

The CI artifact is the demo build candidate.

## Current limitations

- Resource/API extraction is conservative and same-origin only.
- Generic title parsing intentionally does not invent make/model/trim.
- Marketplace/platform detection is diagnostic rather than a separate scraper.
- Watch/price-history behavior from the v0.13 baseline has not yet been ported into the maintainable source tree; the baseline ZIP remains preserved in the repository.

The source build should not replace the v0.13 baseline artifact until regression testing shows equivalent or better extraction behavior across the corpus.
