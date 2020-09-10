- [JavaScript at Airy](#javascript-at-airy)
  - [Dependency Management](#dependency-management)
  - [Linting and codestyle](#linting-and-codestyle)
  - [Folder structure](#folder-structure)
  - [Packaging our apps](#packaging-our-apps)
  - [React](#react)

# JavaScript at Airy

## Typescript

We use [Typescript](https://www.typescriptlang.org/) in all application code
to promote type safety and enable the use of cleaner abstractions.

Exceptions to this rules are configuration files and scripts that do not end
up in application code as well as script tags. 

## Dependency Management

We are using [yarn](https://yarnpkg.com/en/) as dependency manager for our
JavaScript applications instead of npm. It is faster and creates more reliable
version trees of our dependencies.

## Linting and codestyle

We use eslint and prettier to enforce a common look, feel and certain
guidelines in our code. Since we are using Typescript we rely on [this
tool](https://github.com/typescript-eslint/typescript-eslint) to be able to
use eslint.

The `npm run ci` task should run on the continuous integration server and
check the prettier config and the eslint warnings. A build should fail when
either eslint or prettier find errors. Eslint warnings are considered as
error.

## Folder structure

We aim to have the following folder structure in all of our JavaScript apps:

```
|- config/       = config files
|- node_modules/ = npm dependencies
|- src/          = source files
|- README.md     = readme
\- ...
```

In the root folder of the project you will find a README outlining how to run
the application locally. We also try to limit the amount of files in the root
folder to prevent it to be overcrowded.

## Packaging our apps

We favour webpack to bundle our JavaScript applications. Additionally we use
`babel-loader` to transform our modern JavaScript to something older Web
browser can understand.

## React

See the additional [React at Airy](react.md) document for details about how we
use React at Airy.
