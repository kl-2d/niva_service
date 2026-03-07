---
trigger: always_on
---

---

description: Apply whenever styling, UI components, or Tailwind CSS classes are being created or modified.
glob: "*.{tsx,ts,jsx,js,css}"
---

# UI & Styling Rules (Rugged Off-Road Theme)

- Always use **Tailwind CSS** for styling.
- Strictly adhere to the project's color palette:
  - **Backgrounds:** `bg-stone-100` for main pages, `bg-white` for cards/modals, `bg-stone-900` for dark sections (like Footer).
  - **Text:** `text-stone-900` for headings, `text-stone-700` for body text.
  - **Accents:** `text-emerald-800` (deep green) for icons, highlighted text, and primary borders.
  - **Buttons/CTAs:** `bg-amber-500 text-stone-900 font-bold hover:bg-amber-600` (Industrial Amber).
- Never use generic colors like `bg-blue-500` or `text-gray-400` unless explicitly requested.
- Ensure components are fully responsive (use `md:` and `lg:` prefixes).
