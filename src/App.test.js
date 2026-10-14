import { site } from './data/site';

test('uses the Box Studio domain', () => {
  expect(site.url).toBe('https://boxstudio.us');
  expect(site.email).toBe('');
});
