SPECIFIED_DIR = %s
WORKING_DIR = %s
COMMAND = "%s"
ARGUMENTS = "%s"

If the COMMAND is empty, output this description:

  specified init:  Set up an initial app.
  specified build: Build the app
  specified run:   First build and then run the app

Otherwise, if the COMMAND is represented in SPECIFIED_DIR/commands, parse and execute the SPEC.md file in that folder.

Otherwise, reply with:

  Unknown command: <command>.

