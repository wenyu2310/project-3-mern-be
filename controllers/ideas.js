const express = require('express')
const verifyToken = require('../middleware/verify-token')
const Idea = require('../models/idea')
const router = express.Router()

// CREATE - POST - /ideas
router.post('/', verifyToken, async (req,res) => {
    try{
        req.body.author =req.user._id;
        const idea =await Idea.create(req.body)
        idea._doc.author= req.user
        res.status(201).json(idea)
    } catch (err) {
        res.status(500).json({err: err.message })
    }
})

//GET /ideas
router.get("/", verifyToken, async (req, res) => {
    try {
        const ideas = await Idea.find({})
        .populate("author")
        .sort({ createAt:"desc"})
    res.status(200).json(ideas)
    } catch (err) {
        res.status(500).json({ err:err.message})
    }
  });

//GET /ideas/:ideaId
router.get("/:ideaId",verifyToken, async (req,res) =>{
    try {
        const idea = await Idea.findById(req.params.ideaId).populate([
            'author',
            'comments.author',
            'sentiments.author',
        ]);
        res.status(200).json(idea)
    } catch(err) {
        res.status(500).json({ err:err.message})
    }
})

//PUT /ideas/:ideaId
router.put("/:ideaId", verifyToken,async(req,res) =>{
    try{
        //Find the idea:
        const idea = await Idea.findById(req.params.ideaId);

        //Check permissions:
        if (!idea.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that")
        }
        // Update idea:
        const updatedIdea = await Idea.findByIdAndUpdate(
            req.params.ideaId,
            req.body,
            {new:true}
        )
        //Append req.user to the author property:
        updatedIdea._doc.author = req.user;

        //Issue JSON response:
        res.status(200).json(updatedIdea)
        } catch (err) {
            res.status(500).json({ err:err.message});
        }
    
})

//DELETE /ideas/:ideaId
router.delete("/:ideaId", verifyToken, async (req,res) =>{
    try{
        const idea = await Idea.findById(req.params.ideaId) 

        if (!idea.author.equals(req.user._id)){
            return res.status(403).send("You're not allowed to do that!")
        }
        const deletedIdea= await Idea.findByIdAndDelete(req.params.ideaId)
        res.status(200).json(deletedIdea)
        } catch (err) {
            res.status(500).json({err:err.message})
        }
})

//POST / ideas/:ideaId/comments
router.post("/:ideaId/comments", verifyToken, async(req, res) => {
    try {
        req.body.author =req.user._id
        const idea = await Idea.findById(req.params.ideaId)
        idea.comments.push(req.body);
        await idea.save()
        
        //Find the newly created comment:
        const newComment = idea.comments[idea.comments.length - 1]

        newComment._doc.author =req.user

        //Respond with the newComment:
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ err:err.message})
    }
})
  
//PUT /idea/:ideaId/comments/:commentId
router.put("/:ideaId/comments/:commentId", verifyToken, async (req,res)=>{
    
    try {
        const idea = await Idea.findById(req.params.ideaId);
        const comment = idea.comments.id(req.params.commentId);

        //ensures the current user is the author of the comment
        if (comment.author.toString() !== req.user._id){
            return res
            .status(403)
            .json({ message:"You are not authorised to edit this comment"})
        }

        comment.text = req.body.text;
        await idea.save();
        res.status(200).json({message:"Comment updated successfully"});
    } catch (err){
        res.status(500).json({err:err.message})
    }
})

//Delete /idea/:ideaId/comments/:commentId
router.delete("/:ideaId/comments/:commentId",verifyToken,async(req,res) =>{
    try {
        const idea = await Idea.findById(req.params.ideaId);
        const comment = await idea.comments.id(req.params.commentId)

        //ensure the current user is the author of the comment
        if(comment.author.toString() !== req.user._id) {
            return res
            .status(403)
            .json({message:"You are not authorised to delete this comment"})
        }

        idea.comments.remove({_id: req.params.commentId})
        await idea.save()
        res.status(200).json({message:"Comment deleted successfully"});
    } catch (err) {
        res.status(500).json({err:err.message})
    }
})

