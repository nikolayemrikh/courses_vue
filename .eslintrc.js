module.exports = {
    "extends": "standard",
    "plugins": [
        "standard",
        "promise"
    ],
    preLoaders: [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
    }],
};
