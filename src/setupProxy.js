const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://web-ohtail-ly8dqscw04c35e9c.sel5.cloudtype.app',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api', // /api 경로를 대상 서버의 /api 경로로 리디렉션
            },
        })
    );

    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://port-0-ohserver-ly8dqscw04c35e9c.sel5.cloudtype.app',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api', // /api 경로를 대상 서버의 /api 경로로 리디렉션
            },
        })
    );
};
