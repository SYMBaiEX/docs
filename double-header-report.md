# Double Header Issue Report

## Summary

Found **75 files** with double header issues out of 111 total MDX files scanned.

## Pattern Identified

The issue occurs when:
1. The file has a `title:` in the frontmatter
2. An H2 (`##`) with the same or similar title appears within the first 10 lines after the frontmatter

## Files with Double Headers

### Advanced Section (4 files)
- `content/docs/advanced/database-adapters.mdx` (line 8)
- `content/docs/advanced/deployment.mdx` (line 8)
- `content/docs/advanced/tee-integration.mdx` (line 6)
- `content/docs/advanced/tauri-desktop-app.mdx` (line 6)

### Plugins Section (6 files)
- `content/docs/plugins/plugin-registry.mdx` (line 6)
- `content/docs/plugins/index.mdx` (line 6)
- `content/docs/plugins/plugin-templates.mdx` (line 6)
- `content/docs/plugins/creating-plugins.mdx` (line 6)
- `content/docs/plugins/plugin-development.mdx` (line 6)
- `content/docs/plugins/plugin-testing.mdx` (line 6)

### API Reference Section (10 files)
- `content/docs/api-reference/system.mdx` (line 6)
- `content/docs/api-reference/agents.mdx` (line 6)
- `content/docs/api-reference/index.mdx` (line 6)
- `content/docs/api-reference/server.mdx` (line 6)
- `content/docs/api-reference/messaging.mdx` (line 6)
- `content/docs/api-reference/core-providers.mdx` (line 6)
- `content/docs/api-reference/media.mdx` (line 6)
- `content/docs/api-reference/memory.mdx` (line 6)
- `content/docs/api-reference/audio.mdx` (line 6)
- `content/docs/api-reference/core-actions.mdx` (line 8) - Note: "Core Actions" vs "Core Actions Reference"

### Cookbook Section (1 file)
- `content/docs/cookbook/index.mdx` (line 6)

### Getting Started Section (4 files)
- `content/docs/getting-started/configuration.mdx` (line 6)
- `content/docs/getting-started/index.mdx` (line 6)
- `content/docs/getting-started/quickstart.mdx` (line 6)
- `content/docs/getting-started/installation.mdx` (line 6)

### Guides Section (3 files)
- `content/docs/guides/plugin-development-linking.mdx` (line 8)
- `content/docs/guides/monorepo-workflow.mdx` (line 8)
- `content/docs/guides/standalone-vs-monorepo.mdx` (line 8)

### Learning Tracks Section (22 files)
#### Main
- `content/docs/learning-tracks/index.mdx` (line 6)

#### Simple Track (13 files)
- `content/docs/learning-tracks/simple/intro.mdx` (line 6)
- `content/docs/learning-tracks/simple/index.mdx` (line 6)
- `content/docs/learning-tracks/simple/getting-started/quick-start.mdx` (line 6) - Note: "Quick Start" vs "Quick Start Guide"
- `content/docs/learning-tracks/simple/getting-started/index.mdx` (line 6)
- `content/docs/learning-tracks/simple/guides/choosing-development-approach.mdx` (line 6)
- `content/docs/learning-tracks/simple/guides/cli-reference.mdx` (line 8)
- `content/docs/learning-tracks/simple/guides/index.mdx` (line 6)
- `content/docs/learning-tracks/simple/guides/quickstart-comprehensive.mdx` (line 7)
- `content/docs/learning-tracks/simple/guides/troubleshooting-guide.mdx` (line 8)
- `content/docs/learning-tracks/simple/guides/deployment-guide.mdx` (line 8)
- `content/docs/learning-tracks/simple/guides/character-creation.mdx` (line 6)
- `content/docs/learning-tracks/simple/faq.mdx` (line 6)
- `content/docs/learning-tracks/simple/templates/index.mdx` (line 6)
- `content/docs/learning-tracks/simple/templates/discord-agent.mdx` (line 6)

#### Technical Track (8 files)
- `content/docs/learning-tracks/technical/advanced/index.mdx` (line 6)
- `content/docs/learning-tracks/technical/intro.mdx` (line 6)
- `content/docs/learning-tracks/technical/development/index.mdx` (line 6)
- `content/docs/learning-tracks/technical/index.mdx` (line 6)
- `content/docs/learning-tracks/technical/api-reference/index.mdx` (line 6)
- `content/docs/learning-tracks/technical/integrations/index.mdx` (line 6)
- `content/docs/learning-tracks/technical/architecture/overview.mdx` (line 6) - Note: "Architecture Overview" vs "ElizaOS Architecture Overview"
- `content/docs/learning-tracks/technical/architecture/index.mdx` (line 6)
- `content/docs/learning-tracks/technical/faq.mdx` (line 6)

### Core Concepts Section (17 files)
#### Data State (2 files)
- `content/docs/core-concepts/data-state/database.mdx` (line 8)
- `content/docs/core-concepts/data-state/state-management.mdx` (line 8)

#### AI Models (4 files)
- `content/docs/core-concepts/ai-models/llm-plugins.mdx` (line 6)
- `content/docs/core-concepts/ai-models/index.mdx` (line 6)
- `content/docs/core-concepts/ai-models/embeddings.mdx` (line 6)
- `content/docs/core-concepts/ai-models/model-providers.mdx` (line 8)

#### Architecture (2 files)
- `content/docs/core-concepts/architecture/runtime.mdx` (line 12)
- `content/docs/core-concepts/architecture/database-system.mdx` (line 6)

#### Communication (2 files)
- `content/docs/core-concepts/communication/message-bus-architecture.mdx` (line 12) - Note: "Message Bus Architecture" vs "Architecture"
- `content/docs/core-concepts/communication/rest-api.mdx` (line 6)

#### Infrastructure (2 files)
- `content/docs/core-concepts/infrastructure/services.mdx` (line 7)
- `content/docs/core-concepts/infrastructure/testing.mdx` (line 13) - Note: "Testing" vs "Testing Architecture"

#### Agent Development (6 files)
- `content/docs/core-concepts/agent-development/tasks.mdx` (line 8)
- `content/docs/core-concepts/agent-development/evaluators.mdx` (line 8)
- `content/docs/core-concepts/agent-development/index.mdx` (line 6)
- `content/docs/core-concepts/agent-development/actions.mdx` (line 8)
- `content/docs/core-concepts/agent-development/character-definition.mdx` (line 8)
- `content/docs/core-concepts/agent-development/providers.mdx` (line 8)

### Migration Section (4 files)
- `content/docs/migration/index.mdx` (line 6)
- `content/docs/migration/v1.2.0-migration.mdx` (line 8)
- `content/docs/migration/migration-helper.mdx` (line 6)
- `content/docs/migration/api-migration.mdx` (line 7)

### Root Files (1 file)
- `content/docs/index.mdx` (line 8)

## Notable Patterns

1. Most H2 headers appear on line 6 or 8 after frontmatter
2. Some files have slight variations in the H2 vs frontmatter title:
   - "Core Actions" → "Core Actions Reference"
   - "Quick Start" → "Quick Start Guide"
   - "Architecture Overview" → "ElizaOS Architecture Overview"
   - "Message Bus Architecture" → "Architecture"
   - "Testing" → "Testing Architecture"
3. Index files consistently have this issue
4. The pattern is widespread across all major sections of the documentation

## Recommendation

These duplicate headers should be removed as the title from frontmatter is already displayed as the page title in Fumadocs. The H2 headers are redundant and create visual duplication.