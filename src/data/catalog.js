export const materials = [
  {
    id: 'paperboard',
    name: 'Paperboard',
    summary: 'A single-ply board that creases cleanly. It is the usual board for folding cartons.',
    image: '/images/sample-paperboard.jpg',
    alt: 'Close view of a smooth white paperboard edge.',
  },
  {
    id: 'rigid-wrap',
    name: 'Rigid board with paper wrap',
    summary: 'Thick board wrapped in paper. It holds its shape and does not fold flat for shipping.',
    image: '/images/sample-rigid-wrap.jpg',
    alt: 'Corner of thick board wrapped in charcoal paper.',
  },
  {
    id: 'corrugated',
    name: 'Corrugated board',
    summary: 'Liners with a fluted layer between them. It is used when a box needs more body for transit.',
    image: '/images/sample-corrugated.jpg',
    alt: 'Edge of corrugated board showing the wavy flute between kraft liners.',
  },
  {
    id: 'kraft-board',
    name: 'Kraft appearance',
    summary: 'Unbleached board, or a kraft-looking face. This describes the paper, not the closure.',
    image: '/images/sample-kraft.jpg',
    alt: 'Unbleached kraft paper with visible fibers.',
  },
];

export const finishes = [
  {
    id: 'matte',
    name: 'Matte lamination',
    summary: 'A low-sheen film over the print.',
    image: '/images/sample-matte.jpg',
    alt: 'Matte laminated ivory paperboard with a soft, non-reflective surface.',
  },
  {
    id: 'gloss',
    name: 'Gloss lamination',
    summary: 'A smooth, reflective film.',
    image: '/images/sample-gloss.jpg',
    alt: 'Gloss laminated paperboard with a smooth reflective highlight.',
  },
  {
    id: 'foil',
    name: 'Foil stamping',
    summary: 'Metallic foil on selected areas.',
    image: '/images/sample-foil.jpg',
    alt: 'A plain metallic gold foil rectangle on charcoal paperboard.',
  },
  {
    id: 'emboss',
    name: 'Embossing and debossing',
    summary: 'A raised or pressed impression in the board.',
    image: '/images/sample-emboss.jpg',
    alt: 'Blind embossed rectangle on ivory paperboard, with no lettering.',
  },
  {
    id: 'spot-uv',
    name: 'Spot UV',
    summary: 'A glossy varnish on chosen areas of a quieter surface.',
    image: '/images/sample-spot-uv.jpg',
    alt: 'A glossy spot UV circle on matte ivory paperboard.',
  },
];

export const inserts = [
  {
    id: 'none',
    name: 'No insert',
    detail: 'The product sits directly in the box.',
  },
  {
    id: 'cradle',
    name: 'Paperboard cradle',
    detail: 'A folded fitment shaped around the product.',
  },
  {
    id: 'dividers',
    name: 'Dividers',
    detail: 'Partitions for a set or for more than one piece.',
  },
  {
    id: 'tissue',
    name: 'Tissue bedding',
    detail: 'A light layer for presentation.',
  },
  {
    id: 'advice',
    name: 'I need advice',
    detail: 'Describe the product and the insert can be discussed with the quote.',
  },
];

export const exteriorColors = [
  { id: 'ivory', name: 'Ivory', value: '#F3EFE6' },
  { id: 'white', name: 'Soft white', value: '#F7F6F3' },
  { id: 'kraft', name: 'Kraft', value: '#C4A574' },
  { id: 'taupe', name: 'Taupe', value: '#B7A48C' },
  { id: 'blush', name: 'Blush', value: '#E4C9C2' },
  { id: 'charcoal', name: 'Charcoal', value: '#242826' },
  { id: 'forest', name: 'Forest', value: '#243F38' },
  { id: 'navy', name: 'Ink navy', value: '#1C2430' },
];

