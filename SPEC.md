The current folder is %s. Command: "%s". Arguments: "%s".

If the command is empty, output this description:

  specified init:  Set up an initial app.
  specified build: Build the app
  specified run:   First build and then run the app

If the command is init:

  Check if the current folder is empty. If not, output:
    The current folder is not empty.
  Otherwise, if the folder is empty:
    Create an empty file called "MANIFEST.md"
    And output:
      The project is initiated.

Otherwise, reply with:

  Unknown command: <command>.

