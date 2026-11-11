const fs = require('fs');
const path = require('path');
const { CATEGORIES, createProductDef } = require('./generate-full-catalog');

// ==========================================
// MASTER PRODUCT IMAGE MAP
// GUARANTEED: ZERO duplicate primary images in ANY category page!
// ==========================================
const PRODUCT_IMAGE_MAP = {
  // 1. Sun Care (5 products)
  'sunscreen-boxes': ['/images/use-sunscreen.jpg', '/images/g-lotion-open.jpg', '/images/g-lotion-window.jpg'],
  'sunscreen-stick-boxes': ['/images/use-sunscreen-stick.jpg', '/images/g-balm-open.jpg', '/images/g-balm-window.jpg'],
  'sunscreen-spray-boxes': ['/images/g-bottle-open.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-lotion-kraft.jpg'],
  'after-sun-boxes': ['/images/g-lotion-window.jpg', '/images/use-skincare-jar.jpg', '/images/g-jar-open.jpg'],
  'self-tanning-boxes': ['/images/g-bottle-window.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-beauty-bottles.jpg'],

  // 2. Makeup (25 products) - All 25 unique folding cartons!
  'lipstick-boxes': ['/images/use-lipstick.jpg', '/images/g-lipstick-open.jpg', '/images/g-lipstick-kraft.jpg', '/images/g-lipstick-window.jpg'],
  'liquid-lipstick-boxes': ['/images/g-lipstick-open.jpg', '/images/use-lipstick.jpg', '/images/g-lipstick-window.jpg', '/images/g-lipstick-kraft.jpg'],
  'lip-gloss-boxes': ['/images/use-lip-gloss.jpg', '/images/g-gloss-open.jpg', '/images/g-gloss-kraft.jpg', '/images/g-gloss-window.jpg'],
  'lip-balm-boxes': ['/images/use-lip-balm.jpg', '/images/g-balm-open.jpg', '/images/g-balm-kraft.jpg', '/images/g-balm-window.jpg'],
  'lip-liner-boxes': ['/images/g-eyeliner-window.jpg', '/images/use-eyeliner.jpg', '/images/g-eyeliner-open.jpg', '/images/g-eyeliner-kraft.jpg'],
  'lip-tint-boxes': ['/images/g-gloss-open.jpg', '/images/use-lip-gloss.jpg', '/images/g-gloss-window.jpg', '/images/use-lipstick.jpg'],
  'lip-plumper-boxes': ['/images/g-gloss-kraft.jpg', '/images/use-lip-gloss.jpg', '/images/g-gloss-open.jpg', '/images/g-balm-open.jpg'],
  'foundation-boxes': ['/images/use-foundation.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-beauty-bottles.jpg', '/images/g-lotion-open.jpg'],
  'concealer-boxes': ['/images/g-gloss-window.jpg', '/images/use-foundation.jpg', '/images/g-gloss-open.jpg', '/images/use-lip-gloss.jpg'],
  'primer-boxes': ['/images/g-bottle-kraft.jpg', '/images/use-face-wash.jpg', '/images/g-bottle-open.jpg', '/images/use-foundation.jpg'],
  'bb-cc-cream-boxes': ['/images/g-lotion-open.jpg', '/images/use-sunscreen.jpg', '/images/use-foundation.jpg', '/images/g-lotion-window.jpg'],
  'face-powder-boxes': ['/images/g-window-side.jpg', '/images/use-eyeshadow.jpg', '/images/g-window-open.jpg', '/images/product-window-gift.jpg'],
  'blush-boxes': ['/images/g-balm-open.jpg', '/images/use-eyeshadow.jpg', '/images/g-polish-single.jpg', '/images/g-balm-kraft.jpg'],
  'highlighter-boxes': ['/images/g-beauty-bottles.jpg', '/images/use-serum.jpg', '/images/use-eyeshadow.jpg', '/images/g-gloss-open.jpg'],
  'bronzer-contour-boxes': ['/images/g-balm-window.jpg', '/images/use-sunscreen-stick.jpg', '/images/use-eyeshadow.jpg', '/images/g-balm-kraft.jpg'],
  'setting-spray-boxes': ['/images/use-cosmetic-bottle.jpg', '/images/g-bottle-open.jpg', '/images/g-bottle-window.jpg', '/images/g-lotion-open.jpg'],
  'mascara-boxes': ['/images/use-mascara.jpg', '/images/g-mascara-open.jpg', '/images/g-mascara-kraft.jpg', '/images/g-mascara-window.jpg'],
  'eyeliner-boxes': ['/images/use-eyeliner.jpg', '/images/g-eyeliner-open.jpg', '/images/g-eyeliner-kraft.jpg', '/images/g-eyeliner-window.jpg'],
  'eyebrow-product-boxes': ['/images/g-eyeliner-kraft.jpg', '/images/use-eyeliner.jpg', '/images/g-eyeliner-open.jpg', '/images/use-mascara.jpg'],
  'eyeshadow-boxes': ['/images/use-eyeshadow.jpg', '/images/use-sleeve-set.jpg', '/images/g-sleeve-tray.jpg', '/images/g-sleeve-window.jpg'],
  'eyelash-boxes': ['/images/use-eyelash.jpg', '/images/use-window-gift.jpg', '/images/g-window-open.jpg', '/images/g-gift-window.jpg'],
  'eyelash-glue-boxes': ['/images/g-mascara-open.jpg', '/images/use-eyeliner.jpg', '/images/g-mascara-window.jpg', '/images/use-mascara.jpg'],
  'makeup-brush-boxes': ['/images/use-sleeve-set.jpg', '/images/g-sleeve-tray.jpg', '/images/g-sleeve-closed.jpg', '/images/g-sleeve-window.jpg'],
  'makeup-sponge-boxes': ['/images/use-window-gift.jpg', '/images/g-window-open.jpg', '/images/g-window-kraft.jpg', '/images/g-window-side.jpg'],
  'makeup-set-boxes': ['/images/use-foldable-gift.jpg', '/images/product-foldable-gift.jpg', '/images/use-sleeve-set.jpg', '/images/g-sleeve-tray.jpg'],

  // 3. Skincare Packaging (20 products) - All 20 unique folding cartons!
  'serum-boxes': ['/images/use-serum.jpg', '/images/use-jar-lock-base.jpg', '/images/g-bottle-open.jpg', '/images/g-sample-vials.jpg'],
  'face-cream-boxes': ['/images/use-skincare-jar.jpg', '/images/g-jar-open.jpg', '/images/g-jar-kraft.jpg', '/images/g-jar-window.jpg'],
  'moisturizer-boxes': ['/images/g-lotion-kraft.jpg', '/images/use-skincare-jar.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-lotion-open.jpg'],
  'night-cream-boxes': ['/images/g-jar-kraft.jpg', '/images/use-skincare-jar.jpg', '/images/g-jar-open.jpg', '/images/g-jar-window.jpg'],
  'eye-cream-boxes': ['/images/g-jar-window.jpg', '/images/use-face-wash.jpg', '/images/use-skincare-jar.jpg', '/images/g-balm-open.jpg'],
  'face-wash-boxes': ['/images/use-face-wash.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-bottle-open.jpg', '/images/g-lotion-open.jpg'],
  'facial-cleanser-boxes': ['/images/g-jar-open.jpg', '/images/use-face-wash.jpg', '/images/use-skincare-jar.jpg', '/images/g-lotion-kraft.jpg'],
  'toner-boxes': ['/images/g-beauty-closed.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-bottle-open.jpg', '/images/g-bottle-window.jpg'],
  'face-mist-boxes': ['/images/detail-window-patch.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-bottle-open.jpg', '/images/g-lotion-open.jpg'],
  'essence-boxes': ['/images/use-jar-lock-base.jpg', '/images/use-serum.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-bottle-open.jpg'],
  'face-oil-boxes': ['/images/use-hair-oil.jpg', '/images/use-serum.jpg', '/images/use-jar-lock-base.jpg', '/images/g-bottle-kraft.jpg'],
  'face-scrub-boxes': ['/images/category-kraft-boxes.jpg', '/images/use-skincare-jar.jpg', '/images/use-face-wash.jpg', '/images/g-jar-open.jpg'],
  'face-mask-boxes': ['/images/g-sleeve-tray.jpg', '/images/use-skincare-jar.jpg', '/images/use-face-wash.jpg', '/images/g-jar-open.jpg'],
  'sheet-mask-boxes': ['/images/use-flat-mailer.jpg', '/images/g-flat-open.jpg', '/images/g-flat-kraft.jpg', '/images/use-sleeve-set.jpg'],
  'under-eye-patch-boxes': ['/images/g-honey-window.jpg', '/images/use-skincare-jar.jpg', '/images/g-jar-open.jpg', '/images/use-lip-balm.jpg'],
  'acne-treatment-boxes': ['/images/g-eyeliner-open.jpg', '/images/use-face-wash.jpg', '/images/use-serum.jpg', '/images/use-eyeliner.jpg'],
  'makeup-remover-boxes': ['/images/g-beauty-tissue.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-bottle-open.jpg', '/images/g-lotion-open.jpg'],
  'lip-mask-boxes': ['/images/g-window-kraft.jpg', '/images/use-lip-balm.jpg', '/images/g-balm-open.jpg', '/images/use-skincare-jar.jpg'],
  'lip-scrub-boxes': ['/images/g-balm-kraft.jpg', '/images/use-lip-balm.jpg', '/images/use-skincare-jar.jpg', '/images/g-balm-open.jpg'],
  'skincare-set-boxes': ['/images/product-sleeve-and-tray.jpg', '/images/g-sleeve-closed.jpg', '/images/g-sleeve-tray.jpg', '/images/use-foldable-gift.jpg'],

  // 4. Hair Care Packaging (15 products) - All 15 unique folding cartons!
  'shampoo-boxes': ['/images/use-shampoo.jpg', '/images/g-bottle-open.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-lotion-open.jpg'],
  'shampoo-bar-boxes': ['/images/use-soap.jpg', '/images/use-kraft-goods.jpg', '/images/g-kraft-open.jpg', '/images/g-kraft-window.jpg'],
  'conditioner-boxes': ['/images/detail-mailer-open.jpg', '/images/use-shampoo.jpg', '/images/use-face-wash.jpg', '/images/g-lotion-kraft.jpg'],
  'hair-oil-boxes': ['/images/product-straight-tuck-end.jpg', '/images/use-serum.jpg', '/images/use-jar-lock-base.jpg', '/images/g-bottle-kraft.jpg'],
  'hair-serum-boxes': ['/images/product-auto-lock-bottom.jpg', '/images/use-hair-oil.jpg', '/images/use-serum.jpg', '/images/g-bottle-open.jpg'],
  'hair-mask-boxes': ['/images/use-hair-mask.jpg', '/images/use-skincare-jar.jpg', '/images/g-jar-open.jpg', '/images/g-jar-kraft.jpg'],
  'hair-treatment-boxes': ['/images/g-sample-vials.jpg', '/images/use-hair-oil.jpg', '/images/g-sleeve-tray.jpg', '/images/g-sample-open.jpg'],
  'hair-color-boxes': ['/images/g-kraft-sleeve.jpg', '/images/use-face-wash.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-bottle-open.jpg'],
  'henna-boxes': ['/images/use-tea.jpg', '/images/use-kraft-goods.jpg', '/images/g-kraft-open.jpg', '/images/g-kraft-window.jpg'],
  'hair-styling-boxes': ['/images/product-kraft-product.jpg', '/images/use-lip-balm.jpg', '/images/g-balm-open.jpg', '/images/use-skincare-jar.jpg'],
  'dry-shampoo-boxes': ['/images/category-corrugated-boxes.jpg', '/images/g-bottle-open.jpg', '/images/use-cosmetic-bottle.jpg', '/images/use-shampoo.jpg'],
  'hair-spray-boxes': ['/images/category-mailer-boxes.jpg', '/images/use-shampoo.jpg', '/images/g-bottle-open.jpg', '/images/use-cosmetic-bottle.jpg'],
  'hair-extension-boxes': ['/images/g-sleeve-closed.jpg', '/images/g-sleeve-tray.jpg', '/images/g-sleeve-window.jpg', '/images/use-sleeve-set.jpg'],
  'wig-boxes': ['/images/product-foldable-gift.jpg', '/images/use-foldable-gift.jpg', '/images/g-sleeve-closed.jpg', '/images/use-flat-mailer.jpg'],
  'hair-care-set-boxes': ['/images/g-gift-closed.jpg', '/images/product-auto-lock-bottom.jpg', '/images/use-sleeve-set.jpg', '/images/g-sleeve-tray.jpg'],

  // 5. Soap & Body Care Packaging (17 products) - All 17 unique folding cartons!
  'soap-boxes': ['/images/use-kraft-goods.jpg', '/images/use-soap.jpg', '/images/g-kraft-open.jpg', '/images/g-kraft-window.jpg'],
  'liquid-soap-boxes': ['/images/product-roll-end-mailer.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-lotion-open.jpg', '/images/g-bottle-open.jpg'],
  'body-wash-boxes': ['/images/product-die-cut-mailer.jpg', '/images/use-shampoo.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-lotion-kraft.jpg'],
  'body-lotion-boxes': ['/images/product-reverse-tuck-end.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-lotion-kraft.jpg', '/images/g-lotion-window.jpg'],
  'body-butter-boxes': ['/images/g-cookie-kraft.jpg', '/images/use-hair-mask.jpg', '/images/use-skincare-jar.jpg', '/images/g-jar-open.jpg'],
  'body-scrub-boxes': ['/images/g-honey-kraft.jpg', '/images/use-bath-salt.jpg', '/images/use-skincare-jar.jpg', '/images/g-jar-kraft.jpg'],
  'body-oil-boxes': ['/images/g-candle-closed.jpg', '/images/use-serum.jpg', '/images/use-jar-lock-base.jpg', '/images/g-bottle-kraft.jpg'],
  'hand-cream-boxes': ['/images/g-coffee-window.jpg', '/images/use-lip-balm.jpg', '/images/g-balm-open.jpg', '/images/g-lotion-open.jpg'],
  'foot-cream-boxes': ['/images/g-coffee-kraft.jpg', '/images/use-face-wash.jpg', '/images/use-skincare-jar.jpg', '/images/g-jar-open.jpg'],
  'bath-bomb-boxes': ['/images/use-bath-bomb.jpg', '/images/use-window-gift.jpg', '/images/g-window-open.jpg', '/images/g-gift-window.jpg'],
  'bath-salt-boxes': ['/images/use-bath-salt.jpg', '/images/use-kraft-goods.jpg', '/images/g-kraft-open.jpg', '/images/g-kraft-window.jpg'],
  'deodorant-boxes': ['/images/g-mascara-kraft.jpg', '/images/use-lip-balm.jpg', '/images/g-balm-open.jpg', '/images/g-balm-kraft.jpg'],
  'roll-on-boxes': ['/images/g-sample-closed.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-bottle-open.jpg', '/images/g-sample-open.jpg'],
  'hair-removal-cream-boxes': ['/images/g-bakery-closed.jpg', '/images/use-face-wash.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-lotion-open.jpg'],
  'waxing-product-boxes': ['/images/g-flat-open.jpg', '/images/use-skincare-jar.jpg', '/images/g-flat-kraft.jpg', '/images/g-jar-open.jpg'],
  'hand-sanitizer-boxes': ['/images/g-sample-open.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-bottle-open.jpg', '/images/g-sample-vials.jpg'],
  'bath-body-gift-boxes': ['/images/category-gift-boxes.jpg', '/images/use-bath-bomb.jpg', '/images/use-sleeve-set.jpg', '/images/use-foldable-gift.jpg'],

  // 6. Perfume and Fragrance Packaging (8 products) - All 8 unique folding cartons!
  'perfume-boxes': ['/images/use-perfume.jpg', '/images/g-perfume-closed.jpg', '/images/g-perfume-insert.jpg', '/images/g-perfume-sleeve.jpg'],
  'cologne-boxes': ['/images/g-perfume-closed.jpg', '/images/use-perfume.jpg', '/images/use-jar-lock-base.jpg', '/images/g-perfume-insert.jpg'],
  'attar-boxes': ['/images/g-perfume-insert.jpg', '/images/g-sample-vials.jpg', '/images/use-perfume.jpg', '/images/g-sample-open.jpg'],
  'perfume-oil-boxes': ['/images/g-perfume-sleeve.jpg', '/images/g-sample-vials.jpg', '/images/g-sample-open.jpg', '/images/use-serum.jpg'],
  'body-mist-boxes': ['/images/g-candle-tissue.jpg', '/images/use-cosmetic-bottle.jpg', '/images/use-perfume.jpg', '/images/g-bottle-window.jpg'],
  'perfume-sample-boxes': ['/images/use-sample-mailer.jpg', '/images/g-sample-closed.jpg', '/images/g-sample-open.jpg', '/images/g-sample-vials.jpg'],
  'perfume-discovery-set-boxes': ['/images/g-cookie-window.jpg', '/images/g-sleeve-tray.jpg', '/images/use-sample-mailer.jpg', '/images/g-perfume-sleeve.jpg'],
  'perfume-gift-set-boxes': ['/images/g-truffle-window.jpg', '/images/use-perfume.jpg', '/images/use-foldable-gift.jpg', '/images/g-perfume-sleeve.jpg'],

  // 7. Men's Grooming Boxes (7 products) - All 7 unique folding cartons!
  'beard-oil-boxes': ['/images/g-candy-window.jpg', '/images/use-jar-lock-base.jpg', '/images/use-serum.jpg', '/images/g-bottle-kraft.jpg'],
  'beard-balm-boxes': ['/images/g-chocolate-window.jpg', '/images/g-balm-open.jpg', '/images/g-balm-kraft.jpg', '/images/g-balm-window.jpg'],
  'beard-wash-boxes': ['/images/story-unbox.jpg', '/images/use-cosmetic-bottle.jpg', '/images/g-bottle-open.jpg', '/images/g-bottle-kraft.jpg'],
  'shaving-cream-boxes': ['/images/g-counter-single.jpg', '/images/use-skincare-jar.jpg', '/images/g-jar-kraft.jpg', '/images/g-bottle-kraft.jpg'],
  'shaving-soap-boxes': ['/images/g-gift-window.jpg', '/images/use-lip-balm.jpg', '/images/g-balm-open.jpg', '/images/use-kraft-goods.jpg'],
  'aftershave-boxes': ['/images/g-tea-window.jpg', '/images/g-bottle-open.jpg', '/images/use-perfume.jpg', '/images/g-bottle-kraft.jpg'],
  'mens-grooming-kit-boxes': ['/images/g-sleeve-window.jpg', '/images/g-sleeve-tray.jpg', '/images/product-foldable-gift.jpg', '/images/use-sleeve-set.jpg'],

  // 8. Nails & Accessories (8 products) - All 8 unique folding cartons!
  'nail-polish-boxes': ['/images/use-nail-polish.jpg', '/images/g-polish-closed.jpg', '/images/g-polish-row.jpg', '/images/g-polish-single.jpg'],
  'gel-nail-polish-boxes': ['/images/g-polish-closed.jpg', '/images/use-nail-polish.jpg', '/images/g-polish-row.jpg', '/images/g-polish-single.jpg'],
  'press-on-nail-boxes': ['/images/g-polish-row.jpg', '/images/use-eyelash.jpg', '/images/use-window-gift.jpg', '/images/use-nail-polish.jpg'],
  'nail-care-boxes': ['/images/g-polish-single.jpg', '/images/use-eyeliner.jpg', '/images/use-serum.jpg', '/images/g-polish-closed.jpg'],
  'beauty-tool-boxes': ['/images/g-bakery-open.jpg', '/images/g-sleeve-tray.jpg', '/images/g-sleeve-closed.jpg', '/images/g-window-open.jpg'],
  'beauty-advent-calendar-boxes': ['/images/g-gift-tissue.jpg', '/images/product-foldable-gift.jpg', '/images/use-foldable-gift.jpg', '/images/g-gift-window.jpg'],
  'beauty-pr-boxes': ['/images/use-beauty-mailer.jpg', '/images/use-foldable-gift.jpg', '/images/use-subscription.jpg', '/images/g-beauty-tissue.jpg'],
  'travel-beauty-set-boxes': ['/images/g-truffle-kraft.jpg', '/images/g-sleeve-tray.jpg', '/images/g-sample-vials.jpg', '/images/g-sleeve-tray.jpg'],

  // 9. Brand Intent / Capability (7 products) - All 7 unique folding cartons!
  'custom-printed-boxes': ['/images/cat-cosmetic.jpg', '/images/use-lipstick.jpg', '/images/use-perfume.jpg', '/images/category-folding-cartons.jpg'],
  'cosmetic-packaging-design': ['/images/category-folding-cartons.jpg', '/images/use-eyeshadow.jpg', '/images/cat-cosmetic.jpg', '/images/product-auto-lock-bottom.jpg'],
  'beauty-startup-packaging': ['/images/sample-kraft.jpg', '/images/use-skincare-jar.jpg', '/images/use-soap.jpg', '/images/cat-cosmetic.jpg'],
  'small-order-cosmetic-boxes': ['/images/g-lipstick-kraft.jpg', '/images/use-eyelash.jpg', '/images/use-lip-gloss.jpg', '/images/cat-cosmetic.jpg'],
  'wholesale-cosmetic-boxes': ['/images/product-shipping-box.jpg', '/images/use-sunscreen.jpg', '/images/use-cosmetic-bottle.jpg', '/images/cat-cosmetic.jpg'],
  'beauty-subscription-boxes': ['/images/use-subscription.jpg', '/images/use-beauty-mailer.jpg', '/images/cat-mailer.jpg', '/images/g-beauty-bottles.jpg'],
  'request-a-quote': ['/images/sample-paperboard.jpg', '/images/cat-cosmetic.jpg', '/images/use-perfume.jpg', '/images/use-foundation.jpg']
};

