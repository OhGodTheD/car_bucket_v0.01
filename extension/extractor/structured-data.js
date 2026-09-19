(() => {
  const clean = v => String(v ?? '').replace(/\s+/g, ' ').trim();

  function asArray(value) {
    if (Array.isArray(value)) return value.flatMap(asArray);
    return value == null ? [] : [value];
  }

  function parseJsonLd() {
    const records = [];
    for (const node of document.querySelectorAll('script[type="application/ld+json"]')) {
      const raw = node.textContent?.trim();
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        records.push(...asArray(parsed));
      } catch {
        // Some sites contain malformed JSON-LD. Leave it to later layers.
      }
    }
    return records;
  }

  function flattenGraph(value, out = []) {
    if (Array.isArray(value)) {
      for (const item of value) flattenGraph(item, out);
      return out;
    }
    if (!value || typeof value !== 'object') return out;
    out.push(value);
    if (value['@graph']) flattenGraph(value['@graph'], out);
    return out;
  }

  function isVehicleLike(node) {
    const types = asArray(node?.['@type']).map(x => String(x).toLowerCase());
    return types.some(t =>
      ['vehicle','car','product','automotiveproduct'].includes(t)
    );
  }

  function getOffer(node) {
    const offers = asArray(node?.offers);
    return offers.find(x => x && typeof x === 'object') || null;
  }

  function numericPrice(value) {
    if (value == null || value === '') return null;
    const n = Number(String(value).replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) && n > 100 ? n : null;
  }

  function extract() {
    const nodes = flattenGraph(parseJsonLd()).filter(isVehicleLike);
    const scored = nodes.map(node => {
      const offer = getOffer(node);
      const evidence = [];
      let score = 0;

      if (node.vehicleIdentificationNumber) { score += 40; evidence.push('vehicleIdentificationNumber'); }
      if (node.mileageFromOdometer) { score += 20; evidence.push('mileageFromOdometer'); }
      if (node.name) { score += 8; evidence.push('name'); }
      if (offer) { score += 15; evidence.push('offers'); }

      const price = numericPrice(offer?.price ?? offer?.lowPrice);
      if (price != null) { score += 20; evidence.push('offer.price'); }

      return { node, offer, score, price, evidence };
    }).sort((a,b) => b.score - a.score);

    const best = scored[0];
    if (!best) return null;

    const node = best.node;
    const offer = best.offer;
    const mileage = node.mileageFromOdometer?.value ?? node.mileageFromOdometer;
    const address = node.seller?.address || node.provider?.address || null;

    return {
      data: {
      year: clean(node.vehicleModelDate || node.dateVehicleFirstRegistered || ''),
      make: clean(node.brand?.name || node.manufacturer || ''),
      model: clean(node.model || ''),
      trim: clean(node.vehicleConfiguration || ''),
      mileage: mileage != null ? clean(mileage) : null,
      vin: clean(node.vehicleIdentificationNumber || ''),
      price: best.price,
      dealer: clean(node.seller?.name || node.provider?.name || ''),
      location: clean(address ? [address.addressLocality, address.addressRegion].filter(Boolean).join(', ') : ''),
      image: Array.isArray(node.image) ? node.image[0] : clean(node.image || ''),
      },
      evidence,
      confidence: Object.fromEntries(['year','make','model','trim','mileage','vin','price','dealer','location','image'].filter(k => { const v = ({year: clean(node.vehicleModelDate || node.dateVehicleFirstRegistered || ''), make: clean(node.brand?.name || node.manufacturer || ''), model: clean(node.model || ''), trim: clean(node.vehicleConfiguration || ''), mileage: mileage != null ? clean(mileage) : null, vin: clean(node.vehicleIdentificationNumber || ''), price: best.price, dealer: clean(node.seller?.name || node.provider?.name || ''), location: clean(address ? [address.addressLocality, address.addressRegion].filter(Boolean).join(', ') : ''), image: Array.isArray(node.image) ? node.image[0] : clean(node.image || '') })[k]; return v != null && v !== '' }).map(k => [k, Math.min(0.99, 0.55 + best.score / 200)]))
    };
  }

  window.CarBucketStructuredExtractor = { extract };
})();