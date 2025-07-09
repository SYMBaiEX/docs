#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the report to get list of files
const reportPath = resolve(__dirname, '../double-header-report.md');
const report = readFileSync(reportPath, 'utf-8');

// Extract file paths from the report
const fileMatches = report.matchAll(/- `([^`]+)`/g);
const filesToFix = Array.from(fileMatches).map(match => match[1]);

console.log(`Found ${filesToFix.length} files to fix`);

let fixedCount = 0;
let skippedCount = 0;

filesToFix.forEach(file => {
  try {
    const content = readFileSync(file, 'utf-8');
    
    // Find frontmatter end
    const frontmatterEndMatch = content.match(/^---\n(.*?)\n---\n/s);
    if (!frontmatterEndMatch) {
      console.log(`⚠️  No frontmatter found in ${file}`);
      skippedCount++;
      return;
    }
    
    const frontmatterEnd = frontmatterEndMatch[0].length;
    const afterFrontmatter = content.substring(frontmatterEnd);
    
    // Extract title from frontmatter
    const titleMatch = frontmatterEndMatch[1].match(/title:\s*(.+)/);
    if (!titleMatch) {
      console.log(`⚠️  No title found in frontmatter of ${file}`);
      skippedCount++;
      return;
    }
    
    const title = titleMatch[1].trim();
    
    // Find and remove the duplicate H2
    // Look for H2 within first ~10 lines after frontmatter
    const lines = afterFrontmatter.split('\n');
    let foundDuplicate = false;
    let newLines = [...lines];
    
    for (let i = 0; i < Math.min(15, lines.length); i++) {
      const line = lines[i];
      if (line.startsWith('## ')) {
        const h2Title = line.substring(3).trim();
        // Check if H2 title is same or very similar to frontmatter title
        if (h2Title === title || 
            h2Title.toLowerCase() === title.toLowerCase() ||
            title.includes(h2Title) || 
            h2Title.includes(title)) {
          
          // Remove the H2 line
          newLines.splice(i, 1);
          
          // Also remove the following line if it's empty or contains the description
          if (i < newLines.length && (newLines[i] === '' || newLines[i].trim() === '')) {
            newLines.splice(i, 1);
          }
          
          // Check if next line duplicates the description
          const descMatch = frontmatterEndMatch[1].match(/description:\s*(.+)/);
          if (descMatch && i < newLines.length) {
            const desc = descMatch[1].trim();
            if (newLines[i].includes(desc)) {
              newLines.splice(i, 1);
              // Remove following empty line if exists
              if (i < newLines.length && newLines[i] === '') {
                newLines.splice(i, 1);
              }
            }
          }
          
          foundDuplicate = true;
          break;
        }
      }
    }
    
    if (foundDuplicate) {
      const newContent = content.substring(0, frontmatterEnd) + newLines.join('\n');
      writeFileSync(file, newContent);
      console.log(`✅ Fixed ${file}`);
      fixedCount++;
    } else {
      console.log(`⚠️  No duplicate H2 found in ${file}`);
      skippedCount++;
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error);
    skippedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
console.log(`⚠️  Skipped ${skippedCount} files`);
console.log('\nRemember to run "bun run lint:mdx" to check for any MDX issues!');