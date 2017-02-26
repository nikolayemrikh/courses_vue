module.exports = {
    // "extends": "standard",
    // "plugins": [
    //     "standard",
    //     "promise"
    // ],
    // "extends": "airbnb",
    preLoaders: [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
    }],
};
