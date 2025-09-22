#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SECRETS_PATTERNS = [
  /(['"]?(?:api[_-]?key|token|secret)['"]\s*[:=]\s*['"])[a-zA-Z0-9_-]{20,}(['"])/i,
  /(['"]?(?:password|pwd)['"]\s*[:=]\s*['"])[^'"]{8,}(['"])/i,
  /-----BEGIN [A-Z ]+ PRIVATE KEY-----/,
  /ghp_[a-zA-Z0-9]{36}/,  // GitHub personal access token
  /sk-[a-zA-Z0-9]{32,}/,  // OpenAI API key pattern
];

const EXCLUDED_DIRS = ['node_modules', 'dist', '.git', 'coverage'];
const EXCLUDED_FILES = ['.env.example'];

function checkFile(filePath: string): string[] {
  const findings: string[] = [];
  
  // Skip binary files and excluded files
  if (EXCLUDED_FILES.includes(filePath.split('/').pop() || '')) {
    return findings;
  }
  
  const ext = extname(filePath).toLowerCase();
  if (!['.ts', '.js', '.json', '.yml', '.yaml', '.md', '.env'].includes(ext)) {
    return findings;
  }
  
  try {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      SECRETS_PATTERNS.forEach(pattern => {
        if (pattern.test(line)) {
          findings.push(`${filePath}:${index + 1} - Potential secret found`);
        }
      });
    });
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  
  return findings;
}

function scanDirectory(dir: string): string[] {
  let findings: string[] = [];
  
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      
      // Skip excluded directories
      if (EXCLUDED_DIRS.includes(entry)) {
        continue;
      }
      
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        findings = findings.concat(scanDirectory(fullPath));
      } else {
        findings = findings.concat(checkFile(fullPath));
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dir}:`, error);
  }
  
  return findings;
}

// Start scan from current directory
const findings = scanDirectory('.');

if (findings.length > 0) {
  console.error('⚠️ Potential secrets found in repository:');
  findings.forEach(finding => console.error(finding));
  process.exit(1);
} else {
  console.log('✅ No secrets found in repository');
  process.exit(0);
}