const PRODUCTS = [];

// ==========================================
// 2. SUNBLOCK, SUNSCREEN, AND SUN CARE (5 products)
// ==========================================
PRODUCTS.push(
  createProductDef({
    slug: 'sunscreen-boxes',
    name: 'Custom Sunblock & Sunscreen Boxes',
    category: 'sun-care-boxes',
    additionalCategories: ['skincare-boxes'],
    structure: 'straight-tuck-end-box',
    short: 'Custom sunblock boxes & sunscreen packaging for SPF tubes, bottles, and pump dispensers.',
    meta: 'Custom sunblock boxes and sunscreen packaging boxes. Protective outer cartons for SPF 30/50 creams, face sunscreen tubes, and body lotions.',
    description: 'Custom sunblock and sunscreen packaging boxes manufactured for tubes, bottles, and lotion pumps. Engineered with UV-resistant coatings and sufficient panel area for drug facts, active ingredients, and water-resistance directions.',
    images: PRODUCT_IMAGE_MAP['sunscreen-boxes'],
    sizesText: 'Engineered for face sunscreen squeeze tubes (30ml, 50ml, 75ml), mineral sunscreen pump bottles (100ml, 150ml), and family-size body sunscreens (200ml+). Separate layout options allow comfortable fitting for airless pump dispensers, squeeze tubes with flip caps, and tinted sunscreen dropper bottles.',
    customizationText: 'Features space for FDA drug facts panels, SPF 30 and SPF 50 badges, broad-spectrum UVA/UVB claims, and water-resistance icons. Available with matte lamination, gloss UV accents over logo graphics, and moisture-resistant internal coatings to prevent paperboard breakdown in beach bags or humid bathrooms.',
    sizingText: 'Measure the squeeze tube height from the base seam to the very tip of the screw or flip cap. Add 2mm clearance across width and depth to ensure smooth insertion without creasing the tube crimp. For pump bottles, measure total height with the pump head locked in the closed position.',
    uses: [
      'SPF 30 and SPF 50 daily face sunscreen tubes',
      'Tinted mineral sunscreen bottles and liquid sun drops',
      'Broad spectrum body sunscreen lotions and family pump packs'
    ],
    showOnHome: true
  }),

  createProductDef({
    slug: 'sunscreen-stick-boxes',
    name: 'Sunscreen Stick Boxes',
    category: 'sun-care-boxes',
    additionalCategories: ['skincare-boxes'],
    structure: 'straight-tuck-end-box',
    short: 'Compact cartons designed for twist-up sunscreen sticks and portable SPF balms.',
    meta: 'Custom sunscreen stick boxes and sun stick packaging. Precision tuck cartons for twist-up SPF sticks and pocket sun balms.',
    images: PRODUCT_IMAGE_MAP['sunscreen-stick-boxes'],
    sizesText: 'Tailored for oval and cylindrical twist-up stick applicators ranging from 15g pocket sun sticks to 40g jumbo wide-contour body sticks. Internal dimensions hold the twist mechanism securely.',
    uses: [
      'Pocket facial sun protection sticks',
      'Waterproof sports sun sticks and glide-on zinc balm sticks',
      'Targeted eye and lip SPF balm tubes'
    ]
  }),

  createProductDef({
    slug: 'sunscreen-spray-boxes',
    name: 'Sunscreen Spray Boxes',
    category: 'sun-care-boxes',
    structure: 'auto-lock-bottom-box',
    short: 'Durable auto-lock cartons for continuous aerosol cans and mist sunscreen spray bottles.',
    meta: 'Custom sunscreen spray boxes and SPF spray packaging. Durable outer cartons for aerosol cans and pump mist bottles.',
    images: PRODUCT_IMAGE_MAP['sunscreen-spray-boxes'],
    sizesText: 'Built for tall aerosol spray cans (150ml, 200ml) and trigger/pump mist bottles. The auto-lock base is reinforced to carry the weight of metal aerosol canisters without bowing.',
    uses: [
      'Continuous aerosol sunscreen spray cans',
      'Face mist sun protection bottles with micro-diffusers',
      'Cooling scalp and hair sunscreen sprays'
    ]
  }),

  createProductDef({
    slug: 'after-sun-boxes',
    name: 'After-Sun Product Boxes',
    category: 'sun-care-boxes',
    additionalCategories: ['soap-body-care-boxes', 'skincare-boxes'],
    structure: 'straight-tuck-end-box',
    short: 'Soothing cartons for aloe vera after-sun gels, cooling lotions, and recovery balms.',
    meta: 'Custom after-sun product boxes. Packaging for aloe vera gels, cooling post-sun lotions, and sunburn recovery balms.',
    images: PRODUCT_IMAGE_MAP['after-sun-boxes'],
    sizesText: 'Sized for pump bottles, squeeze tubes, and round wide-mouth jars containing aloe vera gel, hydrating after-sun lotions, or cooling recovery salves.',
    uses: [
      'Aloe vera soothing body gels in jars and tubes',
      'Hydrating post-sun recovery lotions and tan prolonging creams',
      'Overnight sunburn relief balms and cooling sprays'
    ]
  }),

  createProductDef({
    slug: 'self-tanning-boxes',
    name: 'Self-Tanning Product Boxes',
    category: 'sun-care-boxes',
    additionalCategories: ['soap-body-care-boxes'],
    structure: 'auto-lock-bottom-box',
    short: 'Protective cartons for self-tan foaming mousse bottles, tanning drops, and bronzing lotions.',
    meta: 'Custom self-tanning product boxes. Packaging cartons for self-tan mousse bottles, tanning drop pipettes, and bronzing lotion tubes.',
    images: PRODUCT_IMAGE_MAP['self-tanning-boxes'],
    sizesText: 'Accommodates 150ml–200ml foaming mousse bottles with wide foamer pumps, 30ml glass dropper tanning concentrate vials, and tanning mist bottles.',
    uses: [
      'Self-tan foaming mousses with foaming pump dispensers',
      'Facial self-tanning drops in glass dropper bottles',
      'Gradual tanning daily lotions and express bronzing waters'
    ]
  })
);

