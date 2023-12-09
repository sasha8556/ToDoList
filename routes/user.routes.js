const express = require("express");
const router = express.Router();
const UsersController = require("../controller/user.controller");

const { body } = require("express-validator");

const validateDataBodyUser = [
  body("login")
    .notEmpty()
    .withMessage("login must be provided"),
  body("password")
    .not()
    .equals(body("login"))
    .withMessage("password can't be the same as the login")
    .bail()
    .isLength({
      min: 5,
    })
    .withMessage("password length must be at least 5 characters"),
];


/**
 * @swagger
 * /api/users/register:
 *  post:
 *      description: Creates new user
 *      tags:
 *        - Users
 *      requestBody:
 *        description: sign up
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                login: 
 *                  type: string
 *                  example: example@gmail.com
 *                  description: user's login
 *                password: 
 *                  type: string
 *                  description: user's password
 *      responses:
 *          '200':
 *              description: Successful response
 *          '400':
 *              description: Bad request
 *        
 */

router.post("/register", validateDataBodyUser, UsersController.registerUser);

/**
 * @swagger
 * /api/users/login:
 *  post:
 *      description: Signs in the user
 *      tags:
 *        - Users
 *      requestBody: 
 *        description: sign in
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                login: 
 *                  type: string
 *                  example: example@gmail.com
 *                  description: user's login
 *                password: 
 *                  type: string
 *                  description: user's password
 *      responses:
 *          '200':
 *              description: Successful response
 *          '400':
 *              description: Bad request
 *          default:
 *              description: Error 
 */

router.post("/login", validateDataBodyUser, UsersController.loginUser);



module.exports = router;
