const Either = require('data.either')
const Task = require('data.task')
const xsdInt = 'http://www.w3.org/2001/XMLSchema#integer'
const countPredicate = 'app://vocab/count'

module.exports = (queryNode, changesetSparql) => id => 
function (reject, resolve){
    const applyChangeset = cs => new Task((reject, resolve) => changesetSparql(cs, {
        error: reject,
        success: d => resolve(Either.Right(d)),
        fail: d => resolve(Either.Left(d))
    }))
    const query = taskify(queryNode)
    const makeZeroCounter = _ => applyChangeset(createCounter(id)).map(changesetUri=>[0, changesetUri]) 
    const incNum = queryCounter(query, id)
    .chain(either(makeZeroCounter, Task.of))
    .chain(
        (tuple) => {
            const [count, lastChangeSet] = tuple
            return applyChangeset(incrementCount(id, count, lastChangeSet))
            .chain(either(_=>incNum, Task.of))
            .map(_=>count+1)
        }
    )

    incNum.fork(reject, resolve)
}

function queryCounter(query, id){
    return query(`SELECT ?count ?lastChangeSet WHERE {
        <${id}> <app://vocab/count> ?count .
        <${id}> <app://vocab/changeset-extension/schema#latestChangeSet> ?lastChangeSet .
    }`)
        .map(data => data.bindings.length? data.bindings[0] : null )
        .map(row => row? 
            Either.Right([parseInt(row.count.value), row.lastChangeSet.value]) 
            : Either.Left(id)
        )
}


const createCounter = id => ({
        reasonForChange: "Create Counter",
        date: new Date().toISOString(),
        add: [countTriple(id, 0)]
})
    

function countTriple(id, num){
    return {s: id, p: countPredicate, o_value: 0, o_type: 'literal', o_datatype: xsdInt }
}

const incrementCount = (id, count, lastChangeSet) => ({
    reasonForChange: "Increment Counter",
    previous: [lastChangeSet],
    date: new Date().toISOString(),
    remove: [countTriple(id, count)],
    add: [countTriple(id, count+1)]
})

function taskify(nodeF){
    return (...args) => new Task((reject, resolve)=>{
        nodeF(...args, function(err, data){
            err? reject(err) : resolve(data)
        })
    })
}

function either(left, right){
    return choice => choice.fold(left, right)
}
