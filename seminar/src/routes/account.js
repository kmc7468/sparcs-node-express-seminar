const express = require('express');
const AccountModel = require('../models/account');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

class BankDB {
    static _inst_;
    static getInst = () => {
        if ( !BankDB._inst_ ) BankDB._inst_ = new BankDB();
        return BankDB._inst_;
    }

    constructor() { console.log("[Bank-DB] DB Init Completed"); }

    register = async (username) => {
        try {
            const newItem = new AccountModel({ username });
            const res = await newItem.save();
            return { success: true, data: "10000" };
        } catch (e) {
            return { success: false, data: `DB Error - ${ e }` };
        }
    }

    getBalance = async (username) => {
        try {
            const OFiler = { username };
            console.log(OFiler);
            const res = await AccountModel.findOne(OFiler);
            console.log(res);
            return { success: true, data: res.total.toString() };
        } catch (e) {
            return { success: false, data: `DB Error - ${ e }` };
        }
    }

    transaction = async ( username, amount ) => {
        try {
            const OFiler = { username };
            const current = await this.getBalance(username);
            const newTotal = parseInt(current.data) + parseInt(amount);
            const res = await AccountModel.updateOne(OFiler, { total: newTotal });
            return { success: true, data: newTotal.toString() };
        } catch (e) {
            return { success: false, data: `DB Error - ${ e }` };
        }
    }
}

const bankDBInst = BankDB.getInst();

router.post('/register', authMiddleware, async (req, res) =>{
    try {
        const { success, data } = await bankDBInst.register(req.body.username);
        console.log(data);
        if (success) return res.status(200).json({ balance: data });
        else return res.status(500).json({ error: data });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/getInfo', authMiddleware, async (req, res) => {
    try {
        const { success, data } = await bankDBInst.getBalance(req.body.username);
        console.log(data);
        if (success) return res.status(200).json({ balance: data });
        else return res.status(500).json({ error: data });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/transaction', authMiddleware, async (req, res) => {
    try {
        const { amount, username } = req.body;
        const { success, data } = await bankDBInst.transaction( username, parseInt(amount) );
        console.log(data);
        if (success) res.status(200).json({ success: true, balance: data, msg: "Transaction success" });
        else res.status(500).json({ error: data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

module.exports = router;