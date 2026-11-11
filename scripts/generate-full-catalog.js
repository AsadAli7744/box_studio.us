const fs = require('fs');
const path = require('path');

// Helper to check image existence
function pickImgs(preferredList) {
  const defaults = [
    '/images/use-cosmetic-bottle.jpg',
    '/images/use-skincare-jar.jpg',
    '/images/use-lipstick.jpg',
    '/images/g-gloss-open.jpg',
    '/images/g-balm-open.jpg',
    '/images/use-perfume.jpg',
    '/images/g-polish-closed.jpg'
  ];
  const valid = [];
  for (const src of preferredList) {
    const p = path.join(process.cwd(), 'public', src.replace(/^\//, ''));
    if (fs.existsSync(p)) valid.push(src);
  }
  if (!valid.length) {
    valid.push(defaults[0], defaults[1]);
  } else if (valid.length === 1) {
    valid.push(defaults[0]);
  }
  return valid.slice(0, 4);
}

const CATEGORIES = [
  {
    slug: 'cosmetic-boxes',
    name: 'All Cosmetic Boxes',
    heading: 'Custom Cosmetic Boxes',
    image: '/images/cat-cosmetic.jpg',
    alt: 'Custom cosmetic packaging boxes in luxury colors with gold accents',
    short: 'Custom packaging folding cartons, tuck boxes, and sets for beauty & cosmetic brands.',
    intro: 'Custom cosmetic packaging boxes tailored to your bottle, tube, jar, or palette. Select your structure, specify internal dimensions, and customize with foil stamping, embossing, custom windows, and precision inserts.',
    line: 'Lipstick, mascara, eyeliner, serums, creams, and beauty sets',
    faqs: [
      {
        q: 'Can I order custom cosmetic boxes sized to my specific container?',
        a: 'Yes. Every cosmetic box is custom-manufactured to your exact bottle, jar, dropper, or tube dimensions plus necessary clearance so your container fits securely without rattling.'
      },
      {
        q: 'What finishes are available for cosmetic packaging?',
        a: 'We offer soft-touch matte lamination, high-gloss lamination, metallic hot foil stamping (gold, silver, rose gold), blind embossing and debossing, and spot UV varnishing.'
      },
      {
        q: 'Do you provide dieline templates for our artwork designer?',
        a: 'Yes. Once we know your product dimensions and chosen box structure, we generate an exact vector dieline PDF showing cut lines, fold lines, and bleed margins for your artwork.'
      }
    ]
  },
  {
    slug: 'makeup-boxes',
    name: 'Makeup Boxes',
    heading: 'Custom Makeup Boxes',
    image: '/images/use-lipstick.jpg',
    alt: 'Custom printed makeup cartons and cosmetics packaging',
    short: 'Custom folding cartons, sleeve trays, and compact boxes for colour cosmetics.',
    intro: 'Custom printed makeup boxes for lipsticks, liquid lips, foundations, compact powders, mascaras, eyeliners, and makeup palettes. Custom die-cut windows, protective cradles, and premium finishes available.',
    line: 'Lipsticks, foundations, palettes, liners, and beauty tools',
    faqs: [
      {
        q: 'Can we add clear acetate windows to makeup boxes?',
        a: 'Yes. We offer custom die-cut windows with PET/acetate patching so customers can see shade colors and container branding directly through the box.'
      },
      {
        q: 'Are your makeup boxes durable enough for retail shelf display and shipping?',
        a: 'Yes. We use premium folding paperboard (16pt to 24pt SBS) with reinforced tuck closures to ensure your makeup products remain pristine on retail shelves and during transit.'
      }
    ]
  },
  {
    slug: 'skincare-boxes',
    name: 'Skincare Boxes',
    heading: 'Custom Skincare Boxes',
    image: '/images/use-serum.jpg',
    alt: 'Custom skincare packaging boxes for serums, creams, and facial cleansers',
    short: 'Protective folding cartons and gift sets for serums, creams, and lotions.',
    intro: 'Custom skincare packaging boxes designed for face serums, droppers, night creams, moisturizers, facial cleansers, and sheet masks. Precision-fitted paperboard cradles ensure glass containers stay safe.',
    line: 'Serum droppers, face cream jars, cleansers, toners, and masks',
    faqs: [
      {
        q: 'How do you protect glass serum dropper bottles inside the box?',
        a: 'We provide custom paperboard cradle inserts and neck collars that lock the glass bottle and dropper pipette in place, preventing movement and glass-on-glass impact.'
      },
      {
        q: 'Can skincare boxes withstand bathroom moisture?',
        a: 'Yes. We offer protective matte and gloss laminations that shield the printed paperboard from humidity and moisture.'
      }
    ]
  },
  {
    slug: 'sun-care-boxes',
    name: 'Sun Care Boxes',
    heading: 'Custom Sun Care Packaging Boxes',
    image: '/images/use-sunscreen.jpg',
    alt: 'Custom sun care packaging boxes for SPF tubes, sunblock creams, and sun protection sticks',
    short: 'Outer cartons for sunblock, sunscreen sticks, sprays, and after-sun lotions.',
    intro: 'Custom sun care packaging boxes designed for sunblock tubes, sunscreen spray canisters, SPF sticks, after-sun gels, and self-tanning mousses. Includes ample space for SPF drug facts and water-resistance directions.',
    line: 'Sunblock, SPF sprays, sun sticks, after-sun, and tanning',
    faqs: [
      {
        q: 'Is there enough space on the box for FDA drug facts and SPF compliance text?',
        a: 'Yes. We plan your dieline with sufficient rear and side panel real estate to clearly accommodate SPF active ingredients, drug facts tables, and warning directions.'
      },
      {
        q: 'Can you make boxes for both squeeze tubes and aerosol sunscreen sprays?',
        a: 'Yes. We produce tall folding cartons for cylindrical pump sprays and auto-lock bottom boxes for heavier sunscreen squeeze tubes.'
      }
    ]
  },
  {
    slug: 'hair-care-boxes',
    name: 'Hair Care Boxes',
    heading: 'Custom Hair Care Packaging Boxes',
    image: '/images/use-shampoo.jpg',
    alt: 'Custom hair care packaging boxes for shampoo bottles, hair oils, and salon masks',
    short: 'Durable cartons and sets for shampoo bottles, hair oils, masks, and styling products.',
    intro: 'Custom hair care packaging boxes for liquid shampoos, solid bars, conditioners, hair growth oils, smoothing serums, wigs, and styling pomades. Auto-lock bottom cartons provide reliable support for heavier bottles.',
    line: 'Shampoo bottles, hair oils, hair masks, sprays, and wigs',
    faqs: [
      {
        q: 'Which box structure is best for 250ml or 500ml shampoo bottles?',
        a: 'An auto-lock bottom carton or crash-lock base box is recommended for liquid bottles over 200ml, as the base supports weight without accidental opening.'
      },
      {
        q: 'Do you offer eco-friendly boxes for solid shampoo bars?',
        a: 'Yes. We produce unbleached kraft paperboard boxes with optional cutout windows and soy-based inks for zero-waste and organic hair care brands.'
      }
    ]
  },
  {
    slug: 'soap-body-care-boxes',
    name: 'Soap & Body Care Boxes',
    heading: 'Custom Soap & Body Care Boxes',
    image: '/images/use-soap.jpg',
    alt: 'Custom soap and body care packaging boxes for artisan soap bars, lotions, and bath bombs',
    short: 'Paperboard cartons and cut-out window boxes for soaps, lotions, and bath products.',
    intro: 'Custom soap and body care packaging boxes for handmade bar soaps, body washes, exfoliating scrubs, hand creams, and bath bombs. Available in natural kraft or smooth white paperboard with custom cutouts.',
    line: 'Bar soaps, body lotions, body scrubs, bath bombs, and washes',
    faqs: [
      {
        q: 'Can soap boxes have scent-release cutout windows?',
        a: 'Yes. We can die-cut open windows without plastic film so shoppers can smell the soap fragrance and feel the natural bar texture directly.'
      },
      {
        q: 'Can you make multi-pack boxes for bath bombs?',
        a: 'Yes. We produce sleeve trays and partitioned cartons with dividers to hold 2, 4, or 6 bath bombs without them chipping or rubbing against each other.'
      }
    ]
  },
  {
    slug: 'fragrance-boxes',
    name: 'Perfume & Fragrance Boxes',
    heading: 'Custom Fragrance Packaging Boxes',
    image: '/images/use-perfume.jpg',
    alt: 'Luxury custom perfume packaging folding boxes with gold stamping',
    short: 'Custom folding cartons, tuck boxes, and discovery kit packaging for fragrances.',
    intro: 'Custom fragrance packaging boxes for perfume glass bottles, colognes, attars, rollerball perfume oils, body mists, and sample discovery sets. Fitted paperboard inserts hold bottles firmly.',
    line: 'Perfume bottles, colognes, attars, mists, and discovery sets',
    faqs: [
      {
        q: 'What box type do you recommend for high-end luxury perfumes?',
        a: 'A straight tuck end or reinforced auto-lock bottom folding carton with a custom die-cut paperboard neck insert provides luxury shelf presence and bottle protection.'
      },
      {
        q: 'Can you produce packaging for 2ml to 10ml perfume sample discovery sets?',
        a: 'Yes. We make folding cartons and sleeve & tray cartons with multi-cavity paperboard trays tailored specifically for sample vial sets.'
      }
    ]
  },
  {
    slug: 'mens-grooming-boxes',
    name: 'Men’s Grooming Boxes',
    heading: 'Custom Men’s Grooming Boxes',
    image: '/images/use-hair-oil.jpg',
    alt: 'Custom men’s grooming packaging boxes for beard oils, shaving creams, and balms',
    short: 'Masculine packaging for beard oils, shaving creams, balms, and grooming sets.',
    intro: 'Custom men’s grooming packaging boxes for beard oils, balms, shaving soaps, aftershave tonics, and complete multi-piece grooming kits. Matte finishes, dark kraft textures, and metallic foil stamping.',
    line: 'Beard oils, balms, shaving soaps, and grooming kits',
    faqs: [
      {
        q: 'Can you create kit boxes for a beard comb, oil bottle, and balm tin together?',
        a: 'Yes. We engineer custom multi-compartment inserts that secure dropper bottles, round tins, and wooden combs in a single cohesive presentation box.'
      },
      {
        q: 'What aesthetic finishes work best for men’s grooming products?',
        a: 'Deep charcoal or kraft boards with matte lamination, blind debossing, and bronze or copper foil stamping provide an authentic, premium masculine feel.'
      }
    ]
  },
  {
    slug: 'beauty-gift-boxes',
    name: 'Beauty Gift & Product Sets',
    heading: 'Custom Beauty Gift Boxes',
    image: '/images/category-gift-boxes.jpg',
    alt: 'Custom beauty gift folding cartons and multi-piece cosmetic sets',
    short: 'Folding gift cartons, sleeve & tray sets, PR presentation boxes, and holiday kits.',
    intro: 'Custom beauty gift boxes and product set packaging. Ideal for skincare routine kits, fragrance gift sets, PR presentation cartons, and holiday cosmetic collections with custom paperboard partitions.',
    line: 'Folding gift boxes, PR cartons, seasonal collections, and kits',
    faqs: [
      {
        q: 'Can you manufacture custom PR influencer boxes and beauty advent calendars?',
        a: 'Yes. We produce large folding presentation boxes with tuck closures, perforated numbered doors, and customized multi-product paperboard inserts.'
      },
      {
        q: 'Can boxes be shipped flat to save on warehousing and freight?',
        a: 'Yes. All our folding carton gift boxes ship flat to maximize warehouse space and reduce freight costs, and assemble in seconds.'
      }
    ]
  }
];

// Product factory function
function createProductDef({
  slug,
  name,
  category,
  additionalCategories = [],
  structure = 'straight-tuck-end-box',
  short,
  meta,
  description,
  images = [],
  sizesText,
  customizationText,
  sizingText,
  artworkText,
  pricingText,
  uses = [],
  faqs = [],
  showOnHome = false
}) {
  const validImages = pickImgs(images);
  const categories = [...new Set([category, 'cosmetic-boxes', ...additionalCategories])];

  return {
    slug,
    name,
    category,
    categories,
    structure,
    short: short || `Custom printed ${name.toLowerCase()} tailored to your brand specifications.`,
    meta: meta || `Custom ${name.toLowerCase()}. Premium printed packaging for bottles, jars, and tubes with custom inserts and foil finishes.`,
    description: description || `Custom ${name.toLowerCase()} manufactured to the exact measurements of your cosmetic container. Available in single-unit retail folding cartons or multi-pack presentation cartons with full-color printing, custom die-cut windows, and luxury foil finishes.`,
    images: validImages.map((src, i) => ({
      src,
      alt: `${name} custom packaging box view ${i + 1}`
    })),
    sections: [
      {
        heading: 'Products and container sizes',
        body: sizesText || `We engineer custom ${name.toLowerCase()} for tubes, glass bottles, jars, compacts, and multi-product sets. Whether you pack 10ml travel sizes, 30ml and 50ml standard retail formats, or 100ml family sizes, the internal dimensions are sized with exact clearances so the container sits upright and secure without rattling.`
      },
      {
        heading: 'Customization & finishing options',
        body: customizationText || `Elevate your shelf presence with full-color CMYK and Pantone exterior printing, interior flood coating, and clear product windows. Choose between soft-touch velvet matte lamination or high-gloss coatings, and accent your logo with hot foil stamping (metallic gold, silver, rose gold), blind embossing, or spot UV varnish.`
      },
      {
        heading: 'Help with sizing & measurements',
        body: sizingText || `To get a precise fit, measure your container with the cap, pump, or dropper fitted: measure maximum outside diameter or width, depth, and overall height. Add 1.5mm to 2mm clearance on each dimension. Alternatively, you can mail us a physical sample of your bottle or component, and our packaging engineers will build the dieline to measure.`
      },
      {
        heading: 'Artwork dielines & design support',
        body: artworkText || `We supply 1:1 scale vector dieline templates (PDF / Illustrator) indicating fold creases, glue flaps, trim cuts, and bleed zones. You can place your own artwork directly onto the template, or send us your logo, color palette, and regulatory copy for layout assistance before pre-press verification.`
      },
      {
        heading: 'Price factors & ordering steps',
        body: pricingText || `Your quote is determined by box dimensions, chosen paperboard caliper (16pt–24pt SBS paperboard), order volume, and optional finishes like foil or windows. After you request a quote, we confirm specifications, provide a digital 3D proof, produce an optional pre-production sample, and manufacture your complete run with tracked delivery.`
      }
    ],
    uses: uses.length ? uses : [
      `${name} packaging for retail and boutique sales`,
      'E-commerce order fulfillment and subscription boxes',
      'High-end branded gift sets and promotional launches'
    ],
    related: [],
    showOnHome: Boolean(showOnHome),
    syncReciprocal: true,
    showInProducts: [],
    faqs: faqs.length ? faqs : [
      {
        q: `What is the minimum order quantity for ${name.toLowerCase()}?`,
        a: 'Our standard production runs begin at 250 to 500 units for custom printed folding cartons, with volume pricing tiers at 1,000, 2,500, 5,000, and 10,000+ units.'
      },
      {
        q: `Can I get a physical sample of my ${name.toLowerCase()} before mass production?`,
        a: 'Yes. We offer plain structural white samples to test container fit, as well as full digital color printed proofs before the full production run begins.'
      },
      {
        q: `How long does production and delivery take?`,
        a: 'Standard production typically takes 8 to 12 business days following final artwork proof approval. Expedited turnaround is available upon request.'
      }
    ]
  };
}

module.exports = {
  CATEGORIES,
  createProductDef,
  pickImgs
};