export const categories = [
  {
    slug: 'folding-cartons',
    name: 'Cartons for Products You Sell',
    menuLine: 'A printed face for a product on the shelf',
    short: 'Printed paperboard that folds flat, then stands up as the product’s face.',
    image: '/images/category-folding-cartons.jpg',
    alt: 'Ivory straight-tuck folding carton standing on a warm studio background.',
    intro:
      'Folding cartons are cut from paperboard and creased so they can be folded into shape. Tuck ends, auto-lock bottoms, and sleeve-and-tray formats are different closures on that same idea. They suit products that need a printed panel and a light structure.',
    guidance:
      'Paperboard is the usual material. A kraft face is a surface choice, not a different closure. Windows, hang tabs, and paperboard inserts can be discussed where the structure allows them. Dimensions are the internal length, width, and height, with clearance around the product.',
    useCases: ['Skincare jars and bottles', 'Shelf products with a printed face', 'Light gift cartons', 'Dry goods in an inner bag'],
    faqs: [
      {
        q: 'How is a folding carton different from a rigid box?',
        a: 'A folding carton is creased paperboard and can fold flat. A rigid box is wrapped thick board and stays set up. The choice depends on how the product is packed and how substantial the box needs to feel.',
      },
      {
        q: 'Can a folding carton use a kraft face?',
        a: 'Yes. Kraft is a material appearance. A tuck-end carton can be made with unbleached board, which is separate from choosing a tuck, lock, or sleeve.',
      },
      {
        q: 'Are folding cartons suitable for food?',
        a: 'That depends on the food and whether the board is meant to touch it. Suitability has to be confirmed for the specific product. This site does not treat a folding carton as food-contact certified.',
      },
    ],
  },
  {
    slug: 'rigid-boxes',
    name: 'Luxury Boxes for Sets',
    menuLine: 'A firm box for a set someone keeps',
    short: 'Magnetic lids, drawers, and bases that feel firm when someone picks them up.',
    image: '/images/category-rigid-boxes.jpg',
    alt: 'Charcoal rigid box with the lid lifted above the base.',
    intro:
      'Rigid boxes are wrapped structures that do not fold flat. A magnetic lid, a separate lid and base, and a drawer are different ways to open the same kind of board. The walls are thicker than a folding carton, so the box feels firmer in the hand.',
    guidance:
      'The usual construction is rigid board with a paper wrap. Matte or gloss lamination, foil, embossing, and spot UV are surface choices on that wrap. Inserts are common because the base can hold a cradle or dividers. Share the product weight and how it should sit.',
    useCases: ['Skincare and fragrance sets', 'Gifts people keep', 'Client kits', 'Products that need a firm lid'],
    faqs: [
      {
        q: 'Does a rigid box ship flat?',
        a: 'No. The base, lid, or drawer is set up. That changes how the packaging is stored before the product goes inside, and it is one reason to compare it with a folding carton.',
      },
      {
        q: 'What is the difference between a magnetic lid and a lift-off lid?',
        a: 'A magnetic closure stays hinged to the base and closes against a magnet. A two-piece lid lifts off completely. Both are rigid boxes. The difference is how the cover is attached.',
      },
      {
        q: 'Can I match a rigid box to a folding carton?',
        a: 'The wrap color and finishes can be related, but the board and the way the box is made are different. Notes in the quote are the right place to describe a pair of packs.',
      },
    ],
  },
  {
    slug: 'corrugated-boxes',
    name: 'Shipping Boxes for Delivery',
    menuLine: 'The carton that carries the order',
    short: 'Corrugated cartons for the trip from you to the customer.',
    image: '/images/category-corrugated-boxes.jpg',
    alt: 'Brown corrugated box with the top flaps partly open.',
    intro:
      'Corrugated boxes use board with a visible flute between two liners. The flute is what adds thickness. A regular shipping carton and a mailer can both use this board, but the flap pattern is not the same. Choose corrugated when the box itself is part of sending or protecting the product.',
    guidance:
      'Decorative films and foil are not typical on a plain shipping carton. A mailer made from corrugated can carry print more readily. Say whether the box is an outer shipper or the box the customer opens. Internal size should include any inner pack.',
    useCases: ['Outer boxes for online orders', 'Heavier products in transit', 'Orders that need a stronger wall', 'Mailers that take a knock'],
    faqs: [
      {
        q: 'Is every corrugated box a mailer?',
        a: 'No. A shipping carton usually has a regular slotted flap pattern. A mailer is a shallower structure with a folding lid made for a parcel. They can share corrugated board without being the same box.',
      },
      {
        q: 'What does full overlap mean?',
        a: 'On a full-overlap carton the outer flaps each cover the whole opening, so they lie on top of one another. On a regular shipping carton the outer flaps meet in the middle.',
      },
      {
        q: 'Can corrugated be used for food?',
        a: 'Only if the specific board and the food use are confirmed. A kraft shipping box on this site is not offered as a food-contact pack.',
      },
    ],
  },
  {
    slug: 'mailer-boxes',
    name: 'Mailers Customers Open',
    menuLine: 'The parcel with your name on the lid',
    short: 'The box that arrives at the door, with a lid instead of loose flaps.',
    image: '/images/category-mailer-boxes.jpg',
    alt: 'White die-cut mailer box with the lid flap open.',
    intro:
      'Mailer boxes are made to send a product in a box the recipient opens with a lid flap. A die-cut mailer and a roll-end tuck mailer close in different ways. Many are corrugated, so they overlap with transit packaging, but the proportions and the closure are planned as a parcel.',
    guidance:
      'Corrugated board is the usual material. Matte or gloss print can be discussed for mailers. Measure the product with any tissue or inner carton included, then add a little clearance so the lid can close.',
    useCases: ['Online orders', 'Subscription parcels', 'Shallow product kits', 'Printed boxes that arrive at the door'],
    faqs: [
      {
        q: 'How is a die-cut mailer different from a roll-end mailer?',
        a: 'A die-cut mailer closes with a lid that folds over the front, often with locking tabs at the sides. A roll-end tuck mailer rolls the short ends inward and locks with a tuck. Both are mailers. The opening action is different.',
      },
      {
        q: 'Should I choose a mailer or a shipping carton?',
        a: 'A mailer is usually the box someone opens. A shipping carton is often an outer box with flaps that meet or overlap. If one box has to do both jobs, say so in the quote notes.',
      },
      {
        q: 'Can I add an insert?',
        a: 'A paperboard cradle or a simple divider can be discussed. It has to fit the internal size and still let the lid close.',
      },
    ],
  },
  {
    slug: 'kraft-boxes',
    name: 'Kraft Boxes with a Natural Face',
    menuLine: 'When the paper itself is the look',
    short: 'Unbleached board for brands that want the paper color to show.',
    image: '/images/category-kraft-boxes.jpg',
    alt: 'Natural kraft paperboard carton with a tuck closure.',
    intro:
      'Kraft is the color and fiber of unbleached board. It is not a structural style by itself. The kraft product box here is a tuck-end carton in that board. Other structures can use a kraft face when the material suits them, and those boxes stay listed under their own structure.',
    guidance:
      'Expect the natural variation of unbleached paper. Foil and embossing can sit on kraft, while a heavy gloss film changes the natural look. If the product is food, the board and the kind of contact still need to be confirmed.',
    useCases: ['Natural retail packs', 'Dry goods with a kraft face', 'Simple gifts', 'Brands that want the board color to show'],
    faqs: [
      {
        q: 'Is kraft a type of box?',
        a: 'No. Kraft describes the board. A tuck end, a mailer, or a sleeve can all be made with a kraft face. The closure is specified separately.',
      },
      {
        q: 'Will the color match a printed brown?',
        a: 'Unbleached board has its own tone and can vary. If you need a controlled printed color, paperboard with print may be a better note to add than relying on the natural sheet.',
      },
      {
        q: 'Can I use kraft board for direct food contact?',
        a: 'Not by assumption. Food use depends on the product and whether the box is meant to touch it. That is confirmed when the specifications are reviewed.',
      },
    ],
  },
  {
    slug: 'gift-boxes',
    name: 'Gift Boxes Made to Give',
    menuLine: 'A box that feels like part of the present',
    short: 'Window boxes and covers for a product someone will hand to another person.',
    image: '/images/category-gift-boxes.jpg',
    alt: 'Ivory gift box with a clear rectangular window on the front.',
    intro:
      'Gift boxes are grouped by the occasion, not by one factory style. A window carton shows the contents through an opening. A foldable gift box collapses for storage and opens with a hinged cover. A rigid magnetic box can be a gift box too, and it remains a rigid box in structure.',
    guidance:
      'Start with how the box will be opened and whether the product should be seen. Then choose paperboard or rigid board. Tissue and cradles are insert preferences, not a separate product. Ribbon can be noted, but it is not part of the box structure.',
    useCases: ['Gifts with the product in view', 'Limited sets', 'Retail gifts', 'Corporate gifts'],
    faqs: [
      {
        q: 'What is the window made from?',
        a: 'A window is an opening in the board, often covered with a clear film. The exact film is confirmed with the quote. The opening reduces the printable area on that panel.',
      },
      {
        q: 'Does a foldable gift box stay rigid?',
        a: 'It is creased so the walls can fold. It is not the same as a wrapped rigid box that stays set up. If you want a firmer lid, look at the magnetic closure rigid box as well.',
      },
      {
        q: 'Can a gift box also be a mailer?',
        a: 'Sometimes one box is asked to do both. That affects board and closure. Describe the journey, from packing to the person opening it, in the quote notes.',
      },
    ],
  },
];

