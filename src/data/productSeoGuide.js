function cleanList(items = []) {
  return items.map((item) => String(item || '').trim()).filter(Boolean);
}

function coreFromName(name = '') {
  return String(name)
    .replace(/\s+boxes$/i, '')
    .replace(/\s+box$/i, '')
    .replace(/\s+packaging$/i, '')
    .trim();
}

function faqValue(faqs, matcher) {
  const hit = (Array.isArray(faqs) ? faqs : []).find((item) => matcher.test(String(item?.q || '')));
  return hit?.a || '';
}

/**
 * Handwritten description copy for the highest-value commercial pages.
 * Keep headings and body unique per product — no shared fill-in templates,
 * and no quoted search-term filler lines.
 */
const FEATURED_DESCRIPTIONS = {
  'lipstick-boxes': [
    {
      heading: 'Lipstick boxes built around the bullet and cap',
      paragraphs: [
        'A lipstick box has one job: hold a closed lipstick securely while the shade name stays readable on the front. Box Studio cuts the carton to the bullet mechanism and cap, so the pack does not rattle on a shade wall or look oversized next to neighbouring SKUs.',
        'Custom lipstick boxes manufactured for retail beauty brands usually use a straight tuck end so packing stays simple. High-pigment print, optional foil, and a clean front panel help the shade read from a short distance — important for boutique counters and department store walls.',
        'Typical fills include bullet lipstick tubes, snap-cap cases, and luxury lip colours for retail and online unboxing. When you request a quote, send the closed lipstick length and cross-section so the internal fit is correct before artwork is locked.',
      ],
    },
    {
      heading: 'What to confirm before lipstick packaging goes to print',
      paragraphs: [
        'Measure the closed lipstick with the cap on. Internal height must clear that length; width and depth only need enough room so the mechanism is not crushed. Do not count the tuck flap as part of the height.',
        'Decide whether the front carries only the brand and shade, or also a window or foil accent. Busy decoration on every panel usually hurts recognition more than it helps on a dense shade wall.',
        'Starter structure reference for this page is a straight tuck end carton. Paperboard or kraft board, matte or gloss, foil and emboss are available depending on the quote. Production runs commonly start around 250–500 units, with volume tiers above that — confirm current MOQ and lead time on your quote.',
      ],
    },
  ],
  'liquid-lipstick-boxes': [
    {
      heading: 'Boxes for liquid lipstick vials and doe-foot applicators',
      paragraphs: [
        'Liquid lipstick packaging is taller and often slimmer than a bullet lipstick carton. The closed vial — including the doe-foot applicator cap — sets the height. Box Studio sizes the tuck carton to that closed component so the pack stands cleanly on retail shelves and in DTC unboxing.',
        'Matte liquid lipsticks, long-wear stains, and applicator vials benefit from a snug fit and a front panel that can carry shade names without crowding. Print and optional foil stay secondary to proportion: if the carton looks like a mascara box, shoppers read the wrong category.',
        'Share the closed vial height and the widest point of the cap when you quote. That keeps the dieline honest for production instead of copying a lipstick blank that does not fit.',
      ],
    },
    {
      heading: 'Fit notes for liquid lip packaging',
      paragraphs: [
        'A straight tuck end is the usual structure here: flat for shipping, filled by hand, front panel free for print. Soft-touch or matte finishes are common for liquid lip lines that want a modern, less glossy shelf look.',
        'If you also sell bullet lipstick, do not reuse one dieline for both. The mechanisms differ in width and height. Separate cartons keep both lines presentation-ready.',
        'MOQ and turnaround follow standard custom folding-carton ranges (often from a few hundred units, with proofing before full production). Exact numbers are confirmed on the quote for your size and finish.',
      ],
    },
  ],
  'lip-gloss-boxes': [
    {
      heading: 'Slim cartons for lip gloss tubes',
      paragraphs: [
        'Lip gloss boxes should feel as slim as the tube they hold. Clear gloss tubes, squeeze tubes, and lacquer bottles each need a different footprint — Box Studio builds the carton around the closed component, not a generic lip blank.',
        'Retail beauty brands use these packs on shade walls and in online kits where the gloss must look precise next to lipstick and balm. High-pigment print and optional foil work best when they support one clear product name.',
        'Send tube length with the cap on and the cap diameter. That is usually the widest point and the detail that prevents a loose or over-tight carton.',
      ],
    },
    {
      heading: 'Gloss packaging choices that stay manufacturable',
      paragraphs: [
        'Straight tuck cartons keep packing simple for single tubes. Windows are optional when the formula colour should show; solid fronts are better when shade chips or naming carry the story.',
        'If the same brand also packs mascara, keep the proportions distinct. Gloss tubes are shorter; mascara wands drive a taller pack.',
        'Ask for a structural sample when the tube is unusual. Fitting the tube once saves reprint issues later.',
      ],
    },
  ],
  'lip-balm-boxes': [
    {
      heading: 'Packaging for sticks, tins, and balm tubes',
      paragraphs: [
        'Lip balm boxes cover more shapes than lipstick: twist-up sticks, round butter tins, and soft tubes all show up in the same category. The carton has to match the fill, or the pack looks wrong on shelf even when the print is strong.',
        'Organic beeswax sticks and tin balms often want a shorter, wider footprint than a bullet lipstick. Box Studio sizes to the closed component and leaves room for a simple brand panel — useful for boutique counters and gift-friendly online orders.',
        'Tell us whether the product is a stick, tin, or tube. One sentence is enough to start the right dieline conversation.',
      ],
    },
    {
      heading: 'Practical options for balm cartons',
      paragraphs: [
        'Paperboard tuck cartons remain the everyday choice. Kraft faces suit natural balm stories; white board suits brighter brand systems. Foil is optional and works best as a small accent, not a full wrap.',
        'Measure height with the cap or lid closed. For tins, send diameter and height so the internal square or rectangle does not float.',
        'Quantity and lead time are quoted against your size and finish after artwork review — typically starting in the low hundreds for custom print runs.',
      ],
    },
  ],
  'mascara-boxes': [
    {
      heading: 'Tall cartons sized to the mascara tube and wand',
      paragraphs: [
        'Mascara boxes are tall because the closed tube includes the wand. Volumizing, waterproof, and tubing mascaras all need that full closed length cleared inside the carton. Box Studio cuts to the component so the pack does not crush the cap or look stubby on the beauty wall.',
        'A clean front panel carries brand and product type; the tuck structure ships flat and fills by hand. Retail counters and online kits both benefit from a snug, upright pack.',
        'Measure the closed tube from base to cap tip. Width only needs to stop rattling — extra width makes the carton look like a bottle pack.',
      ],
    },
    {
      heading: 'Keeping mascara packaging distinct from lip and liner',
      paragraphs: [
        'Do not share a lipstick or eyeliner dieline with mascara. Heights and silhouettes differ, and shoppers use that silhouette as a category cue.',
        'Finishes stay secondary to proportion: matte, gloss, or a foil nameplate can work once the size is correct.',
        'Request a white structural sample if your wand assembly is longer than a standard tube. Fit first, then print.',
      ],
    },
  ],
  'foundation-boxes': [
    {
      heading: 'Foundation packaging for pumps, droppers, and tubes',
      paragraphs: [
        'Foundation boxes have to respect the component: glass pump bottles, dropper vials, and squeeze tubes each need different footprints. Box Studio sizes the carton to the closed fill so shade systems stay aligned on shelf.',
        'Retail beauty brands often need a reverse tuck or similar folding carton that leaves a strong front for shade and finish names. Print quality matters because foundation lines are compared side by side.',
        'Send the closed bottle or tube dimensions, including the pump or dropper height. That single measurement prevents a carton that looks right in a mockup but fails on the packing table.',
      ],
    },
    {
      heading: 'Shelf-ready foundation carton notes',
      paragraphs: [
        'Heavier glass bottles may need a more secure base or insert discussion on the quote. Light tubes can stay on a simple tuck.',
        'Keep artwork hierarchy simple: brand, product type, shade. Extra claims belong on the side or back if the front must stay scannable.',
        'MOQ and production timing follow custom folding-carton norms and are confirmed after proof approval on your project.',
      ],
    },
  ],
  'serum-boxes': [
    {
      heading: 'Serum boxes for droppers, pipettes, and clinical lines',
      paragraphs: [
        'Serum packaging protects glass and keeps a clinical or clean-beauty story readable. Box Studio engineers the carton for dropper bottles — commonly 10 ml, 15 ml, 30 ml, and 50 ml — plus pipette vials and pump ampoules used in dermatologist and med-spa ranges.',
        'Custom serum boxes designed for clinical and organic skincare lines often need anti-humidity coatings and a dieline that clears the dropper collar. The pack should feel precise, not oversized, whether it sits on a clinic shelf or arrives in a subscription box.',
        'Share the closed bottle height including the dropper, plus the shoulder diameter. Those two numbers drive a carton that holds the glass still without wasting board.',
      ],
    },
    {
      heading: 'How serum cartons differ from cream jars',
      paragraphs: [
        'A serum dropper is tall and narrow; a cream jar is short and wide. Using one blank for both usually fails on shelf and in transit. Keep serum boxes on their own footprint.',
        'Straight tuck ends are common for single bottles. Inserts or cradles can be quoted when the glass is especially fragile or the neck is unusual.',
        'Typical custom print runs start around 250–500 units, with structural samples and digital proofs available before mass production. Lead time is commonly quoted after artwork approval — often in the multi-week production window depending on finish and quantity.',
      ],
    },
  ],
  'face-cream-boxes': [
    {
      heading: 'Face cream boxes sized to jars and balms',
      paragraphs: [
        'Face cream packaging is about jar footprint: glass and acrylic jars (often 30 ml and 50 ml), gel creams, and whipped balms need a carton that clears the lid and holds the base steady. Box Studio cuts to the closed jar so clinical and organic lines stay tidy on shelf.',
        'Dermatologist and retail skincare brands use these packs where the product name and texture claim must stay clear. The carton should feel solid in hand without looking like a tall serum pack.',
        'Measure jar diameter and closed height with the lid on. Add a little clearance so the lid does not bind when the tuck closes.',
      ],
    },
    {
      heading: 'Cream carton structure and finishing',
      paragraphs: [
        'Paperboard tuck cartons cover most single-jar SKUs. Wider jars may need a different panel ratio than dropper serums — that is intentional.',
        'Matte finishes suit clinical stories; soft foil accents can mark a premium night cream without covering every panel.',
        'Quantity breaks and timing are confirmed on quote after size and artwork are set. Ask for a fit sample when the jar thread or lid is non-standard.',
      ],
    },
  ],
  'moisturizer-boxes': [
    {
      heading: 'Moisturizer packaging for pumps, tubs, and barrier creams',
      paragraphs: [
        'Moisturizer boxes often hold heavier fills: pump bottles, tubs, and facial barrier creams. An auto-lock or crash-lock style base can help when the pack is filled often or the bottle is tall — Box Studio matches structure to the closed component.',
        'Daily hydrating pumps and tub moisturizers need clear hierarchy on the front and enough internal height for the pump head. Clinical and e-commerce lines both benefit from a carton that survives shipping without panel crush.',
        'Send closed height including the pump, plus the widest diameter. That keeps the dieline honest before print.',
      ],
    },
    {
      heading: 'Choosing board and base for moisturizer cartons',
      paragraphs: [
        'Taller pump bottles lean toward auto-lock bottoms for packing speed. Shorter tubs can stay on a simpler tuck if the weight is modest.',
        'Paperboard with matte or gloss lamination is typical. Soft-touch is a finish choice, not a structure change.',
        'Confirm MOQ, volume tiers, and lead time on the quote — custom folding-carton projects usually proof structurally and in colour before the full run.',
      ],
    },
  ],
  'face-wash-boxes': [
    {
      heading: 'Face wash cartons for tubes, gels, and pumps',
      paragraphs: [
        'Face wash packaging follows the cleanser format: foaming tubes (often 100–150 ml), gel bottles, and pump dispensers. Box Studio sizes the outer carton to the closed fill so clinical and organic lines look intentional on shelf.',
        'Tubes need a different footprint than pump bottles. Quoting with the real component photo or dimensions avoids a carton that looks like a lotion pack when the product is a squeeze tube.',
        'Measure the closed product at its tallest and widest points. Those two numbers matter more than a mood-board box size.',
      ],
    },
    {
      heading: 'Production notes for cleanser packaging',
      paragraphs: [
        'Auto-lock bottoms help when bottles are filled repeatedly on a packing table. Tuck ends remain fine for lighter tubes.',
        'Keep claims readable: cleanser type on the front, usage detail on the side or back.',
        'Samples, proofs, MOQ, and timing are handled through the quote once size and artwork are known.',
      ],
    },
  ],
  'shampoo-boxes': [
    {
      heading: 'Shampoo boxes for salon bottles and retail pumps',
      paragraphs: [
        'Shampoo packaging has to hold liquid bottles safely — often 250 ml and 500 ml pumps, plus denser salon formats. Box Studio builds cartons with enough structure for shelf and shipping, including reinforced corners and optional inserts when the bottle is heavy.',
        'Professional salon and haircare retail packs benefit from an auto-lock bottom that sets up quickly on a packing line. Moisture-aware board choices and a clear brand panel help the bottle family stay recognisable across sizes.',
        'Send closed bottle height including the pump, and the widest diameter. Mention if you also pack matching conditioner so family proportions can stay aligned.',
      ],
    },
    {
      heading: 'Haircare carton options that scale',
      paragraphs: [
        'Auto-lock bottoms suit frequent fills. Inserts are quoted when bottles need extra hold for e-commerce kits or bundled hair sets.',
        'Print can stay bold for retail or quieter for salon professional lines — the structure comes first.',
        'Custom runs typically begin in the low hundreds depending on size and finish, with proofs before mass production and lead time confirmed after artwork approval.',
      ],
    },
  ],
  'shampoo-bar-boxes': [
    {
      heading: 'Packaging for solid shampoo bars and zero-waste formats',
      paragraphs: [
        'Shampoo bar boxes are shorter and often squarer than liquid shampoo cartons. Round cold-process pucks and rectangular bars need a footprint that holds the bar without excess air — especially for zero-waste and salon retail stories.',
        'Kraft or white paperboard tuck cartons keep the pack light while still allowing a printed brand panel. Moisture management and a snug fit matter more than heavy decoration.',
        'Send bar diameter or length/width/height. If the bar is sold with a sleeve or wrap inside, say so — that changes internal clearance.',
      ],
    },
    {
      heading: 'Bar carton choices vs liquid shampoo packs',
      paragraphs: [
        'Do not reuse a liquid shampoo dieline for bars. Heights and shopper expectations differ.',
        'Windows are optional when the bar colour or swirl should show; solid fronts suit quieter natural brands.',
        'Quote with quantity and finish preferences after size is confirmed. Structural samples help when bar shapes vary by SKU.',
      ],
    },
  ],
  'perfume-boxes': [
    {
      heading: 'Perfume boxes that protect glass and elevate unboxing',
      paragraphs: [
        'Perfume packaging has to protect glass and still feel considered when opened. Box Studio builds cartons for 50 ml and 100 ml flacons, eau de parfum sprays, and designer bottles used in department stores and niche perfumeries.',
        'Luxury perfume boxes often pair a printed outer with foam or paperboard inserts so the bottle does not shift. The goal is impact protection and a calm first impression — not decoration for its own sake.',
        'Share bottle height with the cap on, base footprint, and whether you need a fitted insert. That decides structure before foil or soft-touch is chosen.',
      ],
    },
    {
      heading: 'Fragrance carton structure and finishing',
      paragraphs: [
        'Straight tuck cartons work for many single bottles. Heavier flacons or gift presentations may need a more rigid approach or a secured insert — confirmed on quote.',
        'Metallic foil and deep colour systems are common in fragrance, but they work best when hierarchy stays clear: brand, scent name, size.',
        'MOQ, sampling, and production timing follow custom packaging norms and are stated on your quote after proof approval.',
      ],
    },
  ],
  'cologne-boxes': [
    {
      heading: 'Cologne packaging for men’s flacons and grooming scents',
      paragraphs: [
        'Cologne boxes follow the same protection rules as perfume, with silhouettes that often skew taller or more rectangular for men’s eau de cologne and wooden-cap bottles. Box Studio sizes to the closed flacon and plans insert needs when the glass is heavy.',
        'Department store and niche grooming lines use these packs for shelf presence and for high-value DTC launches where unboxing is part of the brand.',
        'Measure closed height and base. Note cap materials that add height or diameter beyond the bottle shoulders.',
      ],
    },
    {
      heading: 'Keeping cologne packs distinct in a fragrance family',
      paragraphs: [
        'If the brand also sells perfume, keep panel design related but not identical — shoppers should see the difference instantly.',
        'Reverse tuck or straight tuck structures are chosen for packing preference and print-face planning, not as a style slogan.',
        'Ask for insert options when shipping risk is high. Fit and protection beat finish until the bottle sits correctly.',
      ],
    },
  ],
  'perfume-gift-set-boxes': [
    {
      heading: 'Gift set boxes for perfume plus companions',
      paragraphs: [
        'Perfume gift set packaging holds more than one item — often a full-size bottle with lotion and a travel spray. The outer box and the insert must be planned together so pieces do not collide in transit.',
        'Luxury department stores and DTC launches use these packs for seasonal sets where opening the lid is part of the experience. Auto-lock or set-oriented structures help when the pack is heavier than a single flacon carton.',
        'List every item in the set with closed dimensions. That inventory is the brief — without it, the insert cannot be quoted accurately.',
      ],
    },
    {
      heading: 'Set packaging that stays manufacturable',
      paragraphs: [
        'Paperboard outers with custom cradles are common. Rigid options can be discussed when the set must feel like keepsake packaging.',
        'Print can stay restrained so the bottles carry the colour story when the lid opens.',
        'Quantity, proofs, and timing are quote-driven once the set map and artwork are clear.',
      ],
    },
  ],
  'nail-polish-boxes': [
    {
      heading: 'Nail polish boxes with upright bottle protection',
      paragraphs: [
        'Nail polish packaging fails when bottles tip. Standard 15 ml lacquers, minis, and treatment coats need a carton — and often an insert — that keeps glass upright for boutique shelves and subscription boxes.',
        'Box Studio builds to exact bottle dimensions with paperboard options, cradles, and metallic accents when the brand needs stronger shelf appeal.',
        'Count the bottles per pack and send one bottle’s height and diameter. Multi-shade sets need a cell layout, not a single loose cavity.',
      ],
    },
    {
      heading: 'Single bottles vs shade sets',
      paragraphs: [
        'One bottle can live in a tuck carton. Sets usually need a fitted insert and a lid style that closes cleanly over the caps.',
        'Retail merchandising and holiday gifts often prefer the set approach; everyday refill SKUs stay on simpler singles.',
        'Confirm structure, insert, MOQ, and lead time on the quote after the bottle count is fixed.',
      ],
    },
  ],
  'first-aid-boxes': [
    {
      heading: 'First aid cartons for kits, plasters, and care packs',
      paragraphs: [
        'First aid boxes are folding cartons for bandage packs, small kits, and retail care sets. A tuck closure keeps the pack flat for shipping and easy to fill on a packing table.',
        'The front panel should leave room for clear product naming and simple care cues — shoppers need to recognise the pack quickly in pharmacy and retail aisles.',
        'Send the kit or inner pack size, not only a target outer size. Fit starts with what goes inside.',
      ],
    },
    {
      heading: 'Healthcare carton basics',
      paragraphs: [
        'Paperboard tuck cartons cover most single retail first aid packs. Heavier kits may need a stronger board or a different base — noted on the quote.',
        'Print hierarchy matters more than decoration: product type first, brand second if space is tight.',
        'Quantity and timing are confirmed when dimensions and artwork are ready.',
      ],
    },
  ],
  'wellness-boxes': [
    {
      heading: 'Wellness cartons for supplements, tins, and daily routines',
      paragraphs: [
        'Wellness boxes cover supplement cartons, tins, and shelf packs for daily routines. A straight tuck keeps the front clear for the product name and a simple mark — useful when the aisle is crowded with similar claims.',
        'Box Studio sizes to the bottle or tin so the pack does not dwarf a small supplement or squeeze a wide tin.',
        'Measure the closed component and say whether the pack is for retail shelf, subscription, or both.',
      ],
    },
    {
      heading: 'Clear packaging for trust-led products',
      paragraphs: [
        'Keep information hierarchy calm. Wellness shoppers scan for product type and size before decorative detail.',
        'Paperboard with straightforward print finishes is usually enough; special finishes are optional accents.',
        'MOQ and production timing follow the quote for your size and print plan.',
      ],
    },
  ],
  'burger-boxes': [
    {
      heading: 'Kraft burger boxes for service and takeaway',
      paragraphs: [
        'Burger boxes are kraft clamshell cartons built for restaurant service and takeaway. The lid folds back for plating, and the front panel can carry a printed brand colour without turning the pack into a gift box.',
        'Box Studio sizes the clamshell to the burger footprint so the pack closes cleanly and still vents enough for hot service.',
        'Share approximate burger diameter and height with toppings. That drives a carton that closes without crushing the bun.',
      ],
    },
    {
      heading: 'Foodservice carton notes',
      paragraphs: [
        'Kraft board is the everyday look for burger service. Print stays on the outer panels customers see at the counter.',
        'This page is about outer food packaging presentation — not a claim of food-contact certification unless stated on your quote materials discussion.',
        'Quantities for restaurant programs are quoted against size and print colours once the dieline is agreed.',
      ],
    },
  ],
  'sandwich-boxes': [
    {
      heading: 'Triangular sandwich cartons with a clear window',
      paragraphs: [
        'Sandwich boxes use a triangular kraft format with a clear front window so cafe wedges and wraps stay visible in grab-and-go cases. The green or printed panel leaves room for a simple mark without hiding the food.',
        'Box Studio sizes the wedge carton to the sandwich thickness and length so the window shows the fill and the pack still stacks.',
        'Send sandwich length, height, and whether you pack wraps or classic wedges — those shapes need different internal room.',
      ],
    },
    {
      heading: 'Cafe and deli packaging choices',
      paragraphs: [
        'Window patches are part of the brief when visibility matters. Solid kraft suits quieter branding.',
        'Keep allergen or product naming readable on the non-window panels.',
        'Quote with volume expectations for daily cafe use; foodservice runs are planned around repeatable sizes.',
      ],
    },
  ],
};

