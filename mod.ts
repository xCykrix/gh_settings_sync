import { Octokit } from 'npm:@octoherd/cli';
import type { Repository } from 'npm:@octoherd/cli';
import { run } from 'npm:@octoherd/cli/run';
import { upstream } from './configuration.ts';
import { createSecretUpdater } from 'npm:github-secret-dotenv';

export async function script(octokit: Octokit, repository: Repository): Promise<void> {
  octokit.log.info('START SYNC OF "%s";', repository.full_name);
  if (repository.archived) return octokit.log.info('SKIPPED SYNC OF %s ARCHIVED=TRUE', repository.full_name);

  // Sync Repository Settings
  try {
    octokit.log.info('START REPO_SETTINGS SYNC OF "%s";', repository.full_name);
    await octokit.request('PATCH /repos/{owner}/{repo}', {
      owner: repository.owner.login,
      repo: repository.name,
      ...upstream.repo,
    });

    octokit.log.info('START SET_PERSONAL_ACCESS_TOKEN SYNC OF "%s";', repository.full_name);
    const updateSecret = createSecretUpdater({
      owner: repository.owner.login,
      repo: repository.name,
      githubAccessToken: Deno.env.get('GH_ACCESS_TOKEN') ?? '',
    });
    updateSecret('PERSONAL_ACCESS_TOKEN', Deno.env.get('GH_ACCESS_TOKEN')!);
  } catch (error: unknown) {
    if (error instanceof Error) {
      octokit.log.error(`FAILED REPO_SETTINGS SYNC OF "%s".`, repository.full_name);
      octokit.log.error(error.stack!);
      Deno.exit(-1);
    }
  }

  // Sync Branch Settings
  octokit.log.info('START BRANCH SYNC OF "%s";', repository.full_name);
  try {
    await octokit.request('PUT /repos/{owner}/{repo}/branches/{branch}/protection', {
      owner: repository.owner.login,
      repo: repository.name,
      ...upstream.branch,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      octokit.log.error(`FAILED BRANCH SYNC OF "%s";`, repository.full_name);
      octokit.log.error(error.stack!);
      Deno.exit(-1);
    }
  }

  // Sync Issue Labels
  octokit.log.info('START LABEL SYNC OF "%s";', repository.full_name);
  const def = new Map<string, { name: string; color: string; }>();

  for (const label of upstream.label) {
    def.set(label.name, label);
  }

  const exists = new Set<string>();
  const remove = [];

  try {
    const labels = await octokit.request('GET /repos/{owner}/{repo}/labels', {
      owner: repository.owner.login,
      repo: repository.name,
    })
    for (const label of labels.data) {
      const l = def.get(label.name);
      if (l === undefined) {
        remove.push(label.name);
        continue;
      }
      exists.add(l.name);
    }

    for (const label of exists.values()) {
      const l = def.get(label);
      if (l !== undefined) {
        def.delete(label);
      }
    }

    for (const del of remove) {
      // deno-lint-ignore no-await-in-loop
      await octokit.request('DELETE /repos/{owner}/{repo}/labels/{name}', {
        owner: repository.owner.login,
        repo: repository.name,
        name: del,
      })
    }

    for (const cre of def.values()) {
      // deno-lint-ignore no-await-in-loop
      await octokit.request('POST /repos/{owner}/{repo}/labels', {
        owner: repository.owner.login,
        repo: repository.name,
        name: cre.name,
        color: cre.color,
      })
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      octokit.log.error(`FAILED LABEL SYNC OF "%s";`, repository.full_name);
      octokit.log.error(error.stack!);
      Deno.exit(-1);
    }
  }
}

await run(script);
