# PR merge workflow (to ensure changes land on `main`)

If your repository page only shows the initial commit after a PR, it usually means the PR was not merged into `main`.

## Safe workflow

```bash
# 1) make sure main is up to date
git checkout main
git pull origin main

# 2) create a feature branch from main
git checkout -b feature/ed-tracker-updates

# 3) make changes, then commit
git add .
git commit -m "Your change message"

# 4) push branch and open PR targeting main
git push -u origin feature/ed-tracker-updates
```

On GitHub PR page:
- Confirm **base** branch is `main`.
- Confirm PR state becomes **Merged** (not Closed).

After merge, deleting the feature branch is safe.

## Quick checks after merge

```bash
git checkout main
git pull origin main
git log --oneline --max-count=20
```

You should see your feature commit(s) in `main` history.