function buildSearchPhrases(name, core) {
  const lower = name.toLowerCase();
  const coreLower = core.toLowerCase();
  return [
    lower,
    `${coreLower} packaging`,
    `${coreLower} packaging box`,
    `custom ${lower}`,
    `printed ${lower}`,
    `wholesale ${lower}`,
  ];
}

function buildFallbackSections(product, core) {
  const name = product.name || 'Custom Packaging Boxes';
  const coreLower = core.toLowerCase();
  const uses = cleanList(product.applications || product.uses).slice(0, 4);
  const description = String(product.description || '').trim();
  const short = String(product.short || '').trim();
  const structureName = product.structureName || '';
  const measurement = String(product.measurement || '').trim();
  const defaults = product.defaults;

  const sizeLine = defaults
    ? `A common starting internal size reference for this structure family is ${defaults.length} × ${defaults.width} × ${defaults.height} ${defaults.unit || 'mm'} — always re-measure against your closed product before production.`
    : `Measure your closed ${coreLower} product and share length, width, and height when you request a quote.`;

  return [
    {
      heading: `${name} for a precise product fit`,
      paragraphs: [
        short || description || `${name} are custom printed packaging boxes sized to your ${coreLower} component.`,
        description && short && description !== short ? description : null,
        uses.length
          ? `Best suited for: ${uses.join('; ').replace(/\.$/, '')}.`
          : `Built for brands that need a dedicated ${coreLower} packaging box rather than a generic carton.`,
      ].filter(Boolean),
    },
    {
      heading: structureName ? `${structureName} structure and sizing` : `Structure and sizing for ${name.toLowerCase()}`,
      paragraphs: [
        product.structure
          ? String(product.structure)
          : structureName
            ? `This page uses a ${structureName.toLowerCase()} as the reference structure. The final dieline follows your product dimensions.`
            : `The carton structure is selected to match how the ${coreLower} product is packed and presented.`,
        measurement || sizeLine,
        'Finishes such as matte, gloss, foil, or emboss are chosen after fit is confirmed — structure first, decoration second.',
      ].filter(Boolean),
    },
    {
      heading: 'What to include in your quote',
      paragraphs: [
        `Send closed ${coreLower} dimensions, approximate quantity, and any finish preferences. A photo of the component helps check fit.`,
        'Minimum order quantity, volume pricing tiers, sampling, and lead time are confirmed on the quote for your size and artwork — not guessed from a template.',
      ],
    },
  ];
}

