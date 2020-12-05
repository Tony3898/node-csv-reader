let express = require('express');
const yargs = require("yargs/yargs");
const {hideBin} = require('yargs/helpers')
let app = express();
let bodyParser = require('body-parser');
const store = require("./src/api/stores")
const investments = require("./src/api/investments")
const path = require("path")

// Setup Global variable
global.Tony = {
  Config: {},
}

// require another files
require('./src/misc/config')

const {info, success, ghost, warning} = require("./src/misc/style")

// app.use()
app.use(bodyParser.json());

// app routes
app.get("/", (req, res) => {
  res.redirect("/investment/notvalid")
})
app.use("/investment", require('./src/route/investment'))


// set port and listen
app.set('port', process.env.PORT || Tony.Config.connection.port)
app.listen(app.get('port'), () => {
  console.log(info("listening on " + app.get('port')))
  if (process.argv.length > 2) {
    const argv = yargs(hideBin(process.argv)).argv
    if (argv._ && argv._.includes('nvi')) {
      let {budget, investment} = argv
      budget = budget ? budget : path.resolve('./data/budget.csv')
      investment = investment ? investment : path.resolve('./data/investment.csv')
      let filesData = store.readCSVFiles([budget, investment])
      let notValidInvestments = investments.notValid(filesData)
      console.log(warning('Invalid Ids: '))
      notValidInvestments.forEach(nvi => {
        console.log(success(nvi))
      })
    }
  }
})