export const homeFaqs = [
  {
    q: 'How should I measure the box?',
    a: 'Use internal length, width, and height: the space inside, in that order. Length is the front panel, width is the depth, and height is vertical. If you only know the product size, send that and mark that the box size is not final. Clearance is confirmed with the quote.',
  },
  {
    q: 'Which material should I choose?',
    a: 'Paperboard suits folding cartons. Rigid board with a paper wrap suits set-up boxes. Corrugated board suits mailers and shipping cartons. Kraft is a natural board appearance and can be applied to a suitable structure. If you are unsure, choose “I need advice” in the notes or leave a material question in the request.',
  },
  {
    q: 'What should I prepare for artwork?',
    a: 'A PDF is a useful reference, and JPG, PNG, or WEBP images can show the intended look. An uploaded image is a reference. It does not confirm print placement, dielines, or color. Final artwork is reviewed with the quote.',
  },
  {
    q: 'Can I add an insert?',
    a: 'You can ask for no insert, a paperboard cradle, dividers, or tissue bedding. The right fit depends on the product and the internal size. Insert details are confirmed during quotation.',
  },
  {
    q: 'Can I see a sample first?',
    a: 'A sample can be requested in the notes. Whether one is available depends on the structure and is confirmed when the request is reviewed. The site does not promise a sample or a timescale.',
  },
  {
    q: 'How does a quote work here?',
    a: 'You choose a box or describe your own, add specifications, and review the request. This website prepares a summary on your device and does not send it. Download the summary and share it, with any reference files attached separately. Pricing and production details are confirmed after the request is reviewed.',
  },
];

