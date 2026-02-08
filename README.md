# Specify

A declarative, tech-agnostic spec-driven app framework.

Apps are built by creating a MANIFEST.md that defines the framework and the purpose of the app. In an `app/` folder is a hierarchical structure of SPEC.md. Every build with look for changes (by persisting a SHA256 lockfile) so that only changed parts have to be rebuilt.

See the `examples/` folder for ideas.

*Note*: The `specify` CLI app is implemented declaratively using SPECs, with only 10 lines of shell code to run it through `codex`. You can easily adapt it to any other agent CLI tool, such as Gemini CLI or Claude Code.

## Setup
- Install [codex cli](https://developers.openai.com/codex/cli/) using `npm i -g @openai/codex`
- Clone this repo and add bin to your path.

## Usage

### specify init
Create an app stub

Update MANIFEST.md, app/SPEC.md and create new files in app/.../SPEC.md as needed.

### specify doctor
Check that all prerequisites are installed

### Specify build
Build the app

### specify test
Test the built app against the SPEC.md

### specify run
Run it

### specify clean
Clean up any build artifacts
