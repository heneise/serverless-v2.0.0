# Serverless 2.0.0
serverless on steroids with semantic-release, automated continuous integration and automated deployments to Google Cloud Functions.

This repo is an example for an article on how to run Serverless functions with automated, continuous deployment and semantic versioning. You can find the full article here:

https://medium.com/heneise/serverless-v2-0-0-f5ed17fac386

## Steps

### Repo & Code Setup

```sh
serverless create --template google-nodejs --path serverless-2
cd serverless-2
npm install
npm install standard tap semantic-release --save-dev
npm install -g semantic-release-cli
mkdir test && touch test/foobar-test.js
```

Add `test/foobar-test.js`:

```js
const test = require('tap').test
test('bogus', assert => {
  assert.equal(1, 1, 'bogus')
  assert.end()
})
```

Add `scripts` and `repository` in `package.json`:

```json
"scripts": {
  "start": "node index.js",
  "pretest": "standard | snazzy",
  "test": "tap --coverage --jobs-auto './test/*-test.js'",
  "semantic-release": "semantic-release"
},
"repository": {
  "type": "git",
  "url": "https://github.com/heneise/serverless-v2.0.0.git"
}
```

### Google keyfile.json

Follow the Google Credentials page to retrieve a `keyfile.json`: https://serverless.com/framework/docs/providers/google/guide/credentials

Make sure the Service account has "Editor" permissions on the project.

Instead of saving the `keyfile.json` to `~/.gcloud`, copy it directly into your project folder. Don't worry, `keyfile.json` is on `.gitignore` and won't be commited to the repository.

### Travis CI

Add `.travis.yml`:

```yaml
language: node_js
node_js:
  - '10'
notifications:
  email: false
cache:
  directories:
    - node_modules
env:
  global:
    - NODE_ENV=test
before_install:
  - 'echo "//registry.npmjs.org/:_authToken="${NPM_TOKEN} > .npmrc'
  - npm i -g npm@6
  - npm i -g serverless
install:
  - npm ci
script:
  - npm test
after_success:
  - npm run semantic-release
deploy:
  skip_cleanup: true
  provider: script
  script: serverless deploy
  on:
    branch: master
branches:
  only:
    - master
    - /^greenkeeper.*$/
```

Before setting up travis, we need to commit and push the contents to a GitHub repository:

```sh
git init
git add .
git commit -am 'initial commit'
git remote add origin git remote add origin https://github.com/heneise/serverless-v2.0.0.git
git push -u origin master
```

Head over to [travis](https://travis-ci.com/heneise/serverless-v2.0.0) and enable the repo for testing.

In order to deploy to Google Cloud Functions, you need the `keyfile.json`. And to deploy from travis, the keyfile has to be on travis. For this part, you need the `travis-cli` to encrypt the keyfile. Head to this [Travis GitHub Repo](https://github.com/travis-ci/travis.rb) for further information on how to install this. It should be as simple as `gem install travis`. Once you have the cli, you might need to log in with `travis login`.

```sh
$ travis encrypt-file keyfile.json --add
encrypting keyfile.json for heneise/serverless-v2.0.0
storing result as keyfile.json.enc
storing secure env variables for decryption

Make sure to add keyfile.json.enc to the git repository.
Make sure not to add keyfile.json to the git repository.
Commit all changes to your .travis.yml.
```

Keyfile is encrypted and ready on travvis. Next step.

### Semantic-Release

[Documentation](https://semantic-release.gitbooks.io/semantic-release/content/)

Once travis and github are set up, let's install the tokens:

```
$ semantic-release-cli setup
? What is your npm registry? https://registry.npmjs.org/
? What is your npm username? hc-eng
? What is your GitHub username? hc-eng
? What is your GitHub two-factor authentication code? XXXXXX
? What CI are you using? Travis CI
? Do you want a `.travis.yml` file with semantic-release setup? No
```

This might look different for you, if you haven't logged in with semantic-release before. We don't need the `.travis.yml` as we already configured that.

### Summary

That's it. Happy version release.
