import Content from "../model/content.js";
import User from "../model/user.js";

const myVideos = async (req , res) => {
    try
    {
        const creator = await User.findById(req.user.userid);
        var response = {
            username : creator.username,
            date : creator.createdOn.getUTCDate(),
            month : creator.createdOn.toLocaleString('default', { month: 'long' }),
            year : creator.createdOn.getUTCFullYear(),
            subscriber : creator.subscriber,
            description : creator.description,
            videos : []
        }
        for ( const element of creator.myVideos)
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
                description: data.description,
                views: data.views
            }
            response.videos.push(content)
        }
        res.status(200).send(response);
    }
    catch (error)
    {
        console.log(error);
        res.status(500).send("Internal Server error");
    }
}

const updateProfile = async (req , res) => {
    try
    {
        const id = req.user.userid;
        await User.findByIdAndUpdate(id , req.body);
        res.status(200).send("Description Updated Successfully");
    }
    catch (error)
    {
        console.log(error);
        res.status(500).send("Internal Server error");
    }
}

const watchLater = async (req, res) => 
{
    try
    {
        const creator = await User.findById(req.user.userid);
        var response=[];
        for ( const element of creator.watchLater)
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

const history = async (req, res) => 
{
    try
    {
        const creator = await User.findById(req.user.userid);
        var response=[];
        for ( const element of creator.history)
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

const checkSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user.userid);
        if (!user) {
            return res.status(401).send("Creator not found");
        }
        let result = user.subscribedChannels.includes(req.params.id);
        res.send(result).status(200);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}

const updateSubscription = async (req , res) =>{
    try
    {
        if(req.body.channelId===null || req.body.val===null)
        {
        res.send("Please send data carefully").status(400);
        }
        else if(req.body.val===true)
        {
            await User.updateOne(
                { _id: req.user.userid },
                { $push: { subscribedChannels: { $each: [req.body.channelId], $position: 0 } } }
            )
            await User.updateOne(
                { _id: req.body.channelId },
                { $inc: { subscriber: 1 } }
            );
            res.send("Subscription Added").status(200);
        }
        else
        {
            await User.updateOne(
                { _id: req.user.userid },
                { $pull: { subscribedChannels : req.body.channelId } }
            );
            await User.updateOne(
                { _id: req.body.channelId },
                { $inc: { subscriber: -1 } }
            );
            res.send("Subscription Removed").status(200);
        }
    }
    catch (error)
    {
        console.log(error);
        res.send("Internal Server Error").status(500);
    }
}

const checkWatchLater = async (req, res) => {
    try {
        const user = await User.findById(req.user.userid);
        if (!user) {
            return res.status(401).send("Creator not found");
        }
        let result = user.watchLater.includes(req.params.id);
        res.send(result).status(200);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}

const manageWatchLater = async (req , res) =>{
    try
    {
        const action = req.header("action")
        if(action)
        {
            await User.updateOne(
            { _id: req.user.userid },
            { $push: { watchLater: { $each: [req.body.videoId], $position: 0 } } }
            )
            res.send("Added to Watch Later").status(200);
        }
        else
        {
            await User.updateOne(
            { _id: req.user.userid },
            { $pull: { watchLater: req.body.videoId } }
            )
            res.send("Removed from Watch Later").status(200);
        }
    }
    catch(error)
    {
        console.log(error);
        res.send("Internal Server Error").status(500);
    }
}

const getSubscribedChannels = async (req , res) =>{
    try
    {
        const user=await User.findById(req.user.userid);
        if(!user)
        {
            res.status(400).send("Please Log In first");
        }
        let response=[];
        for ( const element of user.subscribedChannels)
        {
        const data = await User.findById(element);
        response.push(data.username);
        }
        res.status(200).send(response);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

const removeHistory = async (req , res) => {
    try
    {
        await User.updateOne(
        { _id: req.user.userid },
        { $pull: { history: req.body.videoId } })
        res.send("removed video from watch history successfully").status(200);
    }
    catch(error)
    {
        console.log(error);
        res.send("Internal Server Error").status(500);
    }
}

export { myVideos , updateProfile , watchLater , history , checkSubscription , updateSubscription , manageWatchLater , checkWatchLater , getSubscribedChannels , removeHistory };