//POST / ideas/:ideaId/likes
// router.post("/:ideaId/likes", verifyToken, async(req, res) => {
//     try {
//         req.body.author =req.user._id
//         const idea = await Idea.findById(req.params.ideaId)
//         idea.likes.push(req.body);
//         await idea.save()
        
//         //Find the newly created comment:
//         const newLike = idea.likes[idea.likes.length - 1]

//         newLike._doc.author =req.user

//         //Respond with the newComment:
//         res.status(201).json(newLike);
//     } catch (err) {
//         res.status(500).json({ err:err.message})
//     }
// })

//POST Reaction
router.post("/:ideaId/reactions", verifyToken, async(req, res) => {
    try {
        req.body.author =req.user._id
        const idea = await Idea.findById(req.params.ideaId);//get idea

        if (!idea){
            return res.status(404).json({message: "Idea not found"});
        }

        const existingReaction = idea.reactions.find(({author}) => author.toString() === req.user._id.toString())

        if (existingReaction !== undefined){
            return res
            .status(403)
            .json({message: "You cannot post a Like/Dislike more than once, you can update your Like/Dislike instead"})
                }

        idea.reactions.push(req.body);
        await idea.save()
        
        //Find the newly created comment:
        const newReaction = idea.reactions[idea.reactions.length - 1]

        newReaction._doc.author =req.user

        //Respond with the newComment:
        res.status(201).json(newReaction);
    } catch (err) {
        res.status(500).json({ err:err.message})
    }
})
  
//Put /idea/:ideaId/likes/:likeId
// router.put("/:ideaId/likes/:likeId",verifyToken,async(req,res) => {
//     try {
//         const idea = await Idea.findById(req.params.ideaId);
//         const like = idea.likes.id(req.params.likeId);

//         //ensure the current user is the author of the like
//         if (like.author.toString() !== req.user._id){
//             return res
//             .status(403)
//             .json({message: "You are not authorised to make changes to this like"})
//         }

//         like.like = req.body.like
//         await idea.save()

//         res.status(200).json({ message:'Like/Dislike updated sucessfully'})
//     } catch(err) {
//         res.status(500).json({err:err.message})
//     }
// })

//Put /idea/:ideaId/reactions/:reactionId
router.put("/:ideaId/reactions/:reactionId",verifyToken,async(req,res) => {
    try {
        const idea = await Idea.findById(req.params.ideaId);
        const reaction = idea.reactions.id(req.params.reactionId);

        //ensure the current user is the author of the like
        if (reaction.author.toString() !== req.user._id){
            return res
            .status(403)
            .json({message: "You are not authorised to make changes to this Like/Dislike"})
        }

        reaction.type = req.body.type
        await idea.save()

        res.status(200).json({ message:'Like/Dislike updated sucessfully'})
    } catch(err) {
        res.status(500).json({err:err.message})
    }
})

//Delete/idea/:ideaId/likes/:likeId
// router.delete("/:ideaId/likes/:likeId", verifyToken,async(req,res) => {
//     try {
//         const idea = await Idea.findById(req.params.ideaId);
//         const like = idea.likes.id(req.params.likeId);

//         //ensure the current user is the author of the like
//         if (like.author.toString() !== req.user._id){
//             return res
//             .status(403)
//             .json({message: "You are not authorised to make changes to this like"})
//         }
        
//         idea.likes.remove({_id:req.params.likeId});
//         await idea.save();
//         res.status(200).json({ message:'Like/Dislike updated sucessfully'})
//     } catch(err) {
//         res.status(500).json({err:err.message})
//     }
// })

//Delete/idea/:ideaId/reactions/:reactionId
router.delete("/:ideaId/reactions/:reactionId", verifyToken,async(req,res) => {
    try {
        const idea = await Idea.findById(req.params.ideaId);
        const reaction = idea.reactions.id(req.params.reactionId);

        //ensure the current user is the author of the like
        if (reaction.author.toString() !== req.user._id){
            return res
            .status(403)
            .json({message: "You are not authorised to delete this Like/Dislike"})
        }
        
        idea.reactions.remove({_id:req.params.reactionId});
        await idea.save();
        res.status(200).json({ message:'Like/Dislike deleted sucessfully'})
    } catch(err) {
        res.status(500).json({err:err.message})
    }
})
module.exports = router

