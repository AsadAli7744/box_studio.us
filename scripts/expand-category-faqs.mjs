import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(__dirname, '../content/catalog.json');

const SHARED = [
  {
    q: 'What is the minimum order quantity (MOQ)?',
    a: 'The minimum order quantity (MOQ) is 1,000 pcs. Custom printed packaging quotes and production runs start at 1,000 units.',
  },
  {
    q: 'How do I request a quote for custom boxes?',
    a: 'Open the product or category page that matches your fill, then submit a quote with internal dimensions, quantity intent (MOQ 1,000 pcs), preferred finishes, and artwork notes. Box Studio confirms structure and pricing from that brief.',
  },
  {
    q: 'What information do you need to size my packaging correctly?',
    a: 'Share the closed product length, width, and height (or bottle diameter and fill height), plus any insert needs. We add clearance so the product fits securely without rattling or crushing.',
  },
  {
    q: 'Can I print my logo and brand colors on the boxes?',
    a: 'Yes. Custom printed packaging supports CMYK brand colors, logos, and panel hierarchy. Soft-touch, gloss, foil, emboss, and spot UV can be added once the structure is confirmed.',
  },
  {
    q: 'Do folding cartons ship flat?',
    a: 'Yes. Most folding carton styles ship flat for efficient storage and freight, then erect quickly for packing. Rigid gift formats that stay set up are called out separately when needed.',
  },
  {
    q: 'Can I order a sample or dieline before production?',
    a: 'Yes. After dimensions and structure are agreed, we can provide a dieline for artwork and discuss sampling options so you can check fit and print before a full run.',
  },
];

