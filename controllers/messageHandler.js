function MessageHandler() {
  var MongoClient = require("mongodb");
  var mongoose = require("mongoose");
  var assert = require("assert").strict;

  mongoose.set("useFindAndModify", false);

  // Connect DB
  mongoose.connect(
    process.env.DATABASE,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, client) => {
      if (err) {
        console.log("Database error: " + err);
      } else {
        console.log("Successful database connection");
      }
    }
  );

  // Set up schema
  const Schema = mongoose.Schema;
  const messagesSchema = new Schema({
    text: { type: String, required: true },
    delete_password: { type: String, required: true },
    created_on: { type: Date, default: Date.now },
    bumped_on: { type: Date, default: Date.now },
    reported: { type: Boolean, default: false },
    replycount: { type: Number, default: 0 },
    replies: [
      {
        text: String,
        created_on: Date,
        delete_password: String,
        reported: Boolean
      }
    ]
  });

  this.postThread = function(board, text, password, done) {
    const Model = mongoose.model(board, messagesSchema);
    var newThread = new Model({
      text: text,
      delete_password: password
    });
    newThread.save(function(err) {
      err ? done(err) : console.log("Save successful");
    });
  };

  this.putThreadReport = function(board, id, done) {
    const Model = mongoose.model(board, messagesSchema);
    Model.findByIdAndUpdate(id, { reported: true }, { new: true }, function(
      err,
      data
    ) {
      if (err) done(err);
      else done(null, "success");
      console.log(data);
    });
  };

  this.getThread = function(board, done) {
    const Model = mongoose.model(board, messagesSchema);
    Model.find()
      .sort({ bumped_on: "desc" })
      .limit(10)
      .select("-reported -delete_password")
      .exec(function(err, data) {
        if (err) done(err);
        data.forEach(function(elm) {
          elm.replies.splice(3, elm.replies.length - 3);
        });
        done(null, data);
      });
  };

  this.deleteThread = function(board, id, password, done) {
    const Model = mongoose.model(board, messagesSchema);
    Model.findById(id, function(err, data) {
      if (err) done(err);
      if (data.delete_password === password) {
        Model.deleteOne({ _id: id }, function(err, data) {
          if (err) done(err);
          else done(null, "success");
        });
      } else done(null, "incorrect password");
    });
  };

  this.postReply = function(board, id, text, password, done) {
    const Model = mongoose.model(board, messagesSchema);
    Model.findByIdAndUpdate(
      id,
      {
        bumped_on: Date.now(),
        $inc: { replycount: 1 },
        $push: {
          replies: {
            text: text,
            created_on: Date.now(),
            delete_password: password,
            reported: false
          }
        }
      },
      { new: true },
      function(err, data) {
        err ? done(err) : console.log("Save successful");
        console.log(data);
      }
    );
  };

  this.putReplyReport = function(board, threadId, replyId, done) {
    const Model = mongoose.model(board, messagesSchema);
    Model.findById(threadId, function(err, data) {
      if (err) done(err);
      let index = data.replies.findIndex(function(elm) {
        return elm._id == replyId;
      });
      data.replies[index].reported = true;
      data.save(function(err) {
        if (err) done(err);
        else done(null, "success");
      });
      console.log(data);
    });
  };

  this.getReplies = function(board, id, done) {
    const Model = mongoose.model(board, messagesSchema);
    Model.findById(id)
      .sort({ bumped_on: "desc" })
      .select("-reported -delete_password")
      .exec(function(err, data) {
        if (err) done(err);
        else done(null, data);
      });
  };

  this.deleteReply = function(board, threadId, replyId, password, done) {
    const Model = mongoose.model(board, messagesSchema);
    Model.findById(threadId, function(err, data) {
      if (err) done(err);
      let index = data.replies.findIndex(function(elm) {
        return elm._id == replyId;
      });
      if (data.replies[index].delete_password === password) {
        data.replies[index].text = "[deleted]";
        data.save(function(err) {
          if (err) done(err);
          else done(null, "success");
        });
      } else done(null, "incorrect password");
    });
  };
}

module.exports = MessageHandler;
