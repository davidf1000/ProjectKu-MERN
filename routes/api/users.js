const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
// @route       POST api/users
// @desc        Register User
// @access      Public

router.post(
  '/',
  [check('name', 'Name is required').not().isEmpty(),
    check('email','Please Include Valid email !').isEmail(),
    check('password','Please enter pass with >6 character').isLength({min:6})
],
  (req, res) => {
      const errors=validationResult(req);
      if(!errors.isEmpty()){
        console.log(errors.array());
          return res.status(400).json({errors:errors.array()});
      }

    res.send('user route');
    console.log(req.body);
  }
);

module.exports = router;