const EXTRA_BY_SLUG = {
  'cosmetic-boxes': [
    {
      q: 'What box structures work best for cosmetic bottles and jars?',
      a: 'Straight tuck, reverse tuck, and auto-lock bottom cartons are common for cosmetic bottles and jars. Heavier glass fills often need a reinforced base and a paperboard cradle or neck collar.',
    },
    {
      q: 'Can cosmetic boxes include inserts for fragile glass?',
      a: 'Yes. Custom paperboard inserts, trays, and collars hold droppers, jars, and tubes in place so products stay presentation-ready through shipping and shelf handling.',
    },
    {
      q: 'Are small-order and wholesale cosmetic runs both available?',
      a: 'Yes. Box Studio supports both smaller brand launches and larger wholesale replenishment. Share your quantity range in the quote so we can recommend a practical production path.',
    },
    {
      q: 'Can one cosmetic packaging family share the same look across SKUs?',
      a: 'Yes. Brands often keep a shared colour story, finish, and typography across cartons while changing only the dieline size and product-facing panel copy for each SKU.',
    },
  ],
  'makeup-boxes': [
    {
      q: 'Can makeup boxes be sized for lipstick, mascara, and foundation together?',
      a: 'Each carton is sized to its fill. Lipsticks, mascaras, foundations, and palettes usually need separate dielines, while kit or set boxes can combine multiple items with a partitioned insert.',
    },
    {
      q: 'What finishes look premium on colour cosmetics packaging?',
      a: 'Soft-touch matte, spot UV on shade names, and gold, silver, or rose-gold foil are popular for makeup retail. Choose finishes that support shade readability on shelf.',
    },
    {
      q: 'Can we print shade names and barcode panels clearly?',
      a: 'Yes. The dieline leaves room for shade names, brand marks, and barcode or regulatory panels so colour cosmetics stay easy to merchandise and scan.',
    },
    {
      q: 'Do you make packaging for makeup palettes and tool kits?',
      a: 'Yes. Palette, brush, and sponge formats can use sleeve-and-tray, window, or tuck-end cartons with cradles that keep trays and tools from shifting.',
    },
    {
      q: 'Can makeup boxes support e-commerce shipping as well as retail?',
      a: 'Yes. Board caliper and closure style can be planned for counter display and parcel handling. Note both journeys in your quote if the same carton must do both jobs.',
    },
  ],
  'skincare-boxes': [
    {
      q: 'Can skincare boxes be sized for serums, jars, and pumps?',
      a: 'Yes. Dropper serums, cream jars, pumps, and tubes each get a dieline matched to the closed product, with clearance for caps and pumps.',
    },
    {
      q: 'What finishes suit clinical or clean beauty brands?',
      a: 'Soft-touch matte, clean white or soft colour stories, and restrained foil or emboss work well for clinical and clean beauty lines. Share your brand direction in the quote notes.',
    },
    {
      q: 'Can we package a skincare routine as a set?',
      a: 'Yes. Sleeve-and-tray or partitioned gift cartons can hold cleanser, serum, and cream together for retail kits or launch sets.',
    },
    {
      q: 'Is there space for ingredient or claim copy on skincare cartons?',
      a: 'Yes. Side and rear panels can be planned for ingredient notes, usage directions, and brand claims once you share the required text length.',
    },
    {
      q: 'Do you support both retail shelf and DTC unboxing for skincare?',
      a: 'Yes. Structure, insert, and finish choices can prioritize shelf presence, unboxing moment, or both — tell us which journey matters most.',
    },
  ],
  'sun-care-boxes': [
    {
      q: 'Can sun care cartons handle beach-bag and travel use messaging?',
      a: 'Yes. Panels can carry SPF callouts, water-resistance notes, and travel-size cues while keeping the carton durable for retail and seasonal launches.',
    },
    {
      q: 'What board works for heavier sunscreen tubes?',
      a: 'Heavier tubes and sprays usually need stronger board and an auto-lock or crash-lock base so the carton stays closed when packed upright.',
    },
    {
      q: 'Can you match packaging across SPF sticks, sprays, and lotions?',
      a: 'Yes. A shared colour story and finish system can run across stick, spray, and lotion dielines so the sun care line looks consistent on shelf.',
    },
    {
      q: 'Do sun care boxes support bilingual or dense regulatory copy?',
      a: 'Yes. We plan panel hierarchy so drug facts, directions, and secondary language copy remain readable without crowding the brand face.',
    },
    {
      q: 'Can after-sun and self-tan products use the same packaging family?',
      a: 'Yes. Related SKUs can share finishes and typography while using separate cartons sized to each fill.',
    },
  ],
  'hair-care-boxes': [
    {
      q: 'Can hair care boxes include sets for shampoo and conditioner pairs?',
      a: 'Yes. Twin packs and routine sets can use sleeve-and-tray or partitioned cartons sized to both bottles.',
    },
    {
      q: 'What finishes work for salon and retail hair brands?',
      a: 'Matte soft-touch, gloss accents, foil wordmarks, and kraft natural looks are all common. Choose finishes that stay readable under salon and retail lighting.',
    },
    {
      q: 'Do you make packaging for hair oils and treatment ampoules?',
      a: 'Yes. Slim tuck cartons and multi-cavity trays protect dropper oils, vials, and treatment ampoules for shelf or e-commerce.',
    },
    {
      q: 'Can tall shampoo cartons stay stable in shipping?',
      a: 'Yes. Auto-lock bottoms, correct caliper, and optional inserts keep taller liquid bottles upright and reduce crush at the corners.',
    },
    {
      q: 'Are window cartons available for hair masks or bars?',
      a: 'Yes. Die-cut windows can show bar texture or jar labels when that helps shoppers choose faster on shelf.',
    },
  ],
  'soap-body-care-boxes': [
    {
      q: 'Can body care cartons fit tubes, jars, and bottles in one brand line?',
      a: 'Yes. Each SKU gets its own dieline, while shared print and finishes keep lotion, scrub, and wash packaging looking like one family.',
    },
    {
      q: 'Do soap boxes need grease or moisture resistance?',
      a: 'Lamination and board choice can be planned for bars and butters that leave residue. Share how the product is stored so we can recommend a practical surface.',
    },
    {
      q: 'Can you print natural or kraft looks for artisan soap brands?',
      a: 'Yes. Unbleached kraft faces, soy-friendly print conversations, and open windows are popular for handmade and natural body care lines.',
    },
    {
      q: 'Are gift sets available for bath and body collections?',
      a: 'Yes. Partitioned gift cartons and sleeve trays can hold soap, lotion, and bath extras as a seasonal or retail set.',
    },
    {
      q: 'Can deodorant and roll-on formats use custom cartons?',
      a: 'Yes. Stick and roll-on fills get slim, fitted cartons with clear brand panels for counter and travel retail.',
    },
  ],
  'fragrance-boxes': [
    {
      q: 'How do fragrance boxes protect glass perfume bottles?',
      a: 'Fitted neck collars, platform inserts, and correct clearance keep flacons from shifting. Luxury lines often combine a strong tuck or auto-lock carton with a precision insert.',
    },
    {
      q: 'What finishes elevate perfume packaging on shelf?',
      a: 'Soft-touch matte, metallic foil, embossing, and spot UV on the brand mark create lasting shelf presence without overcrowding the bottle silhouette.',
    },
    {
      q: 'Can cologne and body mist lines share a packaging system?',
      a: 'Yes. A shared colour story and finish language can run across perfume, cologne, mist, and discovery-set cartons with sizes matched to each fill.',
    },
    {
      q: 'Do you make packaging for rollerballs and attars?',
      a: 'Yes. Slim cartons and small rigid-feel folding formats can be sized for rollerballs, attar vials, and travel sprays.',
    },
    {
      q: 'Can fragrance gift sets include multiple bottles?',
      a: 'Yes. Sleeve-and-tray or partitioned cartons hold discovery vials or paired flacons for gifting and seasonal launches.',
    },
  ],
  'mens-grooming-boxes': [
    {
      q: 'Can grooming boxes support retail counters and subscription kits?',
      a: 'Yes. Single-SKU cartons suit counters, while kit boxes with inserts suit subscription or gift sets for beard, shave, and hair routines.',
    },
    {
      q: 'Do you size cartons for tins, tubes, and dropper bottles?',
      a: 'Yes. Balm tins, shave tubes, and oil droppers each need their own fit. Multi-item kits use partitioned cradles so tools and bottles stay locked in place.',
    },
    {
      q: 'Can artwork stay bold and simple for men’s brands?',
      a: 'Yes. Strong type, limited colour, kraft or charcoal boards, and restrained foil usually read clearly for grooming lines.',
    },
    {
      q: 'Are travel-size grooming cartons available?',
      a: 'Yes. Smaller dielines can match travel tins and minis while keeping the same brand finish system as full-size SKUs.',
    },
    {
      q: 'Can we include a comb or brush in the same box?',
      a: 'Yes. Kit inserts can reserve a cavity for a comb, brush, or tool beside the primary bottle or tin.',
    },
  ],
  'beauty-gift-boxes': [
    {
      q: 'What structures work best for beauty gift sets?',
      a: 'Sleeve-and-tray, tuck-end presentation cartons, and partitioned folding boxes are common for multi-product beauty gifts and PR kits.',
    },
    {
      q: 'Can gift boxes show products through a window?',
      a: 'Yes. Die-cut windows with clear film can showcase the hero product while still protecting the set in transit.',
    },
    {
      q: 'Do you support seasonal and holiday beauty collections?',
      a: 'Yes. Seasonal print, foil accents, and set inserts can be planned for holiday drops, Valentine kits, and limited editions.',
    },
    {
      q: 'Can one gift box hold bottles of different heights?',
      a: 'Yes. Custom inserts and platforms level mixed heights so the set looks intentional when opened.',
    },
    {
      q: 'Is unboxing considered when designing beauty gift packaging?',
      a: 'Yes. Opening detail, insert reveal, and finish choices can be planned for a strong unboxing moment as well as shelf or courier durability.',
    },
  ],
  'healthcare-boxes': [
    {
      q: 'Can healthcare packaging stay clear and easy to read?',
      a: 'Yes. Panel hierarchy can prioritize product name, directions, and facts so wellness and healthcare packs stay scannable on shelf and in kits.',
    },
    {
      q: 'Do you make cartons for bottles, blister cards, and kits?',
      a: 'Yes. Each fill gets a fitted dieline. Kits can use dividers or trays so bottles and accessories stay organized.',
    },
    {
      q: 'What board strength is typical for healthcare cartons?',
      a: 'Paperboard caliper is chosen for the product weight and handling path. Heavier bottles usually need a stronger base closure and secure tuck or lock.',
    },
    {
      q: 'Can we print batch, usage, or caution information clearly?',
      a: 'Yes. Side and rear panels can reserve space for usage, caution, and identification copy once you share the required text.',
    },
    {
      q: 'Are finishes kept practical for healthcare brands?',
      a: 'Matte or gloss protection is common. Soft-touch and light foil can still be used when the brand wants a premium wellness look without crowding critical copy.',
    },
  ],
  'restaurant-food-boxes': [
    {
      q: 'Which foods can these cartons be designed around?',
      a: 'Burger clamshells, sandwich wedges, fry scoops, meal trays, bakery windows, and takeaway cartons can each be drawn to the food format you serve.',
    },
    {
      q: 'Can restaurant boxes carry logo print on kraft?',
      a: 'Yes. Kraft faces with a printed logo panel or colour accent are common for cafes, QSR, and bakery brands.',
    },
    {
      q: 'Do you help choose a structure for hot or greasy foods?',
      a: 'Share how the food is served and held. Structure and board notes are confirmed in the quote so the carton matches real kitchen and takeaway use.',
    },
    {
      q: 'Can bakery boxes include a viewing window?',
      a: 'Yes. Window cartons help display pastries and sweets while still protecting the product in transit.',
    },
    {
      q: 'Are multi-size food carton families available?',
      a: 'Yes. Small, regular, and large versions of a burger, sandwich, or meal carton can share print while changing only the dieline size.',
    },
  ],
  'christmas-boxes': [
    {
      q: 'Can Christmas packaging support retail gifts and brand kits?',
      a: 'Yes. Holiday cartons can hold beauty sets, confectionery, or branded gifts with seasonal print and protective inserts.',
    },
    {
      q: 'What print styles work for holiday boxes?',
      a: 'Characters, snow and pine patterns, foil accents, and custom brand holiday artwork all work. Send art direction with your quote.',
    },
    {
      q: 'Do shaped holiday cartons cost more planning time?',
      a: 'Shaped cartons need their own dieline and sample checks. Share the shape goal early so structure and artwork can be planned together.',
    },
    {
      q: 'Can holiday boxes ship flat before packing?',
      a: 'Most folding holiday cartons ship flat and erect for packing. Say if you need a set-up rigid presentation format instead.',
    },
    {
      q: 'Are window and handle styles available for Christmas gifting?',
      a: 'Yes. Window fronts and gable handles can be discussed when the gift should be carried or displayed without fully opening the carton.',
    },
  ],
};

function mergeFaqs(existing = [], extras = []) {
  const out = [];
  const seen = new Set();

  function add(item) {
    const key = String(item?.q || '')
      .trim()
      .toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push({ q: item.q.trim(), a: String(item.a || '').trim() });
  }

  existing.forEach(add);
  extras.forEach(add);
  SHARED.forEach(add);

  return out.slice(0, 12);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

catalog.categories = catalog.categories.map((category) => {
  const extras = EXTRA_BY_SLUG[category.slug] || [];
  const faqs = mergeFaqs(category.faqs || [], extras);
  if (faqs.length < 7) {
    throw new Error(`${category.slug} only has ${faqs.length} FAQs after merge`);
  }
  return { ...category, faqs };
});

fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');

const summary = catalog.categories.map((item) => `${item.slug}: ${item.faqs.length}`).join('\n');
console.log(`Updated category FAQs:\n${summary}`);
