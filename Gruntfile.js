module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        options: {
          mangle: false
        },
        files: {
          '/js/scripts.js' : [
            'scripts/circles.js',
            'scripts/cssRefresh.js',
            'scripts/smoothie.js',
            'scripts/jquery-3.2.1.min.js',
            'scripts/scripts.js'
          ]
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'css/main.css': 'sass/main.sass',
        }
      }
    },

    watch: {
      sass: {
        files: 'sass/main.sass',
        tasks: ['sass:dist'],
        options: {
          livereload: true
        }
      },
      scripts: {
        files: 'scripts/*.js',
        livereload: true
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src : [
            '/css/*.css',
            '/js/*.js',
            '/*.html'
          ]
        },
        options: {
          server: "./",
          watchTask: true,
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask('default', ['sass', 'browserSync', 'watch']);

};