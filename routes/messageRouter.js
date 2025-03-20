const express = require('express');
const { GetUsersForSidebar, GetMessages, SendMessage } = require('../controllers/messageController');
const { isUserAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/users',isUserAuthenticated,GetUsersForSidebar)
router.get("/:id",isUserAuthenticated,GetMessages)

router.post("/send/:id",isUserAuthenticated,SendMessage)
module.exports = router;