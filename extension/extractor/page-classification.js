(() => {
  const clean = v => String(v || '').replace(/\s+/g, ' ').trim();
  const hasVehicleIdentity = () => {
    const text = `${document.title || ''}\n${document.querySelector('h1')?.textContent || ''}`;
    return /\b(19\d{2}|20\d{2})\b/.test(text) && /\b[A-Z][A-Za-z-]+\b/.test(text);
  };
  const hasInventorySignals = () => {
    const body = clean(document.body?.innerText || '').toLowerCase();
    const cards = document.querySelectorAll('[class*="vehicle" i],[class*="inventory" i],[class*="result" i],[data-vin],[data-stock]').length;
    const searchSignals = ['search results','inventory','vehicles found','matching vehicles','results for'].filter(x => body.includes(x)).length;
    return cards >= 6 || searchSignals >= 1;
  };
  const hasDetailSignals = () => {
    const body = clean(document.body?.innerText || '').toLowerCase();
    const signals = ['vin','mileage','stock number','vehicle identification number','odometer'].filter(x => body.includes(x)).length;
    return signals >= 2;
  };
  window.CarBucketPageClassifier = {
    classify() {
      const inventory = hasInventorySignals();
      const detail = hasDetailSignals() && hasVehicleIdentity();
      if (detail && !inventory) return { type: 'vehicle-detail', confidence: 0.9 };
      if (inventory && !detail) return { type: 'inventory/search', confidence: 0.82 };
      if (detail && inventory) return { type: 'vehicle-detail', confidence: 0.62, ambiguous: true };
      return { type: 'unknown', confidence: 0.45 };
    }
  };
})();