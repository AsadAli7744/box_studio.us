function positiveNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

export function validateBoxStep(draft) {
  const errors = {};
  if (!draft.customDesign && !draft.productSlug) {
    errors.product = 'Choose a box, or say that you have your own design.';
  }
  return errors;
}

export function validateSpecs(draft) {
  const errors = {};
  if (!draft.dimensionsUnsure) {
    if (!positiveNumber(draft.length)) {
      errors.length = 'Enter an internal length greater than zero, or mark that you are not sure yet.';
    }
    if (!positiveNumber(draft.width)) {
      errors.width = 'Enter an internal width greater than zero, or mark that you are not sure yet.';
    }
    if (!positiveNumber(draft.height)) {
      errors.height = 'Enter an internal height greater than zero, or mark that you are not sure yet.';
    }
  }
  if (!draft.quantityGuidance) {
    const quantity = Number(draft.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      errors.quantity = 'Enter a whole quantity greater than zero, or ask for guidance.';
    }
  }
  if (!draft.materialId) {
    errors.material = 'Choose a material preference.';
  }
  return errors;
}

export function validateContact(draft) {
  const errors = {};
  if (!draft.name || draft.name.trim().length < 2) {
    errors.name = 'Enter your name.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((draft.email || '').trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (draft.phone && !/^[0-9+().\-\s]{6,}$/.test(draft.phone.trim())) {
    errors.phone = 'Enter a phone number using digits and normal symbols, or leave it blank.';
  }
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
