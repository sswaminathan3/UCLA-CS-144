var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

let MongoClient = require('mongodb').MongoClient;
let commonmark = require('commonmark');

app.use(express.json());  // to support JSON-encoded bodies   
app.use(express.urlencoded({ extended: true }));  // to support URL-encoded bodies
app.use(cookieParser('C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c'));

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// connection URL
const url = 'mongodb://localhost:27017/BlogServer';

// Create a new MongoClient
const client = new MongoClient(url);

let db;

// Initialize connection once, reuse the database object 
MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
  // create database object
  db = client.db("BlogServer");
  console.log('Listening on port 3000');
});

var getPostId = function(req) {
  return new Promise((resolve) => {
    let post = db.collection('Posts').find({ $query: { $and : [{ username: req.params.username }, { postid: parseInt(req.params.postid) }]}, $orderby: { postid: 1 }}).toArray();
    resolve(post);
  });
}

app.get('/blog/:username/:postid', async(req, res) => {
  try {
    let post = await getPostId(req);

    if (post.length <= 0) {
      res.sendStatus(404);
      return;
    }

    res.render('index', { posts: post, commonmark: commonmark, next: null });
  } catch(err) {
    res.sendStatus(400);
  }
});

app.get('/api/:username/:postid', async(req, res) => {
  try {
    jwt.verify(req.signedCookies.jwt, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c', async(err, decoded) => {
      if (decoded === undefined) {
        res.sendStatus(400);
        return;
      }

      if (decoded.usr === req.params.username) {
        if (Math.round(Date.now()/1000) > decoded.exp) {
          res.sendStatus(401);
          return;
        }
      }
      else {
        res.sendStatus(401);
        return;
      }

      let user = await getUser(req);

      // user is not in database -- unauthorized
      if (user.length <= 0) {
        res.sendStatus(401);
        return;
      }

      let post = await getPostId(req);
      
      if (post.length <= 0) {
        res.sendStatus(404);
        return;
      }

      res.status(200).send(post[0]);
    })
  } catch(err) {
    res.sendStatus(400);
  }
});

// insert new post into the Posts database
var insertPost = function(req) {
  return new Promise((resolve) => {
    resolve(db.collection('Posts').insertOne({ "postid": parseInt(req.params.postid), "username": req.params.username, "created": Date.now(), "modified": Date.now(), "title": req.body.title, "body": req.body.body }));
  });
}

app.post('/api/:username/:postid', async(req, res) => {
  try {
    jwt.verify(req.signedCookies.jwt, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c', async(err, decoded) => {
      if (decoded === undefined) {
        res.sendStatus(400);
        return;
      }

      if (decoded.usr === req.params.username) {
        if (Math.round(Date.now()/1000) > decoded.exp) {
          res.sendStatus(401);
          return;
        }
      }
      else {
        res.sendStatus(401);
        return;
      }

      let post = await getPostId(req);

      // if the postid already exists
      if (post.length > 0) {
        res.sendStatus(400);
        return;
      }

      let insert = await insertPost(req);
      res.sendStatus(201);
    })
  } catch(err) {
    res.sendStatus(400);
  }
})

// update post in the Posts database
var updatePost = function(req) {
  return new Promise((resolve) => {
    resolve(db.collection('Posts').updateOne({ $and : [{ username: req.params.username }, { postid: parseInt(req.params.postid) }]}, { $set: { "modified": Date.now(), "title": req.body.title, "body": req.body.body }}));
  });
}

app.put('/api/:username/:postid', async(req, res) => {
  try {
    jwt.verify(req.signedCookies.jwt, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c', async(err, decoded) => {
      if (decoded === undefined) {
        res.sendStatus(400);
        return;
      }

      if (decoded.usr === req.params.username) {
        if (Math.round(Date.now()/1000) > decoded.exp) {
          res.sendStatus(401);
          return;
        }
      }
      else {
        res.sendStatus(401);
        return;
      }
      let post = await getPostId(req);

      // if the post does not exist
      if (post.length <= 0) {
        res.sendStatus(400);
        return;
      }

      let update = await updatePost(req);
      res.sendStatus(200);
    })
  } catch(err) {
    res.sendStatus(400);
  }
})

