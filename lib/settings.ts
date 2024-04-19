import { Octokit } from 'npm:@octoherd/cli';
import type { Repository } from 'npm:@octoherd/cli';
import { upstream } from '../configuration.ts';

export async function settings(octokit: Octokit, repository: Repository): Promise<void> {
  try {
    await octokit.request('PATCH /repos/{owner}/{repo}', {
      owner: repository.owner.login,
      repo: repository.name,
      ...upstream.repo,
    });
    await octokit.request('PUT /repos/{owner}/{repo}/actions/permissions/workflow', {
      owner: repository.owner.login,
      repo: repository.name,
      default_workflow_permissions: 'write' as const,
      can_approve_pull_request_reviews: true,
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      octokit.log.error(`Failed to write 'settings' to %s.`, repository.full_name);
      octokit.log.error(error.stack!);
      Deno.exit(-1);
    }
  }
}
