exports.files = {
    javascripts: {
        joinTo: {
            'system/js/lbs.js': /^src\/js/,
            'system/js/vendor.js': /^src\/vendor|node_modules/,
        },
        order: {
            before: /jquery-/,
        },
    },
    stylesheets: {
        joinTo: {
            'system/css/lbs.css': /\.css/,
        },
    },
}

exports.paths = {
    watched: ['src'],
    public: 'dist',
}

exports.plugins = {
    babel: {presets: ['env']}
}

exports.conventions = {
    ignored: () => false, // override defaults for no ignored files
}

exports.npm = {
  globals: {
    moment: 'moment',
    $: 'jquery',
    jQuery: 'jquery',
    ko: 'knockout',
    _: 'underscore'
  }
}