// ==========================================
// 3. MAKEUP PACKAGING (25 products)
// ==========================================
const MAKEUP_ITEMS = [
  { slug: 'lipstick-boxes', name: 'Lipstick Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Bullet lipstick tubes, snap-cap lipstick cases, and luxury lip colors.', terms: 'Custom lipstick boxes, lipstick packaging with logo', home: true },
  { slug: 'liquid-lipstick-boxes', name: 'Liquid Lipstick Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Matte liquid lipsticks, doe-foot applicator vials, and long-wear lip stains.', terms: 'Liquid lip color packaging, matte liquid lip boxes' },
  { slug: 'lip-gloss-boxes', name: 'Lip Gloss Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Clear lip gloss tubes, squeezy gloss tubes, and shimmering lip lacquer bottles.', terms: 'Lip gloss tube boxes, lip glaze packaging', home: true },
  { slug: 'lip-balm-boxes', name: 'Lip Balm Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Twist-up lip balm sticks, circular lip butter tins, and organic beeswax balm tubes.', terms: 'Lip care boxes, lip balm tube packaging' },
  { slug: 'lip-liner-boxes', name: 'Lip Liner Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Wooden sharpenable lip pencils, automatic retractable lip liners, and contouring lip pencils.', terms: 'Lip pencil boxes, slim lip pencil packaging' },
  { slug: 'lip-tint-boxes', name: 'Lip Tint Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Water lip stains, velvet lip tints, and jelly tint bottles with applicator brushes.', terms: 'Lip stain packaging, water tint boxes' },
  { slug: 'lip-plumper-boxes', name: 'Lip Plumper Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Collagen lip plumpers, warming lip gloss vials, and instant lip volumizing serums.', terms: 'Lip plumping gloss boxes, lip volumizer cartons' },
  { slug: 'foundation-boxes', name: 'Foundation Boxes', structure: 'reverse-tuck-end-box', usesDesc: 'Glass foundation pump bottles, dropper foundation vials, and tube foundations.', terms: 'Liquid foundation boxes, foundation bottle packaging', home: true },
  { slug: 'concealer-boxes', name: 'Concealer Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Cream concealer tubes, wand applicators, and pot concealers.', terms: 'Concealer tube boxes, under-eye concealer cartons' },
  { slug: 'primer-boxes', name: 'Primer Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Pore-blurring face primer tubes, illuminating primer pumps, and hydrating base serums.', terms: 'Face primer packaging, makeup base boxes' },
  { slug: 'bb-cc-cream-boxes', name: 'BB & CC Cream Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Tinted moisturizer tubes, color-correcting CC cream bottles, and BB creams.', terms: 'BB cream boxes, CC cream packaging' },
  { slug: 'face-powder-boxes', name: 'Face Powder Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Round compact powder cases, loose setting powder jars with sifters, and baking powders.', terms: 'Compact powder boxes, loose powder packaging' },
  { slug: 'blush-boxes', name: 'Blush Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Pressed powder blush compacts, liquid blush dropper vials, and cream blush sticks.', terms: 'Powder blush boxes, liquid blush packaging' },
  { slug: 'highlighter-boxes', name: 'Highlighter Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Baked powder highlighter pans, liquid glow drops, and cream shimmer sticks.', terms: 'Highlighter palette and stick boxes, illuminating powder cartons' },
  { slug: 'bronzer-contour-boxes', name: 'Bronzer & Contour Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Contour sticks, matte bronzer pans, and dual-ended sculpting sticks.', terms: 'Bronzer boxes, contour stick packaging' },
  { slug: 'setting-spray-boxes', name: 'Setting Spray Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Mist spray bottles (50ml, 100ml), dewy fixing sprays, and matte setting spray pumps.', terms: 'Makeup fixing spray boxes, setting mist cartons' },
  { slug: 'mascara-boxes', name: 'Mascara Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Volumizing mascara tubes, waterproof lash wands, and tubing mascara packaging.', terms: 'Custom mascara packaging, lash mascara boxes', home: true },
  { slug: 'eyeliner-boxes', name: 'Eyeliner Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Felt tip liquid eyeliner pens, gel eyeliner glass pots, and kohl pencil liners.', terms: 'Liquid eyeliner boxes, eyeliner pencil boxes' },
  { slug: 'eyebrow-product-boxes', name: 'Eyebrow Product Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Micro brow pencils, tinted brow gels, and eyebrow pomade pots.', terms: 'Brow pencil boxes, eyebrow gel boxes' },
  { slug: 'eyeshadow-boxes', name: 'Eyeshadow Boxes', structure: 'sleeve-and-tray-box', usesDesc: 'Single shadow compacts, 4-pan quads, and multi-color eyeshadow palettes.', terms: 'Single eyeshadow boxes, eyeshadow palette packaging' },
  { slug: 'eyelash-boxes', name: 'Eyelash Boxes', structure: 'window-gift-box', usesDesc: 'Faux mink strip lashes, clear eyelash trays, and individual cluster lash cases.', terms: 'False lash boxes, lash packaging with window' },
  { slug: 'eyelash-glue-boxes', name: 'Eyelash Glue Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Brush-on lash adhesives, quick-drying black and clear eyelash glues.', terms: 'Lash adhesive packaging, strip lash glue boxes' },
  { slug: 'makeup-brush-boxes', name: 'Makeup Brush Boxes', structure: 'sleeve-and-tray-box', usesDesc: 'Individual kabuki brushes, multi-piece foundation/eyeshadow brush sets, and roll pouches.', terms: 'Brush set packaging, cosmetic brush boxes' },
  { slug: 'makeup-sponge-boxes', name: 'Makeup Sponge Boxes', structure: 'window-gift-box', usesDesc: 'Teardrop beauty blending sponges, microfiber makeup sponges, and sponge duos with stand.', terms: 'Beauty sponge packaging, blender sponge boxes' },
  { slug: 'makeup-set-boxes', name: 'Makeup Set Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Holiday makeup collections, lip kits with liner and lipstick, and complete look sets.', terms: 'Makeup kit boxes, cosmetic gift set packaging', home: true }
];

