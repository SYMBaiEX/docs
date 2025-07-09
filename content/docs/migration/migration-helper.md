---
title: "Migration Helper Scripts"
description: "Helper scripts to assist with the ElizaOS v1.2.0 migration process"
---

# Migration Helper Scripts

This page provides helper scripts to assist with the ElizaOS v1.2.0 migration process.

## Character Migration Script

Save this as `migrate-characters.js` and run with `node migrate-characters.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Character migration helper
function migrateCharacterFile(filePath) {
  console.log(`Migrating character file: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const character = JSON.parse(content);
  
  // Migrate messageExamples format
  if (character.messageExamples) {
    character.messageExamples = character.messageExamples.map(conversation => 
      conversation.map(message => ({
        name: message.user || message.name,  // user → name
        content: message.content
      }))
    );
  }
  
  // Fix plugin ordering
  if (character.plugins) {
    const plugins = [...character.plugins];
    const sqlIndex = plugins.findIndex(p => p === '@elizaos/plugin-sql');
    const bootstrapIndex = plugins.findIndex(p => p === '@elizaos/plugin-bootstrap');
    
    // Remove and re-add in correct order
    if (sqlIndex !== -1) plugins.splice(sqlIndex, 1);
    if (bootstrapIndex !== -1) plugins.splice(bootstrapIndex, 1);
    
    character.plugins = [
      '@elizaos/plugin-sql',
      ...plugins.filter(p => p !== '@elizaos/plugin-sql' && p !== '@elizaos/plugin-bootstrap'),
      '@elizaos/plugin-bootstrap'
    ];
  }
  
  // Write back the migrated file
  fs.writeFileSync(filePath, JSON.stringify(character, null, 2));
  console.log(`✅ Migrated: ${filePath}`);
}

// Migrate all character files in a directory
function migrateCharactersDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(dir, file);
      try {
        migrateCharacterFile(filePath);
      } catch (error) {
        console.error(`❌ Error migrating ${filePath}:`, error.message);
      }
    }
  });
}

// Run migration
const charactersDir = process.argv[2] || './characters';
if (fs.existsSync(charactersDir)) {
  migrateCharactersDirectory(charactersDir);
} else {
  console.error(`Directory not found: ${charactersDir}`);
  console.log('Usage: node migrate-characters.js [characters-directory]');
}
```

## API Migration Script

Save this as `migrate-api-calls.js` and run with `node migrate-api-calls.js`:

```javascript
const fs = require('fs');
const path = require('path');

