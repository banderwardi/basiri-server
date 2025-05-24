import { Book } from 'medici';

import * as mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/basiri');

const book = new Book('daily', {maxAccountPath: 20});

export async function addEntry(req, res){
    if (!req || !req.body) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    let entry = book.entry(req.body.entry.trans[0].description)
    for(let trans of req.body.entry.trans){
        if(trans.debit != 0){
            entry.debit(trans.account, trans.debit, {note: trans.description})
        }
        if(trans.credit != 0){
            entry.credit(trans.account, trans.credit, {note: trans.description})
        }
    }
    entry.commit()
    res.json(entry)
}

export async function getEntries(req, res){
    if (!req || !req.body) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    book.ledger(req.body).then(response =>{
        res.json(response)
    })
}

export async function getLedger(req, res){
    if (!req || !req.body) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    let  result = []
    book.listAccounts().then(async accounts =>{
        for (const account of accounts) {
            if(!req.body.account || account.indexOf(req.body.account) !== -1){
                let lastItem = req.body.account ? req.body.account.split(':').at(-1) : undefined;
                let selectAccountIndex = account.split(':').findIndex(p => p == lastItem);
                if((!lastItem && (account.split(':').length <= req.body.level)) || (lastItem && (selectAccountIndex <= req.body.level && account.split(':').slice(selectAccountIndex).length <= req.body.level))){
                    result.push(await calcAccount(account, req.body.date))
                }
            }
        }
        res.json(result)
    })
}


export async function getBalanceSheet(req, res){
    if (!req || !req.body) {
        return res.sendStatus(400).send({
          message: "Data can not be empty!"
        });
    }
    if(req.body.isBalanceSheet){
        let keys = Object.keys(req.body.balanceSheet);
        for(let key of keys){
            if(Object.prototype.toString.call(req.body.balanceSheet[key]) === '[object Object]'){ //Assets
                let subKeys = Object.keys(req.body.balanceSheet[key]); //current,....
                for(let sub of subKeys){ //current
                    for(let subAcc of req.body.balanceSheet[key][sub]){
                        let balance = 0;
                        for(let path of subAcc.paths){
                            balance = balance + (await book.balance({account: path})).balance;
                        }
                        subAcc.balance = balance
                    }
                }
            }
            else{
                for(let subAcc of req.body.balanceSheet[key]){
                    let balance = 0;
                    for(let path of subAcc.paths){
                        balance = balance + (await book.balance({account: path})).balance;
                    }
                    subAcc.balance = balance
                }
            }
        }
    }
    else{
        for(let section of ['earns', 'losses']){
            for(let acc of req.body.balanceSheet[section]){
                let balance = 0;
                for(let path of acc.paths){
                    balance = balance + (await book.balance({account: path})).balance;
                }
                acc.balance = balance
            }
        }
    }
    res.json(req.body.balanceSheet)
}

async function calcAccount(account, date){
    const { results: transactions } = await book.ledger({
        account,
        start_date: date.start,
        end_date: date.end,
      });
  
      let totalDebit = 0;
      let totalCredit = 0;
  
      // Calculate total debit and credit
      transactions.forEach(transaction => {
        totalDebit += transaction.debit || 0;
        totalCredit += transaction.credit || 0;
      });
  
      // Get current balance
      const balanceData = await book.balance({
        account,
      });
      return{
          account: account,
          debit: totalDebit,
          credit: totalCredit,
          balance: balanceData
      }
}