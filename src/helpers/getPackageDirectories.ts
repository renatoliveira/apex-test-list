'use strict';
/* eslint-disable no-await-in-loop */

import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { readFile, readdir, stat } from 'node:fs/promises';

import { SFDX_PROJECT_FILE_NAME } from './constants.js';
import { getRepoRoot } from './getRepoRoot.js';
import { SfdxProject } from './types.js';

export async function getPackageDirectories(): Promise<string[]> {
  const repoRoot = await getRepoRoot();
  process.chdir(repoRoot);
  const dxConfigPath = resolve(repoRoot, SFDX_PROJECT_FILE_NAME);
  if (!existsSync(dxConfigPath)) {
    throw Error(`Salesforce DX Config File does not exist in this path: ${dxConfigPath}`);
  }

  const sfdxProjectRaw: string = await readFile(dxConfigPath, 'utf-8');
  const sfdxProject: SfdxProject = JSON.parse(sfdxProjectRaw) as SfdxProject;
  const packageDirectories = sfdxProject.packageDirectories.map((directory) => resolve(repoRoot, directory.path));
  const metadataPaths: string[] = [];
  for (const directory of packageDirectories) {
    const classesPath = await searchForSubFolders(directory, ['classes', 'triggers']);
    if (classesPath.length > 0) {
      metadataPaths.push(...classesPath);
    }
  }
  return metadataPaths;
}

async function searchForSubFolders(dxDirectory: string, subDirectoryNames: string[]): Promise<string[]> {
  const foundPaths: string[] = [];
  const files = await readdir(dxDirectory);
  
  for (const file of files) {
    const filePath = join(dxDirectory, file);
    const stats = await stat(filePath);
    
    // Check if current directory is one of the desired sub-folders
    if (stats.isDirectory() && subDirectoryNames.includes(file)) {
      foundPaths.push(filePath);
    }
    // Recursively search sub-directories that aren't the target folders
    else if (stats.isDirectory()) {
      const result = await searchForSubFolders(filePath, subDirectoryNames);
      foundPaths.push(...result);
    }
  }
  return foundPaths;
}
