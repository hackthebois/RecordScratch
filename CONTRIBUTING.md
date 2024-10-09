# Contributing to RecordScratch

RecordScratch is still premeture and under extensive development. The contribution guidelines are outlined to help balance the community engagement with the RecordScratch's vision.

## Reporting bugs or requesting features

Bugs and feature requests are should be reported via GitHub issues. Please check if the issue already exists before opening a new one.

## Asking questions

There are several ways to ask questions or ask for help:

-   Use the #community-suggestions or #community-help channels in our [Discord server](https://discord.gg/pwYknVj2QR)
-   Open a [discussion](https://github.com/hackthebois/RecordScratch/discussions) via GitHub

## Labels

Labels are used to help you understand the status of each ticket.

### Status labels

-   **ready** - this ticket is ready to be worked on.
-   **under review** - this ticket has been seen by the RecordScratch team and we are identifying next steps.

### Type labels

Denoted by the `type:` prefix.

## Commit types

| Commit Type | Title            | Description                                                                                                             |
| ----------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------- | --- |
| `feat`      | Features         | A new feature                                                                                                           |
| `fix`       | Bug Fixes        | A solution to a bug                                                                                                     |
| `docs`      | Documentation    | Changes to Documentation only                                                                                           |
| `refactor`  | Code Refactoring | A code change that neither fixes a bug nor adds a feature                                                               |     |
| `test`      | Tests            | Adding temporary changes, should be used with caution and should not be used to implement any new features or bug fixes |
| `docs`      | Documentation    | Changing documentation and not modifying any src files                                                                  |

## Contributing code

### When to contribute

#### Existing issues

If picking up an existing GitHub issue, please respect the **ready** status label.

#### New issues

If you've reported a bug via an issue and have a fix, you don't need to wait for the **ready** label before proposing a fix.

#### No issue

PRs without issues may be accepted for small fixes, but larger changes may be rejected or require further discussion.

### Setting up the environment

Recordscratch uses:

-   TypeScript
-   TailwindCSS
-   Turborepo for monorepo tooling
-   Bun for package management and release automation

To get setup, first clone the repo and then install the dependencies:

```sh
bun install
```

Then to run the to start up the project:

```sh
bun run dev
```

To connect to the web app, visit the given local address
To connect to the expo app, visit the given expo address on your mobile device

### Style

#### Commits

**Keep your PRs focused to a single issue**. This makes it easier to review and is necessary for our release process.

If you need to solve multiple issues, it's best to split it into multiple PRs. Or, if you're comfortable writing conventional commits, you can also split each change into a separate commit. The team is more likely to have opinions about this and you may be asked to reword your commits.