MAKEUP_ITEMS.forEach((item) => {
  const images = PRODUCT_IMAGE_MAP[item.slug] || ['/images/use-lipstick.jpg', '/images/g-lipstick-open.jpg'];
  PRODUCTS.push(
    createProductDef({
      slug: item.slug,
      name: item.name,
      category: 'makeup-boxes',
      additionalCategories: item.slug === 'makeup-set-boxes' ? ['beauty-gift-boxes'] : [],
      structure: item.structure,
      short: `Custom ${item.name.toLowerCase()} manufactured for retail beauty brands.`,
      meta: `Custom ${item.name.toLowerCase()}. ${item.terms}. Custom printed cosmetic cartons with foil stamping, embossing, and window cutouts.`,
      description: `Custom ${item.name.toLowerCase()} precision-cut to fit your container snugly. Features vibrant high-pigment exterior printing, metallic foil accents, and optional clear display windows.`,
      images,
      sizesText: `Available for standard, mini travel-size, and professional jumbo formats. Suitable for: ${item.usesDesc}. Internal support flaps keep items centered.`,
      uses: [item.usesDesc, 'Retail boutique and department store beauty counters', 'Online beauty brand unboxing and gift collections'],
      showOnHome: Boolean(item.home)
    })
  );
});

// ==========================================
// 4. SKINCARE PACKAGING (20 products)
// ==========================================
const SKINCARE_ITEMS = [
  {
    slug: 'serum-boxes',
    name: 'Serum Boxes',
    structure: 'straight-tuck-end-box',
    usesDesc: 'Glass dropper bottles (10ml, 15ml, 30ml, 50ml), pipette vials, and pump ampoules.',
    terms: 'Face serum boxes, dropper serum packaging, vitamin c serum boxes, retinol serum packaging',
    home: true,
    sections: [
      {
        heading: 'Serum bottles and dropper formats',
        body: 'Custom serum packaging boxes built specifically for glass dropper bottles in 10ml, 15ml, 30ml, and 50ml capacities. Includes paperboard neck collars and bottom support cradles to keep fragile glass pipettes and dropper bulbs upright, protected, and wobble-free.'
      },
      {
        heading: 'Serum variations & targeted formulas',
        body: 'Ideal for popular active ingredient formulations including Vitamin C serum, Hyaluronic Acid, Niacinamide, Retinol, Vitamin E, Brightening serums, and Anti-Aging peptide complexes. We provide ample panel space for active percentage declarations, ingredient transparency, and usage frequency instructions.'
      },
      {
        heading: 'Custom inserts & glass protection',
        body: 'Glass serum droppers require careful stabilization. Our custom die-cut paperboard inserts hold the base of the bottle while supporting the shoulder and neck, preventing glass-on-glass collision during shipping and retail handling.'
      },
      {
        heading: 'Sizing & clearance guidance',
        body: 'Measure your serum bottle from the glass bottom to the highest peak of the rubber bulb dropper. Add 2mm internal clearance. For heavy glass bases, we recommend 18pt or 20pt SBS paperboard for added strength.'
      },
      {
        heading: 'Artwork, pricing & ordering',
        body: 'Upload your vector dieline or let us format your branding, clinical claims, and batch code areas. Quotes are calculated based on volume, stock weight, and foil embellishments, with sample proofs provided prior to production.'
      }
    ]
  },
  { slug: 'face-cream-boxes', name: 'Face Cream Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Glass and acrylic face cream jars (30ml, 50ml), gel creams, and whipped face balms.', terms: 'Skin cream boxes, cream jar packaging', home: true },
  { slug: 'moisturizer-boxes', name: 'Moisturizer Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Daily hydrating moisturizer pump bottles, tub moisturizers, and facial barrier creams.', terms: 'Moisturising cream boxes, hydrating cream packaging' },
  { slug: 'night-cream-boxes', name: 'Night Cream Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Heavy overnight repair cream jars, peptide sleeping masks, and regenerative night balms.', terms: 'Overnight cream packaging, night repair jar boxes' },
  { slug: 'eye-cream-boxes', name: 'Eye Cream Boxes', structure: 'straight-tuck-end-box', usesDesc: '15ml under-eye cream tubes with metal cooling ceramic tips, pump vials, and eye balm pots.', terms: 'Under-eye cream boxes, eye serum packaging' },
  { slug: 'face-wash-boxes', name: 'Face Wash Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Foaming facial wash tubes (100ml–150ml), gel cleanser bottles, and pump dispensers.', terms: 'Facial wash boxes, face wash tube packaging' },
  { slug: 'facial-cleanser-boxes', name: 'Facial Cleanser Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Cleansing balm tubs with spatula compartments, cleansing oils, and micellar cream cartons.', terms: 'Cleansing balm boxes, cleansing oil boxes' },
  { slug: 'toner-boxes', name: 'Toner Boxes', structure: 'auto-lock-bottom-box', usesDesc: '150ml–200ml glass and PET face toner bottles, exfoliating acid toners, and essence waters.', terms: 'Face toner bottle packaging, skin toner boxes' },
  { slug: 'face-mist-boxes', name: 'Face Mist Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Hydrating facial spray mists, thermal water cans, and soothing rosewater glass mist bottles.', terms: 'Facial spray packaging, face mist cartons' },
  { slug: 'essence-boxes', name: 'Essence Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Fermented essence bottles, snail mucin bottles, and glass watery treatment lotions.', terms: 'Facial essence packaging, treatment lotion boxes' },
  { slug: 'face-oil-boxes', name: 'Face Oil Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Rosehip oil dropper bottles, squalane oil vials, and luxury botanical facial oil elixirs.', terms: 'Facial oil bottle boxes, botanical oil packaging' },
  { slug: 'face-scrub-boxes', name: 'Face Scrub Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Micro-exfoliating scrub jars, enzymatic exfoliating powder bottles, and scrub tubes.', terms: 'Facial exfoliator packaging, face scrub cartons' },
  { slug: 'face-mask-boxes', name: 'Face Mask Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Clay mask jars, peeling gel tubes, and overnight jelly mask containers.', terms: 'Clay mask boxes, mask jar packaging' },
  { slug: 'sheet-mask-boxes', name: 'Sheet Mask Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Outer retail cartons holding 5-pack, 10-pack, or single luxury sheet mask foil sachets.', terms: 'Outer cartons for sheet mask packs and sets, sheet mask multipacks' },
  { slug: 'under-eye-patch-boxes', name: 'Under-Eye Patch Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Round tubs containing 30 or 60 hydrogel eye patch pairs with spatula inserts.', terms: 'Eye patch jar boxes, hydrogel eye patch cartons' },
  { slug: 'acne-treatment-boxes', name: 'Acne Treatment Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Targeted spot treatment tubes (15ml), salicylic acid gels, and pimple patch sachet boxes.', terms: 'Spot treatment boxes, acne gel packaging' },
  { slug: 'makeup-remover-boxes', name: 'Makeup Remover Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Micellar cleansing water bottles, bi-phase eye makeup remover glass bottles, and balm tubs.', terms: 'Micellar water boxes, makeup remover bottle packaging' },
  { slug: 'lip-mask-boxes', name: 'Lip Mask Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Sleeping lip mask jars (20g), berry lip butter pots, and peptide lip therapy tubs.', terms: 'Overnight lip mask packaging, lip sleeping mask boxes' },
  { slug: 'lip-scrub-boxes', name: 'Lip Scrub Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Exfoliating sugar lip scrub glass jars (15g), conditioning scrub tins, and polishing pots.', terms: 'Lip exfoliator jar boxes, sugar scrub packaging' },
  { slug: 'skincare-set-boxes', name: 'Skincare Set Boxes', structure: 'auto-lock-bottom-box', usesDesc: '3-step skincare routine sets (Cleanser, Toner, Moisturizer), discovery bundles, and kits.', terms: 'Skincare kit boxes, skincare routine packaging', home: true }
];

