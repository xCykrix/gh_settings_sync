import { Octokit } from 'npm:@octoherd/cli';
import type { Repository } from 'npm:@octoherd/cli';
import { upstream } from '../configuration.ts';

export async function branch(octokit: Octokit, repository: Repository): Promise<void> {
  try {
    await octokit.request('PUT /repos/{owner}/{repo}/branches/{branch}/protection', {
      owner: repository.owner.login,
      repo: repository.name,
      ...upstream.branch,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      octokit.log.error(`Failed to write 'branch' to %s.`, repository.full_name);
      octokit.log.error(error.stack!);
      Deno.exit(-1);
    }
  }
}
