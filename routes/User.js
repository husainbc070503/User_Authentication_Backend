const User = require('../models/User');
const router = require('express').Router();

router.post('/register', async (req, res) => {
    const { name, email, password, avatar, phone, address, skills } = req.body;

    try {
        if (!name || !email || !password || !phone || !address || !avatar)
            return res.status(400).json({ success: false, message: "Please fill all the required fields" });

        var user = await User.findOne({ email });
        if (user)
            return res.status(400).json({ success: false, message: "User already exists!!" });

        user = await User.create({ name, email, password, avatar, phone, address, skills });
        res.status(200).json({ success: true, user });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password)
            return res.status(400).json({ success: false, message: "Please fill all the required fields" });

        var user = await User.findOne({ email });
        if (!user || !await user.validatePassword(password))
            return res.status(400).json({ success: false, message: "Invalid Credentials" });

        console.log(await user.generateToken());
        res.status(200).json({ success: true, user: { user, id: user._id.toString(), token: await user.generateToken() } });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;