SKINCARE_ITEMS.forEach((item) => {
  const images = PRODUCT_IMAGE_MAP[item.slug] || ['/images/use-skincare-jar.jpg', '/images/g-jar-open.jpg'];
  const additional = item.slug === 'skincare-set-boxes' ? ['beauty-gift-boxes'] : [];
  const def = createProductDef({
    slug: item.slug,
    name: item.name,
    category: 'skincare-boxes',
    additionalCategories: additional,
    structure: item.structure,
    short: `Custom ${item.name.toLowerCase()} designed for clinical and organic skincare lines.`,
    meta: `Custom ${item.name.toLowerCase()}. ${item.terms}. Custom printed skincare boxes with dropper cradles, window cutouts, and luxury finishes.`,
    description: `Custom ${item.name.toLowerCase()} engineered to protect and display your skincare formula. Includes tailored dielines for jars, dropper pipettes, and pump bottles with anti-humidity coatings.`,
    images,
    sizesText: `Precision-engineered for: ${item.usesDesc}. Available with internal paperboard fitments that hold jars and bottles firmly in place.`,
    uses: [item.usesDesc, 'Dermatologist and med-spa clinical skincare packaging', 'E-commerce subscription boxes and retail store shelving'],
    showOnHome: Boolean(item.home)
  });
  if (item.sections) def.sections = item.sections;
  PRODUCTS.push(def);
});

// ==========================================
// 5. HAIR CARE PACKAGING (15 products)
// ==========================================
const HAIR_ITEMS = [
  { slug: 'shampoo-boxes', name: 'Shampoo Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Liquid shampoo bottles (250ml, 500ml), pump shampoo dispensers, and salon gallon refills.', terms: 'Shampoo bottle packaging, hair wash cartons', home: true },
  { slug: 'shampoo-bar-boxes', name: 'Shampoo Bar Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Solid shampoo bars, round cold-process hair soap pucks, and zero-waste bar packaging.', terms: 'Solid shampoo packaging, eco-friendly hair bar cartons' },
  { slug: 'conditioner-boxes', name: 'Conditioner Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Rich hair conditioner bottles, deep conditioning mask tubes, and leave-in conditioner cartons.', terms: 'Hair conditioner bottle and tube boxes' },
  { slug: 'hair-oil-boxes', name: 'Hair Oil Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Rosemary hair growth oils, Moroccan argan oil bottles, coconut oil jars, and castor oil droppers.', terms: 'Custom hair oil packaging, rosemary oil boxes, argan oil packaging', home: true },
  { slug: 'hair-serum-boxes', name: 'Hair Serum Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Anti-frizz hair smoothing serums, keratin split-end repair droppers, and scalp barrier serums.', terms: 'Hair smoothing serum boxes, scalp serum cartons' },
  { slug: 'hair-mask-boxes', name: 'Hair Mask Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Deep repair hair mask tubs (200ml, 350ml), protein butter jars, and scalp mask pots.', terms: 'Hair treatment jar packaging, hair mask tub boxes' },
  { slug: 'hair-treatment-boxes', name: 'Hair Treatment Boxes', structure: 'sleeve-and-tray-box', usesDesc: 'Glass scalp treatment ampoules (set of 6 or 12), follicular leave-in sprays, and bond builders.', terms: 'Scalp treatment boxes, treatment ampoule boxes' },
  { slug: 'hair-color-boxes', name: 'Hair Color Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Permanent hair dye squeeze tubes, developer bottles, developer kits, and gloves.', terms: 'Hair dye boxes, hair coloring kit packaging' },
  { slug: 'henna-boxes', name: 'Henna Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Natural henna powder foil pouches, organic herbal hair dye powder cartons, and applicators.', terms: 'Henna powder boxes, henna kit packaging' },
  { slug: 'hair-styling-boxes', name: 'Hair Styling Product Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Matte hair clay tins, water-based pomade jars, styling waxes, and curl defining creams.', terms: 'Hair wax boxes, pomade boxes, hair gel packaging' },
  { slug: 'dry-shampoo-boxes', name: 'Dry Shampoo Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Aerosol dry shampoo cans, non-aerosol root powder shaker bottles, and puff containers.', terms: 'Dry shampoo outer packaging, volumizing dry shampoo boxes' },
  { slug: 'hair-spray-boxes', name: 'Hair Spray Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Aerosol hair lacquer cans, heat protectant pump sprays, and sea salt texture mists.', terms: 'Styling spray boxes, heat protection spray boxes' },
  { slug: 'hair-extension-boxes', name: 'Hair Extension Boxes', structure: 'sleeve-and-tray-box', usesDesc: 'Clip-in hair extension bundles, tape-in wefts, sew-in hair bundles, and ponytail wraps.', terms: 'Hair bundle packaging, hair extension pillow boxes' },
  { slug: 'wig-boxes', name: 'Wig Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Lace front wigs, human hair luxury wigs, cosplay wigs, and wig styling stands.', terms: 'Custom wig packaging, custom folding wig cartons' },
  { slug: 'hair-care-set-boxes', name: 'Hair Care Set Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Shampoo and conditioner companion sets, bond repair discovery kits, and salon gift boxes.', terms: 'Shampoo and conditioner sets, hair treatment kits', home: true }
];

