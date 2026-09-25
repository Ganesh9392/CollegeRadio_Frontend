/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#171715',
    tint: '#F5CF22',

    // Core surfaces
    background: '#FFFDF7',
    foreground: '#171715',

    // Cards / elevated surfaces
    card: '#F7F5EE',
    cardForeground: '#171715',

    // Primary action color (buttons, links, active states)
    primary: '#F5CF22',
    primaryForeground: '#171715',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#F2F0E8',
    secondaryForeground: '#292822',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#F2F0E8',
    mutedForeground: '#77766F',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#FFF2BC',
    accentForeground: '#292822',

    // Destructive actions (delete, error states)
    destructive: '#C94F46',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#E8E5DB',
    input: '#E8E5DB',

    success: '#348365',
    successSoft: '#E8F3EC',
    warning: '#B77A21',
    premiumBadge: '#FFF1B4',
    scrim: 'rgba(18, 17, 13, 0.76)',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 20,
};

export default colors;
