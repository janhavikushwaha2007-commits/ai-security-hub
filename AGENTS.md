<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep each feature-specific demo module (e.g. Reports & Alerts under `src/components/reports-alerts/`, Profile & Settings under `src/components/profile-settings/`) isolated in its own component folder, composed by a thin route, so preview behavior stays separate from other modules.
