import { getCategory } from './catalog';
import { productCopy } from './productCopy';

const paperFinishes = ['matte', 'gloss', 'foil', 'emboss', 'spot-uv'];
const rigidFinishes = ['matte', 'gloss', 'foil', 'emboss', 'spot-uv'];
const mailerFinishes = ['matte', 'gloss'];
const kraftFinishes = ['matte', 'foil', 'emboss'];
const shippingFinishes = [];

const foldingInserts = ['none', 'cradle', 'dividers', 'tissue', 'advice'];
const rigidInserts = ['none', 'cradle', 'dividers', 'tissue', 'advice'];
const transitInserts = ['none', 'dividers', 'advice'];

export const products = [
  {
    slug: 'straight-tuck-end-box',
    name: 'Straight Tuck End Box',
    category: 'folding-cartons',
    tags: ['retail', 'cosmetics', 'food'],
    model: 'tuck-straight',
    short: 'A paperboard carton whose top and bottom tucks close from the same face.',
    description:
      'The straight tuck end is a folding carton with the tuck flaps on one panel, top and bottom. It is filled by hand, then the tuck is pushed into the body. The front panel stays clear for print because the tucks sit on the opposite face or the same narrow face, depending on how the dieline is drawn. It is a practical structure for a single product that does not need an automatic base.',
    images: [
      {
        src: '/images/product-straight-tuck-end.jpg',
        alt: 'Closed ivory straight tuck end carton, with the tuck flaps on the front face.',
      },
    ],
    applications: ['A skincare jar that needs a printed carton', 'A shelf product with a clear front panel', 'Dry goods packed over an inner bag'],
    materialIds: ['paperboard', 'kraft-board'],
    structuralOptions: [
      'Top and bottom tucks from the same panel',
      'Optional hang tab on the top tuck',
      'Optional window on the front panel',
    ],
    finishIds: paperFinishes,
    insertIds: foldingInserts,
    defaults: { length: 80, width: 40, height: 150, unit: 'mm', color: 'ivory' },
    structure:
      'One sheet of paperboard forms the body, the glue seam, the dust flaps, and both tucks. The tucks enter from the same side. The carton folds flat before it is set up.',
    measurement:
      'Measure the product, then add clearance. Internal length is the front panel, width is the side panel, and height runs from the inside bottom to the opening. Do not include the tuck length in the height.',
    faqs: [
      {
        q: 'Why choose a straight tuck instead of a reverse tuck?',
        a: 'Both are tuck cartons. On a straight tuck, the top and bottom close from the same face, which some packing lines find easier to learn. A reverse tuck alternates the faces. The printed panel can be planned around either one.',
      },
      {
        q: 'Does the tuck lock by itself?',
        a: 'Friction holds a standard tuck. If the product is heavy or the carton is large, say so. A lock or a different base may be more suitable, and that is confirmed with the quote.',
      },
    ],
  },
  {
    slug: 'reverse-tuck-end-box',
    name: 'Reverse Tuck End Box',
    category: 'folding-cartons',
    tags: ['retail', 'cosmetics'],
    model: 'tuck-reverse',
    short: 'A folding carton with the top and bottom tucks on opposite faces.',
    description:
      'A reverse tuck end carton uses the same paperboard family as a straight tuck, but the top tuck and the bottom tuck come from opposite panels. That alternation can keep the dust flaps and the glue seam in a useful place for certain fills. It still folds flat and is still closed by hand.',
    images: [
      {
        src: '/images/product-reverse-tuck-end.jpg',
        alt: 'Warm gray reverse tuck carton standing upright, showing tucks on opposite faces.',
      },
    ],
    applications: ['A cosmetic bottle opened from the top', 'A small retail product on a shelf', 'A carton staff can close by hand'],
    materialIds: ['paperboard', 'kraft-board'],
    structuralOptions: [
      'Top and bottom tucks from opposite panels',
      'Optional hang tab',
      'Optional front window',
    ],
    finishIds: paperFinishes,
    insertIds: foldingInserts,
    defaults: { length: 90, width: 45, height: 160, unit: 'mm', color: 'white' },
    structure:
      'The body is a tube of paperboard. Dust flaps fold in from the sides and the tuck flap closes over them. Because the tucks are reversed, the top opening and the bottom closure are mirrored.',
    measurement:
      'Use internal length, width, and height. The tuck flap length is extra board beyond the height and should not be counted as internal height.',
    faqs: [
      {
        q: 'Will a reverse tuck use more board than a straight tuck?',
        a: 'The panel layout is similar. Any difference in sheet size comes from the dieline, not from a different kind of material. The quote is the place to compare them for a given size.',
      },
      {
        q: 'Can the front stay free of tuck flaps?',
        a: 'The tucks occupy two opposite faces. The remaining faces can be planned as the main print panels. Share which face the customer should see.',
      },
    ],
  },
  {
    slug: 'auto-lock-bottom-box',
    name: 'Auto-Lock Bottom Box',
    category: 'folding-cartons',
    tags: ['retail', 'cosmetics'],
    model: 'auto-lock',
    short: 'A folding carton with a pre-glued bottom that locks as the box is opened.',
    description:
      'An auto-lock bottom, sometimes called a crash lock, is a folding carton whose base is glued in advance. When the carton is squared, the bottom flaps hook together and hold. The top is commonly a tuck. It is useful when a pack is filled often and the base should not be folded by hand each time.',
    images: [
      {
        src: '/images/product-auto-lock-bottom.jpg',
        alt: 'White auto-lock bottom carton with the interlocking base partly visible.',
      },
    ],
    applications: ['Bottles and jars that need a locked base', 'Heavier retail products', 'Cartons packed the same way every time'],
    materialIds: ['paperboard'],
    structuralOptions: [
      'Pre-glued automatic bottom',
      'Tuck top',
      'Optional window above the product line',
    ],
    finishIds: paperFinishes,
    insertIds: foldingInserts,
    defaults: { length: 100, width: 50, height: 180, unit: 'mm', color: 'white' },
    structure:
      'The bottom flaps are part of the same sheet and are glued so they lock when the tube is opened. The top remains a separate closure, usually a tuck and dust flaps. The carton still ships flat.',
    measurement:
      'Internal height is the clear opening above the locked base, not the depth of the bottom flaps. Check that the product and any insert can pass through the top.',
    faqs: [
      {
        q: 'Is the bottom glued?',
        a: 'Yes. The lock is formed with glue during converting, then it snaps into place when the carton is squared. It is not a tuck you fold on every unit.',
      },
      {
        q: 'Can the top also lock automatically?',
        a: 'This style is specified with a tuck top. If you need a different top closure, describe it in the notes so it can be reviewed as its own structure.',
      },
    ],
  },
  {
    slug: 'sleeve-and-tray-box',
    name: 'Sleeve and Tray Box',
    category: 'folding-cartons',
    tags: ['gift-boxes', 'retail'],
    model: 'sleeve-tray',
    short: 'A sliding tray inside a paperboard sleeve, made as two pieces.',
    description:
      'The sleeve and tray is two parts. The tray holds the product. The sleeve slides over it and becomes the printed cover. It is still a folding-board construction, not a wrapped rigid box, though the unboxing feels different from a tuck carton because the tray pulls out.',
    images: [
      {
        src: '/images/product-sleeve-and-tray.jpg',
        alt: 'Ivory tray pulled halfway from a charcoal paperboard sleeve.',
      },
    ],
    applications: ['A gift set that should slide out', 'A retail sleeve on a shelf', 'A product people pull from a tray'],
    materialIds: ['paperboard', 'kraft-board'],
    structuralOptions: [
      'Outer sleeve open at the ends',
      'Inner tray with a low wall',
      'Optional stop so the tray does not slide through',
    ],
    finishIds: paperFinishes,
    insertIds: ['none', 'cradle', 'tissue', 'advice'],
    defaults: { length: 160, width: 120, height: 40, unit: 'mm', color: 'charcoal' },
    structure:
      'The sleeve is a tube. The tray is a shallow carton that moves along the length. Neither piece is a hinged lid. Clearance between the tray and the sleeve has to be enough to slide, and tight enough that the tray does not fall out.',
    measurement:
      'Size the tray from the product first. The sleeve’s internal size has to clear the tray’s outside. In the quote, state whether your numbers describe the tray cavity or the outside of the sleeve. Treat the numbers as the internal tray unless you say otherwise.',
    faqs: [
      {
        q: 'Is this the same as a rigid drawer?',
        a: 'No. A sleeve and tray is folded paperboard. A rigid drawer is wrapped thick board and does not fold flat. They open in a similar direction but they are made differently.',
      },
      {
        q: 'Which piece is printed?',
        a: 'The sleeve is usually the main printed surface. The tray can stay plain or carry a simple finish. Say if both pieces need print.',
      },
    ],
  },
  {
    slug: 'magnetic-closure-rigid-box',
    name: 'Magnetic Closure Rigid Box',
    category: 'rigid-boxes',
    tags: ['gift-boxes', 'presentation', 'cosmetics'],
    model: 'magnetic',
    short: 'A wrapped rigid box with a hinged lid that closes on a magnet.',
    description:
      'This rigid box has a base and a lid joined at the back. A magnet in the front lip holds the lid shut. The board is wrapped, so the box stays set up. It is chosen when the opening itself is part of the presentation, for a single product or a small set.',
    images: [
      {
        src: '/images/product-magnetic-closure.jpg',
        alt: 'Charcoal rigid box with the magnetic lid partly open and a gold edge.',
      },
      {
        src: '/images/detail-magnetic-interior.jpg',
        alt: 'Interior of an open magnetic rigid box with a cream lining and a small magnet in the front lip.',
      },
    ],
    applications: ['A skincare set meant to be kept', 'A gift with a lid that stays on', 'A client kit with your name on the cover', 'A product that needs a reusable lid'],
    materialIds: ['rigid-wrap'],
    structuralOptions: [
      'Hinged lid',
      'Concealed magnet in the front lip',
      'Wrapped base and lid',
    ],
    finishIds: rigidFinishes,
    insertIds: rigidInserts,
    defaults: { length: 180, width: 130, height: 70, unit: 'mm', color: 'charcoal' },
    structure:
      'The base is a five-sided tray. The lid is hinged along the back edge and carries a front lip, and often side lips, so it sits over the base. The magnet is a closure detail, not a substitute for the board.',
    measurement:
      'Give the internal size of the base. The lid adds height outside the cavity. If an insert is needed, the cradle has to sit inside that cavity and still let the lid close.',
    faqs: [
      {
        q: 'Is the lid removable?',
        a: 'No. It stays attached at the hinge. For a cover that lifts off, use the two-piece lid and base.',
      },
      {
        q: 'Can the inside be a different color from the wrap?',
        a: 'The wrap and the lining can be specified separately in the notes. A product photo shows one exterior and is not the lining.',
      },
    ],
  },
  {
    slug: 'two-piece-lid-and-base-box',
    name: 'Two-Piece Lid and Base Box',
    category: 'rigid-boxes',
    tags: ['gift-boxes', 'presentation'],
    model: 'lid-base',
    short: 'A rigid base with a separate lid that lifts off.',
    description:
      'The lid and base are two wrapped pieces. The lid is a shallow cover that sits over the base and comes away completely. There is no hinge and no magnet unless one is requested as a change to the structure. It is a direct rigid box for products that are lifted out from above.',
    images: [
      {
        src: '/images/product-lid-and-base.jpg',
        alt: 'Ivory two-piece rigid box with the lid lifted off the base.',
      },
    ],
    applications: ['A gift packed from above', 'A presentation set with a lift-off lid', 'A product that should sit in a base'],
    materialIds: ['rigid-wrap'],
    structuralOptions: [
      'Separate lid',
      'Base tray',
      'Lid depth specified to suit the product',
    ],
    finishIds: rigidFinishes,
    insertIds: rigidInserts,
    defaults: { length: 200, width: 150, height: 80, unit: 'mm', color: 'ivory' },
    structure:
      'Each piece is wrapped board. The lid’s inside length and width are larger than the base’s outside by a small clearance so it can lift on and off. That fit is part of the specification.',
    measurement:
      'Quote the internal size of the base. Note how deep the lid should be. A deep lid changes the proportion and the way the box looks when closed.',
    faqs: [
      {
        q: 'Will the lid fit tightly?',
        a: 'It needs a small clearance to come off. How tight that feels is agreed with the specification. Photos show the lid lifted and do not show the friction fit.',
      },
      {
        q: 'Can this box fold for storage?',
        a: 'No. Both pieces stay set up. A foldable gift box is a different structure.',
      },
    ],
  },
  {
    slug: 'rigid-drawer-box',
    name: 'Rigid Drawer Box',
    category: 'rigid-boxes',
    tags: ['gift-boxes', 'presentation'],
    model: 'drawer',
    short: 'A wrapped outer sleeve with a rigid drawer that slides out.',
    description:
      'A rigid drawer box has an outer shell and an inner drawer. The drawer pulls out from the front. Both parts are wrapped board, so the piece stays assembled. It suits flat or layered contents that should be revealed by sliding rather than by lifting a lid.',
    images: [
      {
        src: '/images/product-rigid-drawer.jpg',
        alt: 'Charcoal sleeve with a cream rigid drawer pulled partway out.',
      },
      {
        src: '/images/detail-drawer-open.jpg',
        alt: 'Close view of an open rigid drawer and the thickness of the sleeve.',
      },
    ],
    applications: ['A gift revealed by pulling a drawer', 'A stationery or welcome kit', 'A set packed in layers'],
    materialIds: ['rigid-wrap'],
    structuralOptions: [
      'Closed outer sleeve',
      'Sliding inner drawer',
      'Optional ribbon pull, noted separately from the board',
    ],
    finishIds: rigidFinishes,
    insertIds: rigidInserts,
    defaults: { length: 170, width: 120, height: 55, unit: 'mm', color: 'charcoal' },
    structure:
      'The sleeve is open at the front. The drawer is a tray that travels inside it. The drawer front can sit flush with the sleeve. A pull, if you want one, should be described in the notes.',
    measurement:
      'The internal drawer cavity is the useful size. The sleeve is larger. State the drawer’s internal length, width, and height. Those numbers are the cavity unless you say otherwise.',
    faqs: [
      {
        q: 'How is this different from a sleeve and tray?',
        a: 'The motion is similar, but the materials are not. This drawer is rigid wrapped board. The sleeve and tray is folded paperboard.',
      },
      {
        q: 'Can the drawer open from a short side?',
        a: 'The standard here opens on the width. If you need the opening on another face, describe it so the structure can be reviewed.',
      },
    ],
  },
  {
    slug: 'shipping-box',
    name: 'Shipping Box',
    category: 'corrugated-boxes',
    tags: ['e-commerce'],
    model: 'shipping-rsc',
    short: 'A regular slotted corrugated carton whose outer flaps meet at the center.',
    description:
      'This shipping box is a regular slotted carton in corrugated board. The bottom flaps fold in and the top flaps meet in the middle when closed. It is an outer pack for transit rather than a presentation lid. Tape or another closure is assumed as part of shipping, not drawn as a branded feature.',
    images: [
      {
        src: '/images/product-shipping-box.jpg',
        alt: 'Brown corrugated shipping box with the four top flaps open.',
      },
    ],
    applications: ['An outer box for an online order', 'A product that needs protection in transit', 'Filled goods stored before they ship'],
    materialIds: ['corrugated'],
    structuralOptions: [
      'Regular slotted top and bottom',
      'Outer flaps that meet',
      'Fluted board edge',
    ],
    finishIds: shippingFinishes,
    insertIds: transitInserts,
    defaults: { length: 300, width: 220, height: 180, unit: 'mm', color: 'kraft' },
    structure:
      'Four walls and eight flaps come from one corrugated blank. Minor flaps fold from the ends and major flaps fold from the sides to meet. The flute is visible on the cut edge.',
    measurement:
      'Internal length, width, and height should fit the goods plus any inner box. Flap size is derived from the width and is not part of the height you enter.',
    faqs: [
      {
        q: 'Can this carton be foil stamped?',
        a: 'Foil, embossing, and spot UV are not offered on this plain shipping structure. If the outer box needs a printed face, say so in the notes and it can be reviewed separately from a mailer.',
      },
      {
        q: 'Do the flaps need tape?',
        a: 'A regular slotted carton is normally closed with tape or a similar method. That is a packing choice, not part of the box structure itself.',
      },
    ],
  },
  {
    slug: 'full-overlap-shipping-box',
    name: 'Full Overlap Shipping Box',
    category: 'corrugated-boxes',
    tags: ['e-commerce'],
    model: 'shipping-fol',
    short: 'A corrugated carton whose outer flaps each cover the full opening.',
    description:
      'A full-overlap shipping box uses the same corrugated family as a regular shipping carton, but each outer flap is long enough to cover the whole top. The two outer flaps lie over one another instead of meeting at a center seam. That extra layer is the reason to choose it over a standard slotted carton.',
    images: [
      {
        src: '/images/product-full-overlap.jpg',
        alt: 'Closed brown corrugated carton with outer flaps overlapping across the top.',
      },
    ],
    applications: ['A heavier shipment', 'A carton that needs a double top', 'An outer box for delivery'],
    materialIds: ['corrugated'],
    structuralOptions: [
      'Full-overlap outer flaps',
      'Inner flaps from the ends',
      'Corrugated board',
    ],
    finishIds: shippingFinishes,
    insertIds: transitInserts,
    defaults: { length: 350, width: 250, height: 200, unit: 'mm', color: 'kraft' },
    structure:
      'The blank is a slotted carton with deeper outer flaps. When closed, one outer flap covers the opening and the second covers the first. The ends still fold in underneath.',
    measurement:
      'Enter the internal cavity. The overlap uses more board across the width, but it does not increase the internal height.',
    faqs: [
      {
        q: 'When is full overlap worth requesting?',
        a: 'When you want the top to be two layers of board rather than two flaps meeting. If you only need a standard outer carton, the shipping box is the simpler structure.',
      },
      {
        q: 'Is the overlap the same as a mailer lid?',
        a: 'No. These are still loose flaps. A mailer has a lid panel that folds over the front as one piece.',
      },
    ],
  },
  {
    slug: 'die-cut-mailer-box',
    name: 'Die-Cut Mailer Box',
    category: 'mailer-boxes',
    tags: ['corrugated-boxes', 'e-commerce'],
    model: 'mailer',
    short: 'A shallow parcel box with a lid flap and side locking tabs.',
    description:
      'The die-cut mailer is a one-piece box with a lid that folds over the top and down the front. Side tabs tuck in as the lid closes. It is often corrugated, so it shares a material with shipping boxes, but the lid is the difference: one flap covers the opening instead of four meeting flaps.',
    images: [
      {
        src: '/images/product-die-cut-mailer.jpg',
        alt: 'White die-cut mailer box closed, with the front tuck and side scores visible.',
      },
      {
        src: '/images/detail-mailer-open.jpg',
        alt: 'Open white mailer showing the lid folded back and the side tabs.',
      },
    ],
    applications: ['An online order the customer opens', 'A subscription parcel', 'A shallow kit sent in one box'],
    materialIds: ['corrugated'],
    structuralOptions: [
      'Hinged lid flap',
      'Front tuck',
      'Side locking tabs',
    ],
    finishIds: mailerFinishes,
    insertIds: ['none', 'cradle', 'dividers', 'tissue', 'advice'],
    defaults: { length: 250, width: 180, height: 80, unit: 'mm', color: 'white' },
    structure:
      'The blank includes the base, the walls, the lid, and the front tuck. Tabs on the sides hold the lid. It is die-cut rather than a regular slotted carton.',
    measurement:
      'Internal height must include the product and any tissue. The lid has to close over that height. Measure length and width inside the base.',
    faqs: [
      {
        q: 'Can a mailer be the only box in the shipment?',
        a: 'Often, yes. If the product still needs an outer carton, order that as a shipping box and say they travel together.',
      },
      {
        q: 'Why are foil and spot UV not listed?',
        a: 'This mailer is specified in corrugated board with matte or gloss as the print-surface options. Foil and spot UV can be raised in the notes if you need them reviewed, but they are not shown as standard for this structure.',
      },
    ],
  },
  {
    slug: 'roll-end-tuck-mailer',
    name: 'Roll End Tuck Mailer',
    category: 'mailer-boxes',
    tags: ['corrugated-boxes', 'e-commerce'],
    model: 'roll-end',
    short: 'A mailer whose short ends roll inward and whose front panel tucks to lock.',
    description:
      'A roll-end tuck mailer closes from the ends. The short side panels roll over the top, and a tuck on the front locks into the body. It is a different opening from the die-cut mailer, which uses one lid flap. The board is typically corrugated, in a shallower proportion than a shipping carton.',
    images: [
      {
        src: '/images/product-roll-end-mailer.jpg',
        alt: 'Warm white roll-end mailer with the end rolls and front tuck closed.',
      },
    ],
    applications: ['A flat product sent by post', 'Books and shallow sets', 'A parcel that locks with a tuck'],
    materialIds: ['corrugated'],
    structuralOptions: [
      'Rolling end panels',
      'Front tuck lock',
      'One-piece blank',
    ],
    finishIds: mailerFinishes,
    insertIds: ['none', 'dividers', 'tissue', 'advice'],
    defaults: { length: 220, width: 160, height: 60, unit: 'mm', color: 'ivory' },
    structure:
      'The ends fold in a roll rather than standing as simple side walls with a separate lid. The tuck is the lock. Dust and roll scores are part of the blank.',
    measurement:
      'Keep the height modest relative to the length and width. Internal height is the closed cavity, not the length of the roll.',
    faqs: [
      {
        q: 'How do I decide between this and a die-cut mailer?',
        a: 'Use this when you want the ends to roll shut and a tuck to lock. Use the die-cut mailer when you want a single lid to fold over the front.',
      },
      {
        q: 'Is the tuck the same as a carton tuck?',
        a: 'It is a tuck lock, but the body is a mailer with rolling ends, not a tall folding carton. The two structures are not interchangeable.',
      },
    ],
  },
  {
    slug: 'kraft-product-box',
    name: 'Kraft Product Box',
    category: 'kraft-boxes',
    tags: ['folding-cartons', 'retail', 'food'],
    model: 'tuck-straight',
    short: 'A tuck-end product carton in unbleached kraft board.',
    description:
      'This is a straight tuck carton specified in kraft board. The structure is the tuck, not the brown color. The natural face is the point of the material: fiber shows, and the color is the paper rather than a printed brown. It can be left plain or carry foil and embossing where those finishes suit kraft.',
    images: [
      {
        src: '/images/product-kraft-product.jpg',
        alt: 'Unbleached kraft tuck carton with visible paper fiber.',
      },
    ],
    applications: ['A retail product that should look natural', 'Dry goods in a kraft carton', 'A simple branded box with the board color showing'],
    materialIds: ['kraft-board'],
    structuralOptions: [
      'Straight tuck top and bottom',
      'Kraft board face',
      'Optional hang tab',
    ],
    finishIds: kraftFinishes,
    insertIds: foldingInserts,
    defaults: { length: 90, width: 50, height: 140, unit: 'mm', color: 'kraft' },
    structure:
      'The dieline matches a straight tuck end. The sheet is kraft paperboard. A gloss film is not part of this specification because it covers the natural surface. Matte, foil, and embossing can be discussed.',
    measurement:
      'Measure internal length, width, and height the same way as any tuck carton. Kraft thickness is still paperboard, not corrugated flute.',
    faqs: [
      {
        q: 'Can I get this closure in white board instead?',
        a: 'Yes. That is the straight tuck end box in paperboard. Use this product when the kraft face is what you want.',
      },
      {
        q: 'Is kraft corrugated?',
        a: 'Not here. This box is paperboard with a kraft appearance. Corrugated shipping boxes are a separate structure, even when the liner looks brown.',
      },
    ],
  },
  {
    slug: 'window-gift-box',
    name: 'Window Gift Box',
    category: 'gift-boxes',
    tags: ['folding-cartons', 'gifts', 'retail'],
    model: 'window',
    short: 'A tuck gift carton with a clear window in the front panel.',
    description:
      'The window gift box is a folding carton with an opening in the front so the product can be seen. A clear film usually covers the opening. The closure is a tuck, so it remains a carton rather than a rigid lid. The window changes the print area and needs to line up with the product inside.',
    images: [
      {
        src: '/images/product-window-gift.jpg',
        alt: 'Ivory gift carton with a large rectangular window and a tuck top.',
      },
      {
        src: '/images/detail-window-patch.jpg',
        alt: 'Close view of a clear window film set into ivory paperboard.',
      },
    ],
    applications: ['A gift people should see before opening', 'A retail gift on a shelf', 'A seasonal product in a window box'],
    materialIds: ['paperboard', 'kraft-board'],
    structuralOptions: [
      'Front window opening',
      'Clear film over the opening',
      'Tuck closure',
    ],
    finishIds: paperFinishes,
    insertIds: foldingInserts,
    defaults: { length: 150, width: 70, height: 180, unit: 'mm', color: 'ivory' },
    structure:
      'The body is a tuck carton. The window is cut from the front panel and patched with film. The film, the window size, and the distance from the creases are specification details.',
    measurement:
      'Size the cavity for the product first. Then place the window so it frames the product rather than the empty space above it. Internal height does not include the tuck.',
    faqs: [
      {
        q: 'Will the window match the product photo?',
        a: 'The photo shows a rectangular opening as an example. It does not confirm the film, the exact cut, or how your product sits behind it. Describe the window with the quote.',
      },
      {
        q: 'Can artwork cover the window?',
        a: 'No. The window is an opening. Upload artwork with the quote and describe what should sit beside the window.',
      },
    ],
  },
  {
    slug: 'foldable-gift-box',
    name: 'Foldable Gift Box',
    category: 'gift-boxes',
    tags: ['gifts', 'presentation'],
    model: 'foldable',
    short: 'A collapsible gift box with a hinged cover and creased walls.',
    description:
      'A foldable gift box is creased so it can collapse flatter than a rigid box and still open with a hinged cover. The front flap closes over the body. It is a presentation box, not a shipping carton and not a wrapped rigid lid. The creases are part of the structure, so the walls are paperboard rather than thick wrapped board.',
    images: [
      {
        src: '/images/product-foldable-gift.jpg',
        alt: 'Blush foldable gift box partly opened, showing creases and a hinged cover.',
      },
    ],
    applications: ['A gift stored flat before it is packed', 'A shallow set with a hinged cover', 'A seasonal present'],
    materialIds: ['paperboard'],
    structuralOptions: [
      'Hinged cover',
      'Creased side walls that fold',
      'Front closure flap',
    ],
    finishIds: paperFinishes,
    insertIds: ['none', 'cradle', 'tissue', 'advice'],
    defaults: { length: 200, width: 160, height: 50, unit: 'mm', color: 'blush' },
    structure:
      'Scores let the side walls fold inward and the cover hinge at the back. A front flap closes the box. It is not held by a magnet unless you ask for that change in the notes.',
    measurement:
      'This style is usually shallow. Internal height should match the product plus any tissue. The cover is included in the blank and is not extra internal height.',
    faqs: [
      {
        q: 'Will it feel like a rigid magnetic box?',
        a: 'No. It folds, and the board is paperboard. If you want a magnet and a wrapped wall, choose the magnetic closure rigid box.',
      },
      {
        q: 'Can it be mailed on its own?',
        a: 'It is a gift box, not a mailer. If it needs to travel, an outer mailer or shipping box should be considered and noted.',
      },
    ],
  },
];

