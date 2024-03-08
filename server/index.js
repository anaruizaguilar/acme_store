const { client, createTables, createUser, createProduct, fetchUsers, fetchProducts, createFavorite, fetchFavorites, destroyFavorite } = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/users', async(req, res, next) => {
    try{
        res.send(await fetchUsers());
    } catch(ex) {
        next(ex);
    }
});

app.get('/api/products', async(req, res, next) => {
    try {
        res.send(await fetchProducts());
    } catch(ex) {
        next(ex);
    }
});

app.get('/api/users/:id/favorites', async(req, res, next) => {
    try {
        res.send(await fetchFavorites(req.params.id));
    } catch(ex) {
        next(ex);
    }
});

app.post('/api/users/:id/favorites', async(req, res, next) => {
    const { user_id } = req.params.id;
    const { product_id } = req.body;
    try {
        res.status(201).send(await createFavorite(user_id, product_id));
    } catch(ex) {
        next(ex);
    }
});

app.delete('/api/users/:userId/favorites/:id', async(req, res, next) => {
    const { id } = req.params.id;
    const { user_id } = req.params.userId;
    try {
        await destroyFavorite(id, user_id);
        res.sendStatus(204);
    } catch(ex) {
        next(ex);
    }
});

const init = async() => {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [allie, mavis, agnes, toaster, tumbler, socks, puzzle] = await Promise.all([
        createUser('allie', 'gotasecr3t'),
        createUser('mavis', 'canUk33pIt'),
        createUser('agnes', 'this1ullsav3'),
        createProduct('toaster'),
        createProduct('tumber'),
        createProduct('socks'),
        createProduct('puzzle')
    ]);
    const users = await fetchUsers();
    console.log(users);

    const products = await fetchProducts();
    console.log(products);

    const favorites = await Promise.all([
        createFavorite(allie.id, puzzle.id),
    //     createFavorite(mavis.id, tumbler.id),
    //     createFavorite(agnes.id, toaster.id),
    //     createFavorite(mavis.id, socks.id)
     ]);

    //  //console.log(await fetchFavorites(allie.id));
    // // await destroyFavorite(favorites[0].id);
    // // console.log(await fetchFavorites(allie.id));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`listening in port ${PORT}`));
};

init();