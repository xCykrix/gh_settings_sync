import { Octokit } from 'npm:@octoherd/cli';
import type { Repository } from 'npm:@octoherd/cli';
import { upstream } from '../configuration.ts';

export async function label(octokit: Octokit, repository: Repository): Promise<void> {
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
      octokit.log.error(`Failed to write 'label' to %s.`, repository.full_name);
      octokit.log.error(error.stack!);
      Deno.exit(-1);
    }
  }
}
