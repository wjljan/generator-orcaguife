const Generator = require('yeoman-generator');
const yosay = require('yosay');
const chalk = require('chalk');
const {dfsReader} = require('./utils/fileReader');
const clearConsole = require('./utils/clearConsole');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
	initializing (){
		clearConsole();
		this.log(yosay(chalk.cyan(`Welcome to ${chalk.green('orcaguife')} project setup wizard, please follow the interactions to complete it: \n`)));
	}

	async prompting (){
		this.answers = await this.prompt([
			{
				type: 'input',
				name: 'name',
				message: `What's project's name?'`,
				// Default to current folder name.
				default: this.appname
			}, {
				type: 'input',
				name: 'version',
				message: `What's project's version?'`,
				default: '0.1.0'
			}, {
				type: 'input',
				name: 'description',
				message: `What's project description?'`,
				default: `${this.appname} project description`
			}, {
				type: 'input',
				name: 'author',
				message: `What's project's author?'`,
				default: `${this.appname} R&D team`
			}, {
				type: 'confirm',
				name: 'installDependenciesForProject',
				message: `Install the dependencies of project by npm? Before choose yes, make sure your npm registry is switched or you're in an internet environment.'`,
				default: false
			}
		]);
		this.log(chalk.cyan('\nStarts writing files...\n'));
	}

	writing (){
		// Make folders.
		const folderPaths = [
			'config', 'coverage', 'public', 'scripts',
			'src/components', 'src/http', 'src/images', 'src/redux', 'src/routerPath',
			'src/services', 'src/socket', 'src/styleSheets', 'src/tests', 'src/views'
		];
		folderPaths.forEach(path => mkdirp(path));

		// Write files.
		// Replace keyword collected from the interaction with user.
		const {name, version, description, author,} = this.answers;

		// Store the custom files raw blob content in memory.
		const packageJOSNPath = './package.json';
		const indexHTMLPath = './public/index.html';

		const packageJOSNBuffer = this.fs.read(this.templatePath(packageJOSNPath), {raw: true});
		const indexHTMLBuffer = this.fs.read(this.templatePath(indexHTMLPath), {raw: true});

		// Custom the files with parameters provided by users through prompt interaction.
		this.fs.extendJSON(this.templatePath('./package.json'), {
			name,
			version,
			description,
			author,
			repository: {
				type: 'git',
				url: `http://gitlab.orcadt.com/Orcadt/${name}.git`
			}
		});
		this.fs.copyTpl(
			this.templatePath('./public/index.html'),
			this.templatePath('./public/index.html'),
			{name}
		);

		// Write files.
		const filePaths = dfsReader(this.templatePath());
		filePaths.forEach(filePath => {
			this.fs.copy(
				this.templatePath(filePath),
				this.destinationPath(filePath)
			);
		});
		this.numberOfFiles = filePaths.length;

		// Restore custom files, delete customized files, and write raw ones from memory for next use.
		this.fs.delete(this.templatePath(packageJOSNPath));
		this.fs.write(this.templatePath(packageJOSNPath), packageJOSNBuffer);
		
		this.fs.delete(this.templatePath(indexHTMLPath));
		this.fs.write(this.templatePath(indexHTMLPath), indexHTMLBuffer);
	}

	install (){
		const {installDependenciesForProject} = this.answers;
		if (installDependenciesForProject){
			this.log(chalk.cyan('\nStarts installing dependencies for your project...'));
			// this.spawnCommandSync('npm', ['i']);
			this.npmInstall();
		}
	}

	end (){
		const {name} = this.answers;
		this.log(chalk.cyan('\nAll dependencies were installed.'));
		this.log(chalk.cyan(`\n${this.numberOfFiles} files were written.`));
		this.log(chalk.green(`\nSetup project named "${name}" successfully!`));
		this.log(chalk.cyan('\nVersions of the main dependencies are as follows:'));
		const dependencies = this.fs.readJSON(this.templatePath('./package.json')).dependencies;
		['webpack', 'webpack-dev-server', 'babel-core', 'react', 'redux', 'react-redux', 'react-router', 'antd']
		.forEach(module => {
			this.log(`${module} ${chalk.green(dependencies[module])}`);
		});
		this.log(chalk.cyan(`\nSee details in documents ${chalk.white('package.json')} and ${chalk.white('README.rd')}.`));
		this.log(chalk.cyan(`\nThank you for using ${chalk.green('orcaguife')}, enjoy your project journey.`));
	}
};

/**
 * Lifecycle descriptions of Generator for reference:
 *
 * @initializing  // Get current project status and the basic opts.
 * @prompting      // Interact with user by show some prompts and get answers.
 * @configuring    // Save configuration information and generate configuration files, such as files with name that starts with '.'.
 * @default        // Running all the unmatched, un-lifecycle, custom private methods(tasks) automatically in sequence and priority.
 * @writing        // Write the files of new project according to the template.
 * @conflicts      // Handler the conflicting files, always running in internal. Often, we don't need th handle them.
 * @install        // Use the specified module management tool to install the dependencies, like: npm, yarn, bower, etc.
 * @end            // Operation completed, do some finishing work, such as: clear the terminal screen，output completion information, say 'goodbye', etc.
 *
 */