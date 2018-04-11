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
            'system/css/lbs.css': /\.[s]?css/,
        },
    },
    templates: {joinTo:'system/js/templates.js'}
}

exports.paths = {
    watched: ['src'],
    public: 'dist',
}

module.exports.plugins = {
    sass:{},
    raw: {
        pattern: /\.(tpl.html)$/
    },
    babel: {
        plugins: [
            ['transform-object-rest-spread', { useBuiltIns: true }]
        ],
        presets: [['env', {
        targets: {
            browsers: ['last 2 versions']
        },
        useBuiltIns: true
        }]]
    }
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
    'ko.mapping': 'knockout-mapping',
    'ko.punches': 'knockout-punches',
    _: 'underscore'
  }
}

exports.server = {
    // hostname: '0.0.0.0',
    indexPath: 'lbs.html'
}