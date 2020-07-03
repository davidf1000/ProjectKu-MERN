const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt= require('bcryptjs');
const config = require('config');

// @route     GET api/auth
// @desc       Authenticate user & get token 
// @access      PRivate

router.get('/', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error ! ');
    }
});
// @route     POST api/auth
// @desc       Login, get token
// @access      public

router.post(
    '/',
    [
      check('email', 'Please Include Valid email !').isEmail(),
      check('password', 'Password is required').exists()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() });
      }
      const {email, password } = req.body;
  
      try {
        // Check if user exist
        const found = await User.findOne({ email: email });
        if (!found) {
          res.status(400).json({ errors: [{ msg: 'User not found !' }] });
        }

        const isMatch = await bcrypt.compare(password,found.password);

        if(!isMatch){
          res.status(400).json({ errors: [{ msg: 'Password Invalid !' }] });

        }

        const payload = {
            'user': {
                'id': found.id
            }
        }
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn:360000},
            (err,token)=>{
                if(err) throw err;
                res.json({token});
            }
        );
  
      } catch (err) {
        console.error(err);
        res.status(500).send('server error !');
      }
    }
  );
module.exports = router;
