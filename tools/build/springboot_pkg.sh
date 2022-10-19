#!/bin/bash

# This script outputs a proper Spring Boot executable jar.
# This script is callable from a Bazel build (via a genrule in springboot.bzl).
# It takes a standard Bazel java_binary output executable jar and 'springboot-ifies' it.
# See springboot.bzl to see how it is invoked from the build.
# You should not be trying to invoke this file directly from your BUILD file.

RULEDIR=$(pwd)
# MAINCLASS=$1
OUTPUTJAR=$2
APPJAR=$3
# APPJAR_NAME=$4
MANIFEST=$5

# This output is really spammy, suppress unless you need it
#echo "SPRING BOOT PACKAGER FOR BAZEL"
#echo "  RULEDIR         $RULEDIR     (build working directory)"
#echo "  MAINCLASS       $MAINCLASS   (classname of the @SpringBootApplication class for the MANIFEST.MF file entry)"
#echo "  OUTPUTJAR       $OUTPUTJAR   (the executable JAR that will be built from this rule)"
#echo "  APPJAR          $APPJAR      (contains the .class files for the Spring Boot application)"
#echo "  APPJAR_NAME     $APPJAR_NAME (unused, is the appjar filename without the .jar extension)"
#echo "  MANIFEST        $MANIFEST    (the location of the generated MANIFEST.MF file)"
#echo "  DEPLIBS         (list of upstream transitive dependencies, these will be incorporated into the jar file in BOOT-INF/lib )"
#i=6
#while [ "$i" -le "$#" ]; do
#  eval "lib=\${$i}"
#  printf '%s\n' "     DEPLIB:      $lib"
#  i=$((i + 1))
#done
#echo ""

# Setup working directories
mkdir -p outputjar/BOOT-INF/lib
mkdir -p outputjar/BOOT-INF/classes

# Extract the compiled Boot application classes into BOOT-INF/classes
#    this must include the application's main class (annotated with @SpringBootApplication)
cd "$RULEDIR"/outputjar/BOOT-INF/classes || exit
jar -xf "$RULEDIR/$APPJAR"

# Copy all transitive upstream dependencies into BOOT-INF/lib
#   The dependencies are passed as arguments to the script, starting at index 5
cd "$RULEDIR"/outputjar || exit
i=6
while [ "$i" -le "$#" ]; do
  eval "lib=\${$i}"
  libname=$(basename $lib)

  if [[ $libname == *spring-boot-loader* ]]; then
    # if libname is prefixed with the string 'spring-boot-loader' then...
    # the Spring Boot Loader classes are special, they must be extracted at the root level /,
    #   not in BOOT-INF/lib/loader.jar nor BOOT-INF/classes/**/*.class
    # we only extract org/* since we don't want the toplevel META-INF files
    jar xf "$RULEDIR"/"$lib" org
  else
    cp "$RULEDIR"/"$lib" BOOT-INF/lib
  fi

  i=$((i + 1))
done

# Create the output jar
# Note that a critical part of this step is to pass option 0 into the jar command
# that tells jar not to compress the jar, only package it. Spring Boot does not
# allow the jar file to be compressed (it will fail at startup).
cd "$RULEDIR"/outputjar || exit

ls -d **/* | sort > list.txt

echo list.txt

jar -cfm0 ../"$OUTPUTJAR" ../"$MANIFEST" @list.txt

cd "$RULEDIR" || exit