HAIR_ITEMS.forEach((item) => {
  const images = PRODUCT_IMAGE_MAP[item.slug] || ['/images/use-shampoo.jpg', '/images/g-bottle-open.jpg'];
  const additional = ['hair-care-set-boxes', 'wig-boxes'].includes(item.slug) ? ['beauty-gift-boxes'] : [];
  PRODUCTS.push(
    createProductDef({
      slug: item.slug,
      name: item.name,
      category: 'hair-care-boxes',
      additionalCategories: additional,
      structure: item.structure,
      short: `Custom ${item.name.toLowerCase()} engineered for professional salon & haircare retail.`,
      meta: `Custom ${item.name.toLowerCase()}. ${item.terms}. Custom printed hair product boxes with crash-lock bottoms, dielines, and foil stamping.`,
      description: `Custom ${item.name.toLowerCase()} built to hold hair products safely on shelves and in shipping. Includes reinforced corners, moisture barriers, and custom foam or paperboard inserts.`,
      images,
      sizesText: `Designed for: ${item.usesDesc}. Sized to accommodate heavy liquid volumes and tall bottles cleanly.`,
      uses: [item.usesDesc, 'Hair salon retail counters and beauty supply distributors', 'E-commerce shipping kits and boxed hair bundles'],
      showOnHome: Boolean(item.home)
    })
  );
});

// ==========================================
// 6. SOAP, BATH, AND BODY CARE PACKAGING (17 products)
// ==========================================
const SOAP_ITEMS = [
  { slug: 'soap-boxes', name: 'Soap Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Cold-process handmade soaps, goat milk soap bars, charcoal detox bars, and glycerin soaps.', terms: 'Custom soap boxes, handmade soap packaging, organic soap cartons', home: true },
  { slug: 'liquid-soap-boxes', name: 'Liquid Soap Boxes', structure: 'auto-lock-bottom-box', usesDesc: '250ml–500ml liquid hand soap pump bottles, refill cartons, and foaming soap dispensers.', terms: 'Liquid soap bottle cartons, hand wash packaging' },
  { slug: 'body-wash-boxes', name: 'Body Wash Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Shower gel bottles, moisturizing body wash tubes, and exfoliating shower creams.', terms: 'Shower gel boxes, body wash bottle cartons' },
  { slug: 'body-lotion-boxes', name: 'Body Lotion Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Hydrating body lotion pump bottles (200ml–400ml), squeeze tubes, and body milks.', terms: 'Body lotion bottle and tube packaging, body milk boxes' },
  { slug: 'body-butter-boxes', name: 'Body Butter Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Shea body butter tubs (200ml), whipped cocoa butter jars, and body soufflé pots.', terms: 'Body cream jar boxes, body butter tub packaging' },
  { slug: 'body-scrub-boxes', name: 'Body Scrub Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Coffee body scrub pouches, Himalayan salt scrub jars, and sugar scrub tubs.', terms: 'Exfoliating body scrub packaging, sugar scrub jars' },
  { slug: 'body-oil-boxes', name: 'Body Oil Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Glass body oil bottles with pumps, shimmering dry oil vials, and massage oil bottles.', terms: 'Massage oil boxes, body oil bottle packaging' },
  { slug: 'hand-cream-boxes', name: 'Hand Cream Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Aluminum hand lotion tubes (30ml, 50ml, 75ml), purse-size hand balms, and hand salves.', terms: 'Hand lotion tube boxes, hand balm packaging' },
  { slug: 'foot-cream-boxes', name: 'Foot Cream Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Cracked heel balm sticks, urea foot cream squeeze tubes, and exfoliating foot mask boxes.', terms: 'Foot care product packaging, foot lotion cartons' },
  { slug: 'bath-bomb-boxes', name: 'Bath Bomb Boxes', structure: 'window-gift-box', usesDesc: 'Round spherical bath fizzers, multi-pack bath bomb gift cubes, and shower steamers.', terms: 'Bath bomb gift packaging, bath fizzer window boxes', home: true },
  { slug: 'bath-salt-boxes', name: 'Bath Salt Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Epsom bath salt glass jars, Dead Sea salt pouch boxes, and mineral soak containers.', terms: 'Bath salt jar and pouch outer boxes, bath soak packaging' },
  { slug: 'deodorant-boxes', name: 'Deodorant Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Twist-up natural deodorant sticks, push-up paperboard deodorant tubes, and balm pots.', terms: 'Deodorant stick packaging, natural deodorant boxes' },
  { slug: 'roll-on-boxes', name: 'Roll-On Boxes', structure: 'straight-tuck-end-box', usesDesc: '50ml rollerball deodorant bottles, essential oil roll-ons, and cooling pulse-point oils.', terms: 'Roll-on deodorant bottle boxes, rollerball packaging' },
  { slug: 'hair-removal-cream-boxes', name: 'Hair Removal Cream Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Depilatory cream squeeze tubes with curved plastic applicator spatulas included.', terms: 'Depilatory cream packaging, hair removal cartons' },
  { slug: 'waxing-product-boxes', name: 'Waxing Product Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Cold wax strip packets, hard wax bean pouches, and microwaveable wax jar kits.', terms: 'Wax strip boxes, waxing kit packaging' },
  { slug: 'hand-sanitizer-boxes', name: 'Hand Sanitizer Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Pocket sanitizer spray cards, 60ml travel bottles, and antimicrobial foam pump cartons.', terms: 'Sanitizer bottle outer packaging, pocket sanitizer cartons' },
  { slug: 'bath-body-gift-boxes', name: 'Bath & Body Gift Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Spa gift sets (Lotion, Wash, Scrub, Bath Bomb), hotel amenity sets, and holiday body kits.', terms: 'Body care sets, bath gift sets, spa gift packaging', home: true }
];

SOAP_ITEMS.forEach((item) => {
  const images = PRODUCT_IMAGE_MAP[item.slug] || ['/images/use-soap.jpg', '/images/use-kraft-goods.jpg'];
  const additional = item.slug === 'bath-body-gift-boxes' ? ['beauty-gift-boxes'] : [];
  PRODUCTS.push(
    createProductDef({
      slug: item.slug,
      name: item.name,
      category: 'soap-body-care-boxes',
      additionalCategories: additional,
      structure: item.structure,
      short: `Custom ${item.name.toLowerCase()} tailored for natural soap makers and body care brands.`,
      meta: `Custom ${item.name.toLowerCase()}. ${item.terms}. Custom printed soap and bath boxes with scent windows, kraft board, and luxury coatings.`,
      description: `Custom ${item.name.toLowerCase()} crafted from durable paperboard and natural kraft boards. Features optional scent-release cutout windows, greaseproof coatings, and multi-piece partitions.`,
      images,
      sizesText: `Engineered for: ${item.usesDesc}. Available with customized compartments, grease-resistant liners, and ventilation cutouts.`,
      uses: [item.usesDesc, 'Farmer’s markets, boutique apothecary stores, and retail chains', 'Holiday spa gift baskets and e-commerce body care orders'],
      showOnHome: Boolean(item.home)
    })
  );
});

