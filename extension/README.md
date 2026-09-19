# Extension Source Layout

The current v0.13.0-dev ZIP is the baseline artifact. This directory is the beginning of the maintainable source tree.

Planned modules:

- `manifest.json` — MV3 configuration
- `background.js` — service-worker orchestration and watch jobs
- `content.js` — isolated-world message bridge
- `page-state.js` — MAIN-world application-state bridge
- `extractor/` — extraction pipeline
- `sidepanel/` — UI and bucket management
- `assets/` — icons and static assets

Extraction should remain layered and platform-aware without becoming dealer-specific.
