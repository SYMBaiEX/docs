#!/usr/bin/env bun

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface DoubleHeaderIssue {
  file: string;
  frontmatterTitle: string;
  h2Title: string;
  h2Line: number;
  h2Content: string;
}

async function findMDXFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  async function scan(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }
  
  await scan(dir);
  return files;
}

async function checkFileForDoubleHeader(filePath: string): Promise<DoubleHeaderIssue | null> {
  const content = await readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Find frontmatter
  let inFrontmatter = false;
  let frontmatterTitle = '';
  let frontmatterEndLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (i === 0 && line === '---') {
      inFrontmatter = true;
      continue;
    }
    
    if (inFrontmatter && line === '---') {
      frontmatterEndLine = i;
      break;
    }
    
    if (inFrontmatter && line.startsWith('title:')) {
      frontmatterTitle = line.substring(6).trim().replace(/^["']|["']$/g, '');
    }
  }
  
  if (!frontmatterTitle || frontmatterEndLine === -1) {
    return null;
  }
  
  // Check for H2 within first 10 lines after frontmatter
  const searchLimit = Math.min(frontmatterEndLine + 11, lines.length);
  
  for (let i = frontmatterEndLine + 1; i < searchLimit; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('## ')) {
      const h2Title = line.substring(3).trim();
      
      // Check if titles are same or similar
      const normalizedFrontmatter = frontmatterTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normalizedH2 = h2Title.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (normalizedFrontmatter === normalizedH2 || 
          normalizedFrontmatter.includes(normalizedH2) || 
          normalizedH2.includes(normalizedFrontmatter)) {
        return {
          file: filePath,
          frontmatterTitle,
          h2Title,
          h2Line: i + 1, // Convert to 1-based line number
          h2Content: lines[i]
        };
      }
    }
  }
  
  return null;
}

async function main() {
  const docsDir = join(process.cwd(), 'content', 'docs');
  console.log('Scanning for MDX files with double header issues...\n');
  
  const mdxFiles = await findMDXFiles(docsDir);
  console.log(`Found ${mdxFiles.length} MDX files\n`);
  
  const issues: DoubleHeaderIssue[] = [];
  
  for (const file of mdxFiles) {
    const issue = await checkFileForDoubleHeader(file);
    if (issue) {
      issues.push(issue);
    }
  }
  
  if (issues.length === 0) {
    console.log('✅ No double header issues found!');
  } else {
    console.log(`⚠️  Found ${issues.length} files with double header issues:\n`);
    
    for (const issue of issues) {
      const relativePath = issue.file.replace(process.cwd() + '/', '');
      console.log(`📄 ${relativePath}`);
      console.log(`   Frontmatter title: "${issue.frontmatterTitle}"`);
      console.log(`   H2 title (line ${issue.h2Line}): "${issue.h2Title}"`);
      console.log(`   Line content: ${issue.h2Content}`);
      console.log('');
    }
  }
}

main().catch(console.error);