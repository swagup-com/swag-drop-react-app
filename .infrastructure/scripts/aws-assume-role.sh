#!/bin/bash

AWS_ROLE=""

while getopts r: option
do
    case $option in

    r)  AWS_ROLE=${OPTARG}
        ;;

    esac
done

# Skip passed the options
shift `expr $OPTIND - 1`

if [[ "${AWS_ROLE}" != "" ]]
then
  CREDS=$(aws sts assume-role --role-arn ${AWS_ROLE} --role-session-name ci-user 2>/dev/null)

  if (( $? == 0 ))
  then
    export AWS_ACCESS_KEY_ID=$(echo ${CREDS} | jq -r '.Credentials.AccessKeyId')
    export AWS_SECRET_ACCESS_KEY=$(echo ${CREDS} | jq -r '.Credentials.SecretAccessKey')
    export AWS_SESSION_TOKEN=$(echo ${CREDS} | jq -r '.Credentials.SessionToken')
  fi
fi

$*
