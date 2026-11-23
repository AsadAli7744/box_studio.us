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

function categoryVoice(category = '', categoryLabel = '') {
  const key = String(category || '').toLowerCase();
  if (key.includes('makeup') || key.includes('cosmetic')) {
    return {
      shopper: 'makeup shoppers and beauty counters',
      aisle: 'the makeup aisle and shade wall',
      fill: 'lipstick, mascara, foundation, and other colour cosmetics',
    };
  }
  if (key.includes('skincare') || key.includes('sun')) {
    return {
      shopper: 'skincare buyers and self-care shoppers',
      aisle: 'the skincare shelf',
      fill: 'creams, serums, cleansers, and sun care',
    };
  }
  if (key.includes('hair')) {
    return {
      shopper: 'haircare buyers',
      aisle: 'the haircare shelf',
      fill: 'shampoo, oil, treatment, and styling products',
    };
  }
  if (key.includes('fragrance') || key.includes('perfume')) {
    return {
      shopper: 'fragrance buyers',
      aisle: 'the fragrance counter',
      fill: 'perfume, cologne, attar, and mist bottles',
    };
  }
  if (key.includes('soap') || key.includes('body')) {
    return {
      shopper: 'body-care shoppers',
      aisle: 'the bath and body shelf',
      fill: 'soap, lotion, scrub, and bath products',
    };
  }
  if (key.includes('grooming') || key.includes('mens')) {
    return {
      shopper: 'men’s grooming shoppers',
      aisle: 'the grooming shelf',
      fill: 'beard, shave, and grooming kits',
    };
  }
  if (key.includes('food') || key.includes('restaurant')) {
    return {
      shopper: 'food customers and takeaway guests',
      aisle: 'the counter and delivery bag',
      fill: 'ready-to-eat food and bakery items',
    };
  }
  if (key.includes('health')) {
    return {
      shopper: 'pharmacy and wellness shoppers',
      aisle: 'the healthcare shelf',
      fill: 'wellness and daily-care products',
    };
  }
  if (key.includes('christmas') || key.includes('gift') || key.includes('beauty-gift')) {
    return {
      shopper: 'gift buyers',
      aisle: 'gift sets and holiday displays',
      fill: 'gift sets and seasonal kits',
    };
  }
  return {
    shopper: 'your customers',
    aisle: categoryLabel ? `the ${categoryLabel.toLowerCase()} shelf` : 'the retail shelf',
    fill: 'your product',
  };
}

function buildSearchPhrases(name, core) {
  const lower = name.toLowerCase();
  const coreLower = core.toLowerCase();
  return [
    lower,
    `${coreLower} packaging`,
    `${coreLower} packaging box`,
    `${coreLower} packaging boxes`,
    `custom ${lower}`,
    `custom ${coreLower} packaging`,
    `printed ${lower}`,
    `wholesale ${lower}`,
    `packaging box for my ${coreLower} brand`,
    `packaging boxes for ${coreLower}`,
    `box for ${coreLower}`,
    `boxes for ${coreLower} products`,
    `${coreLower} carton packaging`,
    `buy ${lower}`,
    `${coreLower} brand packaging box`,
    `small order ${lower}`,
    `${coreLower} gift packaging`,
    `${coreLower} retail packaging box`,
  ];
}

