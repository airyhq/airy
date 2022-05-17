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

npm_token = os.getenv('DEPLOY_NPM_EMAIL')

if not npm_token:
    raise Exception(
        'token should be passed via '
        '$DEPLOY_NPM_TOKEN env variable'
    )

node_path = ':'.join([
    '/usr/bin/',
    '/bin/',
    os.path.realpath('external/nodejs/bin/nodejs/bin/'),
    os.path.realpath('external/nodejs_darwin_amd64/bin/'),
    os.path.realpath('external/nodejs_linux_amd64/bin/'),
    os.path.realpath('external/nodejs_windows_amd64/bin/'),
])

subprocess.check_call([
    'npm',
    'publish',
    '--registry={}'.format(npm_registry),
    '--token={}'.format(npm_token),
    'deploy_npm.tgz'
], env={
    'PATH': node_path
})
