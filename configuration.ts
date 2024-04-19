export const upstream = {
  repo: {
    has_issues: true,
    has_projects: true,
    has_wiki: true,
    has_pages: false,
    has_discussions: true,
    allow_rebase_merge: true,
    allow_squash_merge: true,
    allow_auto_merge: false,
    delete_branch_on_merge: true,
    allow_merge_commit: true,
    squash_merge_commit_title: 'PR_TITLE' as const,
    squash_merge_commit_message: 'COMMIT_MESSAGES' as const,
    merge_commit_title: 'PR_TITLE' as const,
    merge_commit_message: 'PR_BODY' as const,
    web_commit_signoff_required: true,
    security_and_analysis: {
      secret_scanning: {
        status: 'enabled',
      },
      secret_scanning_push_protection: {
        status: 'enabled',
      },
    },
  },
  branch: {
    branch: 'main',
    required_status_checks: null,
    enforce_admins: true,
    required_pull_request_reviews: {
      dismiss_stale_reviews: true,
      require_code_owner_reviews: true,
      required_approving_review_count: 1,
    },
    restrictions: null,
    required_linear_history: true,
    allow_force_pushes: false,
    allow_deletions: false,
    block_creations: true,
    required_conversation_resolution: true,
    allow_fork_syncing: true,
  },
  label: [
    {
      'name': 'Priority: 0 Critical',
      'color': '000000',
    },
    {
      'name': 'Priority: 1 High',
      'color': 'F9D0C4',
    },
    {
      'name': 'Priority: 2 Medium',
      'color': 'FEF2C0',
    },
    {
      'name': 'Priority: 3 Low',
      'color': 'D4C5F9',
    },
    {
      'name': 'State: Help Wanted',
      'color': '0E8A16',
    },
    {
      'name': 'State: Work in Progress',
      'color': '5319E7',
    },
    {
      'name': 'State: Blocked',
      'color': '000000',
    },
    {
      'name': 'State: Postponed',
      'color': 'C5DEF5',
    },
    {
      'name': 'Type: Enhancement',
      'color': '1D76DB',
    },
    {
      'name': 'Type: Bug',
      'color': 'B60205',
    },
    {
      'name': 'Type: Infrastructure',
      'color': 'FBCA04',
    },
    {
      'name': 'Type: Dependencies',
      'color': 'D4C5F9',
    },
    {
      'name': 'Meta: Question',
      'color': 'BFDADC',
    },
    {
      'name': 'Meta: Conversation',
      'color': '27828C',
    },
    {
      'name': 'Meta: Duplicate',
      'color': 'BFDADC',
    },
    {
      'name': 'Meta: Abandoned / No Fix',
      'color': '808080',
    },
  ],
};
