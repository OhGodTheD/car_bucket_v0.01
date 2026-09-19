# Extension Source Layout

The current v0.13.0-dev ZIP remains the baseline artifact while the maintainable source tree is built out.

## Source structure

- `manifest.json` — MV3 configuration
- `background.js` — service-worker orchestration and watch jobs
- `content.js` — isolated-world message bridge
- `page-state.js` — MAIN-world application-state bridge
- `extractor/page-classification.js` — classifies vehicle-detail vs inventory/search vs unknown pages
- `extractor/universal.js` — current universal extraction engine; this is the next major refactor target
- `sidepanel/` — UI and bucket management
- `assets/` — icons and static assets

## Architecture rule

Extraction is layered and platform-aware without becoming dealer-specific.

The pipeline should prefer:

1. structured data
2. semantic DOM relationships
3. data attributes
4. embedded application state
5. same-origin loaded inventory resources
6. conservative fallback extraction

Platform logic belongs at the platform level only after repeated evidence across multiple domains.

## Current refactor work

The source tree is being separated from the v0.13 artifact so extraction behavior can be tested and improved without throwing away the working engine.

The next reliability milestone is content-script recovery: if a SPA navigation or an already-open tab has no active extraction bridge, the side panel should inject the universal extractor/bridge and retry once rather than immediately reporting that the listing cannot be read.

Page classification is intentionally diagnostic first. It is used to distinguish vehicle detail pages from inventory/search pages before it is allowed to affect extraction behavior.
