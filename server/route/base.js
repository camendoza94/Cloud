module.exports = (app) => {
    app.get('/', (req, res) => {
        let routes = [];
        routes = app._router.stack.map(route => {
            return route.route || '';
        });
        routes = routes.filter(Boolean);
        res.json({
            info: 'Contests API',
            api: routes
        });
    })
};