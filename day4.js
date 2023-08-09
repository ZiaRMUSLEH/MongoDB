//*********** Day 04 *************/

use("school");
db.grades.insertMany([
    {_id:6305, name: "A. MacDyver", "assignment":5, "points" :24},
    {_id:6308, name: "B. Batlock", "assignment":3, "points" :22},
    {_id:6312, name: "M. Tagnum", "assignment":5, "points" :30},
    {_id:6319, name: "R. Stiles", "assignment":2, "points" :12},
    {_id:6322, name: "A. MacDyver", "assignment":2, "points" :14},
    {_id:6334, name: "R. Stiles", "assignment":1, "points" :10}
    ]);

1//  Find the total number of points of documents whose names start with A
//since for there is nothing to group, _id is set to null
use("school");
var pipeline = [
    {$match:{"name":{$regex:"^A"}}}, //stage for filtering
    {$group:{"_id":null, "total_points":{$sum:"$points"}}} // stage for grouping 
]
db.grades.aggregate(pipeline);

2//Find the total number of points of documents whose names end with s

use("school");
var pipeline = [
    {$match:{"name":{$regex:"s$"}}}, //stage for filtering
    {$group:{"_id":null, "total_points":{$sum:"$points"}}} // stage for grouping 
]
db.grades.aggregate(pipeline);

3// Find the number of documents with a points less than 19

//1st way
use("school");
db.grades.find({"points":{$lt:19}}).count();

//2nd way
use("school");
db.grades.count({"points":{$lt:19}}); //depricated

//3rd way; with aggretage and $count
use("school");
var pipeline = [
    {$match:{"points":{$lt:19}}}, //stage filtering
    {$count:"points"}  //stage counting 
]
db.grades.aggregate(pipeline);

//How to add temprory fileds(fields for display)while reporting

use("school")
db.exams.insertMany(
[{"author":"dave","score":80,"views":100},
{"author":"dave","score":85,"views":521},
{"author":"ahn","score":60,"views":1000},
{"author":"li","score":55,"views":5000},
{"author":"annT","score":60,"views":50},
{"author":"li","score":94,"views":999},
{"author":"ty","score":95,"views":1000},]);


use("school")
db.accounting.insertMany(
[{"name":"dave","expense":[-80, -40, -50, -120], "earn":[100, 150]},
{"name":"dave","expense":[-60, -30, -20], "earn":[200, 50, 130]},
{"name":"ahn","expense":[-80, -40, -50], "earn":[300, 450]},
{"name":"li","expense":[-80, -120], "earn":[500, 50, 70, 10]},
{"name":"annT","expense":[-140, -50, -120], "earn":[400]},
{"name":"li","expense":[-120], "earn":[22, 375, 65]},
{"name":"ty","expense":[-180, -40, -70, -12], "earn":[500, 650, 400]}]);


4.1//--> Find the exact total expense, total earn 

use("school");
var pipeline = [
    {$addFields:{"totalExpense": {$sum:"$expense"}, 
                "totalEarn": {$sum:"$earn"},
                
                }}
]
db.accounting.aggregate(pipeline);

4.2//--> Find the exact total cost, total earn and exact balance 
//values ​​in the document

use("school");
var pipeline = [
    {$addFields:{"totalExpense": {$sum:"$expense"}, 
                "totalEarn": {$sum:"$earn"},
                }}, //stage to create totalExpense and  totalEarn
    {$addFields:{"balance" :{$add:["$totalExpense", "$totalEarn"]}}
    } //stage to use fields that are created in prev.stage
]
db.accounting.aggregate(pipeline);

4.3//--> Find the exact total cost, total earn and exact balance 
//values ​​in the document and sort decreasing order according balance

use("school");
var pipeline = [
    {$addFields:{"totalExpense": {$sum:"$expense"}, 
                "totalEarn": {$sum:"$earn"},
                }}, //stage to create totalExpense and  totalEarn
    {$addFields:{"balance" :{$add:["$totalExpense", "$totalEarn"]}}
    }, //stage to use fields that are created in prev.stage
    {$sort:{"balance":-1}} //stage for stage
]
db.accounting.aggregate(pipeline);

4.4//--> Find the exact total cost, total earn and exact balance 
//values ​​in the document and sort decreasing order according balance.
//display fields of name, totalExpense, totalEarn, balance

