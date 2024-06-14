import Content from "../model/content.js";
import User from "../model/user.js";
const likedVideo = async (req, res) => {
    try {
        if (req.body.like) {
            await User.updateOne(
                { _id: req.user.userid },
                { $push: { likedVideos: { $each: [req.body.videoId], $position: 0 } } }
            )
            await Content.updateOne(
                { _id: req.body.videoId },
                { $inc: { likes: 1 } }
            )
        }
        else {
            await User.updateOne(
                { _id: req.user.userid },
                { $pull: { likedVideos: req.body.videoId } }
            );
            await Content.updateOne(
                { _id: req.body.videoId },
                { $inc: { likes: -1 } }
            );
        }
        res.status(200).send("Like done");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

const dislikedVideo = async (req, res) => {
    try {
        if (req.body.dislike) {
            await User.updateOne(
                { _id: req.user.userid },
                { $push: { dislikedVideos: { $each: [req.body.videoId], $position: 0 } } }
            )
            await Content.updateOne(
                { _id: req.body.videoId },
                { $inc: { dislikes: 1 } }
            )
        }
        else {
            await User.updateOne(
                { _id: req.user.userid },
                { $pull: { dislikedVideos: req.body.videoId } }
            );
            await Content.updateOne(
                { _id: req.body.videoId },
                { $inc: { dislikes: -1 } }
            );
        }
        res.status(200).send("Dislike done");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

const likedOrNot = async (req, res) => {
    try {
        const creater = await User.findById(req.user.userid);
        if (!creater)
        {
            return res.status(401).send("Creator not found");
        }
        let present = creater.history.includes(req.params.id);
        if(present)
        {
            await User.updateOne(
                { _id: req.user.userid },
                { $pull: { history: req.params.id } }
            );
        }
        await User.updateOne(
            { _id: req.user.userid },
            { $push: { history : { $each: [req.params.id], $position: 0 } } }
        )
        let result = creater.likedVideos.includes(req.params.id);
        if (result) {
            return res.status(200).json({like:true , dislike:false});
        }
        result = creater.dislikedVideos.includes(req.params.id);
        if (result) {
            res.status(200).json({like:false , dislike:true});
        }
        else {
            res.status(200).json({like:false , dislike:false});
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}

const allLikedVideos = async (req, res) => 
{
    try
    {
        const creator = await User.findById(req.user.userid);
        var response=[];
        for ( const element of creator.likedVideos)
        {
            const data = await Content.findById(element);
            const content = {
                id : data._id,
                username : data.username,
                imageData : `data:${data.imageContentType};base64,${data.imageData.toString('base64')}`,
                imageContentType : data.imageContentType,
                videoData: `data:${data.videoContentType};base64,${data.videoData.toString('base64')}`,
                videoContentType : data.videoContentType,
                title : data.title,
                description: data.description
            }
            response.push(content)
        }
        res.status(200).send(response);
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const removeLikedVideos = async (req , res) => {
    try
    {
        await User.updateOne(
            { _id: req.user.userid },
            { $pull: { likedVideos: req.body.videoId } }
        );
        await Content.updateOne(
            { _id: req.body.videoId },
            { $inc: { likes: -1 } }
        );
        res.send("Removed Video Successfully").status(200);
    }
    catch(error)
    {
        console.log(error);
        res.send("Internal Server Error").status(500);
    }
}

export { likedVideo, dislikedVideo, likedOrNot , allLikedVideos , removeLikedVideos }