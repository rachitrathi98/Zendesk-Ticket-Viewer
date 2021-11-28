const express = require('express')
var axios  = require ('axios');
const app = express();
require('dotenv').config()

//Set View Enfgine and PORT at which the applicatio will run
app.set("view engine", "ejs");
app.set('port', process.env.PORT || 3000);


app.listen( app.get('port'), () => {
  console.log('Application Running on localhost:' + app.get('port'))
});

//Gets the HomePage on localhost:3000 
app.get('/', (req, res) => {
  res.render('Home')
});

//Authentication Parameters
const AUTH = {
    username: process.env.USER_NAME,
    password: process.env.PASSWORD
  }


  //Gets the Ticket Data with 25 tickets in each page. Pagination has been implmented to account for tickets more than 25
  app.get('/:pageNo', (req, res) => {
    const url = 'https://'+process.env.SUBDOMAIN+'.zendesk.com/api/v2/tickets.json?page='+req.params.pageNo+'&per_page=25'
    console.log(url);

    const TicketsAPI = {
      method: 'get',
      url: url,
      auth: AUTH
    }


    axios(TicketsAPI)
      .then((response) => {

        var lastPage = Math.ceil(response.data.count / 25)
        const obj =
        {
          tickets: response.data.tickets, PreviousPage: req.params.pageNo > 1 ? "" : "disabled", 
          NextPage: req.params.pageNo < lastPage ? "" : "disabled", 
          PageNumber: req.params.pageNo, 
          lastP: lastPage,
          count: response.data.count
        }


       if(req.params.pageNo > lastPage)
       res.status(404).render('Error', {error: "Page Not Found"})
       
       else
       res.render('AllTickets', obj)

      
      })
      .catch((err) => {
        if (err.response === undefined) {
          res.sendStatus(500)
        } else if (err.response.status) {
          res.status(400).render('Error', {error: "Invalid Request or API Unavailable"})   
        }
      })
  })

  //Get the tickets speficied by Id
  app.get('/ticket/:ticketId', (req, res) => {

    const url = 'https://'+process.env.SUBDOMAIN+'.zendesk.com/api/v2/tickets/'+ req.params.ticketId
    console.log(url);
    const SingleTicketAPI = {
      method: 'get',
      url: url,
      auth: AUTH
    }

    axios(SingleTicketAPI)
      .then((response) => {
        
        res.render('SingleTicket', {ticket: response.data.ticket})

      })
      .catch((err) => {
        if (err.response === undefined) {
          res.sendStatus(500)
        } else if (err.response.status) {
          res.status(400).render('Error', {error:"Invalid Ticket Id or API Unavailable"})          
        }
      })
  })

