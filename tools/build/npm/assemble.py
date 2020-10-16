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
import glob
import json
import shutil
import subprocess
import os
import tempfile

parser = argparse.ArgumentParser()
parser.add_argument('--package', help="NPM package to pack")
parser.add_argument('--version_file', help="Version file")
parser.add_argument('--output', help="Output archive")

args = parser.parse_args()

with open(args.version_file) as version_file:
    version = version_file.read().strip()

new_package_root = tempfile.mktemp()

shutil.copytree(args.package, new_package_root,
                ignore=lambda _, names: list(
                    filter(lambda x: 'external' in x, names)))
package_json_fn = os.path.join(new_package_root, 'package.json')

with open(package_json_fn) as f:
    package_json = json.load(f)

package_json['version'] = version

os.chmod(package_json_fn, 0o755)

with open(package_json_fn, 'w') as f:
    json.dump(package_json, f)


os.chmod(new_package_root, 0o755)
for root, dirs, files in os.walk(new_package_root):
    for d in dirs:
        os.chmod(os.path.join(root, d), 0o755)
    for f in files:
        os.chmod(os.path.join(root, f), 0o755)

subprocess.check_call([
    'npm',
    'pack'
], env={
    'PATH': ':'.join([
        '/usr/bin/',
        '/bin/',
        os.path.realpath('external/nodejs/bin/nodejs/bin/'),
        os.path.realpath('external/nodejs_darwin_amd64/bin/'),
        os.path.realpath('external/nodejs_linux_amd64/bin/'),
        os.path.realpath('external/nodejs_windows_amd64/bin/'),
    ])
}, cwd=new_package_root)

archives = glob.glob(os.path.join(new_package_root, '*.tgz'))
if len(archives) != 1:
    raise Exception('expected one archive instead of {}'.format(archives))

shutil.copy(archives[0], args.output)
shutil.rmtree(new_package_root)
