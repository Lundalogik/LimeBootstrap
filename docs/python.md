Install and configure python
=======================

Some help on making python work on windows.

##Helper scripts
In the folder "PythonHelpers" where are a few helpers to make the process easier.
The script collection is refered to as __$pyh__.

##Install python
open cmd and run __$pyh/Install.bat__. This will:

+ Install python 2 and 3
+ Install pip
+ Install virutalenvironment
+ Install virtualenvironmentWrapper

##Woring with virtual environment

###Create environment
open cmd and run __$pyh/CreateEnvironment.bat__.

It takes 3 parameters.

+ Python version 2/3
+ Name of environment
+ Path to project files

This will install an set everything up.

### Activate virtual environment
	workon [<name>]

### Deactive virtual environment
	deactivate

### Install dependecies
	pip install -r requirements.txt`	

## Setup environment variables
To set environment variables such as github credentials. Create a file named
`.env` in the prject root and list key-value pairs as
`KEY=VAL`

Also add key "PYTHONUNBUFFERED=true" for immeiate console output

####Example
	PYTHONUNBUFFERED=true
	GITHUB_USER=xxx
	GITHUB_PASSWORD=yyy

## Starting webproject for services
`honcho start`

## Working with heroku (optional)
The service and documentation platform is hosted on heroku.
If you are to be working with heroku you may have to install the toolbelt.
Make sure to install into a path without spaces. Standard path may not work.

	https://toolbelt.heroku.com/windows

### Publish to heroku using git
Publishing to heroku is done by commiting to a specific git repo.

Setup the heroku repos as remotes to you local repo

	heroku git:remote -a limebootstrapservices -r heroku
	heroku git:remote -a limebootstrapservices-dev -r heroku-dev

Send keys of you have not alread done so

	heroku keys:add

Publish to heroku

	git push heroku-dev master

to publish from another branch then master use
	
	git push heroku-dev <my branch>:master

Check the logs

	heroku logs --app limebootstrapservices-dev

Environments real addresses are located on the following urls, production is alias under _limebootstrap.lundalogik.se_.

	http://limebootstrapservices.herokuapp.com/
	http://limebootstrapservices-dev.herokuapp.com/

Some environment variables will have to be present on both environments similar to en _.env_ file on local enviroment.

	heroku config:set GITHUB_USER=xxx --app limebootstrapservices-dev
	heroku config:set GITHUB_PASSWORD=yyy --app limebootstrapservices-dev 


## Working with powershell (optional)
Add python environment path.
Set path as administrator and set it for whole machine

```
[Environment]::SetEnvironmentVariable("Path", "$env:Path;C:\Python33\;C:\Python33\Scripts\", "Machine")
```
### Change powershell executionpolicy
`Set-ExecutionPolicy Unrestricted`