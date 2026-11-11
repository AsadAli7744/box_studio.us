const fs = require('fs');
const path = require('path');

// Ensure image paths exist or fallback safely
function getImg(name, fallback = '/images/cat-cosmetic.jpg') {
  const p = path.join(process.cwd(), 'public', name.replace(/^\//, ''));
  if (fs.existsSync(p)) return name;
  return fallback;
}

const CATEGORIES = [
  {
    slug: 'cosmetic-boxes',
    name: 'All Cosmetic Boxes',
    heading: 'Custom Cosmetic Boxes',
    image: '/images/cat-cosmetic.jpg',
    alt: 'Custom cosmetic packaging boxes in luxury colors with gold accents',
    short: 'Custom packaging cartons, rigid boxes, and sets for beauty & cosmetic brands.',
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
        a: 'Yes. We use premium paperboard (16pt to 24pt) and rigid board options with reinforced tuck closures to ensure your makeup products remain pristine on retail shelves and during transit.'
      }
    ]
  },
  {
    slug: 'skincare-boxes',
    name: 'Skincare Boxes',
    heading: 'Custom Skincare Boxes',
    image: '/images/use-skincare-jar.jpg',
    alt: 'Skincare packaging boxes with dropper bottle and cream jar',
    short: 'Protective cartons and rigid gift boxes for serums, creams, and lotions.',
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
    image: '/images/use-cosmetic-bottle.jpg',
    alt: 'Sun care and sunblock packaging boxes for tubes and pumps',
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
    image: '/images/g-bottle-open.jpg',
    alt: 'Hair care packaging boxes for shampoos, oils, and treatments',
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
    image: '/images/use-skincare-jar.jpg',
    alt: 'Custom soap and body care packaging boxes',
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
    alt: 'Luxury custom perfume boxes with gold stamping',
    short: 'Luxury rigid set boxes, tuck cartons, and discovery kit packaging for fragrances.',
    intro: 'Custom fragrance packaging boxes for perfume glass bottles, colognes, attars, rollerball perfume oils, body mists, and sample discovery sets. Fitted foam and paperboard inserts hold bottles firmly.',
    line: 'Perfume bottles, colognes, attars, mists, and discovery sets',
    faqs: [
      {
        q: 'What box type do you recommend for high-end luxury perfumes?',
        a: 'A two-piece rigid shoulder box or magnetic closure rigid box lined with a custom EVA velvet-topped insert provides the highest level of luxury and drop protection.'
      },
      {
        q: 'Can you produce packaging for 2ml to 10ml perfume sample discovery sets?',
        a: 'Yes. We make folding cartons and drawer boxes with multi-cavity paperboard or foam trays tailored specifically for sample vial sets.'
      }
    ]
  },
  {
    slug: 'mens-grooming-boxes',
    name: 'Men’s Grooming Boxes',
    heading: 'Custom Men’s Grooming Boxes',
    image: '/images/use-cosmetic-bottle.jpg',
    alt: 'Custom men’s grooming boxes for beard care and shaving products',
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
    image: '/images/use-skincare-set.jpg',
    alt: 'Luxury beauty gift boxes and multi-piece cosmetic sets',
    short: 'Rigid gift boxes, magnetic closure sets, PR launch boxes, and advent calendars.',
    intro: 'Custom beauty gift boxes and product set packaging. Ideal for skincare routine kits, fragrance gift sets, PR influencer launch packages, and multi-tier cosmetic advent calendars with custom partitions.',
    line: 'Rigid gift boxes, PR launch boxes, advent calendars, and kits',
    faqs: [
      {
        q: 'Can you manufacture custom PR influencer boxes and beauty advent calendars?',
        a: 'Yes. We produce large rigid keepsake boxes with magnetic doors, numbered pull-out drawers, ribbon pulls, and customized multi-product inserts.'
      },
      {
        q: 'Can boxes be shipped flat to save on warehousing and freight?',
        a: 'Yes. We offer foldable rigid boxes that assemble with adhesive corner strips in seconds, giving you rigid box presentation with folding carton shipping savings.'
      }
    ]
  }
];

console.log('Categories defined:', CATEGORIES.length);
