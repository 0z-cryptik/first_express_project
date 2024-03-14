const router = require('express').Router()
const homeController = require('../controllers/homeController')

router.get('/', homeController.create)
router.get('/chat', homeController.chatView)

module.exports = router