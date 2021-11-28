var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3000");


//Testing Home Page
describe("When Loading Home Page",function(){

  it("return a page with View Tickets Button /",function(done){

    server
    .get("/")    
    .expect('Content-Type',/html/)
    .expect(200) 
    .end(function(err,res){            
        (res.text.includes('View Tickets')).should.be.equal(true)
        done();
    });
  });
});


//Testing AllTickets API /:pageNo

describe("Returns the first page /:pageNo (/1)",function(){

  it("Should return page with the first 25 tickets in paginated view",function(done){
    server
    .get("/1")
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });


  it("Should return page with the next 25 tickets in continuation with the first /2",function(done){
    server
    .get("/2")
    .expect('Content-Type',/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });
});

  //Testing SingleTicket API /ticket/:id

  describe("Return a view of Single Ticket /ticket/:ticketId",function(){
  it("Should return page containing information on single ticket /ticket/2",function(done){
    server
    .get("/ticket/2")
    .expect('Content-Type',/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });
});


//Testing Error Handling for API /:pageNo

describe("When a page greater than the last Page is entered or random text is entered",function(){
 
  //When Page Number exceeds the last Page in Pagination
  it("Should return 404 Page Not Found for /1000",function(done){
    server
    .get("/1000")
    .expect('Content-Type',/HTML/)
    .expect(404)
    .end(function(err,res){
      res.text.includes('Page Not Found').should.equal(true);
      res.status.should.equal(404);
      done();
    });
  });

  //When a random text xxxx is entered /xxxxx
  it("Should return 400 Invalid Request or API unavailable for /xxx",function(done){
    server
    .get("/xxx")
    .expect('Content-Type',/HTML/)
    .expect(400) 
    .end(function(err,res){
      res.text.includes('Invalid Request or API Unavailable').should.equal(true);
      res.status.should.equal(400)
      done();
    });
  });
});

//Testing Error Handling for /ticket/:id
describe("When an invalid ticket id is entered in /ticket/:ticketId",function(){
 
 it("Should return 400 Invalid Ticket Id /ticket/1000",function(done){
    server
    .get("/ticket/1000")
    .expect('Content-Type',/HTML/)
    .expect(400)
    .end(function(err,res){
      res.text.includes('Invalid Ticket Id').should.equal(true);
      res.status.should.equal(400)
      done();
    });
  });
});


