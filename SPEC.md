SPECIFIED_DIR = %s
WORKING_DIR = %s
COMMAND = "%s"
ARGUMENTS = "%s"

If the COMMAND is empty, list the commands in SPECIFIED_DIR/commands/ and output each command with the description in the header, like this:

  specified init:  Set up a new app
  specified build: Build the app
  ...

Otherwise, if the COMMAND is represented in SPECIFIED_DIR/commands, parse and execute the SPEC.md file in that folder.

Otherwise, reply with:

  Unknown command: <command>.

