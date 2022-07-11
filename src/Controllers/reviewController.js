const mongoose  = require("mongoose");
const bookModel = require("../Models/bookModel.js")
const userModel = require("../Models/userModel.js")
const validator = require("../validator/validator.js")
const moment = require('moment')
const reviewModel = require("../Models/reviewModel.js")

const createReview = async function (req, res) {
   try {
      const content = req.body;
      if (Object.keys(content).length === 0) {
         // console.log(err.message)
         return res.status(400).send({ status: false, msg: "no content in the document" });
      }
      const bookId= req.params.bookId
      // const bodyBook= req.body.bookId
      if (!mongoose.Types.ObjectId.isValid(bookId)) { return res.status(400).send({ status: false, msg: "enter a valid id" }) }
      // if (!mongoose.Types.ObjectId.isValid(bodyBook)) { return res.status(400).send({ status: false, msg: "enter a valid id" }) }

      const book = await bookModel.findById(bookId);  
      if(!book || book.isDeleted === true){return res.status(404).send({status:false, msg: "no such book exists"})};

      // if(bookId !== bodyBook){
      //   return res.status(400).send({ status: false, msg: "bookId should be the same" })
      // }else{
     let rBy= req.body.reviewedBy;
     let rAt= req.body.reviewedAt;
     let rat= req.body.rating;
     let rev= req.body.review
         let v= {bookId: req.params.bookId ,reviewedBy: rBy,reviewedAt: rAt, rating: rat,review: rev}
        const savedData = await reviewModel.create(v);
        res.status(201).send({ status: true, data: savedData })
      
   } catch (error) {
      console.log(error)
      return res.status(500).send({ status: false, errorName: error.name, msg: error.message });
   }
}




let validateRating = (rating) => {
    var rate = /^[1-5]{1}$/;
    return rate.test(rating)}

let reviewedByValidator = function (reviewedBy) {
        let regx = /^[a-zA-z]+([\s][a-zA-Z\,]+)*$/;
        return regx.test(reviewedBy);
    }

    const updateReview = async function (req, res){
    try{

        let reviewID = req.params.reviewId
        
        let bookID = req.params.bookId
        
        let data = req.body

        let{ reviewedBy, rating, review} = data

        if(!bookID && !reviewID){return res.status(400).send({status: false, msg: "bookID or reviewID missing in params"})}

        if (Object.keys(data).length === 0) { return res.status(400).send({ status: false, msg: "cannot update empty body" }) };

        const book = await bookModel.findById(bookID);
        if (!book || book.isDeleted === true) { return res.status(404).send({ status: false, msg: "no such book exists" }) };

        const Review = await reviewModel.findById(reviewID);
        if (!Review || book.isDeleted === true) { return res.status(404).send({ status: false, msg: "no such review exists" }) };
        
        if (!reviewedByValidator(reviewedBy)) { return res.status(400).send({ status: false, message: "please enter reviewedBy correctly" }) }

        if (!validateRating(rating)) { return res.status(400).send({ status: false, message: "please enter rating correctly" }) }

        if (data.reviewedBy){
            data.reviewedBy = data.reviewedBy;
        }
        
        if (data.rating) {
        
            data.rating = data.rating;
        }
        
        if (data.review) {
        data.review = data.review
            }
            
        const update = await reviewModel.findByIdAndUpdate(reviewID, { $set: { ...data } }, { new: true });
        return res.status(200).send({ status: true, reviewData: update });

        


    }catch(error){
        return res.status(500).send({status:false, error: error.name, msg:error.msg})
    }
}

module.exports.createReview= createReview
module.exports.updateReview = updateReview


        