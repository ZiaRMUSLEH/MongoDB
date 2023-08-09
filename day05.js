//********** DAY 05 ********* */
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

1// write a query which will calculate total revenue (from fiction and attempts) 
//of each publisher

use("MEDYA");
var pipeline = [
    {$unionWith:{coll:"attempts"}},
    {$group:{"_id":"$publisher", "total_income":{$sum:{$multiply:["$amount", "$price"]}} }}

]
db.fictions.aggregate(pipeline)

//==================================================================================
//                       $LOOKUP (LEFT JOIN in SQL) 
//    //returns unshared documents of first collection and shared documents 
    // with other joined collection  
//    {
//      $lookup:
//      {
//        from: <collection to join>,
//        localField: <field from the input documents>,
//        foreignField: <field from the documents of the "from" collection>,
//        as: <output array field>
//      },
//      { $unwind:<field path> }//passes field from first stage to next stage
//    }
//==================================================================================


use("MEDYA")
db.fictions.insertMany(
[{"author": "Mehmet Bak",  "price" : 60, "publisher" : "Yildiz",   "amount": 1000 },//60000
{"author" : "Ali Gel",     "price" : 75, "publisher" : "MaviAy",   "amount": 1200 },
{"author" : "Su Ak",       "price" : 90, "publisher" : "Caliskan", "amount": 2200},
{"author" : "Meryem Can",  "price" : 35, "publisher" : "MorEv",    "amount": 560},
{"author" : "Pelin Su",    "price" : 80, "publisher" : "Hedef",    "amount": 890 },
{"author" : "Suat Ok",     "price" : 54, "publisher" : "Sinir",    "amount": 245}]);

use("MEDYA")
db.poems.insertMany(
[{"writer": "Mehmet Bak",   "price" : 34, "publisher" : "Yildiz", "amount": 400 },
{"writer" : "Ali Gel",      "price" : 40, "publisher" : "Hedef",  "amount": 1200 },
{"writer" : "Su Ak",        "price" : 50, "publisher" : "MorEv",  "amount": 200},
{"writer" : "Meryem Can",   "price" : 22, "publisher" : "MaviAy", "amount": 300},
{"writer" : "Deniz Kos",    "price" : 44, "publisher" : "Yildiz", "amount": 350 },
{"writer" : "İsmet Kaç",    "price" : 25, "publisher" : "Hedef",  "amount": 800}]);



//********** how to use lookup ******** */

use("MEDYA");
db.fictions.aggregate(

    {$lookup:{
        from: "poems",
        localField: "author",
        foreignField: "writer",
        as: "common_authors"
    }}

)

2//write a query that will calculate total books and total 
// prices for fictions collection and common author from poems collection, 

use("MEDYA");
var pipeline = [
    {$lookup:{
        from: "poems",
        localField: "author",
        foreignField: "writer",
        as: "common_authors"
    }}, //stage for lookup -for left joining

    {$unwind:{path:"$common_authors"}}, //stage to pass new field to next stage

    {$addFields:{
        "total_books":{$add:["$amount", "$common_authors.amount"]},
        "tatal_price":{$add:["$price", "$common_authors.price"]}
    }}, // stage to calculate total price & books
    {$project:{"_id":0}}
]
db.fictions.aggregate(pipeline);