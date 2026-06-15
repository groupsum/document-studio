# Document Studio

SSOT-governed Groupsum workspace for the `@groupsum/document-studio` React package.

## Workspace

- Python workspace: `uv` with `ssot-registry` in the dev dependency group.
- JavaScript workspace: `pnpm` with packages under `packages/*`.
- Component package: `packages/document-studio`.

## Commands

```powershell
uv sync
pnpm install
pnpm run test
pnpm run typecheck
pnpm run build
uv run ssot validate .
```
