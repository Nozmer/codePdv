const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// create store image
const storage = multer.diskStorage({
    destination: '../assets/imageProductsUsers',
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

// router
function createRouter(db) {
    const router = express.Router();

    router.post('/register', (req, res, next) => {
        bcrypt.hash(req.body.password, 12, (hashError, hashedPassword) => {
            if (hashError) {
                console.error(hashError);
                res.status(500).json({ status: 'error bcrypt' });
            } else {
                // Insere usuário no banco de dados com a senha hashed
                db.query(
                    'INSERT INTO login (name, email, password) VALUES (?,?,?)',
                    [req.body.name, req.body.email, hashedPassword],
                    (error) => {
                        if (error) {
                            console.error(error);
                            res.status(500).json({ status: 'error insert' });
                        } else {
                            res.status(200).json({ status: 'ok' });
                        }
                    }
                );
            }
        });
    });

    router.post('/login', (req, res, next) => {
        db.query(
            'SELECT * FROM login WHERE email = ?',
            [req.body.email],
            (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ status: 'error connection database' });
                } else {
                    if (results.length === 0) {
                        res.status(401).json({ status: 'error', message: 'user no found' });
                    } else {
                        const user = results[0];
                        bcrypt.compare(req.body.password, user.password, (bcryptError, bcryptResult) => {
                            if (bcryptError) {
                                console.error(bcryptError);
                                res.status(500).json({ status: 'error bcrypt' });
                            } else {
                                if (bcryptResult) {
                                    // Gera um token
                                    const token = jwt.sign({ user_id: user.user_id }, 'seu_segredo_secreto', { expiresIn: '1h' });
                                    res.status(200).json({ status: 'ok', token: token });
                                } else {
                                    res.status(401).json({ status: 'error', message: 'incorrect password' });
                                }
                            }
                        });
                    }
                }
            }
        );
    });

    router.post('/showProductTable', (req, res, next) => {
        db.query(
            'SELECT * FROM product WHERE owner_id = ?',
            [req.body.user_id],
            (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ status: 'error connection database' });
                } else {
                    if (results.length === 0) {
                        res.status(401).json({ status: 'error', message: 'products no found' });
                    } else {
                        const products = results;
                        res.status(200).json({ status: 'ok', products: products });
                    }
                }
            }
        );
    });
    
    router.post('/uploadImageProduct', upload.single('image'), (req, res) => {
        const uniqueName = req.file.filename;
        res.status(200).json({ uniqueName: uniqueName });
    });

    router.post('/addProduct', (req, res, next) => {
        db.query(
            'INSERT INTO product (owner_id, product_name, product_code, price, discount, max_quantity, min_quantity, description, image_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.body.ownerId, req.body.nameProduct, req.body.codeProduct, req.body.priceProduct, req.body.discontProduct,
                 req.body.max_quantity, req.body.min_quantity, req.body.descriptionProdcut, req.body.nameImageProduct],
            (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ status: 'error connection database' });
                } else {
                    res.status(200).json({ status: 'ok' });
                }
            }
        );
    });

    router.post('/removeProduct', (req, res, next) => {
        db.query(
            'DELETE FROM product WHERE product_id = ?',
            [req.body.product_id],
            (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ status: 'error connection database' });
                } else {
                    res.status(200).json({ status: 'ok' });
                }
            }
        );
    });

    return router;
}

module.exports = createRouter;