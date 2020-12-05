const express = require('express');
const Promise = require("bluebird");
const path = require("path")
const router = express.Router();
const store = require("../api/stores")
const investments = require("../api/investments")

const getData = (req, res) => {
  let {budgetFilePath, investmentFilePath} = req.query
  budgetFilePath = budgetFilePath ? budgetFilePath : path.resolve('./data/budget.csv')
  investmentFilePath = investmentFilePath ? investmentFilePath : path.resolve('./data/investment.csv')
  if (!budgetFilePath || !investmentFilePath)
    res.status(404).send({message: "Please provide both file path"})
  else if (!budgetFilePath.includes('.csv') || !investmentFilePath.includes('.csv'))
    res.status(404).send({message: "Please provide csv file"})
  else {
    try {
      let filesData = store.readCSVFiles([budgetFilePath, investmentFilePath])
      let notValidInvestments = investments.notValid(filesData)
      res.json(notValidInvestments)
    } catch (e) {
      res.status(404).send({message: e.message})
    }
  }
}

module.exports = router.get('/notvalid', (req, res, next) => {
  getData(req, res)
})