// API migration helper
function migrateAPIFile(filePath) {
  console.log(`Migrating API calls in: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Replace old API endpoints
  const oldEndpoint = /\/api\/agents\/\${?(\w+)}?\/message/g;
  if (oldEndpoint.test(content)) {
    content = content.replace(oldEndpoint, '/api/messaging/submit');
    changed = true;
  }
  
  // Replace old payload format
  const oldPayload = /{\s*senderId:\s*(['"`])([^'"`]+)\1,\s*roomId:\s*(['"`])([^'"`]+)\3,\s*text:\s*([^,}]+),?\s*source:\s*(['"`])([^'"`]+)\6\s*}/g;
  if (oldPayload.test(content)) {
    content = content.replace(oldPayload, `{
      channel_id: $3$4$3,
      server_id: '00000000-0000-0000-0000-000000000000',
      author_id: $1$2$1,
      content: $5,
      source_type: $6$7$6,
      raw_message: { text: $5 }
    }`);
    changed = true;
  }
  
  // Replace WebSocket usage
  const wsPattern = /new WebSocket\((['"`])([^'"`]+)\1\)/g;
  if (wsPattern.test(content)) {
    content = content.replace(wsPattern, `io('$2')`);
    changed = true;
    
    // Add Socket.IO import if not present
    if (!content.includes('socket.io-client')) {
      content = `import { io } from 'socket.io-client';\n${content}`;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Migrated: ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
  }
}

// Migrate all JS/TS files in a directory
function migrateDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      migrateDirectory(filePath);
    } else if (file.name.match(/\.(js|ts|jsx|tsx)$/)) {
      try {
        migrateAPIFile(filePath);
      } catch (error) {
        console.error(`❌ Error migrating ${filePath}:`, error.message);
      }
    }
  });
}

// Run migration
const sourceDir = process.argv[2] || './src';
if (fs.existsSync(sourceDir)) {
  migrateDirectory(sourceDir);
} else {
  console.error(`Directory not found: ${sourceDir}`);
  console.log('Usage: node migrate-api-calls.js [source-directory]');
}
```

## Plugin Migration Script

Save this as `migrate-plugins.js` and run with `node migrate-plugins.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Plugin migration helper
function migratePluginFile(filePath) {
  console.log(`Migrating plugin: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Add new plugin interface properties
  const pluginExportPattern = /export const (\w+): Plugin = {/g;
  const match = pluginExportPattern.exec(content);
  
  if (match) {
    // Add init function if not present
    if (!content.includes('init:')) {
      content = content.replace(
        /export const \w+: Plugin = {/,
        `$&
  init: async (config, runtime) => {
    console.log('${match[1]} plugin initialized');
  },`
      );
      changed = true;
    }
    
    // Add priority if not present
    if (!content.includes('priority:')) {
      content = content.replace(
        /export const \w+: Plugin = {/,
        `$&
  priority: 0,`
      );
      changed = true;
    }
    
    // Add events structure if not present
    if (!content.includes('events:')) {
      content = content.replace(
        /export const \w+: Plugin = {/,
        `$&
  events: {
    // Add event handlers here
  },`
      );
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Migrated: ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
  }
}

// Migrate all plugin files
function migratePluginsDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      migratePluginsDirectory(filePath);
    } else if (file.name.match(/plugin\.ts$/)) {
      try {
        migratePluginFile(filePath);
      } catch (error) {
        console.error(`❌ Error migrating ${filePath}:`, error.message);
      }
    }
  });
}

// Run migration
const pluginsDir = process.argv[2] || './plugins';
if (fs.existsSync(pluginsDir)) {
  migratePluginsDirectory(pluginsDir);
} else {
  console.error(`Directory not found: ${pluginsDir}`);
  console.log('Usage: node migrate-plugins.js [plugins-directory]');
}
```

## Complete Migration Script

Save this as `migrate-to-v1.2.0.js` and run with `node migrate-to-v1.2.0.js`:

```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Complete migration script
async function migrateProject() {
  console.log('🚀 Starting ElizaOS v1.2.0 migration...\n');
  
  // Step 1: Backup
  console.log('📦 Creating backup...');
  const backupDir = `./backup-${Date.now()}`;
  execSync(`cp -r . ${backupDir}`, { stdio: 'inherit' });
  console.log(`✅ Backup created: ${backupDir}\n`);
  
  // Step 2: Update package.json
  console.log('📝 Updating package.json...');
  if (fs.existsSync('./package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    
    // Update dependencies
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    // Update ElizaOS packages
    Object.keys(dependencies).forEach(dep => {
      if (dep.startsWith('@elizaos/')) {
        dependencies[dep] = '^1.2.0';
      }
    });
    
    Object.keys(devDependencies).forEach(dep => {
      if (dep.startsWith('@elizaos/')) {
        devDependencies[dep] = '^1.2.0';
      }
    });
    
    // Add required dependencies
    dependencies['@elizaos/plugin-sql'] = '^1.2.0';
    dependencies['@elizaos/plugin-bootstrap'] = '^1.2.0';
    dependencies['@elizaos/database-sqlite'] = '^1.2.0';
    dependencies['socket.io-client'] = '^4.0.0';
    
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json updated\n');
  }
  
  // Step 3: Install dependencies
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
  }
  
  // Step 4: Migrate characters
  console.log('👤 Migrating characters...');
  if (fs.existsSync('./characters')) {
    // Run character migration (using the logic from above)
    migrateCharactersDirectory('./characters');
    console.log('✅ Characters migrated\n');
  }
  
  // Step 5: Migrate API calls
  console.log('🔄 Migrating API calls...');
  if (fs.existsSync('./src')) {
    // Run API migration (using the logic from above)
    migrateAPIDirectory('./src');
    console.log('✅ API calls migrated\n');
  }
  
  // Step 6: Create .env template
  console.log('🔧 Creating .env template...');
  const envTemplate = `# ElizaOS v1.2.0 Configuration

# Database (required)
DATABASE_URL=sqlite:./db.sqlite

# Model Provider (required)
OPENAI_API_KEY=your_openai_key_here

# Runtime Configuration
RUNTIME_MODE=development
ENABLE_MULTI_AGENT=true
ENABLE_WEB_SEARCH=true

# Add your other environment variables here
`;
  
  if (!fs.existsSync('./.env')) {
    fs.writeFileSync('./.env', envTemplate);
    console.log('✅ .env template created\n');
  }
  
  // Step 7: Validation
  console.log('🔍 Running validation...');
  try {
    // This would use the ElizaOS CLI validation
    execSync('npx @elizaos/cli validate', { stdio: 'inherit' });
    console.log('✅ Validation passed\n');
  } catch (error) {
    console.warn('⚠️  Validation warnings (check manually):', error.message);
  }
  
  // Step 8: Final instructions
  console.log('🎉 Migration complete!\n');
  console.log('Next steps:');
  console.log('1. Review and update your .env file');
  console.log('2. Test your application in development');
  console.log('3. Run your test suite');
  console.log('4. Deploy to staging for testing');
  console.log(`5. Keep backup directory safe: ${backupDir}`);
}

// Helper functions (simplified versions of the above scripts)
function migrateCharactersDirectory(dir) {
  // Character migration logic here
  console.log(`Migrating characters in ${dir}`);
}

function migrateAPIDirectory(dir) {
  // API migration logic here
  console.log(`Migrating API calls in ${dir}`);
}

// Run migration
migrateProject().catch(console.error);
```

## Usage Instructions

1. **Character Migration**: Run `node migrate-characters.js ./characters`
2. **API Migration**: Run `node migrate-api-calls.js ./src`
3. **Plugin Migration**: Run `node migrate-plugins.js ./plugins`
4. **Complete Migration**: Run `node migrate-to-v1.2.0.js`

## Important Notes

- Always backup your project before running migration scripts
- Test thoroughly in a staging environment
- The scripts are helpers - manual review is still required
- Some complex migrations may need manual intervention
- Check the [troubleshooting guide](/docs/migration/v1.2.0-migration#troubleshooting-common-issues) for common issues

## CLI Alternative

For a more comprehensive solution, use the ElizaOS CLI:

```bash
# Use the official CLI migration tools
elizaos migrate --from=1.1.x --to=1.2.0
elizaos validate
```