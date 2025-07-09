# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Core Understanding

This is a **Fumadocs-based documentation site** using Next.js. Key principles:

- MDX files in `/docs` → Static pages via dynamic routing
- Fumadocs handles navigation, search, and UI components
- Build-time processing enables advanced features
- Everything is file-based and statically generated

## Essential Commands

```bash
# Development
bun dev              # Start development server
bun run build        # Production build (runs linting + processing)
bun start            # Serve production build

# Code Quality (run these before marking tasks complete)
bun run lint         # Must pass with zero warnings
bun run format       # Auto-fix formatting issues
bun run format:check # Check formatting without fixing (useful for CI)
bun run lint:mdx     # Check MDX content quality
```

## Critical Patterns to Follow

### When Creating/Editing Documentation

**DO:**
- Place MDX files in `/docs` with `.mdx` extension
- Include frontmatter: `title` and `description` (required)
- Use H2 (`##`) as highest heading level in content
- Follow existing URL patterns (check similar pages)
- Format code blocks properly (backticks on separate lines)
- Test changes with `bun dev` before committing

**DON'T:**
- Use H1 (`#`) headers in content (title comes from frontmatter)
- Create files outside `/docs` for documentation content
- Mix code and documentation in the same PR
- Forget to update `meta.json` when adding new pages
- Use inline code blocks (e.g., `` ```bash # comment ``)
- Compress multi-line content into single lines in MDX components

### Code Block Formatting

**❌ WRONG - Inline code blocks:**
```mdx
<Tab value="Testing">
  ```bash # This is wrong - don't put code blocks inline
</Tab>
```

**✅ CORRECT - Properly formatted:**
```mdx
<Tab value="Testing">
  ```bash
  # This is correct - code block on separate lines
  bun test
  bun test --coverage
  ```
</Tab>
```

### MDX Component Usage

**Decision Tree for Components:**

```
Need to highlight important info? → <Callout>
Showing step-by-step process? → <Steps> with <Step>
Multiple ways to do something? → <Tabs> with <Tab>
Linking to multiple related pages? → <Cards> with <Card>
Showing file structure? → <Files>, <Folder>, <File>
Q&A or collapsible content? → <Accordions> with <Accordion>
```

**Component Rules:**

1. Always leave blank lines after opening tags and before closing tags
2. Each `<Step>` must contain an H2 header
3. Don't nest interactive components
4. Components are globally available (no imports needed)

### File Organization Patterns

```
/docs
├── index.mdx                 # ALWAYS: Section overview
├── meta.json                 # ALWAYS: Navigation config
├── getting-started/          # Pattern: verb-noun folders
│   ├── index.mdx            # ALWAYS: Section landing
│   ├── quickstart.mdx       # Pattern: noun for guides
│   └── meta.json            # ALWAYS: Section nav
└── api-reference/           # Pattern: noun-noun folders
    ├── endpoints/           # Pattern: group by type
    └── meta.json
```

**Navigation Rules:**

- `meta.json` defines order: `{"pages": ["quickstart", "installation"]}`
- Hidden pages: prefix with `_` (e.g., `_draft.mdx`)
- Landing pages: always `index.mdx` (not in meta.json)

## Text Formatting Standards

### Inline Formatting Quick Reference

- **Bold**: UI elements, important terms → `**Save button**`
- _Italics_: New concepts, emphasis → `*rarely* need this`
- `Code`: Commands, filenames, values → `` `bun dev` ``
- Links: Descriptive text → `[see configuration guide](/guides/config)`

### Code Blocks

```typescript title="app/config.ts"  // Always add filename
export const config = {
  // Code here
};
```

For package installation:

```package-install
fumadocs-ui fumadocs-core
```

## Architecture Decisions

### Why These Patterns Matter

1. **Static Generation**: Pre-building ensures fast loads and SEO
2. **File-based Routing**: Predictable URLs from file structure
3. **MDX Processing**: Enables rich content with components
4. **Fumadocs Conventions**: Following them ensures features work

### Extension Points

When adding capabilities, check these locations:

- `/scripts/*` - Build-time processing examples
- `/app/api/*` - Runtime features and endpoints
- `source.config.ts` - MDX processing configuration
- `package.json` scripts - Build pipeline hooks

Common patterns for new features:

- **Search Enhancement**: Process content → Build index → Serve via API
- **Analytics**: Add tracking → Collect events → Display insights
- **LLM Formats**: Parse MDX → Strip formatting → Serve as `/llms.txt`
- **API Docs**: Parse OpenAPI → Generate MDX → Include in build

## Development Checklist

Before completing any documentation task:

- [ ] All MDX files have required frontmatter
- [ ] Navigation updated in relevant `meta.json` files
- [ ] No H1 headers used in content
- [ ] All internal links use absolute paths without `/docs`
- [ ] Ran `bun run lint:mdx` and fixed any issues
- [ ] Tested locally with `bun dev`
- [ ] Ran `bun run build` successfully (must pass before committing)
- [ ] Verified navigation and search work correctly

## Quick Decisions Guide

**"Where should I put this new page?"** → Follow existing patterns, check similar content's location

**"What component should I use?"** → See Decision Tree in Critical Patterns section

**"How should I format this?"** → Check similar pages, follow their patterns

**"Should I create a new folder?"** → Only if you have 3+ related pages to group

**"What frontmatter fields do I need?"** → `title` and `description` are required, others optional

## Tools and Helpers

### Context7 MCP Server

Enable for real-time Fumadocs documentation access:

- Provides current component APIs
- Shows configuration examples
- Explains advanced patterns
- Use when: implementing new Fumadocs features

### Build Tools

```bash
# Optional advanced features
bun run build:openapi    # Generate API docs from OpenAPI specs
# Add custom scripts in /scripts for new capabilities
```

## Remember

1. **Follow existing patterns** - consistency matters more than perfection
2. **Test everything locally** - `bun dev` before pushing
3. **Keep it simple** - use built-in components before custom solutions
4. **Document as you code** - update docs with feature changes
5. **Ask when uncertain** - check existing examples first
