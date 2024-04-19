import { Octokit } from 'npm:@octoherd/cli';
import type { Repository } from 'npm:@octoherd/cli';
import { upstream } from '../configuration.ts';
import { encrypt } from './util/libsodium.ts';

export async function settings(octokit: Octokit, repository: Repository): Promise<void> {
  try {
    // Update Settings
    await octokit.request('PATCH /repos/{owner}/{repo}', {
      owner: repository.owner.login,
      repo: repository.name,
      ...upstream.repo,
    });
    
    const req = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
      owner: repository.owner.login,
      repo: repository.name,
    });
    await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
      owner: repository.owner.login,
      repo: repository.name,
      secret_name: 'PERSONAL_ACCESS_TOKEN',
      encrypted_value: await encrypt(req.data.key, Deno.env.get('GH_ACCESS_TOKEN') ?? 'NULL')
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      octokit.log.error(`Failed to write 'settings' to %s.`, repository.full_name);
      octokit.log.error(error.stack!);
      Deno.exit(-1);
    }
  }
}
