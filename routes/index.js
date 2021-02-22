var express = require('express');
var router = express.Router();

require('dotenv').config()
const {google} = require('googleapis');

const scopes = 'https://www.googleapis.com/auth/analytics.readonly'

const jwt = new google.auth.JWT(process.env.CLIENT_EMAIL, null, process.env.PRIVATE_KEY, scopes)


/* GET home page. */
router.get('/', async function(req, res, next) {

  const defaults = {
    'auth': jwt,
    'ids': 'ga:' + process.env.VIEW_ID,
  }
  const response = await jwt.authorize().catch(err => console.log(err))
  const result = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': '30daysAgo',
    'end-date': 'today',
    'metrics': 'ga:sessions',
  })
  //console.log(result)
  res.send(result.data.rows[0][0])
  // console.dir(result.data.rows.sort((a, b) => b[1] - a[1]))
});

router.get('/browser', async function(req, res, next) {

  const defaults = {
    'auth': jwt,
    'ids': 'ga:' + process.env.VIEW_ID,
  }
  const response = await jwt.authorize().catch(err => console.log(err))
  const result = await google.analytics('v3').data.ga.get({
    ...defaults,
    'start-date': '30daysAgo',
    'end-date': 'today',
    'dimensions': 'ga:browser',
    'metrics': 'ga:sessions'
  })
  //console.log(result);
  res.send(result.data.rows.sort((a, b) => b[1] - a[1]))
});

module.exports = router;
