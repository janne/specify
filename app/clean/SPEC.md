Check if the current folder contains a MANIFEST.md. Otherwise exit with message:
  Run this command from an app folder.

Otherwise, delete the build/ folder, the README.md, MANIFEST.md.lock and traverse the app/ folder recursively and delete any *.lock files found.
