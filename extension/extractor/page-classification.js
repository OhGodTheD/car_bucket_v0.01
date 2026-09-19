(() => {
  const clean = v => String(v || '').replace(/\s+/g, ' ').trim();
  const count = (arr, fn) => arr.reduce((n, x) => n + (fn(x) ? 1 : 0), 0);

  const bodyText = () => clean(document.body?.innerText || '');
  const titleText = () => clean(document.title || '');
  const headings = () => [...document.querySelectorAll('h1,h2,h3,[role="heading"]')]
    .map(x => clean(x.textContent)).filter(Boolean);

  const hasVehicleIdentity = () => {
    const text = [titleText(), ...headings().slice(0, 8)].join('\n');
    const year = /\b(19\d{2}|20\d{2})\b/.test(text);
    const vehicleWord = /\b(ford|chevrolet|chevy|gmc|ram|dodge|jeep|chrysler|toyota|honda|nissan|infiniti|acura|lexus|subaru|mazda|hyundai|kia|volkswagen|vw|volvo|bmw|mercedes|audi|cadillac|buick|lincoln|rivian|tesla|lucid|porsche|genesis)\b/i.test(text);
    return year && vehicleWord;
  };

  const explicitVehicleMarkers = () => {
    const selectors = [
      '[data-vin]','[data-stock]','[data-mileage]',
      '[itemprop="vehicleIdentificationNumber"]',
      '[itemprop="mileageFromOdometer"]','[itemprop="vehicleModelDate"]'
    ];
    return count(selectors, s => document.querySelector(s));
  };

  const explicitInventoryMarkers = () => {
    const selectors = [
      '[class*="inventory" i]','[class*="vehicle-list" i]',
      '[class*="search-results" i]','[class*="vehicle-card" i]',
      '[data-vin]','[data-stock]'
    ];
    return selectors.reduce((n, s) => n + document.querySelectorAll(s).length, 0);
  };

  const hasDetailSignals = () => {
    const body = bodyText().toLowerCase();
    const labels = [
      'vin','vehicle identification number','mileage','odometer',
      'stock number','stock #','vehicle details','vehicle history'
    ];
    const labelHits = count(labels, x => body.includes(x));
    return labelHits >= 2 || explicitVehicleMarkers() >= 2;
  };

  const hasInventorySignals = () => {
    const body = bodyText().toLowerCase();
    const phrases = [
      'search results','vehicles found','matching vehicles','results for',
      'new inventory','used inventory','vehicle inventory',
      'browse inventory','view inventory','vehicles available'
    ];
    const phraseHits = count(phrases, x => body.includes(x));
    const cards = document.querySelectorAll(
      '[class*="vehicle-card" i],[class*="inventory-item" i],[class*="search-result" i]'
    ).length;
    const markerCount = explicitInventoryMarkers();
    return phraseHits >= 1 || cards >= 6 || markerCount >= 10;
  };

  const classify = () => {
    const detailSignals = hasDetailSignals();
    const identity = hasVehicleIdentity();
    const inventorySignals = hasInventorySignals();

    if (detailSignals && identity && !inventorySignals) {
      return { type: 'vehicle-detail', confidence: 0.94, evidence: ['identity', 'detail-signals'] };
    }

    if (detailSignals && identity && inventorySignals) {
      return {
        type: 'vehicle-detail',
        confidence: 0.68,
        ambiguous: true,
        evidence: ['identity', 'detail-signals', 'inventory-signals']
      };
    }

    if (inventorySignals) {
      return { type: 'inventory/search', confidence: 0.9, evidence: ['inventory-signals'] };
    }

    if (identity) {
      return { type: 'vehicle-detail', confidence: 0.56, ambiguous: true, evidence: ['identity'] };
    }

    return { type: 'unknown', confidence: 0.5, evidence: [] };
  };

  window.CarBucketPageClassifier = { classify };
})();