export const applications = [
  {
    id: 'cosmetics',
    title: 'Packaging for Skincare & Cosmetics',
    text: 'Folding cartons and rigid boxes are common for jars, bottles, and compacts. A cradle can hold the container. Tell us the component size and whether the pack is a single unit or a set.',
  },
  {
    id: 'retail',
    title: 'Boxes for Products on a Shelf',
    text: 'A tuck carton, sleeve, or window box can sit on a shelf. Print area, closure, and how the pack is filled matter more than a decorative finish. Mention if it needs to hang or stack.',
  },
  {
    id: 'gifts',
    title: 'Gift Boxes People Want to Open',
    text: 'Gift boxes include window cartons, foldable covers, and rigid lids. The structure changes the unboxing. Tissue or a cradle can be requested as an insert preference.',
  },
  {
    id: 'food',
    title: 'Cartons for Food Brands',
    text: 'Cartons are sometimes used around food, especially when an inner bag or tray is the contact layer. Requirements depend on the product and whether the box is intended to touch it. Nothing on this site is a food-contact certification.',
  },
  {
    id: 'ecommerce',
    title: 'Mailer Boxes for Orders You Ship',
    text: 'Mailers and shipping cartons are built for parcels. A mailer is usually opened by the customer. A shipping carton is often the outer box. Internal size should include any inner packaging.',
  },
  {
    id: 'corporate',
    title: 'Boxes for Client Gifts & Kits',
    text: 'Magnetic lids, drawers, and lid-and-base boxes give a firmer presentation for kits and documents. Share the contents and whether the box will be reused or kept.',
  },
];

export const processSteps = [
  {
    n: '01',
    title: 'Tell us what goes inside',
    text: 'Start from a structure, or describe a box you already have in mind.',
  },
  {
    n: '02',
    title: 'Share the size and how many',
    text: 'Internal size, quantity, material, and any reference files give the request a practical starting point.',
  },
  {
    n: '03',
    title: 'Confirm the box before it is made',
    text: 'Structure, board, and finishes are checked against what you asked for. Details are confirmed at this stage.',
  },
  {
    n: '04',
    title: 'Approve the look',
    text: 'Nothing moves forward on artwork until the reviewed version is approved. A sample, if one is part of the agreement, is separate from the product photos on this site.',
  },
  {
    n: '05',
    title: 'The agreed box is produced',
    text: 'The agreed specification is what production follows. This page does not state a manufacturing method or a completion date.',
  },
  {
    n: '06',
    title: 'The finished boxes are sent',
    text: 'Finished boxes are sent according to the details agreed in the quote.',
  },
];

export function getCategory(slug) {
  return categories.find((category) => category.slug === slug);
}

export function getMaterial(id) {
  return materials.find((item) => item.id === id);
}

export function getFinish(id) {
  return finishes.find((item) => item.id === id);
}

export function getInsert(id) {
  return inserts.find((item) => item.id === id);
}

export function getColor(id) {
  return exteriorColors.find((item) => item.id === id);
}
