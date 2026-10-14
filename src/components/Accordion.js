import { useState } from 'react';

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function Accordion({ items }) {
  const [open, setOpen] = useState(() => new Set());

  return (
    <div className="accordion">
      {items.map((item) => {
        const id = slug(item.q);
        const isOpen = open.has(item.q);
        return (
          <div className={isOpen ? 'accordion-item is-open' : 'accordion-item'} key={item.q}>
            <h3>
              <button
                type="button"
                id={`${id}-button`}
                aria-expanded={isOpen}
                aria-controls={`${id}-panel`}
                onClick={() => {
                  setOpen((current) => {
                    const next = new Set(current);
                    if (next.has(item.q)) next.delete(item.q);
                    else next.add(item.q);
                    return next;
                  });
                }}
              >
                <span>{item.q}</span>
                <span className="accordion-mark" aria-hidden="true" />
              </button>
            </h3>
            <div
              id={`${id}-panel`}
              role="region"
              aria-labelledby={`${id}-button`}
              aria-hidden={!isOpen}
              className="accordion-panel"
            >
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
