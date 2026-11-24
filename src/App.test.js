import { site } from './data/site';

test('uses the Box Studio domain', () => {
  expect(site.url).toBe('https://www.boxstudio.us');
  expect(site.email).toBe('info@boxstudio.us');
});
