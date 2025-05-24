import cron from 'node-cron';

import { db } from "../models/index.js";

cron.schedule('0 12 * * *', async () => {
    try {
        console.log('ddd')
        const {percents} = (await db.collection('settings').findOne({_id: 'settings'}))
        const invoices = (await db.collection('invoices').find({status: 0}).toArray());
        invoices.forEach(async (invoice) => {
            await db.collection('invoices').updateOne({_id: invoice._id}, {
                $push: {items: {name: 'إيجار الغرفة', type: 'charge', qty: 1, price: Number(invoice.roomRate), receipt: invoice.book, date: Date.now()}},
                $inc: {'total.rentVat': (percents.vat / 100) * Number(invoice.roomRate), 'total.rentFees': ((percents.fees / 100) * Number(invoice.roomRate))},
                $set: {lastCheck: Date.now()}
            })
            console.log('added to invoice ' + invoice._id)
        });
    } 
    catch (error) {
        console.error('حدث خطأ أثناء تحديث الفواتير', error);
    }   
});

async function checkMissedDays(){
    try{
        const {percents} = (await db.collection('settings').findOne({_id: 'settings'}))
        const invoices = (await db.collection('invoices').find({status: 0}).toArray());
        invoices.forEach(async (invoice) => {
            const lastRentalDate = new Date(invoice.lastCheck);
            const missedDays = Math.floor((new Date() - lastRentalDate) / (1000 * 60 * 60 * 24));
            let rentVat = 0; let rentFees = 0;
            if (missedDays > 0) {
                const newLineItems = [];
                for (let i = 1; i <= missedDays; i++) {
                    const missedDate = new Date(lastRentalDate);
                    missedDate.setDate(missedDate.getDate() + i);
                    newLineItems.push({name: 'إيجار الغرفة', type: 'charge', qty: 1, price: Number(invoice.roomRate), receipt:invoice.book, date: missedDate.getTime()});
                    rentVat = rentVat + ((percents.vat / 100) * Number(invoice.roomRate))
                    rentFees = rentFees + ((percents.fees / 100) * Number(invoice.roomRate))
                }
                await db.collection('invoices').updateOne({_id: invoice._id}, {
                    $push: { items: { $each: newLineItems } },
                    $inc: {'total.rentVat': rentVat, 'total.rentFees': rentFees},
                    $set: {lastCheck: Date.now()}
                })
            }
        })
    }
    catch (error) {
        console.error('حدث خطأ أثناء تحديث الفواتير:', error);
    }
}

checkMissedDays()