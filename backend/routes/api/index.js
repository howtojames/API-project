// phase 2
// backend/routes/api/index.js
const router = require('express').Router();
//----------------------------------------

router.post('/test', function(req, res) {   //accepts /api/test
    res.json({ requestBody: req.body });
});
// to test this endpoint, go to console in developer tools
// fetch('/api/test', {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
//     },
//     body: JSON.stringify({ hello: 'world' })
// }).then(res => res.json()).then(data => console.log(data));

//----------------------------------------


module.exports = router;
