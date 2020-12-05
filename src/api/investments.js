const moment = require('moment')
moment().format();

class Investments {

  arrayReduce(arry, key) {
    return arry && arry.length ? arry.reduce((a, b) => Number(a) + (Number(b[key]) || 0), 0) : 0
  }

  notValid(options) {
    try {
      let notValidIds = [], budgetData = [], investmentData = [], investmentMade = {}
      let valid = true
      if (!Array.isArray(options))
        throw new Error('Please provide valid data array')
      if (!options.find((o) => {
        return o.name === 'budget' || o.name === 'investment'
      })) {
        throw new Error('Budget/Investment Data is missing!!!')
      }

      // investment not valid rules
      options.forEach((o) => {
        if (o.name === 'budget')
          budgetData = o.data
        else if (o.name === 'investment')
          investmentData = o.data
      })

      let maxAmountInYear = this.arrayReduce(budgetData.filter(b => b['Sector'] === '' && b['Time Period'] === 'Year'), 'Amount')
      let maxAmountInMonth = this.arrayReduce(budgetData.filter(b => b['Sector'] === '' && b['Time Period'] === 'Month'), 'Amount')
      let maxAmountInQuarter = this.arrayReduce(budgetData.filter(b => b['Sector'] === '' && b['Time Period'] === 'Quarter'), 'Amount')
      let totalAmountInvested = 0, totalAmountInvestedInThisMonth = 0
      let sectorsAvailableInBudget = []

      budgetData.map(r => {
        if (r['Sector'] && r['Sector'].length)
          return sectorsAvailableInBudget.push(r['Sector'])
      })

      investmentData.forEach((invest, i) => {
        valid = true

        let ID = invest['ID']
        let Amount = Number(invest['Amount'])
        let Sector = invest['Sector']
        let investmentDate = invest['Date']
        let currentInvestmentDate = moment(investmentDate, "DD/MM/YYYY")
        let currentInvestmentDateQuarter = currentInvestmentDate.utc().quarter()


        if (totalAmountInvested <= maxAmountInYear && Amount <= maxAmountInYear && (Amount + totalAmountInvested) <= maxAmountInYear) { // check if investing amount is less than total amount investing or not
          if (totalAmountInvested === 0) {
            totalAmountInvestedInThisMonth = Amount
            if (sectorsAvailableInBudget.includes(Sector)) {
              let requiredBudgetAmount = this.arrayReduce(budgetData.filter(r => Sector === r['Sector']), 'Amount')
              valid = Number(Amount) <= Number(requiredBudgetAmount)
            } else
              valid = Number(Amount) <= maxAmountInMonth
          } else {
            let lastInvestment = moment(investmentData[i - 1]['Date'], "DD/MM/YYYY")
            totalAmountInvestedInThisMonth = currentInvestmentDate.get('Month') === lastInvestment.get('Month') ? Number(investmentData[i - 1]['Amount']) + Amount : Amount
            let totalAmountBySector = investmentMade[Sector] && investmentMade[Sector]['investmentAmount'] ? investmentMade[Sector]['investmentAmount'] : 0
            if (sectorsAvailableInBudget.includes(Sector)) {
              let requiredBudgetPlan = budgetData.filter(r => Sector === r['Sector'])[0]
              let TA = totalAmountBySector + Amount
              valid = TA <= requiredBudgetPlan['Amount'] && totalAmountInvestedInThisMonth <= maxAmountInMonth
            } else {
              valid = totalAmountBySector >= 0 ? (totalAmountBySector + Amount) < maxAmountInMonth : true
            }
          }
        } else
          valid = false

        if (!valid) {
          notValidIds.push(ID)
        } else {
          totalAmountInvested += Amount
          investmentMade[Sector] = {
            ID: investmentMade[Sector] && investmentMade[Sector]['ID'] ? [...investmentMade[Sector]['ID'], ID] : [ID],
            Date: investmentMade[Sector] && investmentMade[Sector]['Date'] ? [...investmentMade[Sector]['Date'], investmentDate] : [investmentDate],
            Amount: investmentMade[Sector] && investmentMade[Sector]['Amount'] ? [...investmentMade[Sector]['Amount'], Amount] : [Amount],
            investmentAmount: investmentMade[Sector] && investmentMade[Sector]['investmentAmount'] ? investmentMade[Sector]['investmentAmount'] + Amount : Amount,
          }
        }
      })

      // return not valid ids
      return  notValidIds.length ? notValidIds : 'No invalid investments'
    } catch (e) {
      throw new Error(e.message)
    }
  }
}

module.exports = new Investments()