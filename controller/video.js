import Content from "../model/content.js";
import User from "../model/user.js";
  
const uploadVideo = async (req , res)=>{
    try {
      const image = req.files['image'] ? req.files['image'][0] : null;
      const video = req.files['video'] ? req.files['video'][0] : null;
  
      if (!image || !video) {
        return res.status(400).send('Both image and video must be uploaded together');
      }
      const creater = await User.findById(req.user.userid)
      const name=creater.username;
      const content = new Content({
        userId : req.user.userid,
        username: name,
        imageData: image.buffer,
        imageContentType: image.mimetype,
        videoData: video.buffer,
        videoContentType: video.mimetype,
        title: req.body.title,
        description: req.body.description
      })
      await content.save();
      await User.updateOne(
        { _id: req.user.userid },
        { $push: { myVideos : { $each: [content._id], $position: 0 } } }
      )
      res.status(201).send("Video Uploaded Successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
}
  
const allImages = async (req , res) => {
    try {
      const images = await Content.find();
      const imageDataUrls = images.map(image => ({
        id: image._id,
        createrName: image.username,
        title: image.title,
        imageDataUrl: `data:${image.imageContentType};base64,${image.imageData.toString('base64')}`,
        views: image.views
      }));
      res.status(200).json(imageDataUrls);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

const searchVideos = async (req , res) =>{
    try {
      const search = req.header("search")
      if(search)
      {
        const images = await Content.find();
        var response=[];
        for ( const element of images)
        {
          if(element.username === search || element.title === search)
          {
            const content = {
              id: element._id,
              createrName: element.username,
              title: element.title,
              imageDataUrl: `data:${element.imageContentType};base64,${element.imageData.toString('base64')}`,
              views: element.views
            }
            response.push(content);
          }
        }
        res.status(200).send(response);
      }
      else
      {
        allImages(req , res);
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  
const playVideo = async (req, res) => {
    try {
      const content = await Content.findById(req.params.id);
      if(!content)
      {
        return res.status(404);
      }
      const creator=await User.findById(content.userId)
      const video = {
        id: content._id,
        channelId: creator._id,
        username: content.username,
        title: content.title,
        description: content.description,
        videoData: `data:${content.videoContentType};base64,${content.videoData.toString('base64')}`,
        likes: content.likes,
        dislikes: content.dislikes,
        views: content.views-1,
        subscriber: creator.subscriber
      }
      res.status(200).json(video);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
}

const deleteVideo = async (req , res) => {
  try{
    await Content.findByIdAndDelete(req.params.id);
    await User.updateOne(
      { _id: req.user.userid },
      { $pull: { myVideos: req.params.id }}
  );
    res.send("Video Deleted Successfully").status(200);
  }
  catch(error)
  {
    console.log(error)
    res.send("Internal server error").status(500);
  }
}

const updateViews = async (req , res) =>{
  try
  {
    await Content.updateOne(
        { _id: req.body.videoId },
        { $inc: { views: 1 } }
    )
    res.status(200).send("Views updated");
  }
  catch (error)
  {
    console.log(error);
    res.send("Internal Server error").status(500);
  }
}

export { uploadVideo , allImages , searchVideos , playVideo , deleteVideo , updateViews }