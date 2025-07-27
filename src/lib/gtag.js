export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Fire a page-view
export const pageview = (url) => {
  if (!GA_ID) return;
  window.gtag('config', GA_ID, { page_path: url });
};

// Log a custom event
export const event = ({ action, category, label, value }) => {
  if (!GA_ID) return;
  window.gtag('event', action, { event_category: category, event_label: label, value });
};