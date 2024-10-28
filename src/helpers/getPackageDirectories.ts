'use strict';
/* eslint-disable no-await-in-loop */

import { resolve, join } from 'node:path';
import { readFile, readdir, stat } from 'node:fs/promises';

import { getRepoRoot } from './getRepoRoot.js';
import { SfdxProject } from './types.js';

const SEARCHABLE_METADATA_FOLDERS = ['classes', 'triggers', 'testSuites'];

export async function getPackageDirectories(): Promise<string[]> {
  const { repoRoot, dxConfigFilePath } = await getRepoRoot();

  if (!repoRoot || !dxConfigFilePath) {
    throw new Error('Failed to retrieve repository root or sfdx-project.json path.');
  }

  process.chdir(repoRoot);
  const sfdxProjectRaw: string = await readFile(dxConfigFilePath, 'utf-8');
  const sfdxProject: SfdxProject = JSON.parse(sfdxProjectRaw) as SfdxProject;
  const packageDirectories = sfdxProject.packageDirectories.map((directory) => resolve(repoRoot, directory.path));
  const metadataPaths: string[] = [];

  for (const directory of packageDirectories) {
    const mdPath = await searchForSubFolders(directory, SEARCHABLE_METADATA_FOLDERS);

    if (mdPath.length > 0) {
      metadataPaths.push(...mdPath);
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
