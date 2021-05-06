# Update Golang deps tool

```shell script
bazel run //tools/update-deps
```

Gazelle does not support version management for multiple `go.mod` files [[issue](https://github.com/bazelbuild/bazel-gazelle/issues/634)]. Without this tool, you have to run `update-repo`
for every module in the repository.

This tool solves the problem by implementing the following algorithm:

1. Find all modules in the repository
2. Merge their require sections, while always picking the latest version, and write them to the root `go.mod` file
3. Install the packages using `go get` and run `update-repo` on the root `go.mod`
4. To ensure that all packages use root version of each dependency merge the require statements back and update the modules

To make this work you have to add an empty `main.go` at the root of the repository so that `go get` recognizes
it as a package.
