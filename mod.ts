import { Octokit } from 'npm:@octoherd/cli';
import type { Repository } from 'npm:@octoherd/cli';
import { run } from 'npm:@octoherd/cli/run';
import { settings } from './lib/settings.ts';
import { branch } from './lib/branch.ts';
import { label } from './lib/label.ts';

export async function script(octokit: Octokit, repository: Repository): Promise<void> {
  octokit.log.info('SYNCING %s FROM LOCAL', repository.full_name);
  if (repository.archived) {
    octokit.log.info('SKIPPED %s DUE TO ARCHIVE=TRUE', repository.full_name);
    return;
  }

  await branch(octokit, repository);
  await label(octokit, repository);
  await settings(octokit, repository);
}

await run(script);