use("school");
var pipeline = [
    {$addFields:{"totalExpense": {$sum:"$expense"}, 
                "totalEarn": {$sum:"$earn"},
                }}, //stage to create totalExpense and  totalEarn
    {$addFields:{"balance" :{$add:["$totalExpense", "$totalEarn"]}}
    }, //stage to use fields that are created in prev.stage
    {$sort:{"balance":-1}}, //stage for sorting
    {$project:{"_id":0, "expense":0, "earn":0}} //stage for projecting

]
db.accounting.aggregate(pipeline);

//OR

use("school");
var pipeline = [
    {$addFields:{"totalExpense": {$sum:"$expense"}, 
                "totalEarn": {$sum:"$earn"},
                }}, //stage to create totalExpense and  totalEarn
    {$addFields:{"balance" :{$add:["$totalExpense", "$totalEarn"]}}
    }, //stage to use fields that are created in prev.stage
    {$sort:{"balance":-1}}, //stage for sorting
    {$project:{"_id":0, "name":1, "totalExpense":1, "totalEarn":1, "balance":1}}

]
db.accounting.aggregate(pipeline);

//========================================
//          bulkWrite()
//========================================
//bulkWrite() method provides the ability to perform bulk insert,
// update, and delete operations at once. bulkWrite([])

use("school")
db.stories.insertMany(
[{"author":"dave", "score":75, "views": 200},
{"author":"chris", "score":90, "views": 100},
{"author":"dave", "score":35, "views": 3000},
{"author":"mary", "score":80, "views": 350},
{"author":"dave", "score":54, "views": 333},
{"author":"mary", "score":97, "views": 2000}]);

5//Run following commands in one method
//    * Insert {"author":"mark","score":55, "views":555} ,
//    * update first document's score to 55 where author is "dave",        
//    * replace first document to {"author":"chris tien","score":55} where author is "chris"
//    * delete first document where author is mary

use("school");
db.stories.bulkWrite([

    {insertOne:{"document":{"author":"mark","score":55, "views":555}}},
    {updateOne:{"filter":{"author":"dave"}, "update":{$set:{"score":55}}}},
    {replaceOne:{"filter":{"author":"chris"}, "replacement":{"author":"chris tien","score":55}}},
    {deleteOne:{"filter":{"author":"mary"}}}

]);

db.stories.insertOne()

//=========================================================
//                  UNIONWITH ( Full Join )
//=========================================================
// how to get data from two different collections
// JOIN is used in SQL 
//=========================================================    

use("MEDYA")
db.fictions.insertMany(
[{"author": "Mehmet Bak",  "price" : 60, "publisher" : "Yildiz",   "amount": 1000 },//60000
{"author" : "Ali Gel",     "price" : 75, "publisher" : "MaviAy",   "amount": 1200 },
{"author" : "Su Ak",       "price" : 90, "publisher" : "Caliskan", "amount": 2200},
{"author" : "Meryem Can",  "price" : 35, "publisher" : "MorEv",    "amount": 560},
{"author" : "Pelin Su",    "price" : 80, "publisher" : "Hedef",    "amount": 890 },
{"author" : "Suat Ok",     "price" : 54, "publisher" : "Sinir",    "amount": 245}]);



use("MEDYA")
db.attempts.insertMany(
[{"author": "Mehmet Bak",  "price" : 34, "publisher" : "Yildiz", "amount": 400 },//13600
{"author" : "Deniz Kos",   "price" : 44, "publisher" : "Yildiz", "amount": 350 },//15400
{"author" : "Su Ak",       "price" : 50, "publisher" : "MorEv", "amount": 200},
{"author" : "İsmet Kaç",   "price" : 25, "publisher" : "Hedef","amount": 800},
{"author" : "Ali Gel",     "price" : 40, "publisher" : "Hedef", "amount": 1200 },
{"author" : "Meryem Can",  "price" : 22, "publisher" : "MaviAy","amount": 300}]);


6//:list all the documents from both collections and sort in desc order on "amount" field
// do not display id field

use("MEDYA");

var pipeline = [
    {$unionWith:{coll:"attempts"}}, //stage for joining
    {$sort:{"amount":-1}},
    {$project:{"_id":0}}
]

db.fictions.aggregate(pipeline);

7// write a query which will display total books (in ascending order) of each 
//publishers from both collections. 
use("MEDYA");

var pipeline = [
    {$unionWith:{coll:"attempts"}}, //stage for joining
    {$group:{"_id":"$publisher", "total_books":{$sum:"$amount"}}},
    {$sort:{"total_books":1}},
   // {$project:{"_id":0, "author":1, "publishler":1,  "total_books":1}}
]

db.fictions.aggregate(pipeline);