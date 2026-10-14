export const uses = [
  {
    slug: 'cosmetics',
    name: 'Packaging for Skincare & Cosmetics',
    icon: 'drop',
    tags: ['cosmetics'],
    line: 'Jars, serums, bottles, and sets.',
    intro: 'A skincare brand needs a box that feels as considered as the formula. A tuck carton fits one jar or bottle. A rigid box fits a set someone will keep on a shelf.',
    description: 'Skincare packaging for jars, bottles, and sets. A tuck carton for one piece, a rigid box for a set. Request a quote.',
  },
  {
    slug: 'retail',
    name: 'Boxes for Products on a Shelf',
    icon: 'shelf',
    tags: ['retail'],
    line: 'The face of the product in a store.',
    intro: 'A retail product needs a box that can stand on a shelf and carry the name. Tuck cartons, sleeves, and window boxes do that. Say if it has to hang or stack.',
    description: 'Retail boxes for products that sit on a shelf. Tuck cartons, sleeves, and window boxes with room for your name.',
  },
  {
    slug: 'gifts',
    name: 'Gift Boxes People Want to Open',
    icon: 'gift',
    tags: ['gifts', 'gift-boxes'],
    line: 'For a product that is the present.',
    intro: 'A gift needs a box someone is glad to open. A window shows what is inside. A fold-flat cover stores easily. A rigid lid feels like part of the gift. Tissue or a cradle can be noted with the quote.',
    description: 'Gift boxes for products people give. Choose a window, a fold-flat cover, or a rigid lid, then request a quote.',
  },
  {
    slug: 'food',
    name: 'Cartons for Food Brands',
    icon: 'leaf',
    tags: ['food'],
    line: 'Dry goods that already have an inner pack.',
    intro: 'A food brand needs a carton around the product, usually with a bag or tray as the layer that touches the food. That fit is confirmed for your product. This site does not certify a box for food contact.',
    description: 'Food packaging cartons for dry goods, with an inner bag or tray as the contact layer. Suitability is confirmed with the quote.',
  },
  {
    slug: 'ecommerce',
    name: 'Mailer Boxes for Orders You Ship',
    icon: 'parcel',
    tags: ['e-commerce'],
    line: 'The box that arrives at the door.',
    intro: 'An online order needs a box the customer is willing to open. A mailer closes with a lid. A shipping carton closes with flaps and is often the outer box. Measure the product with anything packed around it.',
    description: 'Mailer boxes and shipping cartons for orders you send to customers. Compare the closures, then request a quote.',
  },
  {
    slug: 'corporate',
    name: 'Boxes for Client Gifts & Kits',
    icon: 'kit',
    tags: ['presentation'],
    line: 'Welcome kits and gifts with your name.',
    intro: 'A company gift needs a box that still feels right after it is opened. Magnetic lids, drawers, and lid-and-base boxes suit welcome kits, client gifts, and documents someone will keep.',
    description: 'Corporate gift boxes for welcome kits and client gifts. Magnetic lids, drawers, and a separate lid and base.',
  },
];

export function getUse(slug) {
  return uses.find((item) => item.slug === slug);
}

export const industries = [
  {
    id: 'all',
    name: 'All Custom Boxes',
    href: '/custom-boxes',
    icon: 'parcel',
    intro: 'Every box is named for the product it holds. Open one to see that product in the box.',
  },
  {
    id: 'cosmetic-boxes',
    name: 'Cosmetic Boxes',
    href: '/cosmetic-boxes',
    icon: 'drop',
    line: 'Eyeliner, mascara, lipstick, and sets',
    intro: 'Eyeliner, mascara, lipstick, lotion, perfume, and skincare sets. Pick the product you pack.',
  },
  {
    id: 'display-boxes',
    name: 'Display Boxes',
    href: '/display-boxes',
    icon: 'shelf',
    line: 'Sleeves, windows, and counter trays',
    intro: 'For a product people should see. A sleeve slides, a window shows the front, a tray holds a row.',
  },
  {
    id: 'food-boxes',
    name: 'Food Boxes',
    href: '/food-boxes',
    icon: 'leaf',
    line: 'Tea, bakery, and kraft cartons',
    intro: 'Tea, bakery, and dry goods. An inner pack is the contact layer when the product needs one.',
  },
  {
    id: 'rigid-boxes',
    name: 'Rigid Boxes',
    href: '/rigid-boxes',
    icon: 'kit',
    line: 'Lids, drawers, and jewelry boxes',
    intro: 'Magnetic lids, lift-off lids, and drawers for sets that should feel firm.',
  },
  {
    id: 'gift-boxes',
    name: 'Gift Boxes',
    href: '/gift-boxes',
    icon: 'gift',
    line: 'Presents and client kits',
    intro: 'A foldable cover or a rigid kit someone will keep.',
  },
  {
    id: 'mailer-boxes',
    name: 'Mailer Boxes',
    href: '/mailer-boxes',
    icon: 'parcel',
    line: 'The box a customer opens',
    intro: 'Mailers for one order, a subscription kit, or a flat product.',
  },
  {
    id: 'shipping-boxes',
    name: 'Shipping Boxes',
    href: '/shipping-boxes',
    icon: 'parcel',
    line: 'Outer cartons for delivery',
    intro: 'Corrugated cartons for the trip. A full-overlap top when the shipment is heavier.',
  },
];

export function matchesIndustry(product, id) {
  if (!id || id === 'all') return true;
  const industry = industries.find((item) => item.id === id);
  if (!industry) return false;
  if (industry.category && product.category === industry.category) return true;
  if (industry.slugs?.includes(product.slug)) return true;
  if (industry.tags?.some((tag) => product.tags.includes(tag))) return true;
  return false;
}
