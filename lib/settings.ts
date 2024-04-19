import { Octokit } from 'npm:@octoherd/cli';
import type { Repository } from 'npm:@octoherd/cli';
import { upstream } from '../configuration.ts';
import { createSecretUpdater } from 'npm:github-secret-dotenv';

export async function settings(octokit: Octokit, repository: Repository): Promise<void> {
  try {
    // Update Settings
    await octokit.request('PATCH /repos/{owner}/{repo}', {
      owner: repository.owner.login,
      repo: repository.name,
      ...upstream.repo,
    });

    const updateSecret = createSecretUpdater({
      owner: repository.owner.login,
      repo: repository.name,
      githubAccessToken: Deno.env.get('GH_ACCESS_TOKEN') ?? '',
    });
    updateSecret('PERSONAL_ACCESS_TOKEN', Deno.env.get('GH_ACCESS_TOKEN')!);
  } catch (error: unknown) {
    if (error instanceof Error) {
      octokit.log.error(`Failed to write 'settings' to %s.`, repository.full_name);
      octokit.log.error(error.stack!);
      Deno.exit(-1);
    }
  }
}
