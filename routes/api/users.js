const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');
secretKey = config.jwtSecret;
const User = require('../../models/User');
// @route       POST api/users
// @desc        Register User
// @access      Public

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please Include Valid email !').isEmail(),
    check('password', 'Please enter pass with >6 character').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      // Check if user exist
      const found = await User.findOne({ email: email });
      if (found) {
        res.status(400).json({ errors: [{ msg: 'User already Exist !' }] });
      }
      // Avatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      // Encryption
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      //  JWT
      const user = new User({
        name: name,
        email: email,
        avatar: avatar,
        password: hashed
      });
      await user.save();

      const payload = {
          "user": {
              'id': user.id
          }
      }
      console.log(payload);
      jwt.sign(payload,secretKey,{expiresIn:360000},
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
