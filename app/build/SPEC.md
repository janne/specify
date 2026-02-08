---
description: Build the app.
---
If the WORKING_DIR/MANIFEST.md or WORKING_DIR/app/SPEC.md are missing, output:
  No app available.

Otherwise, go through MANIFEST.md and all the SPEC.md files in the WORKING_DIR. Run a sha256 on each file.
  If <file>.lock file doesn't exist in the same directory, write it, containing the SHA and add the file to the list of spec-files that need to build.
  If a <file>.lock file exists in the same directory as the <file>.md, compare it to the new SHA.
    If same, do nothing.
    If different, add the file to the list of spec-files that have to build.

If the WORKING_DIR/build is missing, create it.

Build an app in WORKING_DIR/build, specified by the list of spec-files while using the framework and other instructions in WORKING_DIR/MANIFEST.md. If the MANIFEST.md.lock has changed, rebuild the whole app using the new instructions.

Update (or create) the README.md in the WORKING_DIR, with instructions for how to run the app.