export const featuredSlugs = [
  'straight-tuck-end-box',
  'auto-lock-bottom-box',
  'magnetic-closure-rigid-box',
  'rigid-drawer-box',
  'die-cut-mailer-box',
  'window-gift-box',
];

export function getProduct(slug) {
  const product = products.find((item) => item.slug === slug);
  if (!product) return undefined;
  const extra = productCopy[slug];
  return extra ? { ...product, ...extra } : product;
}

export function categoryName(slug) {
  return getCategory(slug)?.name || slug;
}

export function productsForUse(tags) {
  const wanted = new Set(tags);
  return products
    .filter((product) => product.tags.some((tag) => wanted.has(tag)))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function productsForCategory(slug) {
  return products
    .filter((product) => product.category === slug || product.tags.includes(slug))
    .sort((a, b) => {
      if (a.category === slug && b.category !== slug) return -1;
      if (b.category === slug && a.category !== slug) return 1;
      return a.name.localeCompare(b.name);
    });
}

export function filterProducts({ category = 'all', query = '' } = {}) {
  const needle = query.trim().toLowerCase();
  return products.filter((product) => {
    const inCategory =
      category === 'all' || product.category === category || product.tags.includes(category);
    if (!inCategory) return false;
    if (!needle) return true;
    const haystack = [
      product.name,
      product.short,
      product.description,
      categoryName(product.category),
      ...product.applications,
      ...product.tags,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export function relatedProducts(product, limit = 3) {
  return products
    .filter((item) => item.slug !== product.slug)
    .map((item) => {
      let score = 0;
      if (item.category === product.category) score += 3;
      if (item.model === product.model) score += 1;
      item.tags.forEach((tag) => {
        if (tag === product.category || product.tags.includes(tag)) score += 1;
      });
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, limit)
    .map((entry) => entry.item);
}
