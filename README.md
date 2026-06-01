# Off By One UI

A custom [shadcn](https://ui.shadcn.com) component registry hosted at [ui.offbyone.ai](https://ui.offbyone.ai). Components are installable directly into any shadcn-compatible project and are documented with live previews on the site.

## How it works

This monorepo has two main pieces:

- **`packages/registry/`** — the source of truth for every component. The `shadcn build` command reads `registry.json` and compiles the component source files into a JSON API under `apps/web/public/r/`.
- **`apps/web/`** — an Astro site that documents each component. It serves the built registry files and renders MDX docs pages with live preview tabs.

When someone runs:

```sh
npx shadcn@latest add https://ui.offbyone.ai/r/button.json
```

shadcn fetches the built JSON for that component and copies the source into their project.

## Project structure

```
packages/registry/
  registry.json                  # Registry manifest — one entry per component
  src/
    button/button.tsx            # Component source (one folder per component)
    theme-provider/theme-provider.tsx
    mode-toggle/mode-toggle.tsx
    theme-selector/theme-selector.tsx
    lib/utils.ts                 # Shared utilities (registry:lib type)

apps/web/
  src/
    content/components/          # MDX docs pages (one .mdx per component)
    components/examples/         # Demo components used in the docs previews
    components/ui/               # Local copies of registry components (used by the docs site itself)
    pages/components/[slug].astro
```

## Adding a new component

### 1. Write the component source

Create a folder under `packages/registry/src/` named after your component and put the implementation there:

```
packages/registry/src/badge/badge.tsx
```

### 2. Register it in `registry.json`

Add an entry to the `items` array in [packages/registry/registry.json](packages/registry/registry.json):

```json
{
  "name": "badge",
  "type": "registry:ui",
  "title": "Badge",
  "description": "Displays a badge or a component that looks like a badge.",
  "dependencies": ["clsx", "tailwind-merge"],
  "registryDependencies": ["utils"],
  "files": [
    {
      "path": "src/badge/badge.tsx",
      "type": "registry:ui"
    }
  ],
  "categories": ["primitives"]
}
```

**`type` options:**
- `registry:ui` — a UI component (goes into `components/ui/` in the consumer's project)
- `registry:lib` — a utility/helper (goes into `lib/`)
- `registry:hook` — a React hook (goes into `hooks/`)

**`registryDependencies`** lists other items from this registry that must be installed alongside it (e.g. `"utils"`).

### 3. Copy the component into the docs site

The docs site imports components from its own `src/components/ui/` folder, so copy (or symlink) your component there too:

```
apps/web/src/components/ui/badge.tsx
```

### 4. Create a demo component

Add a file under `apps/web/src/components/examples/` that exports named demo functions — one per example you want to show:

```tsx
// apps/web/src/components/examples/badge-demo.tsx
import { Badge } from "@/components/ui/badge";

export function BadgeDemo() {
  return <Badge>Badge</Badge>;
}

export function BadgeSecondary() {
  return <Badge variant="secondary">Secondary</Badge>;
}
```

### 5. Write the MDX docs page

Create an MDX file under `apps/web/src/content/components/`. The frontmatter `component` field must match the `name` in `registry.json`:

```mdx
---
title: Badge
description: Displays a badge or a component that looks like a badge.
component: badge
---

import { BadgeDemo, BadgeSecondary } from "@/components/examples/badge-demo";
import PreviewTabs from "@/components/ui/preview-tabs";

## Usage

```tsx
import { Badge } from "@/components/ui/badge"
```

## Examples

### Default

<PreviewTabs client:load code={`<Badge>Badge</Badge>`}>
  <BadgeDemo client:load />
</PreviewTabs>

### Secondary

<PreviewTabs client:load code={`<Badge variant="secondary">Secondary</Badge>`}>
  <BadgeSecondary client:load />
</PreviewTabs>
```

### 6. Build the registry

```sh
cd packages/registry
bun run registry:build
```

This compiles the registry JSON into `apps/web/public/r/` and copies `registry.json` to `apps/web/public/r/index.json`. The component will then be installable and visible on the docs site.

## Development

```sh
# Install dependencies
bun install

# Start the docs site
bun run dev

# Build the registry (run from packages/registry or via turbo)
bun run registry:build
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for infrastructure and deploy details.
