SPECIFY_DIR = %s
WORKING_DIR = %s
COMMAND = "%s"
ARGUMENTS = "%s"

If the COMMAND is empty, list the commands in SPECIFY_DIR/<command> and output each command with the description in the header, like this:

  specify init: Set up a new app
  specify build: Build the app
  ...

Otherwise, if the COMMAND is represented in SPECIFY_DIR/<command>, parse and execute the SPEC.md file in that folder.

Otherwise, reply with:

  Unknown command: <command>.

