#!/bin/bash

while getopts s: option
do
    case $option in

    s)  SED_FILE=${OPTARG}
        ;;

    esac
done

if [ -z "${SED_FILE}" ]  || [ $# != 3 ]
then
  echo "Usage: $0 -s [sed file] [folder]"
  exit -1;
fi

# Skip passed the options
shift `expr $OPTIND - 1`

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    *)          MACHINE="UNKNOWN:${unameOut}"
esac

if [[ "${MACHINE}" == "Mac" ]]
then
  find $1 -type f -regex ".*/*.\(js\)" | xargs -I{} sed -i '' -f ${SED_FILE} {}
  find $1 -type f -regex ".*/*.\(html\)" | xargs -I{} sed -i '' -f ${SED_FILE} {}
else
  find $1 -type f -regex ".*/*.\(js\)" | xargs -I{} sed -i -f ${SED_FILE} {}
  find $1 -type f -regex ".*/*.\(html\)" | xargs -I{} sed -i -f ${SED_FILE} {}
fi
