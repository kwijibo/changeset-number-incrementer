//conditions:
// count doesn't exist
// count exists, is incremented successfully 
// count exists, but has already been incremented by another actor when incrementing is attempted
//
const getNumber = require('./index.js')
const lastChangeSet = {value: 'urn:hash:sha1:789789djhkjh7'}
const queryExistingNonZeroCount = (sparql, callback) => callback(null, {bindings: [{count: {value: "5"}, lastChangeSet}]})
const queryExistingZeroCount = (sparql, callback) => callback(null, {bindings: [{count: {value: "0"}, lastChangeSet}]})
const changesetSucceed = (changeset, callbacks) => callbacks.ok("Update succeeded")

const id = "123"

getNumber(queryExistingNonZeroCount, changesetSucceed)(id)(
    err => console.error("Error incrementing count for "+id, err),
    num => console.log("count for "+id+" incremented:", num)
)
getNumber(queryExistingZeroCount, changesetSucceed)(id)(
    err => console.error("Error incrementing count for "+id, err),
    num => console.log("count for "+id+" incremented:", num)
)

const results = {bindings: []}
const queryCount = (sparql, callback) => callback(null, {results})
const changesetInc = (cs, cbs) => {
    if(results.bindings.length===0){
        results.bindings[0] = {
            count: { value: "0"} , 
            lastChangeSet: {value: 'urn:hash:sha1:asjdjlkjlk'} 
        }
    } else {
        results.bindings[0].count.value = parseInt(results.bindings[0].count.value) + 1
    }
    cbs.ok("Update succeeded")
}
getNumber(queryCount, changesetInc)(id)(
    console.error,
    x => console.log('incremented', x)
)
getNumber(queryCount, changesetInc)(id)(
    console.error,
    x => console.log('incremented', x)
)
getNumber(queryCount, changesetInc)(id)(
    console.error,
    x => console.log('incremented', x)
)

var fails = 0
changesetReject = (cs, cbs) => {
   setTimeout(_=> {
       console.log("rejecting", cs)
       if(fails < 2){
           cbs.rejected("fail")
           fails++
       } else {
           cbs.ok("ok")
       }
   }, 200)
}

getNumber(queryCount, changesetReject)(id)(
    err => console.error("getNumber failed", err),
    n => console.log("number", n)
)
