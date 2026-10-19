import { convertValue } from './units';
import { validateContact, validateSpecs } from './validation';
import { products, productsForUse } from '../data/products';
import { categories } from '../data/catalog';
import { uses } from '../data/uses';
import { offerings, shopCategories } from '../data/offerings';
import fs from 'fs';
import path from 'path';

test('converts millimetres to inches and back', () => {
  expect(convertValue(25.4, 'mm', 'in')).toBe(1);
  expect(convertValue(1, 'in', 'mm')).toBe(25.4);
  expect(convertValue(10, 'mm', 'cm')).toBe(1);
  expect(convertValue('', 'mm', 'cm')).toBe('');
});

test('requires contact name and email', () => {
  expect(validateContact({ name: 'A', email: 'not-an-email', phone: '' }).email).toBeTruthy();
  expect(validateContact({ name: 'Ada', email: 'ada@studio.test', phone: '' })).toEqual({});
});

test('allows unsure dimensions and asks for a quantity otherwise', () => {
  expect(validateSpecs({
    dimensionsUnsure: true,
    quantityGuidance: false,
    quantity: '',
    materialId: 'paperboard',
  }).quantity).toBeTruthy();
  expect(validateSpecs({
    dimensionsUnsure: false,
    length: 10,
    width: 8,
    height: 4,
    quantityGuidance: true,
    materialId: 'paperboard',
  })).toEqual({});
});

test('lists distinct box products in known categories', () => {
  const slugs = products.map((product) => product.slug);
  expect(new Set(slugs).size).toBe(slugs.length);
  expect(slugs).toEqual(expect.arrayContaining([
    'straight-tuck-end-box',
    'reverse-tuck-end-box',
    'auto-lock-bottom-box',
    'sleeve-and-tray-box',
    'magnetic-closure-rigid-box',
    'two-piece-lid-and-base-box',
    'rigid-drawer-box',
    'shipping-box',
    'die-cut-mailer-box',
    'kraft-product-box',
    'window-gift-box',
    'foldable-gift-box',
  ]));
  const categorySlugs = new Set(categories.map((category) => category.slug));
  products.forEach((product) => {
    expect(categorySlugs.has(product.category)).toBe(true);
    expect(product.images[0].alt.length).toBeGreaterThan(12);
  });
});

test('each public box has its own root url, photo, and copy', () => {
  const reserved = new Set(['about', 'contact', 'quote', 'custom-boxes', 'custom-box-for-your-brand']);
  const slugs = offerings.map((item) => item.slug);
  const images = offerings.flatMap((item) => item.images.map((image) => image.src));
  expect(new Set(slugs).size).toBe(slugs.length);
  expect(new Set(images).size).toBe(images.length);
  const categoryImages = shopCategories.map((category) => category.image);
  expect(new Set(categoryImages).size).toBe(categoryImages.length);
  categoryImages.forEach((src) => {
    expect(images).not.toContain(src);
    expect(fs.existsSync(path.join(process.cwd(), 'public', src))).toBe(true);
  });
  shopCategories.forEach((category) => {
    expect(category.slug.includes('/')).toBe(false);
    expect(reserved.has(category.slug)).toBe(false);
    expect(offerings.some((item) => item.category === category.slug)).toBe(true);
  });
  offerings.forEach((item) => {
    expect(item.slug.includes('/')).toBe(false);
    expect(reserved.has(item.slug)).toBe(false);
    expect(item.meta.length).toBeGreaterThan(40);
    expect(item.images.length).toBe(4);
    item.images.forEach((image) => {
      expect(image.alt.length).toBeGreaterThan(12);
      expect(fs.existsSync(path.join(process.cwd(), 'public', image.src))).toBe(true);
    });
    expect(item.sections).toHaveLength(3);
    expect(item.related.length).toBeGreaterThan(0);
    item.related.forEach((link) => {
      expect(slugs).toContain(link.slug);
      expect(link.note.length).toBeGreaterThan(8);
    });
    const file = path.join(process.cwd(), 'public', item.images[0].src);
    expect(fs.existsSync(file)).toBe(true);
  });
});

test('every packaging use lists at least one real box', () => {
  uses.forEach((item) => {
    expect(item.description.length).toBeGreaterThan(40);
    expect(item.description.length).toBeLessThan(170);
    expect(productsForUse(item.tags).length).toBeGreaterThan(0);
  });
});
