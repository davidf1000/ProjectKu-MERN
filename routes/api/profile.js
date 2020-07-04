const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const request= require('request');
const config = require('config');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route     GET api/profile/me
// @desc       get current users profile
// @access      Private (need middleware auth)

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error ! ');
  }
});
// @route       POST api/profile
// @desc       Create or update user profile
// @access      Private (need middleware auth)
router.post(
  '/',
  [
    auth,
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'skills is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    //Build social objcet
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        found = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(found);
      }
      // Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error ! ');
    }
  }
);

// @route       GET api/profile
// @desc       get all profiles 
// @access      public

router.get('/',async(req,res)=>{
  try{
    const profiles = await Profile.find().populate('user',['name','avatar']);
    res.json(profiles);
  }
  catch(err)
  {
    console.error(err.message);
    res.status(500).send('Server Error !');
  }
});

// @route       GET api/profile/user/:user_id
// @desc       get profiles by user_id 
// @access      public

router.get('/user/:user_id',async(req,res)=>{
  try{
    const profiles = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
    if(!profiles){
      return res.status(400).json({msg:"no profile for this user !"});
    }
    res.json(profiles);
  } 
  catch(err)
  {
    console.error(err.message);
    console.log(err.kind);

    if(err.kind==='ObjectId'){
      return res.status(400).json({msg:"no profile for this user !"});
    }
    res.status(500).send('Server Error !');
  }
});


// @route       DELETE api/profile/
// @desc        Delete profile, user & Posts
// @access      Private

router.delete('/',auth,async(req,res)=>{
  try{
    //Remove profile
    await Profile.findOneAndRemove({user:req.user.id});
    // Remove user 
    await User.findOneAndRemove({_id:req.user.id});

    res.json({msg:'User Deleted!'});
  } 
  catch(err)
  {
    console.error(err.message);
    res.status(500).send('Server Error !');
  }
});

// @route       PUT api/profile/
// @desc        Add Profile Experience 
// @access      Private

router.put('/experience',[auth,
  check('title','title is required').not().isEmpty(),
  check('company','Company is required').not().isEmpty(),
  check('from','from date is required').not().isEmpty(),
], async (req,res)=>{
  const errors= validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp= {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }
  try{
    const profile = await Profile.findOne({user:req.user.id});
    profile.experience.unshift(newExp);
    await profile.save();
    res.json(profile);
  } catch(err)
  {
    console.error(err.message);
    res.status(500).send('Server Error !');
  }
})

// @route       Delete api/profile/experience/exp_id
// @desc        Delete Profile Experience 
// @access      Private

router.delete('/experience/:exp_id',auth,async (req,res)=>{
  try{
    const profile = await Profile.findOne({user:req.user.id});

    //Get remove index
    const removeIndex= profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
    if(removeIndex===-1)
    {
    return res.status(400).send("No Experience Detected");
    }
    profile.experience.splice(removeIndex,1);

    await profile.save();
    res.json(profile);
  } catch(err)
  {
    console.error(err.message);
    res.status(500).send("Server Error !");
    
  }
});


// @route       PUT api/profile/
// @desc        Add Profile Education 
// @access      Private

router.put('/education',[auth,
  check('school','school is required').not().isEmpty(),
  check('degree','degree is required').not().isEmpty(),
  check('from','from date is required').not().isEmpty(),
  check('fieldofstudy','field of study date is required').not().isEmpty()
], async (req,res)=>{
  const errors= validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;

  const newEdu= {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }
  try{
    const profile = await Profile.findOne({user:req.user.id});
    profile.education.unshift(newEdu);
    await profile.save();
    res.json(profile);
  } catch(err)
  {
    console.error(err.message);
    res.status(500).send('Server Error !');
  }
})

// @route       Delete api/profile/education/exp_id
// @desc        Delete education 
// @access      Private

router.delete('/education/:edu_id',auth,async (req,res)=>{
  try{
    const profile = await Profile.findOne({user:req.user.id});

    //Get remove index
    const removeIndex= profile.education.map(item=>item.id).indexOf(req.params.edu_id);
    if(removeIndex===-1)
    {
    return res.status(400).send("No Education Detected");

    }
    profile.education.splice(removeIndex,1);

    await profile.save();
    res.json(profile);
  } catch(err)
  {
    console.error(err.message);
    res.status(500).send("Server Error !");
    
  }
});

// @route       GET api/profile/github/:username
// @desc        Get user repos from Github
// @access      Public

router.get('/github/:username',async (req,res)=>{
  try{
    //${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}
    const options ={
      uri :`https://api/github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get("githubClientId")}&client_secret=${config.get('githubSecret')}`,
      method:'GET',
      headers:{'user-agent':'node.js'}
    }
    console.log(options.uri);
    request(options,(error,response,body)=>{
      console.log(response);
      if(response.statusCode!=200){
        res.status(404).json({msg: 'Github prof not found'});
      }
      console.log(body);
      res.json(JSON.parse(body));
    })
  } catch(err){
    console.error(err.message);
    res.status(500).send('Server Error !');
    
  }
})


module.exports = router;
