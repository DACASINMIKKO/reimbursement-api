const express = require('express');
const db = require('../database');
const jwt = require('jsonwebtoken')
require('dotenv').config();

function signup(req, res) {
    let user = req.body
    let query = "SELECT id, email from user where email=?"
    db.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user(id,email,password,first_name,last_name,role) values(?,?,?,?,?,?)"
                db.query(query, [user.id, user.email, user.password, user.first_name, user.last_name, user.role], (err, results) => {
                    if (!err) {
                        return res.status(201).json({ message: "SUCCESSFULLY REGISTERED" })
                    } else {
                        res.status(500).json(err)
                    }
                })

            } else {
                res.status(400).json({ message: "EMAIL ALREADY EXIST." });
            }
        } else {
            return res.status(500).json(err)
        }
    })
}


function login(req, res) {
    let user = req.body;
    let query = "select id, email, password, role from user where email=?";
    db.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "INCORRECT USERNAME OR PASSWORD" });
            } else if (results[0].password == user.password) {
                const response = { id: results[0].id, email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                return res.status(200).json({ token: accessToken })
            } else {
                return res.status(400).json({ message: "SOMETHING WENT WRONG PLS TRY AGAIN!" })
            }
        } else {
            res.status(500).json(err)
        }
    })
}

function getAllUsers(req, res) {
    let query = "select id, email, first_name, last_name, role from user"
    db.query(query, (err, results) => {
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
}

module.exports.signup = signup;
module.exports.login = login;
module.exports.getAllUsers = getAllUsers;