// delete post from the Posts database
var deletePost = function(req) {
  return new Promise((resolve) => {
    resolve(db.collection('Posts').deleteOne({ $and : [{ username: req.params.username }, { postid: parseInt(req.params.postid) }]}));
  });
}

app.delete('/api/:username/:postid', async(req, res) => {
  try {
    jwt.verify(req.signedCookies.jwt, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c', async(err, decoded) => {
      if (decoded === undefined) {
        res.sendStatus(400);
        return;
      }

      if (decoded.usr === req.params.username) {
        if (Math.round(Date.now()/1000) > decoded.exp) {
          res.sendStatus(401);
          return;
        }
      }
      else {
        res.sendStatus(401);
        return;
      }

      let post = await getPostId(req);

      // if the post does not exist
      if (post.length <= 0) {
        res.sendStatus(400);
        return;
      }

      let del = await deletePost(req);
      res.sendStatus(204);
    })
  } catch(err) {
    res.sendStatus(400);
  }
})

var getPosts = function(req) {
  return new Promise((resolve) => {
    // get optional start parameter if exists
    let start = req.query.start;
    if (start === undefined) {
      start = 1;
    }

    let posts = db.collection('Posts').find({ $query: { $and : [{ username: req.params.username }, { postid: { $gte: parseInt(start) }}]}, $orderby: { postid: 1 }}).toArray();
    resolve(posts);
  });
}

var getUser = function(req) {
  return new Promise((resolve) => {
    let user = db.collection('Users').find({ username: req.params.username }).toArray();
    resolve(user);
  });
}

app.get('/blog/:username', async(req, res) => {
  try {
    let user = await getUser(req);
    if (user.length <= 0) {
      res.sendStatus(404);
      return;
    }

    let posts = await getPosts(req);
    let next;

    // only get first five posts
    if (posts.length > 5) {
      next = "?start=" + posts[5].postid;
      let pagePosts = posts.slice(0, 5);
      posts = pagePosts;
    }

    console.log(posts);
    res.status(200).render('index', { posts: posts, commonmark: commonmark, next: next });
  } catch(err) {
    res.sendStatus(400);
  }
});

app.get('/api/:username', async(req, res) => {
  try {
    jwt.verify(req.signedCookies.jwt, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c', async(err, decoded) => {
      if (decoded === undefined) {
        res.sendStatus(400);
        return;
      }

      if (decoded.usr === req.params.username) {
        if (Math.round(Date.now()/1000) > decoded.exp) {
          res.sendStatus(401);
          return;
        }
      }
      else {
        res.sendStatus(401);
        return;
      }

      let user = await getUser(req);
      if (user.length <= 0) {
        res.sendStatus(401);
        return;
      }

      let posts = await getPosts(req);
      console.log(posts);
      res.status(200).send(posts);
    })
  } catch(err) {
    res.sendStatus(400);
  }
});

app.get('/login', async(req, res) => {
  try {
    let redirect = req.query.redirect;
    if (req.query.redirect === undefined) {
      redirect = null;
    }

    res.status(200).render('login', { username: "", password: "", redirect: redirect });
  } catch(err) {
    res.sendStatus(400);
  }
})

var getPassword = function(req) {
  return new Promise((resolve) => {
    let user = db.collection('Users').find({ username: req.body.username }).toArray();
    resolve(user);
  });
}

async function authenticate(req) {
  let hash = await getPassword(req);
  console.log(hash)
  return bcrypt.compare(req.body.password, hash[0].password);
}

app.post('/login', async(req, res) => {
  try {
    // authenticate password using bcrypt
    let authenticated = await authenticate(req); 

    if (authenticated === false) {
        res.status(401);
        res.render('login', { username: req.body.username, password: req.body.password, redirect: req.body.redirect });
    }

    // generate JWT
    jwt.sign({ exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60), usr: req.body.username }, 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c', { header: { alg: "HS256",
    typ: "JWT" } }, function(err, token) {
      console.log(token);
      res.cookie('jwt', token, { signed: true, httpOnly: true });

      if (req.body.redirect) {
        res.status(200).redirect(req.body.redirect);
      }
      else {
        res.status(200).send("Successful Authentication");
      }
    });
  } catch(err) {
    res.sendStatus(400);
  }
})

app.get('/api', async(req, res) => {
  res.sendStatus(404);
})

app.get('/blog', async(req, res) => {
  res.sendStatus(404);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
