const express = require('express');
const router = express.Router();
const myPageHandler = require('../handlers/myPage');

router.use(myPageHandler.index);
router.get('/:userID', myPageHandler.userID);
router.post('/:userID/edit', myPageHandler.userEdit)

module.exports = router;