// ==========================================
// 7. PERFUME AND FRAGRANCE PACKAGING (8 products)
// ==========================================
const FRAGRANCE_ITEMS = [
  { slug: 'perfume-boxes', name: 'Perfume Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Luxury 50ml and 100ml glass perfume bottles, eau de parfum sprays, and designer flacons.', terms: 'Custom perfume boxes, perfume bottle packaging, luxury fragrance cartons', home: true },
  { slug: 'cologne-boxes', name: 'Cologne Boxes', structure: 'reverse-tuck-end-box', usesDesc: 'Men’s eau de cologne flacons, wooden-cap fragrance bottles, and grooming splash bottles.', terms: 'Men’s fragrance packaging, cologne bottle boxes', home: true },
  { slug: 'attar-boxes', name: 'Attar Boxes', structure: 'straight-tuck-end-box', usesDesc: 'Traditional 3ml, 6ml, and 12ml crystal octagonal ittar bottles with glass dipsticks.', terms: 'Ittar boxes, attar bottle packaging, concentrated perfume oil boxes' },
  { slug: 'perfume-oil-boxes', name: 'Perfume Oil Boxes', structure: 'straight-tuck-end-box', usesDesc: '10ml rollerball perfume oils, concentrated oil roll-ons, and travel fragrance tubes.', terms: 'Roll-on perfume oil packaging, fragrance rollerball cartons' },
  { slug: 'body-mist-boxes', name: 'Body Mist Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Tall 250ml fragrance mist spray bottles, shimmer mists, and hair perfume sprays.', terms: 'Fragrance mist packaging, body spray cartons' },
  { slug: 'perfume-sample-boxes', name: 'Perfume Sample Boxes', structure: 'straight-tuck-end-box', usesDesc: '1.5ml–2ml fragrance sample spray vials on printed card backing or miniature tuck boxes.', terms: 'Sample vial boxes, mini perfume packaging' },
  { slug: 'perfume-discovery-set-boxes', name: 'Perfume Discovery Set Boxes', structure: 'sleeve-and-tray-box', usesDesc: 'Curated 5-piece or 8-piece fragrance discovery flight boxes with velvet foam inserts.', terms: 'Fragrance sample collection boxes, perfume discovery kit packaging', home: true },
  { slug: 'perfume-gift-set-boxes', name: 'Perfume Gift Set Boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Full-size perfume bottle paired with matching scented body lotion and travel spray.', terms: 'Fragrance gift packaging, perfume gift set boxes', home: true }
];

FRAGRANCE_ITEMS.forEach((item) => {
  const images = PRODUCT_IMAGE_MAP[item.slug] || ['/images/use-perfume.jpg', '/images/g-perfume-closed.jpg'];
  const additional = ['perfume-discovery-set-boxes', 'perfume-gift-set-boxes'].includes(item.slug) ? ['beauty-gift-boxes'] : [];
  PRODUCTS.push(
    createProductDef({
      slug: item.slug,
      name: item.name,
      category: 'fragrance-boxes',
      additionalCategories: additional,
      structure: item.structure,
      short: `Luxury ${item.name.toLowerCase()} with custom foam and paperboard inserts.`,
      meta: `Custom ${item.name.toLowerCase()}. ${item.terms}. High-end perfume packaging with metallic foil, custom inserts, and folding paperboard.`,
      description: `Custom ${item.name.toLowerCase()} built to create an unforgettable unboxing experience while safeguarding valuable glass fragrance bottles against impact and drops.`,
      images,
      sizesText: `Customized for: ${item.usesDesc}. Available with custom-cut high-density EVA foam and velvet-topped inserts that hug the contours of your glass bottle.`,
      uses: [item.usesDesc, 'Luxury department stores and niche perfumery boutiques', 'High-value fragrance gift sets and online direct-to-consumer launches'],
      showOnHome: Boolean(item.home)
    })
  );
});

// ==========================================
// 8. MEN'S GROOMING, NAILS & BEAUTY ACCESSORIES (15 products)
// ==========================================
const MENS_AND_OTHER_ITEMS = [
  // Men's Grooming (7)
  { slug: 'beard-oil-boxes', name: 'Beard Oil Boxes', cat: 'mens-grooming-boxes', structure: 'straight-tuck-end-box', usesDesc: '30ml and 50ml amber and black glass beard oil dropper bottles.', terms: 'Beard oil bottle packaging, beard conditioning oil cartons', home: true },
  { slug: 'beard-balm-boxes', name: 'Beard Balm Boxes', cat: 'mens-grooming-boxes', structure: 'straight-tuck-end-box', usesDesc: 'Round 60g aluminum beard balm tins, moustache wax pots, and conditioning butters.', terms: 'Beard balm tin and jar boxes, moustache wax packaging' },
  { slug: 'beard-wash-boxes', name: 'Beard Wash Boxes', cat: 'mens-grooming-boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Beard shampoo bottles (100ml, 200ml) with disc caps or pump dispensers.', terms: 'Beard shampoo packaging, beard wash cartons' },
  { slug: 'shaving-cream-boxes', name: 'Shaving Cream Boxes', cat: 'mens-grooming-boxes', structure: 'straight-tuck-end-box', usesDesc: 'Traditional lathering shave cream tubes, tub jars, and brushless shaving creams.', terms: 'Shave cream packaging, shaving cream tubes' },
  { slug: 'shaving-soap-boxes', name: 'Shaving Soap Boxes', cat: 'mens-grooming-boxes', structure: 'straight-tuck-end-box', usesDesc: 'Round shaving soap pucks, wooden bowl shaving soaps, and refill pucks.', terms: 'Shaving bar packaging, shaving puck boxes' },
  { slug: 'aftershave-boxes', name: 'Aftershave Boxes', cat: 'mens-grooming-boxes', structure: 'straight-tuck-end-box', usesDesc: 'Cooling aftershave splash glass bottles, soothing aftershave balms, and post-shave lotions.', terms: 'Aftershave lotion and balm boxes, post-shave splash cartons' },
  { slug: 'mens-grooming-kit-boxes', name: 'Men’s Grooming Kit Boxes', cat: 'mens-grooming-boxes', structure: 'sleeve-and-tray-box', usesDesc: 'Complete beard care sets (Oil, Balm, Brush, Scissors), wet shave safety razor kits.', terms: 'Beard care sets, shaving gift sets, men’s gift boxes', addCat: ['beauty-gift-boxes'], home: true },

  // Nail care & additional beauty (8)
  { slug: 'nail-polish-boxes', name: 'Nail Polish Boxes', cat: 'makeup-boxes', structure: 'straight-tuck-end-box', usesDesc: 'Standard 15ml nail lacquer glass bottles, mini polish bottles, and treatment coats.', terms: 'Custom nail polish packaging, nail lacquer boxes', home: true },
  { slug: 'gel-nail-polish-boxes', name: 'Gel Nail Polish Boxes', cat: 'makeup-boxes', structure: 'straight-tuck-end-box', usesDesc: 'Opaque UV/LED gel polish bottles with shade-matching cutout windows.', terms: 'Gel polish bottle boxes, UV gel lacquer cartons' },
  { slug: 'press-on-nail-boxes', name: 'Press-On Nail Boxes', cat: 'makeup-boxes', structure: 'window-gift-box', usesDesc: 'Reusable artificial nail tip sets (24 or 30 nails) with adhesive tabs and prep kits.', terms: 'Artificial nail boxes, press-on nail packaging with clear window' },
  { slug: 'nail-care-boxes', name: 'Nail Care Boxes', cat: 'makeup-boxes', structure: 'straight-tuck-end-box', usesDesc: 'Cuticle oil pens, glass nail file sleeves, cuticle remover serums, and nail strengtheners.', terms: 'Cuticle oil boxes, nail treatment packaging' },
  { slug: 'beauty-tool-boxes', name: 'Beauty Tool Boxes', cat: 'makeup-boxes', structure: 'sleeve-and-tray-box', usesDesc: 'Rose quartz gua sha stones, jade facial rollers, eyelash curlers, and LED beauty wands.', terms: 'Gua sha boxes, facial roller boxes, beauty tool packaging' },
  { slug: 'beauty-advent-calendar-boxes', name: 'Beauty Advent Calendar Boxes', cat: 'beauty-gift-boxes', structure: 'auto-lock-bottom-box', usesDesc: '12-day and 24-day countdown calendars with pull-out numbered product doors.', terms: 'Cosmetic advent calendar packaging, holiday beauty calendars', home: true },
  { slug: 'beauty-pr-boxes', name: 'Beauty PR Boxes', cat: 'beauty-gift-boxes', structure: 'auto-lock-bottom-box', usesDesc: 'Large influencer launch boxes, VIP beauty seeding packages, and unboxing kits.', terms: 'Influencer packaging, beauty launch boxes, VIP PR mailer boxes', home: true },
  { slug: 'travel-beauty-set-boxes', name: 'Travel Beauty Set Boxes', cat: 'beauty-gift-boxes', structure: 'sleeve-and-tray-box', usesDesc: 'TSA-compliant mini cosmetic kits, travel skincare duos, and weekend getaway beauty packs.', terms: 'Mini cosmetic sets, travel skincare kits, beauty travel packs' }
];

MENS_AND_OTHER_ITEMS.forEach((item) => {
  const images = PRODUCT_IMAGE_MAP[item.slug] || ['/images/use-hair-oil.jpg', '/images/use-cosmetic-bottle.jpg'];
  PRODUCTS.push(
    createProductDef({
      slug: item.slug,
      name: item.name,
      category: item.cat,
      additionalCategories: item.addCat || [],
      structure: item.structure,
      short: `Custom ${item.name.toLowerCase()} with precision inserts and retail-ready printing.`,
      meta: `Custom ${item.name.toLowerCase()}. ${item.terms}. Custom printed boxes tailored to your product dimensions.`,
      description: `Custom ${item.name.toLowerCase()} engineered for high visual appeal and product protection. Built to your exact dimensions with luxury paperboards, foam cradles, and metallic foil finishes.`,
      images,
      sizesText: `Designed for: ${item.usesDesc}. Customized with exact clearances to prevent shifting.`,
      uses: [item.usesDesc, 'Retail display shelving and premium boutique merchandising', 'E-commerce subscription boxes and holiday gift collections'],
      showOnHome: Boolean(item.home)
    })
  );
});

