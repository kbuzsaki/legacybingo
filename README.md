Legacy OoT Bingo Generators
===

This repo serves as a record of previous OoT Bingo generators and includes a simple
[flask](http://flask.pocoo.org/) web server for serving boards over a restful api.

- `generators/` contains the previous generator code
- `apiserver/` contains the flask server

The api server is being run at [legacybingo.bingosync.com](http://legacybingo.bingosyn.com),
for example here's the card with seed 1234 from version v8.4:

[http://legacybingo.bingosync.com/api/bingo/legacy/card?version=v8.4&seed=1234](http://legacybingo.bingosync.com/api/bingo/legacy/card?version=v8.4&seed=1234)


