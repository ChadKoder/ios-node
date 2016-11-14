var fs = require('fs');

module.exports = function(grunt) {

 // build a list of all module names based off of the directories.
    var modules = (function () {
        var dir = 'src/js',
            files = fs.readdirSync(dir),
            stat, file, i,
            result = [];
        for (i = 0; i < files.length; i++) {
            file = files[i];
            stat = fs.statSync(dir + '/' + file);
            if (stat.isDirectory()) {
                result.push(file);
            }
        }
        return result;
    })();
	
	var pkg = grunt.file.readJSON('package.json'),
		build = grunt.template.today('yyyymmdd_HHMMss_1');
	
	var karmaConfig = {
            debug: {
                options: {
                    frameworks: ['jasmine', 'browserify'],
                    autoWatch: true,
                    files: [
						'node_modules/underscore/underscore.js',
						'node_modules/requirejs/require.js', 
						'node_modules/angular/angular.js',
						'node_modules/angular-route/angular-route.js',
						'node_modules/angular-animate/angular-animate.js',
						'node_modules/angular-aria/angular-aria.js',
						'node_modules/angular-material/angular-material.js',
						'node_modules/angular-mocks/angular-mocks.js',
						'node_modules/angular-loading-bar/build/loading-bar.js',
						//'unitTests/unitTestData.js',
						//'unitTests/unitTestMocks.js',
						'src/js/app/app.js',
                        'specs/*.spec.js'
                    ],
                    browsers: [
						'PhantomJS2'
                    ],
                    reporters: ['dots'],
                    preprocessors: {
						'specs/MainCtrl.spec.js': ['browserify'],
                    },
                    coverageReporter: {
                        type: 'lcov',
                        dir: 'tests/coverage'
                    }
                },
                singleRun: false
            }
        }

	var requiredJsFiles = [
		'node_modules/underscore/underscore.js',
		'node_modules/angular/angular.js',
		'node_modules/requirejs/require.js',
		'node_modules/angular-route/angular-route.js',
		'node_modules/angular-animate/angular-animate.js',
		'node_modules/angular-aria/angular-aria.js',
        'node_modules/angular-resource/angular-resource.js',
		'node_modules/angular-messages/angular-messages.js',
		'node_modules/angular-material/angular-material.js',
		'node_modules/angular-loading-bar/build/loading-bar.js'
		//'node_modules/photoswipe/dist/photoswipe.js',
		//'node_modules/photoswipe/dist/photoswipe-ui-default.js'
	],
	concatConfig = {
		requirements: {
			options: {
				sourceMap: false,
				banner: '/*\n' + 
				  ' * Requirements v <%=pkg.version%> (build <%=build%>)\n' +
				  ' */\n\n'
			},
			dest: 'www/js/requirements.js',
			src: requiredJsFiles,
			nonull: true
		}
	},
	jshintFiles = ['src/js/**/*.js'], 
	uglifyConfig = {
		requirements: {
			options: {
				banner: '/*\n' +
					' * Requirements v <%=pkg.version%> (build <%=build%>)\n' +
					' */\n\n'
			},
			files: {
				'www/js/requirements.min.js': 'www/js/requirements.js'
			}
		}
	};
		
		
		
	function createBannerTemplate(name) {
        return '/*\n' +
            ' * ' + name + ' v <%=pkg.version%> (build <%=build%>)\n' +
            ' * <%=grunt.template.today("yyyy")%>\n' +
            ' * Author: <%=pkg.author %> \n' +
            ' */\n\n';
    };
	
	 //builds the config options.
    (function () {
        for (var i = 0; i < modules.length; i++) {
            var module = modules[i],
                scriptsdir = 'www/js/',
                concatenatedFile = scriptsdir + module + '.js',
                minified = scriptsdir + module + '.min.js',
                moduledir = 'src/js/' + module + '/',
				//  moduledir = 'src/js/' + module + '/',
                bannerTemplate = createBannerTemplate(module);

            // Push pre-concat version to jshint first so we get accurate file names / line numbers.
            jshintFiles.push(moduledir + '/**/*.js');
			concatConfig[module] = {
				options: {
					banner: bannerTemplate,
					sourceMap: false
				},
				dest: concatenatedFile,
				src: [moduledir + module + '.js', moduledir + '/**/*.js']
			};
			
            uglifyConfig[module] = {
                options: {
                    banner: bannerTemplate
                },
                files: {}
            };

            uglifyConfig[module].files[minified] = [concatenatedFile];

            //push first party post-concat modules to ensure nothing went wrong with concat.
            jshintFiles.push(concatenatedFile);

            karmaConfig.debug.options.files.push(concatenatedFile);
        }

        //Push remaining web/js files that may not have been caught.
        //jshintFiles.push('!www/js/angular-ui.js');
    })();	
	 
	grunt.initConfig({
		clean:{
			options: {
				'no-write': false,
				'force': true
			},
			all: ['./www', './photo-dash/config.xml', './photo-dash/www']
		},
		pkg: pkg,
		build: build,
		concat: concatConfig,
		jshint: {
			files: {
				src: jshintFiles
			},
			 options: {
                    trailing: true,
                    quotmark: 'single',
                    bitwise: true,
                    forin: true,
                    browser: true,
                    "bitwise": true,
                    "camelcase": true,
                    "curly": true,
                    "eqeqeq": true,
                    "esversion": 6,
                    "forin": true,
                    "freeze": true,
                    "immed": true,
                    "indent": 4,
                    "latedef": "nofunc",
                    "newcap": true,
                    "noarg": true,
                    "noempty": true,
                    "nonbsp": true,
                    "nonew": true,
                    "plusplus": false,
                    "undef": true,
                    "unused": false,
                    "strict": false,
                    "maxparams": 10,
                    "maxdepth": 5,
                    "maxstatements": 40,
                    "maxcomplexity": 8,
                    "maxlen": 320,
                    "asi": false,
                    "boss": false,
                    "debug": false,
                    "eqnull": true,
                    "esnext": false,
                    "evil": false,
                    "expr": false,
                    "funcscope": false,
                    "globalstrict": false,
                    "iterator": false,
                    "lastsemic": false,
                    "laxbreak": false,
                    "laxcomma": false,
                    "loopfunc": true,
                    "maxerr": 50,
                    "moz": false,
                    "multistr": false,
                    "notypeof": false,
                    "proto": false,
                    "scripturl": false,
                    "shadow": false,
                    "sub": true,
                    "supernew": false,
                    "validthis": false,
                    "noyield": false,
                    "node": true,

                    globals: {
                        angular: false,
                        controller: false,
                        cordova: false,
                        //testing
                        jasmine: false,
                        module: false,
                        describe: false,
                        it: false,
                        xit: false,
                        expect: false,
                        beforeEach: false,
                        afterEach: false,
                        runs: false,
                        waits: false,
                        //mocks
                        inject: false,
                        spyOn: false
                    }
                }
		},
		uglify: uglifyConfig,
		karma: karmaConfig,
		sync: {
                main: {
                    files: [
						{
							expand: true,
							cwd: 'node_modules/photoswipe/dist',
							src: ['photoswipe.js'],
							dest: './photo-dash/www/js/'
						},
						{
							expand: true,
							cwd: 'node_modules/exif-js',
							src: ['exif.js'],
							dest: './photo-dash/www/js/'
						},
						{
							expand: true,
							cwd: 'node_modules/photoswipe/dist',
							src: ['photoswipe-ui-default.js'],
							dest: './photo-dash/www/js/'
						},
                        {
                            expand: true,
                            cwd: 'node_modules/angular-material',
                            src: ['angular-material.min.css'],
                            dest: './www/css/'
                        },
						{
                            expand: true,
                            cwd: 'node_modules/angular-loading-bar/build',
                            src: ['loading-bar.min.css'],
                            dest: './photo-dash/www/css/'
                        },
						/*{
                            expand: true,
                            cwd: 'lib/angular-photoswipe',
                            src: ['angular-photoswipe.css'],
                            dest: './photo-dash/www/css/'
                        },*/
						/*{
							expand: true,
							cwd: 'lib/angular-photoswipe',
							src: ['angular-photoswipe.min.js'],
							dest: './photo-dash/www/js/'
						},*/
						{
                            expand: true,
                            cwd: 'node_modules/photoswipe/dist',
                            src: ['photoswipe.css'],
                            dest: './photo-dash/www/css/'
                        },
						/*{
							expand: true,
							cwd: 'lib/jquery/',
							src: ['jquery-3.1.1.min.js'],
							dest: './photo-dash/www/js/'
						},*/
						{
                            expand: true,
                            cwd: 'node_modules/photoswipe/dist/default-skin',
                            src: ['default-skin.css'],
                            dest: './photo-dash/www/css/'
                        },
						{
                            expand: true,
                            cwd: 'node_modules/photoswipe/dist/default-skin',
                            src: ['default-skin.png', 'preloader.gif', 'default-skin.svg'],
                            dest: './photo-dash/www/res/'
                        },
						{
							expand: true,
							cwd: 'src/res',
							src: ['icon-transfer.png','ic_photo_camera.svg', 'ic_add.svg', 'ic_delete_forever.svg', 'ic_file_upload.svg',
                            'ic_people.svg', 'ic_restore.svg', 'ic_play_circle_filled.svg', 'ic_settings.svg', 'ic_info_outline.svg'
                            ],
							dest: './photo-dash/www/res/'
						},
						{
                            expand: true,
                            cwd: 'src/fonts',
                            src: ['Capture_it.ttf', 'Capture_it_2.ttf', 'ColabLig.otf'],
                            dest: './photo-dash/www/fonts/'
                        },
						{
                            expand: true,
                            cwd: 'src/css',
                            src: ['styles.css'],
                            dest: './photo-dash/www/css/'
                        },
                        {
                            expand: true,
                            cwd: 'node_modules/angular-material',
                            src: ['angular-material.min.css'],
                            dest: './photo-dash/www/css/'
                        },
						{
							expand: true,
							cwd: 'src',
							src: ['index.html'],
							dest: './photo-dash/www/'
						},
						{
							expand: true,
							cwd: 'src',
							src: ['config.xml'],
							dest: './photo-dash/'
						},
						{
							expand: true,
							cwd: 'src/res',
							src: ['icon-transfer.png'],
							dest: './photo-dash/www/res/'
						},
						{
							expand: true,
							cwd: 'src/res/screen/ios',
							src: ['Default_2x_iphone.png'],
							dest: './photo-dash/www/res/screen/ios'
						},
						{
							expand: true,
							cwd: 'src/js/app',
							src: ['app.js'],
							dest: './photo-dash/www/js/'
						},
						{
							expand: true,
							cwd: 'www/js',
							src: ['requirements.js', 'controllers.js', 'directives.js',  'services.js'],
							dest: './photo-dash/www/js/'
						},
						{
							expand: true,
							cwd: 'src/views',
							src: ['*.html'],
							dest: './photo-dash/www/views/'
						}
                    ]
                }
		}
	});

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-sync');
	
	grunt.registerTask('default', ['clean', 'concat', 'uglify', 'sync']);
	grunt.registerTask('test', ['clean', 'concat', 'uglify', 'sync',  'karma']);
	
};