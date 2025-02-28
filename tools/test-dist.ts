import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

const BASE_DIR = path.resolve(__dirname, '..');
const PACKAGES_DIR = path.resolve(BASE_DIR, 'packages');

(async () => {
  const dirsToCheck = [];

  for (const subDir of await fs.readdir(PACKAGES_DIR)) {
    for (const packageDir of await fs.readdir(path.resolve(PACKAGES_DIR, subDir))) {
      dirsToCheck.push(path.resolve(PACKAGES_DIR, subDir, packageDir));
    }
  }

  let bad = false;
  for (const dir of dirsToCheck) {
    const pj = await fs.readJson(path.resolve(dir, 'package.json'));
    if (pj.name === '@electron-forge/cli') continue;
    if (!(await fs.pathExists(path.resolve(dir, pj.main)))) {
      console.error(`${chalk.cyan(`[${pj.name}]`)}:`, chalk.red(`Main entry not found (${pj.main})`));
      bad = true;
    }
    if (!pj.typings || !(await fs.pathExists(path.resolve(dir, pj.typings)))) {
      console.error(`${chalk.cyan(`[${pj.name}]`)}:`, chalk.red(`Typings entry not found (${pj.typings})`));
      bad = true;
    }
  }

  if (bad) {
    process.exit(1);
  }
})().catch(console.error);
