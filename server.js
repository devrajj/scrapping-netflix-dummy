const express = require('express');
const app = express();
const cheerio = require("cheerio");
const request = require("request");
app.use(express.static('client'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let actorFilmMap = new Map();
const readline = require('readline');
var actorNameInput;
var valueOfM;
app.listen(3000, () => {
})
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question1 = () => {
  return new Promise((resolve, reject) => {
    rl.question('Please enter the value of M: ', (answer) => {
      console.log(`Thank you for your valuable feedback: ${answer}`);
      valueOfM = answer;
      resolve()
    })
  })
}

const question2 = () => {
  return new Promise((resolve, reject) => {
    rl.question('Please enter the name of the actor: ', (answer) => {
      console.log(`Thank you for your valuable feedback: ${answer}`);
      actorNameInput = answer;
      resolve()
    })
  })
}

const main = async () => {
  await question1()
  await question2()
  rl.close()
}
main();

app.post('/', (req, res) => {
  // console.log('req:', req.body.numberofmovies);
  let movie = req.body.numberofmovies;
  var url = `https://www.imdb.com/search/title/?count=250&groups=top_250&sort=user_rating`;
  // console.log('url:', url);
  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html, {});
      // var top250 = [];
      $('.lister-item-content').filter(function () {
        var found = $(this);
        let link = 'https://www.imdb.com' + found.children().first().find('a')[0].attribs.href;
        let movieName = found.children().first().find('a').text().trim();
        request(link, function (error, response, html) {
          var $ = cheerio.load(html, {});
          $('.article').filter(function () {
            let foundInner = $(this);
            var tableRow = foundInner.find('.cast_list').find('tbody');
            console.log('tableRow:', tableRow);
            // console.log('actor name:', tableRow);
            // tableRow.each(function () {
            // var self = $(this);
            //console.log('actor name:', self.children().find('.odd').find('a').text());
            // });
            //$('.article').find('.cast_list').find('tbody').find('.odd').find('a').text()

            //console.log('tableRow:', tableRow);
            // var tableRow = $$(this).find('.cast_list').find('tr');
            // console.log('tableRow:', tableRow);
            // tableRow.each(function () {
            //   var self = $(this);
            //   //console.log('actor name:', self.find('.even'));
            //   //console.log('actor name:', self.find('.even').find('td').find('a').text().trim());
            // });
          })
        })
      })
      // top250.push({
      //   link: 'https://www.imdb.com' + found.children().first().find('a')[0].attribs.href,
      //   movieName: found.children().first().find('a').text().trim()
      // })
      // if (actorFilmMap[found.children().find('.ghost+a').text().trim()]) {
      //   actorFilmMap[found.children().find('.ghost+a').text().trim()].push(found.children().first().find('a').text().trim());
      // } else {
      //   actorFilmMap[found.children().find('.ghost+a').text().trim()] = [found.children().first().find('a').text().trim()];
      // }
    }
    //res.json(top250);
  })
  // if (actorFilmMap[actorNameInput]) {
  //   res.json(actorFilmMap[actorNameInput].slice(0, valueOfM));
  // } else {
  //   res.send('No Movies matched your query');
  // }
})

