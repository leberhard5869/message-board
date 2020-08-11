/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {
      test("POST", function(done) {
        chai
          .request(server)
          .post("/api/threads/general")
          .send({ text: "testing123", delete_password: "test" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("GET", function() {
      test("GET", function(done) {
        chai
          .request(server)
          .get("/api/threads/general")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.isArray(res.body);
            assert.isAtMost(res.body.length, 10);
            assert.property(res.body[0], "text");
            assert.notProperty(res.body[0], "reported");
            assert.notProperty(res.body[0], "delete_passwords");
            assert.isAtMost(res.body[0].replies.length, 3);
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("DELETE", function(done) {
        chai
          .request(server)
          .delete("/api/threads/general")
          .send({
            thread_id: "5ee91b401e5e65250af944ea", // Use id from above POST???
            delete_password: "test"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });
    });

    suite("PUT", function() {});
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {});

    suite("GET", function() {});

    suite("PUT", function() {});

    suite("DELETE", function() {});
  });
});
