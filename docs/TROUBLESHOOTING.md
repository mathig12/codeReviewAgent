# Troubleshooting & Common Issues

## ❌ 429 Quota Exceeded
- **Cause**: Attempting to use `gemini-2.5-pro` on a free-tier API key that has a limit of 0 for that specific model.
- **Fix**: The project is configured to use `gemini-2.5-flash`, which has high rate limits on the free tier. Ensure `GeminiEngine.ts` is using the `flash` model.

## ❌ Webhook Not Triggering
- **Cause**: ngrok tunnel expired or the URL in GitHub Webhook settings is outdated.
- **Fix**: Restart ngrok (`ngrok http 3000`) and update the GitHub Webhook URL with the new tunnel address.

## ❌ "Missing Script: test:e2e"
- **Cause**: Running the script on a branch where `package.json` wasn't updated or committed.
- **Fix**: Ensure you are on the `main` branch or a branch that has merged `main`. Run `npm install` to ensure all dependencies are resolved.

## ❌ Git Merge Conflicts during E2E
- **Cause**: The automation script creates branches off `main`. If `main` is ahead of your local branch, conflicts may occur.
- **Fix**: Run `git pull origin main` before running the E2E scripts.
