import path from 'path';
const __dirname = path.resolve();
const noModuleConfig = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'money_calculator.js',
        libraryTarget: 'window',
        library: 'MoneyCalculator'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    devServer: {
        static: __dirname,
        compress: true,
        port: 9000,
        liveReload: true,
        devMiddleware: {
            publicPath: '/dist/',
            writeToDisk: true
        }
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    mode: 'development'
};
const moduleConfig = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'money_calculator.module.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    devServer: {
        static: __dirname,
        compress: true,
        port: 9000,
        liveReload: true,
        devMiddleware: {
            publicPath: '/dist/',
            writeToDisk: true
        }
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    mode: 'development'
};
export default (options) => {
    console.log(options);
    if (typeof options.bundleAsModule === 'undefined' || options.production === 'boolean') {
        console.log("MISSING ARGUMENTS FOR WEBPACK CONFIG! RETURN NON-MODULE DEV CONFIG!");
        return noModuleConfig;
    }
    if (options.bundleAsModule === 'true') {
        moduleConfig.mode = options.production === 'true' ? 'production' : 'development';
        console.log(moduleConfig)
        return moduleConfig;
    } else {
        noModuleConfig.mode = options.production === 'true' ? 'production' : 'development';
        console.log(noModuleConfig)
        return noModuleConfig
    }

};

