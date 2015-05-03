module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var buildConfig = require('./bower.json').buildConfig || {};
    buildConfig.layout = buildConfig.layout || {};
    buildConfig.layout.app = buildConfig.layout.app || 'app';
    buildConfig.layout.dist = buildConfig.layout.dist || 'dist';
    var proxyRequest = require('grunt-connect-proxy/lib/utils').proxyRequest,
        resolvePath = require('path').resolve;

    function mountFolder(connect, dir) {
        return connect.static(resolvePath(dir));
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        project : {
            app: buildConfig.layout.app,
            dist : buildConfig.layout.dist
        },
        // Automatically inject Bower components into the app
        bowerInstall: {
            target: {

                // Point to the files that should be updated when 
                // you run `grunt bower-install` 
                src: [
                    'app/views/**/*.html',
                    'app/styles/main.scss'
                ],
            }
        },
        wiredep: {

            task: {

                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
                    'app/index.html',   // .html support...
                    'app/views/**/*.jade',   // .jade support...
                    'app/styles/main.scss',  // .scss & .sass support...
                    'app/config.yml'         // and .yml & .yaml support out of the box!
                ],

                options: {

                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= dist %>/*',
                        '!<%= dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        concurrent: {
            server: [
                'compass:server'
            ],
            test: [
                'compass'
            ],
            dist: [
                'compass:dist',
                'imagemin',
                'svgmin'
            ]
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= app %>/images',
                javascriptsDir: '<%= app %>/scripts',
                fontsDir: '<%= app %>/styles/fonts',
                importPath: 'app/bower_components',
                httpImagesPath: '<%= app %>/images',
                httpGeneratedImagesPath: '<%= app %>/images/generated',
                httpFontsPath: '<%= app %>/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= dist %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            proxies: buildConfig.server ? [
                {
                    context: buildConfig.server.context,
                    host: buildConfig.server.host,
                    port: buildConfig.server.port,
                    https: buildConfig.server.https || false,
                    changeOrigin: false,
                    xforward: false
                }
            ] : [],
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= app %>'
                    ],
                    middleware: function (connect) {
                        return [
                            proxyRequest,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, buildConfig.layout.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= layout.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= dist %>'
                }
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= app %>/scripts/**/*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            compass: {
                files: ['<%= app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= app %>/views/**/.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },




    });



    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'wiredep',
            'concurrent:server',
            'autoprefixer',
            'configureProxies',
            'connect:livereload',
            'watch'
        ]);
    });
    
    grunt.registerTask('tmp', function (target) {
          grunt.task.run(['wiredep']);
    });
};