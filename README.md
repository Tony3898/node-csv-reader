# Investment

Sample Nodejs app to read CSV files

### Usage

#### Run: npm run build

1. Browser
    1. open browser, goto: http://localhost:5002/investment/notvalid
        1. use url param <b>budgetFilePath</b> to pass Budget.csv path.
        2. use url param <b>investmentFilePath</b> to pass Budget.csv path.

2. Console/Terminal
    1. use command: <b>node server nvi</b> (default).
    2. with params
        1. for budget file:  --budget=/home/tony/Documents/budget.csv.
        2. for investment file:  --budget=/home/tony/Documents/investment.csv.

### Example

1. Browser
    1. http://localhost:5002/investment/notvalid (without params, it uses files at /data).
    2. http://localhost:5002/investment/notvalid?investmentFilePath=data/investment.csv&budgetFilePath=data/budget.csv (
       with custom file paths).

2. Console/Terminal (Commands)
    1. node server nvi
    2. node server.js nvi --budget=/home/tony/Documents/budget.csv --investment=/home/tony/Documents/investment.csv

#### Note:

1. App can be used simultaneously at a browser and terminal.
2. By default, it will use files at <b>data</b> folder.