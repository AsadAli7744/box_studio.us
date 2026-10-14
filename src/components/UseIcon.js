const paths = {
  drop: 'M12 3.5c2.8 3.4 5 6.2 5 9.1a5 5 0 1 1-10 0c0-2.9 2.2-5.7 5-9.1z',
  shelf: 'M4 8h16M4 16h16M7 8v8M17 8v8M6 4h12v16H6z',
  gift: 'M5 11h14v9H5zM4 8h16v3H4zM12 8v12M12 8c-1.5 0-3-1.2-3-2.4S10.2 4 12 6.2C13.8 4 15.4 4.2 15.4 5.6S13.5 8 12 8z',
  leaf: 'M5 19C5 11 11 5 19 5c0 8-6 14-14 14zM8 16c2-2 5-4 8-5',
  parcel: 'M3 8l9-4 9 4-9 4-9-4zM3 8v8l9 4 9-4V8M12 12v8',
  kit: 'M4 9h16v10H4zM9 9V7a3 3 0 0 1 6 0v2M4 14h16',
};

export default function UseIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
      <path d={paths[name] || paths.parcel} />
    </svg>
  );
}