// ==========================================
// 9. BRAND INTENT / CAPABILITY PAGES (7 products/pages)
// ==========================================
const BRAND_INTENT_ITEMS = [
  {
    slug: 'custom-printed-boxes',
    name: 'Custom Printed Boxes',
    category: 'cosmetic-boxes',
    structure: 'straight-tuck-end-box',
    short: 'Custom printed product boxes with your brand logo, custom colors, and dimensions.',
    meta: 'Custom printed boxes, boxes with my logo, branded product boxes, custom boxes for my brand. Low MOQ, fast turnaround, high-definition printing.',
    description: 'Create custom printed boxes with your brand’s logo and colors. From folding cartons to custom gift boxes, we produce bespoke packaging tailored to your exact bottle, tube, or jar dimensions with zero guesswork.',
    images: PRODUCT_IMAGE_MAP['custom-printed-boxes'],
    sizesText: 'Manufactured to order for any product size or container style: tubes, jars, dropper bottles, dropper ampoules, and multi-piece sets.',
    uses: ['Branded boxes with your company logo and pantone brand colors', 'Retail shelf display packaging for new cosmetic product lines', 'E-commerce shipping boxes and subscription packaging']
  },
  {
    slug: 'cosmetic-packaging-design',
    name: 'Cosmetic Packaging Design',
    category: 'cosmetic-boxes',
    structure: 'straight-tuck-end-box',
    short: 'Professional dieline preparation and structural packaging design for beauty brands.',
    meta: 'Help designing cosmetic boxes, packaging design for my beauty brand. Structural engineering, 3D proofs, and dieline templates.',
    description: 'Expert cosmetic packaging design support to help you take your beauty brand from container concept to finished printed box. We generate precise dielines and verify artwork resolution, bleeds, and compliance layout before production.',
    images: PRODUCT_IMAGE_MAP['cosmetic-packaging-design'],
    uses: ['Custom structural dieline generation for novel container shapes', 'Pre-press artwork layout and regulatory label positioning support', '3D digital box mockups and printed production proofs']
  },
  {
    slug: 'beauty-startup-packaging',
    name: 'Packaging for New Beauty Brands',
    category: 'cosmetic-boxes',
    structure: 'straight-tuck-end-box',
    short: 'Beginner-friendly packaging solutions and low barrier-to-entry runs for emerging beauty startups.',
    meta: 'Boxes for my skincare brand, packaging for a new cosmetic business. Guidance on dielines, materials, and cost-effective print runs.',
    description: 'Tailored packaging solutions for new beauty entrepreneurs and emerging indie brands. We guide you step-by-step through container sizing, dieline preparation, material selection, and cost-effective initial print quantities.',
    images: PRODUCT_IMAGE_MAP['beauty-startup-packaging'],
    uses: ['Launch packaging for new organic skincare and clean cosmetic brands', 'Kickstarter and indie beauty brand initial production runs', 'Boutique beauty test runs across multiple product shade variations']
  },
  {
    slug: 'small-order-cosmetic-boxes',
    name: 'Small Order Cosmetic Boxes',
    category: 'cosmetic-boxes',
    structure: 'straight-tuck-end-box',
    short: 'Low minimum order quantity (low MOQ) custom printed cosmetic boxes.',
    meta: 'Small quantity cosmetic boxes, low minimum order packaging. Custom printed cosmetic cartons starting at low minimums with no die plate charges.',
    description: 'Custom printed cosmetic packaging with low minimum order quantities. Ideal for limited-edition seasonal launches, seasonal beauty drops, and small-batch artisanal cosmetic brands who need premium packaging without warehousing thousands of units.',
    images: PRODUCT_IMAGE_MAP['small-order-cosmetic-boxes'],
    uses: ['Short-run seasonal makeup drops and holiday editions', 'Small-batch artisanal soaps, face oils, and apothecary formulas', 'Market validation runs and pilot retail testing']
  },
  {
    slug: 'wholesale-cosmetic-boxes',
    name: 'Wholesale Cosmetic Boxes',
    category: 'cosmetic-boxes',
    structure: 'straight-tuck-end-box',
    short: 'High-volume wholesale printed cosmetic boxes with scalable volume discounts.',
    meta: 'Bulk cosmetic boxes, wholesale printed cosmetic packaging. Scalable offset printing, automated die-cutting, and dedicated account support.',
    description: 'High-volume wholesale cosmetic packaging manufacturing for established brands, contract manufacturers, and national retail distributors. Benefit from aggressive volume pricing tiers, automated folding carton gluing, and dedicated pre-press quality control.',
    images: PRODUCT_IMAGE_MAP['wholesale-cosmetic-boxes'],
    uses: ['Nationwide retail chain distribution and department store replenishment', 'Contract filler and private label cosmetics manufacturing packaging', 'High-volume e-commerce recurring subscription box fulfillment']
  },
  {
    slug: 'beauty-subscription-boxes',
    name: 'Beauty Subscription Boxes',
    category: 'beauty-gift-boxes',
    structure: 'die-cut-mailer-box',
    short: 'Sturdy corrugated mailer boxes engineered for monthly beauty and skincare subscription deliveries.',
    meta: 'Beauty subscription packaging, monthly skincare boxes, cosmetic subscription mailers. Strong corrugated transit boxes with full-color interior printing.',
    description: 'Custom beauty subscription boxes built from durable E-flute corrugated board with high-impact interior flood printing. Delivers an exciting unboxing experience on customers’ doorsteps month after month while protecting cosmetic bottles and palettes in transit.',
    images: PRODUCT_IMAGE_MAP['beauty-subscription-boxes'],
    uses: ['Monthly beauty discovery subscription deliveries', 'Seasonal skincare club VIP mailers', 'Influencer PR and beauty editor product seeding boxes']
  },
  {
    slug: 'request-a-quote',
    name: 'Request a Quote for Custom Boxes',
    category: 'cosmetic-boxes',
    structure: 'straight-tuck-end-box',
    short: 'Instant packaging quotation inquiry for your cosmetic bottles, jars, and custom sets.',
    meta: 'Custom box pricing, get a packaging quote. Fast quotes for custom printed cosmetic boxes, folding cartons, and custom gift boxes.',
    description: 'Get an accurate, transparent price quote for your custom cosmetic packaging. Submit your container dimensions, preferred box style, quantity, and finishes, and our packaging team will respond with structural dielines and pricing within 24 hours.',
    images: PRODUCT_IMAGE_MAP['request-a-quote'],
    uses: ['Fast pricing estimates for custom cosmetic and skincare boxes', 'Material and finish cost comparisons across quantity tiers', 'Structural dieline consultation and custom sample inquiries']
  }
];

BRAND_INTENT_ITEMS.forEach((item) => {
  PRODUCTS.push(
    createProductDef({
      slug: item.slug,
      name: item.name,
      category: item.category,
      structure: item.structure,
      short: item.short,
      meta: item.meta,
      description: item.description,
      images: item.images,
      uses: item.uses,
      showOnHome: false
    })
  );
});

// ==========================================
// CROSS-LINK RELATED PRODUCTS INTELLIGENTLY
// ==========================================
// For each product, pick 3 to 5 relevant related products in the same or complementary categories
PRODUCTS.forEach((prod) => {
  const sameCat = PRODUCTS.filter((p) => p.slug !== prod.slug && p.category === prod.category);
  const otherCat = PRODUCTS.filter((p) => p.slug !== prod.slug && p.category !== prod.category);
  const picked = [...sameCat.slice(0, 3), ...otherCat.slice(0, 2)].slice(0, 4);
  prod.related = picked.map((target) => ({
    slug: target.slug,
    note: `Compare packaging styles for ${target.name}.`
  }));
});

console.log(`Generated ${CATEGORIES.length} categories and ${PRODUCTS.length} products.`);

// Read existing catalog to keep hero slides
let existingHero = [];
try {
  const existing = JSON.parse(fs.readFileSync('content/catalog.json', 'utf8'));
  existingHero = (existing.heroSlides || []).map((slide) => ({
    ...slide,
    alt: (slide.alt || '').replace(/rigid box/gi, 'folding gift carton'),
    secondaryHref: slide.secondaryHref === '/custom-boxes' ? '/cosmetic-boxes' : slide.secondaryHref
  }));
} catch (e) {
  existingHero = [];
}

const CATALOG_DATA = {
  heroSlides: existingHero.length ? existingHero : [
    {
      id: 'cosmetic-boxes-hero',
      title: 'Custom Cosmetic Boxes, Made to Your Product',
      lead: 'Skincare, makeup, sun care, hair care, and luxury gift sets. Specify your container size, select premium finishes, and request your custom quote.',
      image: '/images/hero-packaging.png',
      alt: 'Luxury cosmetic packaging boxes for skincare, lipsticks, and beauty products.',
      collage: false,
      primaryLabel: 'Get a Quote',
      primaryHref: '/quote',
      secondaryLabel: 'Explore boxes',
      secondaryHref: '/cosmetic-boxes'
    }
  ],
  categories: CATEGORIES,
  products: PRODUCTS
};

fs.writeFileSync(
  path.join(process.cwd(), 'content', 'catalog.json'),
  JSON.stringify(CATALOG_DATA, null, 2)
);

console.log('Saved to content/catalog.json successfully!');
