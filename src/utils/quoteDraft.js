export function selectionFromProduct(product) {
  return {
    productSlug: product.slug,
    customDesign: false,
    length: product.defaults.length,
    width: product.defaults.width,
    height: product.defaults.height,
    unit: product.defaults.unit,
    dimensionsUnsure: false,
    materialId: product.materialIds[0] || '',
    finishIds: [],
    insertId: product.insertIds.includes('none') ? 'none' : product.insertIds[0] || 'none',
    prepared: false,
    step: 'specs',
  };
}

export function withPreservedContact(current, patch) {
  return {
    ...current,
    ...patch,
    name: current.name,
    email: current.email,
    company: current.company,
    phone: current.phone,
    notes: current.notes,
    files: current.files,
    quantity: current.quantity,
    quantityGuidance: current.quantityGuidance,
  };
}