function buildAeoFaqs(product, core) {
  const name = product.name || 'Custom Packaging Boxes';
  const coreLower = core.toLowerCase();
  const lower = name.toLowerCase();
  const existing = (Array.isArray(product.faqs) ? product.faqs : [])
    .filter((item) => item?.q && item?.a)
    .map((item) => ({ q: item.q, a: item.a }));

  const generated = [
    {
      q: `What are ${lower}?`,
      a: `${name} are custom packaging boxes made to hold ${coreLower} products for retail, online unboxing, and brand presentation. They are sized to the closed component and printed for the brand.`,
    },
    {
      q: `How do I get the right size for ${lower}?`,
      a: `Measure the closed product (cap or lid on), then share length, width, and height with your quote. Box Studio builds the dieline from those dimensions rather than forcing a generic blank.`,
    },
    {
      q: `Do you provide samples or proofs for ${lower}?`,
      a:
        faqValue(product.faqs, /sample/i) ||
        'Structural white samples and printed proofs can be arranged before a full production run. Ask for sample options on your quote.',
    },
  ];

  const seen = new Set();
  return [...existing, ...generated].filter((item) => {
    const key = String(item.q || '').toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildProductSeoGuide(product) {
  if (!product) return null;

  const name = product.name || 'Custom Packaging Boxes';
  const core = coreFromName(name) || 'product';
  const featured = FEATURED_DESCRIPTIONS[product.slug];

  return {
    searchPhrases: buildSearchPhrases(name, core),
    descriptionSections: featured || buildFallbackSections(product, core),
    aeoFaqs: buildAeoFaqs(product, core),
    featured: Boolean(featured),
  };
}

export function getProductCommerceNotes(product) {
  if (!product) return null;
  const faqs = product.faqs || [];
  return {
    moq: faqValue(faqs, /minimum order|moq/i),
    leadTime: faqValue(faqs, /how long|lead time|production and delivery|turnaround/i),
    sampling: faqValue(faqs, /sample|proof/i),
  };
}
