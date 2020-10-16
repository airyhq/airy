#!/usr/bin/env python

#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#


import argparse
import os
import subprocess
import shutil
import re

# usual importing is not possible because
# this script and module with common functions
# are at different directory levels in sandbox
import tempfile

parser = argparse.ArgumentParser()
parser.add_argument('repo_type')
args = parser.parse_args()

repo_type = args.repo_type
npm_repositories = {
    "snapshot": "{snapshot}",
    "release": "{release}",
}
npm_registry = npm_repositories[repo_type]

npm_username, npm_password, npm_email = (
    os.getenv('DEPLOY_NPM_USERNAME'),
    os.getenv('DEPLOY_NPM_PASSWORD'),
    os.getenv('DEPLOY_NPM_EMAIL'),
)

if not npm_username:
    raise Exception(
        'username should be passed via '
        '$DEPLOY_NPM_USERNAME env variable'
    )

if not npm_password:
    raise Exception(
        'password should be passed via '
        '$DEPLOY_NPM_PASSWORD env variable'
    )

if not npm_email:
    raise Exception(
        'email should be passed via '
        '$DEPLOY_NPM_EMAIL env variable'
    )

expect_input_tmpl = '''spawn npm adduser --registry={registry}
expect {{
  "Username:" {{send "{username}\r"; exp_continue}}
  "Password:" {{send "$env(PASSWORD)\r"; exp_continue}}
  "Email: (this IS public)" {{send "{email}\r"; exp_continue}}
}}'''

with tempfile.NamedTemporaryFile('wt', delete=False) as expect_input_file:
    expect_input_file.write(expect_input_tmpl.format(
        registry=npm_registry,
        username=npm_username,
        email=npm_email,
    ))

node_path = ':'.join([
    '/usr/bin/',
    '/bin/',
    os.path.realpath('external/nodejs/bin/nodejs/bin/'),
    os.path.realpath('external/nodejs_darwin_amd64/bin/'),
    os.path.realpath('external/nodejs_linux_amd64/bin/'),
    os.path.realpath('external/nodejs_windows_amd64/bin/'),
])

with open(expect_input_file.name) as expect_input:
    subprocess.check_call([
        '/usr/bin/expect',
    ], stdin=expect_input, env={
        'PATH': node_path,
        'PASSWORD': npm_password
    })

subprocess.check_call([
    'npm',
    'publish',
    '--registry={}'.format(npm_registry),
    'deploy_npm.tgz'
], env={
    'PATH': node_path
})