function buildDescriptionSections({ name, core, description, short, uses, voice, categoryLabel, structureName }) {
  const coreLower = core.toLowerCase();
  const lower = name.toLowerCase();
  const useItems = cleanList(uses).slice(0, 5);
  const structureBit = structureName ? ` Most ${lower} on this page are built around a ${structureName.toLowerCase()} structure.` : '';

  return [
    {
      heading: `${name} Packaging Is Ideal With Us For Every Brand`,
      paragraphs: [
        `Looking for ${lower}, a ${coreLower} packaging box, or packaging for your ${coreLower} brand? Box Studio helps you choose a clear, sellable outer pack without packaging jargon. We listen to what you sell, how the product looks on the shelf, and what you want shoppers to feel when they open the box.`,
        short
          ? `${short} ${description}`
          : description ||
            `${name} protect the product, carry your brand print, and help ${voice.shopper} recognise your line quickly.`,
        `Whether you are launching your first ${coreLower} SKU or refreshing a full range, we keep the advice practical: size the box to the fill, choose a finish that matches your brand, and print the details customers need to buy with confidence.`,
      ],
    },
    {
      heading: `What ${name} Are — Explained Simply`,
      paragraphs: [
        `${name} are the outer packaging boxes that hold your ${coreLower} product so it arrives clean, looks premium, and stays presentation-ready on ${voice.aisle}.${structureBit}`,
        `You do not need to be a packaging expert to order. If you can say “I need a packaging box for my ${coreLower} brand,” we can guide the next step: dimensions, board, print, quantity, and finishing.`,
        `These boxes are made for ${voice.fill}. They sit where ${voice.shopper} shop — so the front panel, colour, and opening detail matter as much as the fit inside.`,
      ],
    },
    {
      heading: `How Brands Use Custom ${name}`,
      paragraphs: [
        `Brands choose custom ${lower} when a generic carton feels too loose, too plain, or too far from the brand story. A tailored ${coreLower} packaging box keeps the product snug, supports shade or product names on the front, and makes unboxing feel intentional for online orders.`,
        useItems.length
          ? `Common uses include ${useItems.join('; ').replace(/\.$/, '')}. If your use case is different, tell us in plain words — we map it to the right box style.`
          : `If your ${coreLower} product ships retail, online, or as a gift, this packaging format can be adapted to the channel.`,
        categoryLabel
          ? `Inside ${categoryLabel.toLowerCase()}, ${lower} sit alongside related formats. Start here when ${coreLower} is your main product, then explore related boxes if you also pack sets, travel sizes, or gift collections.`
          : `Start with this format when ${coreLower} is your main product, then explore related boxes for sets or gift collections.`,
      ],
    },
    {
      heading: `Choosing The Right ${core} Packaging Box`,
      paragraphs: [
        `The best ${coreLower} packaging box is the one that fits your closed product, prints your brand clearly, and survives shelf handling. Measure the product with the cap or lid on. Share length, width, and height. Add a little clearance so nothing feels crushed.`,
        `Then decide the look: matte for a soft beauty feel, gloss for colour pop, foil for a premium accent, or a window when shoppers should see the product. Keep the design simple if you are new — one strong colour story and clear product naming usually works better than busy artwork.`,
        `If you searched “packaging box for my ${coreLower} brand,” “custom ${coreLower} packaging,” or “wholesale ${lower},” you are asking the right questions. Those searches mean you want a real manufacturable box, not only a mockup.`,
      ],
    },
    {
      heading: 'What To Share When You Request A Quote',
      paragraphs: [
        `Send the product size, approximate quantity, and the finish you prefer. Photos of your ${coreLower} component help us check fit. If you already have brand colours or a logo, include those too.`,
        `Still unsure? Write a short note like “I sell ${coreLower} and need printed packaging boxes for retail.” Our team turns that into structure, board, and print options you can approve before production.`,
        `Ready when you are — request a quote for ${lower} and we will help you move from search intent to a packaging box that sells.`,
      ],
    },
  ];
}

function buildAeoFaqs({ name, core, categoryLabel, faqs }) {
  const coreLower = core.toLowerCase();
  const lower = name.toLowerCase();
  const existing = (Array.isArray(faqs) ? faqs : [])
    .filter((item) => item?.q && item?.a)
    .map((item) => ({ q: item.q, a: item.a }));

  const generated = [
    {
      q: `What are ${lower}?`,
      a: `${name} are custom packaging boxes made to hold ${coreLower} products for retail, online unboxing, and brand gift sets. They protect the fill and carry your brand print on the outside.`,
    },
    {
      q: `What should I search if I need packaging for my ${coreLower} brand?`,
      a: `Search phrases like “${lower}”, “${coreLower} packaging box”, “custom ${coreLower} packaging”, or “packaging box for my ${coreLower} brand.” Those searches usually mean you want a printed outer box sized to your product.`,
    },
    {
      q: `Are ${lower} good for small beauty brands?`,
      a: `Yes. Small and new brands often start with a simple printed carton for one ${coreLower} SKU, then grow into sets, foil finishes, or rigid gift packaging as sales grow.`,
    },
    {
      q: `How is this different from a generic shipping box?`,
      a: `${name} are product packaging for the shelf and unboxing moment. A shipping carton is the outer delivery box. Most brands need both: a presentation packaging box inside, and a shipping carton outside when the order ships.`,
    },
    {
      q: `Can I order ${lower} if I am not a packaging expert?`,
      a: `Yes. Write what you sell, the product size, and the look you want in simple words. Box Studio turns that into a packaging box brief — structure, board, print, and production notes — without asking you to learn dielines first.`,
    },
    {
      q: `What category do ${lower} belong to?`,
      a: categoryLabel
        ? `${name} are part of our ${categoryLabel} collection, made for brands that need custom printed packaging sized to the product.`
        : `${name} are custom printed packaging boxes sized to the product and brand.`,
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

/**
 * Informational product guide copy (SEO/AEO phrases woven into plain language).
 */
export function buildProductSeoGuide(product) {
  if (!product) return null;

  const name = product.name || 'Custom Packaging Boxes';
  const core = coreFromName(name) || 'product';
  const categoryLabel = product.categoryLabel || product.categoryHeading || '';
  const voice = categoryVoice(product.category, categoryLabel);
  const uses = product.applications || product.uses || [];

  return {
    searchPhrases: buildSearchPhrases(name, core),
    descriptionSections: buildDescriptionSections({
      name,
      core,
      description: product.description || '',
      short: product.short || '',
      uses,
      voice,
      categoryLabel,
      structureName: product.structureName || '',
    }),
    aeoFaqs: buildAeoFaqs({
      name,
      core,
      categoryLabel,
      faqs: product.faqs || [],
    }),
  };
}
