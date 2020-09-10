const path = require("path");

const argv = require('minimist')(process.argv.slice(2));

const configGenerator = require(path.resolve(argv.config));
console.log('cwd', process.cwd());

const config = configGenerator(
    process.env, argv
);

const webpack = require('webpack');

const port = 8080;

const middleware = require('webpack-dev-middleware');
const compiler = webpack(config);
const express = require('express');
const app = express();

const instance = middleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
    stats: { colors: true }
});


app.use(require('connect-history-api-fallback')({
    rewrites: {
        from: new RegExp('/[^.]*$'),
        to: `/index.html`
    }
}));

app.use(instance);

app.use(require("webpack-hot-middleware")(compiler));

// After the first build, we immediately stop the built-in middleware watcher
// as we will manually retrigger builds using ibazel
instance.waitUntilValid(() => {
    instance.close()
});

// Listen for ibazel commands on stdin
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {

    let chunk;
    // Use a loop to make sure we read all available data.
    while ((chunk = process.stdin.read()) !== null) {
        if(chunk.includes('IBAZEL_BUILD_COMPLETED SUCCESS')) {
            console.log('IBAZEL triggered an invalidation');
            instance.invalidate();
        }
    }
});


app.listen(port, () => console.log('Webpack app listening on port ' + port));

