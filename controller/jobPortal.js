import User from "../model/user.js";
import { Job , Application } from "../model/job.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname , "../countryCode.json") , "utf-8"));

const getAvailableJobs = async (req , res) => {
    try
    {
        let filters = req.header('filters');
        const search = req.header('search');
        if(filters)
        {
            filters = JSON.parse(filters);
        }
        const user = await User.findById(req.user.userid);
        let filter = {};
        filters && filters.title ? filter.title = filters.title : null;
        filters && filters.jobType ? filter.jobType = filters.jobType : null;
        filters && filters.salary ? filter.salary = { $gte : filters.salary } : null;
        filters && filters.experience ? filter.experience = { $lte : filters.experience } : null;
        filters && filters.workMode ? filter.workMode = filters.workMode : null;
        filters && filters.location ? filter.location = filters.location : null;
        const jobs = await Job.find(filter);
        const response=[];
        for (const element of jobs)
        {
            if(!user.jobsApplied.includes(element._id) && !user.jobsPosted.includes(element._id) && (!search || (element.user===search || element.title===search || !element.location || element.location===search)))
            {
                response.push(element);
            }
        }
        res.status(200).send(response);
    }
    catch (error)
    {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}

const getAppliedJobs = async (req , res) => {
    try
    {
        let filters = req.header('filters');
        const search = req.header('search');
        if(filters)
        {
            filters = JSON.parse(filters);
        }
        const user = await User.findById(req.user.userid);
        let filter = {}
        filters && filters.title ? filter.title = filters.title : null;
        filters && filters.jobType ? filter.jobType = filters.jobType : null;
        filters && filters.salary ? filter.salary = { $gte : filters.salary } : null;
        filters && filters.experience ? filter.experience = { $lte : filters.experience } : null;
        filters && filters.workMode ? filter.workMode = filters.workMode : null;
        filters && filters.location ? filter.location = filters.location : null;
        const jobs = await Job.find(filter);
        const response=[];
        for (const element of jobs)
        {
            if(user.jobsApplied.includes(element._id) && (!search || (element.user===search || element.title===search || !element.location || element.location===search)))
            {
                response.push(element);
            }
        }
        res.status(200).send(response);
    }
    catch (error)
    {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}

const getPostedJobs = async (req , res) => {
    try
    {
        let filters = req.header('filters');
        const search = req.header('search');
        if(filters)
        {
            filters = JSON.parse(filters);
        }
        const user = await User.findById(req.user.userid);
        let filter = {}
        filters && filters.title ? filter.title = filters.title : null;
        filters && filters.jobType ? filter.jobType = filters.jobType : null;
        filters && filters.salary ? filter.salary = { $gte : filters.salary } : null;
        filters && filters.experience ? filter.experience = { $lte : filters.experience } : null;
        filters && filters.workMode ? filter.workMode = filters.workMode : null;
        filters && filters.location ? filter.location = filters.location : null;
        const jobs = await Job.find(filter);
        const response=[];
        for (const element of jobs)
        {
            if(user.jobsPosted.includes(element._id) && (!search || (element.user===search || element.title===search || !element.location || element.location===search)))
            {
                const data = {
                    _id: element._id,
                    user: element.user,
                    title: element.title,
                    description: element.description,
                    skills: element.skills,
                    jobType: element.jobType,
                    salary: element.salary,
                    experience: element.experience,
                    workMode: element.workMode,
                    location: element.location,
                    email: element.email,
                    applications: []
                }
                for(let item of element.applications)
                {
                    const app = {
                        id : item._id,
                        name : item.name,
                        age : item.age,
                        address : item.address,
                        email : item.email,
                        phoneNumber : item.phoneNumber,
                        country : item.country,
                        resume : `data:application/pdf;base64,${item.resume.toString('base64')}`
                    }
                    data.applications.push(app);
                }
                response.push(data);
            }
        }
        res.status(200).send(response);
    }
    catch (error)
    {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}

const postJob = async (req , res) => {
    try
    {
        const creator = await User.findById(req.user.userid);
        const job = await Job({
            user : creator.username,
            title : req.body.title,
            description : req.body.description,
            skills : req.body.description,
            jobType : req.body.jobType,
            salary : req.body.salary,
            experience : req.body.experience,
            workMode : req.body.workMode,
            location : req.body.location,
            email : req.body.email
        })
        await job.save();
        creator.jobsPosted.push(job._id);
        await creator.save();
        res.status(200).send("Job Posted Successfully");
    }
    catch (error)
    {
        console.log(error);
        res.status(500).send("Internal server problem");
    }
}

const applyJob = async (req , res) => {
    try {
        const resume = req.files["resume"] ? req.files["resume"][0] : null;
        if(!resume)
        {
            res.status(403).send("Please send the resume");
        }

        const post = await Job.findById(req.body.jobId);
        for (const element of post.applications)
        {
            if(element.email === req.body.email)
            {
                res.status(300).send("An application already exists from this email");
                return ;
            }
            if(element.countryCode === req.body.countryCode && element.number === req.body.number)
            {
                res.status(300).send("This phone number already exists");
                return ;
            }
        }
        const number = '+' + data[req.body.country] + ' ' + req.body.number.toString();
        const application = new Application({
            name: req.body.name,
            age: req.body.age,
            address: req.body.address,
            country: req.body.country,
            phoneNumber: number,
            email: req.body.email,
            resume: resume.buffer
        })
        await Job.updateOne(
            { _id: req.body.jobId },
            { $push: { applications: { $each: [application] } } }
        )
        await User.updateOne(
            { _id: req.user.userid },
            { $push: { jobsApplied: { $each: [req.body.jobId] } } }
        )
        res.status(200).send("Job Applied");
    }
    catch (error)
    {
        console.log(error)
        res.status(500).send("Internal server error");
    }
}

const deletePostedJob = async (req , res) => {
    try
    {
      await Job.findByIdAndDelete(req.params.id);
      await User.updateOne(
        { _id: req.user.userid },
        { $pull: { jobsPosted: req.params.id }}
    );
      res.send("Post Deleted Successfully").status(200);
    }
    catch(error)
    {
      console.log(error)
      res.send("Internal server error").status(500);
    }
}

const deleteAppliedJob = async (req , res) => {
    try
    {
      await User.updateOne(
        { _id: req.user.userid },
        { $pull: { jobsApplied: req.params.id }}
    );
      res.send("Post Deleted Successfully").status(200);
    }
    catch(error)
    {
      console.log(error)
      res.send("Internal server error").status(500);
    }
}

const removeApplication = async (req , res) => {
    try
    {
        await Job.updateOne(
            { _id: req.body.jobId },
            { $pull: { applications: { _id: req.body.id } } }
        );
        res.send("Applicant Rejected Successfully").status(200);
    }
    catch (error)
    {
        console.error('Error removing application:', error);
        res.status(500).send("Internal Server Error");
    }
};

export { getAvailableJobs , postJob , applyJob , getAppliedJobs , getPostedJobs , deletePostedJob , deleteAppliedJob , removeApplication }