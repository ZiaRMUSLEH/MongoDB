// ******** DAY 03**********

use ("products");

// let 's bring all out documents
use ("products");
db.electronics.find();
 
1// find document where price is 200 and update document 
//by adding "brand" field "Samsung"

use ("products");
db.electronics.findOneAndUpdate({"price":{$eq:200}},
                                {$set:{"brand":"Samsung"}},
                                )

//to see updated document result

use ("products");
db.electronics.findOneAndUpdate({"price":{$eq:200}},
                                {$set:{"tax":50}},
                                {returnNewDocument: true}
                                )

2// find document where name is "Vacuum Cleaner", 
//and update price to 150

use ("products");
db.electronics.findOneAndUpdate({"name":"Vacuum Cleaner"},
                                {$set:{"price":150}},
                                {returnNewDocument:true, upsert:true})

// upsert = update + insert--> if there is a document it udpates,
// if there is no document then insert

3// find documents where price is less than 100 and 
//update price by multiplying by 2

// updateMany -- to update multiple documents at once 

use ("products");
db.electronics.updateMany({"price":{$lt:100}},
                          {$mul:{"price":2}}
                          )

// we can use update() method which depricated
//to update multiple docuements at once we need to set multi:true
//otherwise it will update first match 

4// find documents where price is greater that 500,
// and add field : "condition": "new"

use ("products");
db.electronics.update({"price":{$gt:500}}, 
                    {$set:{"condition":"new"}}, 
                    {multi:true})



//*************** DELETE DOCUMENT **************** 

5// find and delete "Vacuum Cleaner"
use ("products");
db.electronics.deleteOne({"name":"Vacuum Cleaner"})

6// find documents where price is less than 200 and delete them

use ("products");
db.electronics.deleteMany({"price":{$lt:200}})

7//to delete all documents at once 
use ("products");
db.electronics.deleteMany({})

use ("products");
db.electronics.remove({}) //remove() depricated

8// insert new doucments  name :"laptop" specs:{name :"macbookAri" ,model :2022} and 
// city ["texas","new york"}, instcok:true

use ("products");
db.electronics.insertOne({"name": "laptop", 
                            "brand": "apple", 
                            "specs": {"weight": 2, "color": "gray", "display": 13},
                            "city": ["new york", "LA"],
                            "inStock": true
                        });


9// find document which color is gray
9// a find document which city is new york
use ("products");
db.electronics.find({"specs.color":"gray"})

use ("products");
db.electronics.find({"city":"new york"})


//=================================================
//                   AGGREGATION
//=================================================
// 1) aggregation, processing of data in documents and calculate
// results.
//
// 2) The aggregation operation can group values from different documents.
//
// 3) By performing various operations on this grouped data, a unique
// result value can be returned.
//
// 4) MongoDB allows aggregation with 3 different methods.
// a) Aggregation pipeline --> best practice...
// b) map reduction function (map reduction)
// c) Single purpose 
//
// 5) Aggregation can be compared to the Join operation in SQL.
//================================================ ==== =
//                  Aggregation pipeline
//================================================ ==== =

//An aggregation pipeline consists of one or more stages that process documents:
// Syntax
//
// pipeline = [
// { $match : { … },
// { $group : { … },
// {$sort : {…},
//...
//]
// db.collectionName.aggregate({pipeline}, {options})
//
// $match() -> to filter data when selecting
// $group({_id : "$field"}) - >To group processed data 
//a group specification must include an _id
// $sort() -> to sort the results


use("school");
db.grades.insertMany([
    {_id:6305, name: "A. MacDyver", "assignment":5, "points" :24},
    {_id:6308, name: "B. Batlock", "assignment":3, "points" :22},
    {_id:6312, name: "M. Tagnum", "assignment":5, "points" :30},
    {_id:6319, name: "R. Stiles", "assignment":2, "points" :12},
    {_id:6322, name: "A. MacDyver", "assignment":2, "points" :14},
    {_id:6334, name: "R. Stiles", "assignment":1, "points" :10}
    ]);


10// Find the total points of each  assignment

use("school");
//pipeline variable created
var pipeline = [
    {$match:{}},
    {$group: {"_id":"$assignment", 
               total_points:{$sum:"$points" } 
            }}
]

db.grades.aggregate(pipeline)

//without using variable
use("school");
db.grades.aggregate([
    {$match:{}}, //to filter (for this task no filter)
    {$group: {"_id":"$assignment", //grouped values of assigment field
               total_points:{$sum:"$points" } //summed values of points
            }}
])

/*
Stages: Each stage starts from stage operators which are:

$match: It is used for filtering the documents can reduce the amount of documents that are given as input to the next stage.
$project: It is used to select some specific fields from a collection.
$group: It is used to group documents based on some value.
$sort: It is used to sort the document that is rearranging them
$skip: It is used to skip n number of documents and passes the remaining documents
$limit: It is used to pass first n number of documents thus limiting them.
$out: It is used to write resulting documents to a new collection
Expressions: It refers to the name of the field in input documents for e.g. { $group : { _id : “$assigmnet“, total_points:{$sum:”$points“}}} here $id and $points are expressions.

Accumulators: These are basically used in the group stage

sum: It sums numeric values for the documents in each group
count: It counts total numbers of documents
avg: It calculates the average of all given values from all documents
min: It gets the minimum value from all the documents
max: It gets the maximum value from all the documents
first: It gets the first document from the grouping
last: It gets the last document from the grouping
*/

11// Find average points of each  assignment
use("school");
var pipeline = [
    {$group:{"_id": "$assignment", "avr_points":{$avg:"$points"}}}
]
db.grades.aggregate(pipeline)

12// Find min points of each  assignment
use("school")
var pipeline = [
    {$group: {"_id": "$assignment", "min_points": {$min: "$points"}}}
]
db.grades.aggregate(pipeline);

13// Find the average number of points where assignment is less than 4
use("school");
var pipeline = [
    {$match: {"assignment":{$lt:4}}}, //filtered 
    {$group:{"_id":"$assignment", avg_points:{$avg:"$points"}}}
]
db.grades.aggregate(pipeline)
