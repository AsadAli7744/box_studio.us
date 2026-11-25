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
    name: 'Cosmetic Boxes',
    heading: 'Custom Cosmetic Boxes',
    image: '/images/cat-cosmetic.jpg',
    alt: 'Custom cosmetic packaging boxes in luxury colors with gold accents',
    short: 'Custom packaging folding cartons, tuck boxes, and sets for beauty & cosmetic brands.',
    intro: 'Custom cosmetic packaging boxes tailored to your bottle, tube, jar, or palette. Select your structure, specify internal dimensions, and customize with foil stamping, embossing, custom windows, and precision inserts.',
    line: 'Lipstick, mascara, eyeliner, serums, creams, and beauty sets',
    faqs: [
      {
        q: "Can I order custom cosmetic boxes sized to my specific container?",
        a: "Yes. Every cosmetic box is custom-manufactured to your exact bottle, jar, dropper, or tube dimensions plus necessary clearance so your container fits securely without rattling."
      },
      {
        q: "What finishes are available for cosmetic packaging?",
        a: "We offer soft-touch matte lamination, high-gloss lamination, metallic hot foil stamping (gold, silver, rose gold), blind embossing and debossing, and spot UV varnishing."
      },
      {
        q: "Do you provide dieline templates for our artwork designer?",
        a: "Yes. Once we know your product dimensions and chosen box structure, we generate an exact vector dieline PDF showing cut lines, fold lines, and bleed margins for your artwork."
      },
      {
        q: "What box structures work best for cosmetic bottles and jars?",
        a: "Straight tuck, reverse tuck, and auto-lock bottom cartons are common for cosmetic bottles and jars. Heavier glass fills often need a reinforced base and a paperboard cradle or neck collar."
      },
      {
        q: "Can cosmetic boxes include inserts for fragile glass?",
        a: "Yes. Custom paperboard inserts, trays, and collars hold droppers, jars, and tubes in place so products stay presentation-ready through shipping and shelf handling."
      },
      {
        q: "Are small-order and wholesale cosmetic runs both available?",
        a: "Yes. Box Studio supports both smaller brand launches and larger wholesale replenishment. Share your quantity range in the quote so we can recommend a practical production path."
      },
      {
        q: "Can one cosmetic packaging family share the same look across SKUs?",
        a: "Yes. Brands often keep a shared colour story, finish, and typography across cartons while changing only the dieline size and product-facing panel copy for each SKU."
      },
      {
        q: "How do I request a quote for custom boxes?",
        a: "Open the product or category page that matches your fill, then submit a quote with internal dimensions, quantity intent, preferred finishes, and artwork notes. Box Studio confirms structure and pricing from that brief."
      },
      {
        q: "What information do you need to size my packaging correctly?",
        a: "Share the closed product length, width, and height (or bottle diameter and fill height), plus any insert needs. We add clearance so the product fits securely without rattling or crushing."
      },
      {
        q: "Can I print my logo and brand colors on the boxes?",
        a: "Yes. Custom printed packaging supports CMYK brand colors, logos, and panel hierarchy. Soft-touch, gloss, foil, emboss, and spot UV can be added once the structure is confirmed."
      },
      {
        q: "Do folding cartons ship flat?",
        a: "Yes. Most folding carton styles ship flat for efficient storage and freight, then erect quickly for packing. Rigid gift formats that stay set up are called out separately when needed."
      },
      {
        q: "Can I order a sample or dieline before production?",
        a: "Yes. After dimensions and structure are agreed, we can provide a dieline for artwork and discuss sampling options so you can check fit and print before a full run."
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
        q: "Can we add clear acetate windows to makeup boxes?",
        a: "Yes. We offer custom die-cut windows with PET/acetate patching so customers can see shade colors and container branding directly through the box."
      },
      {
        q: "Are your makeup boxes durable enough for retail shelf display and shipping?",
        a: "Yes. We use premium folding paperboard (16pt to 24pt SBS) with reinforced tuck closures to ensure your makeup products remain pristine on retail shelves and during transit."
      },
      {
        q: "Can makeup boxes be sized for lipstick, mascara, and foundation together?",
        a: "Each carton is sized to its fill. Lipsticks, mascaras, foundations, and palettes usually need separate dielines, while kit or set boxes can combine multiple items with a partitioned insert."
      },
      {
        q: "What finishes look premium on colour cosmetics packaging?",
        a: "Soft-touch matte, spot UV on shade names, and gold, silver, or rose-gold foil are popular for makeup retail. Choose finishes that support shade readability on shelf."
      },
      {
        q: "Can we print shade names and barcode panels clearly?",
        a: "Yes. The dieline leaves room for shade names, brand marks, and barcode or regulatory panels so colour cosmetics stay easy to merchandise and scan."
      },
      {
        q: "Do you make packaging for makeup palettes and tool kits?",
        a: "Yes. Palette, brush, and sponge formats can use sleeve-and-tray, window, or tuck-end cartons with cradles that keep trays and tools from shifting."
      },
      {
        q: "Can makeup boxes support e-commerce shipping as well as retail?",
        a: "Yes. Board caliper and closure style can be planned for counter display and parcel handling. Note both journeys in your quote if the same carton must do both jobs."
      },
      {
        q: "How do I request a quote for custom boxes?",
        a: "Open the product or category page that matches your fill, then submit a quote with internal dimensions, quantity intent, preferred finishes, and artwork notes. Box Studio confirms structure and pricing from that brief."
      },
      {
        q: "What information do you need to size my packaging correctly?",
        a: "Share the closed product length, width, and height (or bottle diameter and fill height), plus any insert needs. We add clearance so the product fits securely without rattling or crushing."
      },
      {
        q: "Can I print my logo and brand colors on the boxes?",
        a: "Yes. Custom printed packaging supports CMYK brand colors, logos, and panel hierarchy. Soft-touch, gloss, foil, emboss, and spot UV can be added once the structure is confirmed."
      },
      {
        q: "Do folding cartons ship flat?",
        a: "Yes. Most folding carton styles ship flat for efficient storage and freight, then erect quickly for packing. Rigid gift formats that stay set up are called out separately when needed."
      },
      {
        q: "Can I order a sample or dieline before production?",
        a: "Yes. After dimensions and structure are agreed, we can provide a dieline for artwork and discuss sampling options so you can check fit and print before a full run."
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
        q: "How do you protect glass serum dropper bottles inside the box?",
        a: "We provide custom paperboard cradle inserts and neck collars that lock the glass bottle and dropper pipette in place, preventing movement and glass-on-glass impact."
      },
      {
        q: "Can skincare boxes withstand bathroom moisture?",
        a: "Yes. We offer protective matte and gloss laminations that shield the printed paperboard from humidity and moisture."
      },
      {
        q: "Can skincare boxes be sized for serums, jars, and pumps?",
        a: "Yes. Dropper serums, cream jars, pumps, and tubes each get a dieline matched to the closed product, with clearance for caps and pumps."
      },
      {
        q: "What finishes suit clinical or clean beauty brands?",
        a: "Soft-touch matte, clean white or soft colour stories, and restrained foil or emboss work well for clinical and clean beauty lines. Share your brand direction in the quote notes."
      },
      {
        q: "Can we package a skincare routine as a set?",
        a: "Yes. Sleeve-and-tray or partitioned gift cartons can hold cleanser, serum, and cream together for retail kits or launch sets."
      },
      {
        q: "Is there space for ingredient or claim copy on skincare cartons?",
        a: "Yes. Side and rear panels can be planned for ingredient notes, usage directions, and brand claims once you share the required text length."
      },
      {
        q: "Do you support both retail shelf and DTC unboxing for skincare?",
        a: "Yes. Structure, insert, and finish choices can prioritize shelf presence, unboxing moment, or both — tell us which journey matters most."
      },
      {
        q: "How do I request a quote for custom boxes?",
        a: "Open the product or category page that matches your fill, then submit a quote with internal dimensions, quantity intent, preferred finishes, and artwork notes. Box Studio confirms structure and pricing from that brief."
      },
      {
        q: "What information do you need to size my packaging correctly?",
        a: "Share the closed product length, width, and height (or bottle diameter and fill height), plus any insert needs. We add clearance so the product fits securely without rattling or crushing."
      },
      {
        q: "Can I print my logo and brand colors on the boxes?",
        a: "Yes. Custom printed packaging supports CMYK brand colors, logos, and panel hierarchy. Soft-touch, gloss, foil, emboss, and spot UV can be added once the structure is confirmed."
      },
      {
        q: "Do folding cartons ship flat?",
        a: "Yes. Most folding carton styles ship flat for efficient storage and freight, then erect quickly for packing. Rigid gift formats that stay set up are called out separately when needed."
      },
      {
        q: "Can I order a sample or dieline before production?",
        a: "Yes. After dimensions and structure are agreed, we can provide a dieline for artwork and discuss sampling options so you can check fit and print before a full run."
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
        q: "Is there enough space on the box for FDA drug facts and SPF compliance text?",
        a: "Yes. We plan your dieline with sufficient rear and side panel real estate to clearly accommodate SPF active ingredients, drug facts tables, and warning directions."
      },
      {
        q: "Can you make boxes for both squeeze tubes and aerosol sunscreen sprays?",
        a: "Yes. We produce tall folding cartons for cylindrical pump sprays and auto-lock bottom boxes for heavier sunscreen squeeze tubes."
      },
      {
        q: "Can sun care cartons handle beach-bag and travel use messaging?",
        a: "Yes. Panels can carry SPF callouts, water-resistance notes, and travel-size cues while keeping the carton durable for retail and seasonal launches."
      },
      {
        q: "What board works for heavier sunscreen tubes?",
        a: "Heavier tubes and sprays usually need stronger board and an auto-lock or crash-lock base so the carton stays closed when packed upright."
      },
      {
        q: "Can you match packaging across SPF sticks, sprays, and lotions?",
        a: "Yes. A shared colour story and finish system can run across stick, spray, and lotion dielines so the sun care line looks consistent on shelf."
      },
      {
        q: "Do sun care boxes support bilingual or dense regulatory copy?",
        a: "Yes. We plan panel hierarchy so drug facts, directions, and secondary language copy remain readable without crowding the brand face."
      },
      {
        q: "Can after-sun and self-tan products use the same packaging family?",
        a: "Yes. Related SKUs can share finishes and typography while using separate cartons sized to each fill."
      },
      {
        q: "How do I request a quote for custom boxes?",
        a: "Open the product or category page that matches your fill, then submit a quote with internal dimensions, quantity intent, preferred finishes, and artwork notes. Box Studio confirms structure and pricing from that brief."
      },
      {
        q: "What information do you need to size my packaging correctly?",
        a: "Share the closed product length, width, and height (or bottle diameter and fill height), plus any insert needs. We add clearance so the product fits securely without rattling or crushing."
      },
      {
        q: "Can I print my logo and brand colors on the boxes?",
        a: "Yes. Custom printed packaging supports CMYK brand colors, logos, and panel hierarchy. Soft-touch, gloss, foil, emboss, and spot UV can be added once the structure is confirmed."
      },
      {
        q: "Do folding cartons ship flat?",
        a: "Yes. Most folding carton styles ship flat for efficient storage and freight, then erect quickly for packing. Rigid gift formats that stay set up are called out separately when needed."
      },
      {
        q: "Can I order a sample or dieline before production?",
        a: "Yes. After dimensions and structure are agreed, we can provide a dieline for artwork and discuss sampling options so you can check fit and print before a full run."
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
        q: "Which box structure is best for 250ml or 500ml shampoo bottles?",
        a: "An auto-lock bottom carton or crash-lock base box is recommended for liquid bottles over 200ml, as the base supports weight without accidental opening."
      },
      {
        q: "Do you offer eco-friendly boxes for solid shampoo bars?",
        a: "Yes. We produce unbleached kraft paperboard boxes with optional cutout windows and soy-based inks for zero-waste and organic hair care brands."
      },
      {
        q: "Can hair care boxes include sets for shampoo and conditioner pairs?",
        a: "Yes. Twin packs and routine sets can use sleeve-and-tray or partitioned cartons sized to both bottles."
      },
      {
        q: "What finishes work for salon and retail hair brands?",
        a: "Matte soft-touch, gloss accents, foil wordmarks, and kraft natural looks are all common. Choose finishes that stay readable under salon and retail lighting."
      },
      {
        q: "Do you make packaging for hair oils and treatment ampoules?",
        a: "Yes. Slim tuck cartons and multi-cavity trays protect dropper oils, vials, and treatment ampoules for shelf or e-commerce."
      },
      {
        q: "Can tall shampoo cartons stay stable in shipping?",
        a: "Yes. Auto-lock bottoms, correct caliper, and optional inserts keep taller liquid bottles upright and reduce crush at the corners."
      },
      {
        q: "Are window cartons available for hair masks or bars?",
        a: "Yes. Die-cut windows can show bar texture or jar labels when that helps shoppers choose faster on shelf."
      },
      {
        q: "How do I request a quote for custom boxes?",
        a: "Open the product or category page that matches your fill, then submit a quote with internal dimensions, quantity intent, preferred finishes, and artwork notes. Box Studio confirms structure and pricing from that brief."
      },
      {
        q: "What information do you need to size my packaging correctly?",
        a: "Share the closed product length, width, and height (or bottle diameter and fill height), plus any insert needs. We add clearance so the product fits securely without rattling or crushing."
      },
      {
        q: "Can I print my logo and brand colors on the boxes?",
        a: "Yes. Custom printed packaging supports CMYK brand colors, logos, and panel hierarchy. Soft-touch, gloss, foil, emboss, and spot UV can be added once the structure is confirmed."
      },
      {
        q: "Do folding cartons ship flat?",
        a: "Yes. Most folding carton styles ship flat for efficient storage and freight, then erect quickly for packing. Rigid gift formats that stay set up are called out separately when needed."
      },
      {
        q: "Can I order a sample or dieline before production?",
        a: "Yes. After dimensions and structure are agreed, we can provide a dieline for artwork and discuss sampling options so you can check fit and print before a full run."
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
        q: "Can soap boxes have scent-release cutout windows?",
        a: "Yes. We can die-cut open windows without plastic film so shoppers can smell the soap fragrance and feel the natural bar texture directly."
      },
      {
        q: "Can you make multi-pack boxes for bath bombs?",
        a: "Yes. We produce sleeve trays and partitioned cartons with dividers to hold 2, 4, or 6 bath bombs without them chipping or rubbing against each other."
      },
      {
        q: "Can body care cartons fit tubes, jars, and bottles in one brand line?",
        a: "Yes. Each SKU gets its own dieline, while shared print and finishes keep lotion, scrub, and wash packaging looking like one family."
      },
      {
        q: "Do soap boxes need grease or moisture resistance?",
        a: "Lamination and board choice can be planned for bars and butters that leave residue. Share how the product is stored so we can recommend a practical surface."
      },
      {
        q: "Can you print natural or kraft looks for artisan soap brands?",
        a: "Yes. Unbleached kraft faces, soy-friendly print conversations, and open windows are popular for handmade and natural body care lines."
      },
      {
        q: "Are gift sets available for bath and body collections?",
        a: "Yes. Partitioned gift cartons and sleeve trays can hold soap, lotion, and bath extras as a seasonal or retail set."
      },
      {
        q: "Can deodorant and roll-on formats use custom cartons?",
        a: "Yes. Stick and roll-on fills get slim, fitted cartons with clear brand panels for counter and travel retail."
      },
      {
        q: "How do I request a quote for custom boxes?",
        a: "Open the product or category page that matches your fill, then submit a quote with internal dimensions, quantity intent, preferred finishes, and artwork notes. Box Studio confirms structure and pricing from that brief."
      },
      {
        q: "What information do you need to size my packaging correctly?",
        a: "Share the closed product length, width, and height (or bottle diameter and fill height), plus any insert needs. We add clearance so the product fits securely without rattling or crushing."
      },
      {
        q: "Can I print my logo and brand colors on the boxes?",
        a: "Yes. Custom printed packaging supports CMYK brand colors, logos, and panel hierarchy. Soft-touch, gloss, foil, emboss, and spot UV can be added once the structure is confirmed."
      },
      {
        q: "Do folding cartons ship flat?",
        a: "Yes. Most folding carton styles ship flat for efficient storage and freight, then erect quickly for packing. Rigid gift formats that stay set up are called out separately when needed."
      },
      {
        q: "Can I order a sample or dieline before production?",
        a: "Yes. After dimensions and structure are agreed, we can provide a dieline for artwork and discuss sampling options so you can check fit and print before a full run."
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
        q: "What box type do you recommend for high-end luxury perfumes?",
        a: "A straight tuck end or reinforced auto-lock bottom folding carton with a custom die-cut paperboard neck insert provides luxury shelf presence and bottle protection."
      },
      {
        q: "Can you produce packaging for 2ml to 10ml perfume sample discovery sets?",
        a: "Yes. We make folding cartons and sleeve & tray cartons with multi-cavity paperboard trays tailored specifically for sample vial sets."
      },
      {
        q: "How do fragrance boxes protect glass perfume bottles?",
        a: "Fitted neck collars, platform inserts, and correct clearance keep flacons from shifting. Luxury lines often combine a strong tuck or auto-lock carton with a precision insert."
      },
      {
        q: "What finishes elevate perfume packaging on shelf?",
        a: "Soft-touch matte, metallic foil, embossing, and spot UV on the brand mark create lasting shelf presence without overcrowding the bottle silhouette."
      },
      {
        q: "Can cologne and body mist lines share a packaging system?",
        a: "Yes. A shared colour story and finish language can run across perfume, cologne, mist, and discovery-set cartons with sizes matched to each fill."
      },
      {
        q: "Do you make packaging for rollerballs and attars?",
        a: "Yes. Slim cartons and small rigid-feel folding formats can be sized for rollerballs, attar vials, and travel sprays."
      },
      {
        q: "Can fragrance gift sets include multiple bottles?",
        a: "Yes. Sleeve-and-tray or partitioned cartons hold discovery vials or paired flacons for gifting and seasonal launches."
      },
      {
        q: "How do I request a quote for custom boxes?",
        a: "Open the product or category page that matches your fill, then submit a quote with internal dimensions, quantity intent, preferred finishes, and artwork notes. Box Studio confirms structure and pricing from that brief."
      },
      {
        q: "What information do you need to size my packaging correctly?",
        a: "Share the closed product length, width, and height (or bottle diameter and fill height), plus any insert needs. We add clearance so the product fits securely without rattling or crushing."
      },
      {
        q: "Can I print my logo and brand colors on the boxes?",
        a: "Yes. Custom printed packaging supports CMYK brand colors, logos, and panel hierarchy. Soft-touch, gloss, foil, emboss, and spot UV can be added once the structure is confirmed."
      },
      {
        q: "Do folding cartons ship flat?",
        a: "Yes. Most folding carton styles ship flat for efficient storage and freight, then erect quickly for packing. Rigid gift formats that stay set up are called out separately when needed."
      },
      {
        q: "Can I order a sample or dieline before production?",
        a: "Yes. After dimensions and structure are agreed, we can provide a dieline for artwork and discuss sampling options so you can check fit and print before a full run."
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
        q: "Can you create kit boxes for a beard comb, oil bottle, and balm tin together?",
        a: "Yes. We engineer custom multi-compartment inserts that secure dropper bottles, round tins, and wooden combs in a single cohesive presentation box."
      },
      {
        q: "What aesthetic finishes work best for men’s grooming products?",
        a: "Deep charcoal or kraft boards with matte lamination, blind debossing, and bronze or copper foil stamping provide an authentic, premium masculine feel."
      },
      {
        q: "Can grooming boxes support retail counters and subscription kits?",
        a: "Yes. Single-SKU cartons suit counters, while kit boxes with inserts suit subscription or gift sets for beard, shave, and hair routines."
      },
      {
        q: "Do you size cartons for tins, tubes, and dropper bottles?",
        a: "Yes. Balm tins, shave tubes, and oil droppers each need their own fit. Multi-item kits use partitioned cradles so tools and bottles stay locked in place."
      },
      {
        q: "Can artwork stay bold and simple for men’s brands?",
        a: "Yes. Strong type, limited colour, kraft or charcoal boards, and restrained foil usually read clearly for grooming lines."
      },
      {
        q: "Are travel-size grooming cartons available?",
        a: "Yes. Smaller dielines can match travel tins and minis while keeping the same brand finish system as full-size SKUs."
      },
      {
        q: "Can we include a comb or brush in the same box?",
        a: "Yes. Kit inserts can reserve a cavity for a comb, brush, or tool beside the primary bottle or tin."
      },
      {
        q: "How do I request a quote for custom boxes?",
        a: "Open the product or category page that matches your fill, then submit a quote with internal dimensions, quantity intent, preferred finishes, and artwork notes. Box Studio confirms structure and pricing from that brief."
      },
      {
        q: "What information do you need to size my packaging correctly?",
        a: "Share the closed product length, width, and height (or bottle diameter and fill height), plus any insert needs. We add clearance so the product fits securely without rattling or crushing."
      },
      {
        q: "Can I print my logo and brand colors on the boxes?",
        a: "Yes. Custom printed packaging supports CMYK brand colors, logos, and panel hierarchy. Soft-touch, gloss, foil, emboss, and spot UV can be added once the structure is confirmed."
      },
      {
        q: "Do folding cartons ship flat?",
        a: "Yes. Most folding carton styles ship flat for efficient storage and freight, then erect quickly for packing. Rigid gift formats that stay set up are called out separately when needed."
      },
      {
        q: "Can I order a sample or dieline before production?",
        a: "Yes. After dimensions and structure are agreed, we can provide a dieline for artwork and discuss sampling options so you can check fit and print before a full run."
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
        q: "Can you manufacture custom PR influencer boxes and beauty advent calendars?",
        a: "Yes. We produce large folding presentation boxes with tuck closures, perforated numbered doors, and customized multi-product paperboard inserts."
      },
      {
        q: "Can boxes be shipped flat to save on warehousing and freight?",
        a: "Yes. All our folding carton gift boxes ship flat to maximize warehouse space and reduce freight costs, and assemble in seconds."
      },
      {
        q: "What structures work best for beauty gift sets?",
        a: "Sleeve-and-tray, tuck-end presentation cartons, and partitioned folding boxes are common for multi-product beauty gifts and PR kits."
      },
      {
        q: "Can gift boxes show products through a window?",
        a: "Yes. Die-cut windows with clear film can showcase the hero product while still protecting the set in transit."
      },
      {
        q: "Do you support seasonal and holiday beauty collections?",
        a: "Yes. Seasonal print, foil accents, and set inserts can be planned for holiday drops, Valentine kits, and limited editions."
      },
      {
        q: "Can one gift box hold bottles of different heights?",
        a: "Yes. Custom inserts and platforms level mixed heights so the set looks intentional when opened."
      },
      {
        q: "Is unboxing considered when designing beauty gift packaging?",
        a: "Yes. Opening detail, insert reveal, and finish choices can be planned for a strong unboxing moment as well as shelf or courier durability."
      },
      {
        q: "How do I request a quote for custom boxes?",
        a: "Open the product or category page that matches your fill, then submit a quote with internal dimensions, quantity intent, preferred finishes, and artwork notes. Box Studio confirms structure and pricing from that brief."
      },
      {
        q: "What information do you need to size my packaging correctly?",
        a: "Share the closed product length, width, and height (or bottle diameter and fill height), plus any insert needs. We add clearance so the product fits securely without rattling or crushing."
      },
      {
        q: "Can I print my logo and brand colors on the boxes?",
        a: "Yes. Custom printed packaging supports CMYK brand colors, logos, and panel hierarchy. Soft-touch, gloss, foil, emboss, and spot UV can be added once the structure is confirmed."
      },
      {
        q: "Do folding cartons ship flat?",
        a: "Yes. Most folding carton styles ship flat for efficient storage and freight, then erect quickly for packing. Rigid gift formats that stay set up are called out separately when needed."
      },
      {
        q: "Can I order a sample or dieline before production?",
        a: "Yes. After dimensions and structure are agreed, we can provide a dieline for artwork and discuss sampling options so you can check fit and print before a full run."
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
