const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { log } = require('@angular-devkit/build-angular/src/builders/ssr-dev-server');

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

    router.post('/addPayment', (req, res, next) => {
        const userData = req.body;

        db.query(
            'INSERT INTO payments (owner_id, payment_method, amount, discount) VALUES (?, ?, ?, ?)',
            [userData.owner_id, userData.payment_method, userData.amount, userData.discount],
            (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ status: 'error connection database' });
                } else {
                    const paymentId = results.insertId;
                    const productInsertValues = userData.arrayProductID.map((product, index) => [paymentId, product, userData.numberQuantity[index]]);

                    db.query(
                        'INSERT INTO paymentProducts (payment_id, product_id, quantity) VALUES ?',
                        [productInsertValues],
                        (error, results) => {
                            if (error) {
                                console.error(error);
                                res.status(500).json({ status: 'error connection database' });
                            } else {
                                res.status(200).json({ status: 'ok' });
                            }
                        }
                    );
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

    router.post('/productRecent', (req, res, next) => {
        const owner_id = req.body.user_id;

        const recentProductsQuery = `
        SELECT *
        FROM product
        WHERE owner_id = ?
        ORDER BY created_at DESC
        LIMIT 10
      `;

        const recentPaymentsQuery = `
        SELECT *
        FROM payments
        WHERE owner_id = ?
        ORDER BY payment_date DESC
        LIMIT 10
      `;

        const responseData = {
            recentActivities: [],
        };

        // Consulta para obter os produtos mais recentes
        db.query(recentProductsQuery, [owner_id], (productsError, productsResults) => {
            if (productsError) {
                console.error(productsError);
                res.status(500).json({ status: 'error connecting to database' });
            } else {
                responseData.recentActivities = productsResults;

                // Consulta para obter os pagamentos mais recentes
                db.query(recentPaymentsQuery, [owner_id], (paymentsError, paymentsResults) => {
                    if (paymentsError) {
                        console.error(paymentsError);
                        res.status(500).json({ status: 'error connecting to database' });
                    } else {
                        responseData.recentActivities = responseData.recentActivities.concat(paymentsResults);

                        responseData.recentActivities.sort((a, b) => {
                            const dateA = a.created_at || a.payment_date;
                            const dateB = b.created_at || b.payment_date;
                            return new Date(dateB) - new Date(dateA);
                        });

                        responseData.recentActivities = responseData.recentActivities.slice(0, 10);

                        res.status(200).json(responseData);
                    }
                });
            }
        });
    });

    router.post('/salesStatistics', (req, res, next) => {
        const owner_id = req.body.user_id;

        const responseData = {
            hourlySales: [],
            hourlySalesProducts: {
                topProductIDs: [],
                topProductQuantities: []
            },
            dailySales: [],
            dailySalesProducts: {
                topProductIDs: [],
                topProductQuantities: []
            },
            monthlySales: [],
            monthlySalesProducts: {
                topProductIDs: [],
                topProductQuantities: []
            },
        };

        const hourlyQuery = `
        SELECT
            HOUR(p.payment_date) AS hour,
            COUNT(*) AS salesCount,
            GROUP_CONCAT(pp.product_id) AS topProductIDs,
            GROUP_CONCAT(pp.quantity) AS topProductQuantities
            FROM payments p
            JOIN paymentProducts pp ON p.payment_id = pp.payment_id
            WHERE p.owner_id = ? AND DATE(p.payment_date) = CURDATE() GROUP BY hour
        `;

        db.query(hourlyQuery, [owner_id], (hourlyError, hourlyResults) => {
            if (hourlyError) {
                console.error(hourlyError);
                res.status(500).json({ status: 'error connecting to database' });
            } else {
                responseData.hourlySales = fillEmptyHours(hourlyResults);
                responseData.hourlySalesProducts = organizeResultsByQuantity(hourlyResults);

                // Consulta para obter os IDs e quantidades dos produtos mais vendidos por dia da semana
                const dailyQuery = `
                SELECT
                    DAYOFWEEK(p.payment_date) AS dayOfWeek,
                    COUNT(*) AS salesCount,
                    GROUP_CONCAT(pp.product_id) AS topProductIDs,
                    GROUP_CONCAT(pp.quantity) AS topProductQuantities
                    FROM payments p
                    JOIN paymentProducts pp ON p.payment_id = pp.payment_id
                    WHERE p.owner_id = ? AND DATE(p.payment_date) GROUP BY dayOfWeek
                `;

                db.query(dailyQuery, [owner_id], (dailyError, dailyResults) => {
                    if (dailyError) {
                        console.error(dailyError);
                        res.status(500).json({ status: 'error connecting to database' });
                    } else {
                        responseData.dailySales = fillEmptyDays(dailyResults);
                        responseData.dailySalesProducts = organizeResultsByQuantity(dailyResults);

                        // Consulta para obter os IDs e quantidades dos produtos mais vendidos por mês
                        const monthlyQuery = `
                        SELECT
                            MONTH(p.payment_date) AS month,
                            COUNT(*) AS salesCount,
                            GROUP_CONCAT(pp.product_id) AS topProductIDs,
                            GROUP_CONCAT(pp.quantity) AS topProductQuantities
                            FROM payments p
                            JOIN paymentProducts pp ON p.payment_id = pp.payment_id
                            WHERE p.owner_id = ? AND YEAR(p.payment_date) = YEAR(CURDATE())
                        `;

                        db.query(monthlyQuery, [owner_id], (monthlyError, monthlyResults) => {
                            if (monthlyError) {
                                console.error(monthlyError);
                                res.status(500).json({ status: 'error connecting to database' });
                            } else {
                                responseData.monthlySales = fillEmptyMonths(monthlyResults);
                                responseData.monthlySalesProducts = organizeResultsByQuantity(monthlyResults);

                                res.status(200).json(responseData);
                            }
                        });
                    }
                });
            }
        });
    });

    // functions
    function fillEmptyHours(data) {
        const hoursMap = Array.from({ length: 24 }, (_, i) => ({ hour: i, salesCount: 0 }));

        data.forEach(item => {
            const index = hoursMap.findIndex(hourItem => hourItem.hour === item.hour);
            if (index !== -1) {
                hoursMap[index].salesCount = item.salesCount;
            }
        });

        return hoursMap;
    }

    function fillEmptyDays(data) {
        const daysMap = Array.from({ length: 7 }, (_, i) => ({ dayOfWeek: i + 1, salesCount: 0 }));

        data.forEach(item => {
            const index = daysMap.findIndex(dayItem => dayItem.dayOfWeek === item.dayOfWeek);
            if (index !== -1) {
                daysMap[index].salesCount = item.salesCount;
            }
        });

        return daysMap;
    }

    function fillEmptyMonths(data) {
        const monthsMap = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, salesCount: 0 }));

        data.forEach(item => {
            const index = monthsMap.findIndex(monthItem => monthItem.month === item.month);
            if (index !== -1) {
                monthsMap[index].salesCount = item.salesCount;
            }
        });

        return monthsMap;
    }

    function organizeResultsByQuantity(queryResults) {
        let finalSortedIDs = [];
        let finalSortedQuantities = [];

        const allTopProductIDs = queryResults
            .flat() // Aplanar o array
            .map(row => csvStringToArray(row.topProductIDs)) // Converter strings em arrays de números
            .flat(); // Aplanar novamente para obter um único array

        const allTopProductQuantities = queryResults
            .flat() // Aplanar o array
            .map(row => csvStringToArray(row.topProductIDs)) // Converter strings em arrays de números
            .flat(); // Aplanar novamente para obter um único array

        if (allTopProductIDs != null) {
            const quantityMap = new Map();

            // Preencher o mapa com as quantidades
            allTopProductIDs.forEach((id, index) => {
                if (quantityMap.has(id)) {
                    // Se o ID já existe no mapa, adicionar a quantidade
                    quantityMap.set(id, quantityMap.get(id) + allTopProductQuantities[index]);
                } else {
                    // Se o ID é novo, inserir a quantidade no mapa
                    quantityMap.set(id, allTopProductQuantities[index]);
                }
            });

            // Criar arrays finais a partir do mapa
            const sortedIDs = Array.from(quantityMap.keys());
            const sortedQuantities = Array.from(quantityMap.values());

            // Ordenar os arrays com base nas quantidades em ordem decrescente
            const sortedProducts = sortedIDs.map((id, index) => ({
                id,
                quantity: sortedQuantities[index]
            })).sort((a, b) => b.quantity - a.quantity);

            // Separar novamente os IDs e as quantidades ordenadas
            finalSortedIDs = sortedProducts.map(product => product.id);
            finalSortedQuantities = sortedProducts.map(product => product.quantity);

            return {
                topProductIDs: finalSortedIDs,
                topProductQuantities: finalSortedQuantities
            };
        } else {
            return {
                topProductIDs: null,
                topProductQuantities: null
            };
        }
    }

    function csvStringToArray(csvString) {
        return csvString.split(',').map(Number);
    }

    return router;
}

module.exports = createRouter;