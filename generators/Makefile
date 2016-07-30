
SHEBANG = "\#!/usr/bin/env nodejs"
EXECUTABLES = bin/v8.0 bin/v8.1 bin/v8.2 bin/v8.3 bin/v8.4 bin/v8.5 bin/v9.0 bin/v9.1

.PHONY: all clean new test

all: $(EXECUTABLES)

# let us run the generator from the command line by slamming together
# all of the js files and adding a node shebang at the top
#
# the order of .js files in the cat command is important and should match the
# order of the <script> tags in test/bingo.html
bin/%: %/generator.js %/goal-list.js lib/*.js
	mkdir -p bin
	echo $(SHEBANG) | cat - lib/seedrandom-min.js $*/goal-list.js $*/generator.js lib/cli.js > $@
	chmod +x $@

clean:
	rm -f $(EXECUTABLES)

new: clean all

test: all
	./tester.sh

