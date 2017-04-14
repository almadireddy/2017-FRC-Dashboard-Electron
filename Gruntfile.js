module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask('default', ['sass', 'browserSync', 'watch']);

};