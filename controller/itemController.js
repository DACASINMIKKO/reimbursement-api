const express = require('express');
const db = require('../database');
const jwt = require('jsonwebtoken')
require('dotenv').config();

function addItem(req, res, next) {
    let query = `insert into reimbursement_item (date, or_number, establishment_name, establishment_tin, amount, category, employee_id, status) values (curdate(), "${req.body.or_number}", "${req.body.establishment_name}", "${req.body.establishment_tin}", "${req.body.amount}", "${req.body.category}", "${res.locals.id}", "draft")`
    db.query(query, (err, results) => {
        if(!err) {
            return res.status(200).json('item added successfully')
        } else {
            return res.status(500).json(err)
        }
    })
}

function deleteItem(req, res, next) {
    let query = `select item_id, employee_id, status from reimbursement_item where item_id = "${req.params.id}"`;
    db.query(query, (err, results) => {
        if(!err) {
            if(res.locals.id == results[0].employee_id && results[0].status == process.env.DRAFT){
                let queryDelete = `delete from reimbursement_item where item_id = "${req.params.id}"`
                db.query(queryDelete, (err, result) => {
                    if(!err) {
                        return res.status(200).json('item deleted successfully')
                    } else {
                        return res.status(500).json(err)
                    }
                })
            } else {
                return res.status(400).json({message: "cannot delete item"})
            }
        } else {
            return res.status(500).json(err)
        }
    })
}


function submitReimbursement(req, res, next) {
    let queryTotal = `select (sum(amount)) as total_amount
                      from reimbursement_item
                      where employee_id = ${res.locals.id}`
    db.query(queryTotal, (err, resultTotal) => {
        if(!err){
            let querySubmit = `insert into reimbursement_list (employee_id, flex_cutoff_id, total_amount, date_submitted, status, transaction_number)
                              values(${res.locals.id}, 3, ${resultTotal[0].total_amount}, curdate(), 'submitted', "123123")`
            db.query(querySubmit, (err, results) => {
                if(!err) {
                    let queryUpdateStatus = `update reimbursement_item set status="submitted" where employee_id = ${res.locals.id};`
                    db.query(queryUpdateStatus, (err, resultUpdate) => {
                        if(!err) {
                            db.query(`select * from reimbursement_list where employee_id = ${res.locals.id}`, (err, resultTransactionNumber) => {
                                if(!err) {
                                    let transactionNumber = `1-${resultTransactionNumber[0].flex_cutoff_id}-2022-10-15-${resultTransactionNumber[0].reimbursement_id}`
                                    db.query(`update reimbursement_list set transaction_number = "${transactionNumber}" where employee_id = ${res.locals.id}`, (err, resultFinal) => {
                                        if(!err) {
                                            return res.status(200).json('reimbursement submitted successfully')
                                        } else {
                                            return res.status(500).json(err)
                                        }
                                    })
                                } else {
                                    return res.status(500).json(err)
                                }
                            })

                        } else {
                            return res.status(500).json(err)
                        }
                    })
                } else {
                    return res.status(500).json(err)
                }
            })
        } else {
            return res.status(500).json(err)
        }
    })
}

function getCopyOfReimbursement(req, res, next) {
    let queryReimbursement = `select u.id, u.first_name, u.last_name, rl.date_submitted, rl.total_amount, rl.transaction_number
                              from user u
                              join reimbursement_list rl
                              where u.id = ${req.params.id}`
    db.query(queryReimbursement, (err, resultReimbursement) => {
        if(!err) {
            let queryItems = `select date, or_number, establishment_name, establishment_tin, amount, category
                             from reimbursement_item
                             where employee_id = ${req.params.id}`
            db.query(queryItems, (err, resultItem) => {
                if(!err) {
                    return res.status(200). json({Reimbursement: resultReimbursement, Items: resultItem})
                } else {
                    return res.status(400).json({message: "cannot be processed"})
                }
            })
        } else {
            return res.status(500).json(err)
        }
    })
}

module.exports.addItem = addItem;
module.exports.deleteItem = deleteItem;
module.exports.submitReimbursement = submitReimbursement;
module.exports.getCopyOfReimbursement = getCopyOfReimbursement;
