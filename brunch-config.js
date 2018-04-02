exports.files = {
    javascripts: {
      joinTo: {
      "system/js/lbs.js": /^src\/js/,
      "system/js/vendor.js": /^src\/vendor/
      },
      order: {
        before: /jquery-/
      }
    },
    stylesheets: {
      joinTo: {
        'system/css/lbs.css':/\.css/
      }
    }
  };

  exports.paths = {
    watched: ['src'],
    public: 'dist'
  };
  
  exports.plugins = {
    babel: {presets: ['es2015']}
  };

  exports.conventions = {
    ignored: () => false, // override defaults for no ignored files
  };