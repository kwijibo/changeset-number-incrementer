This module increments a number (under a unique key) in an RDF datastore, and returns the number to you.

### Usage

```
//sparqlQuery:: (query, nodeBack) -> void
//sparqlUpdate:: (update, nodeBack) -> void

const applyChangeset = require('changeset-sparql')(sparqlQuery, sparqlUpdate) //func that does updates via changesets
const incNum = require('changeset-number-incrementer')

// curry in functions that will run a sparql query (to fetch the number) and apply the updates (to increment the number)
const getNum = incNum(sparqlQuery, applyChangeset)

const key = 'abc123hjk789' //could be a sha1 of some values that make your key
const startNumber = 0 //the number to start incrementing from; if there is no number for the key already, will return startNumber + 1

getNum(key, startNumber)(
    err => console.error("error getting number", err),
    num => console.log("got a number", num)
)


```
