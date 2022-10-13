const express = require('express');
const db = require('../database');
const jwt = require('jsonwebtoken')
require('dotenv').config();

function getUsersReimbursement(req, res, next) {
    let query = `select u.id, u.first_name, u.last_name, rl.date_submitted, rl.total_amount, rl.status
                from user u
                join reimbursement_list rl
                on u.id = rl.employee_id`
    db.query(query, (err, results) => {
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
}

function getUsersReimbursementByEmployeeId(req, res, next) {
    let query = `select u.id, u.first_name, u.last_name, rl.date_submitted, rl.reimbursement_id, rl.total_amount, rl.transaction_number, rl.status
                 from user u
                 join reimbursement_list rl
                 where u.id = ${req.params.id}`
    db.query(query, (err, results) => {
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
}

function getUsersReimbursementByEmployeeFirstName(req, res, next) {
    let query = `select u.id, u.first_name, u.last_name, rl.date_submitted, rl.reimbursement_id, rl.total_amount, rl.transaction_number, rl.status
                 from user u
                 join reimbursement_list rl
                 where u.first_name = "${req.params.firstName}"`
    db.query(query, (err, results) => {
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
}

function getUsersReimbursementByEmployeeLastName(req, res, next) {
    let query = `select u.id, u.first_name, u.last_name, rl.date_submitted, rl.reimbursement_id, rl.total_amount, rl.transaction_number, rl.status
                 from user u
                 join reimbursement_list rl
                 where u.last_name = "${req.params.lastName}"`
    db.query(query, (err, results) => {
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
}

function approveReimbursement(req, res, next) {
    let queryReimbursement = `update reimbursement_list set status = "approved" 
                             where reimbursement_id = ${req.params.id}`
    db.query(queryReimbursement, (err, results) => {
        if(!err) {
            let queryItems = `select ri.status, ri.employee_id
                             from reimbursement_item ri
                             join reimbursement_list rl
                             on ri.employee_id = rl.employee_id
                             where reimbursement_id = ${req.params.id}`
            db.query(queryItems, (err, resultItem) => {
                if(!err) {
                    let queryUpdateItemStatus = `update reimbursement_item set status = "approved"
                                                where employee_id = ${resultItem[0].employee_id}`
                    db.query(queryUpdateItemStatus, (err, result) => {
                        if(!err) {
                            return res.status(200).json({message: "reimbursement approved successfully"})
                        } else {
                            return res.status(500).json(err)
                        }
                    })
                } else {
                    return res.status(500).json(err)
                }
            })
        } else {
            return res.status(500).json(500);
        }
    })
}

function rejectReimbursement(req, res, next) {
    let queryReimbursement = `update reimbursement_list set status = "rejected" 
                             where reimbursement_id = ${req.params.id}`
    db.query(queryReimbursement, (err, results) => {
        if(!err) {
            let queryItems = `select ri.status, ri.employee_id
                             from reimbursement_item ri
                             join reimbursement_list rl
                             on ri.employee_id = rl.employee_id
                             where reimbursement_id = ${req.params.id}`
            db.query(queryItems, (err, resultItem) => {
                if(!err) {
                    let queryUpdateItemStatus = `update reimbursement_item set status = "rejected"
                                                where employee_id = ${resultItem[0].employee_id}`
                    db.query(queryUpdateItemStatus, (err, result) => {
                        if(!err) {
                            return res.status(200).json({message: "reimbursement rejected successfully"})
                        } else {
                            return res.status(500).json(err)
                        }
                    })
                } else {
                    return res.status(500).json(err)
                }
            })
        } else {
            return res.status(500).json(500);
        }
    })
}

module.exports.getUsersReimbursementByEmployeeId = getUsersReimbursementByEmployeeId;
module.exports.getUsersReimbursementByEmployeeFirstName = getUsersReimbursementByEmployeeFirstName;
module.exports.getUsersReimbursementByEmployeeLastName = getUsersReimbursementByEmployeeLastName;
module.exports.approveReimbursement = approveReimbursement;
module.exports.rejectReimbursement = rejectReimbursement;
module.exports.getUsersReimbursement = getUsersReimbursement;

