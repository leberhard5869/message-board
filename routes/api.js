"use strict";

var expect = require("chai").expect;
var assert = require("assert").strict;

var MessageHandler = require("../controllers/messageHandler.js");

module.exports = function(app) {
  var messageHandler = new MessageHandler();

  app
    .route("/api/threads/:board")

    .post(
      function(req, res, next) {
        messageHandler.postThread(
          req.params.board,
          req.body.text,
          req.body.delete_password
        );
        next();
      },
      function(req, res) {
        res.redirect("/b/" + req.params.board + "/");
      }
    )

    .put(function(req, res, next) {
      messageHandler.putThreadReport(
        req.params.board,
        req.body.thread_id,
        function(err, result) {
          if (err) console.log(err);
          res.send(result);
        }
      );
    })

    .get(function(req, res, next) {
      messageHandler.getThread(req.params.board, function(err, result) {
        if (err) console.log(err);
        res.json(result);
      });
    })

    .delete(function(req, res, next) {
      messageHandler.deleteThread(
        req.params.board,
        req.body.thread_id,
        req.body.delete_password,
        function(err, result) {
          if (err) console.log(err);
          res.send(result);
        }
      );
    });

  app
    .route("/api/replies/:board")

    .post(
      function(req, res, next) {
        messageHandler.postReply(
          req.params.board,
          req.body.thread_id,
          req.body.text,
          req.body.delete_password
        );
        next();
      },
      function(req, res) {
        res.redirect("/b/" + req.params.board + "/" + req.body.thread_id + "/");
      }
    )

    .put(function(req, res, next) {
      messageHandler.putReplyReport(
        req.params.board,
        req.body.thread_id,
        req.body.reply_id,
        function(err, result) {
          if (err) console.log(err);
          res.send(result);
        }
      );
    })

    .get(function(req, res, next) {
      messageHandler.getReplies(req.params.board, req.query.thread_id, function(
        err,
        result
      ) {
        if (err) console.log(err);
        res.json(result);
      });
    })

    .delete(function(req, res, next) {
      messageHandler.deleteReply(
        req.params.board,
        req.body.thread_id,
        req.body.reply_id,
        req.body.delete_password,
        function(err, result) {
          if (err) console.log(err);
          res.send(result);
        }
      );
    });
  
};
