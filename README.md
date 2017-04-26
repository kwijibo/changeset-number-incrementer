This module increments a number (under a unique key) in an RDF datastore, and returns the number to you.

### Usage

```
//sparqlQuery:: (query, nodeBack) -> void
//sparqlUpdate:: (update, nodeBack) -> void

const applyChangeset = require('changeset-sparql')(sparqlQuery, sparqlUpdate)
const incNum = require('changeset-number-incrementer')
const getNum = incNum(sparqlQuery, applyChangeset)

const key = 'abc123hjk789' //could be a sha1 of some values that make your key

getNum(key)(
    err => console.error("error getting number", err),
    num => console.log("got a number", num)
)


```
