var express = require('express');
var router = express.Router();

require('dotenv').config()
const {google} = require('googleapis');

const scopes = ['https://www.googleapis.com/auth/analytics.readonly']

const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

const jwt = new google.auth.JWT(process.env.CLIENT_EMAIL, null, privateKey, scopes)


/* GET home page. */
router.get('/', async function(req, res, next) {
  const defaults = {
    'auth': jwt,
    'ids': 'ga:' + process.env.VIEW_ID,
  }
  const response = await jwt.authorize().catch(err => console.log(err))
  const result = await google.analytics('v3').data.realtime.get({
    ...defaults,
    'start-date': '30daysAgo',
    'end-date': 'today',
    'metrics': 'rt:activeUsers',
  })
  //console.log(result)
  if (result.data.rows) {
    res.send(result.data.rows[0][0])
  } else {
    res.send('0');
  }
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
  if (result.data.rows) {
    res.send(result.data.rows.sort((a, b) => b[1] - a[1]))
  } else {
    res.send([['no', 'views']])
  }
});

router.get('/blue', async function(req, res, next) {
  const defaults = {
    'auth': jwt,
    'ids': 'ga:' + process.env.VIEW_ID_BLUE,
  }
  const response = await jwt.authorize().catch(err => console.log(err))
  const result = await google.analytics('v3').data.realtime.get({
    ...defaults,
    'start-date': '30daysAgo',
    'end-date': 'today',
    'metrics': 'rt:activeUsers',
  })
  // console.log(result)
  if (result.data.rows) {
    res.send(result.data.rows[0][0])
  } else {
    res.send('0');
  }
  
  // console.dir(result.data.rows.sort((a, b) => b[1] - a[1]))
});

router.get('/blue/browser', async function(req, res, next) {

  const defaults = {
    'auth': jwt,
    'ids': 'ga:' + process.env.VIEW_ID_BLUE,
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
  if (result.data.rows) {
    res.send(result.data.rows.sort((a, b) => b[1] - a[1]))
  } else {
    res.send([['no', 'views']])
  }

});

module.exports = router;
