#!/usr/bin/env bash

set -e

usage() {
	echo "usage: $0 [--push]"
	echo "where: "
	echo "       --push: (optional) flag to push docker image tag"
	echo ""
	echo "your args: $@"
	exit 1
}

push_flag=$1

if [[ -n "$push_flag" && "$push_flag" != '--push' ]]; then
	usage $@
fi

if [[ ! -f "package.json" ]]; then
	echo "This script is meant to be executed from project root"
	echo "  $ docker/build.sh"
	exit -1
fi

if [[ ! -d dist/apps/api ]]; then
	echo "This script expects the api project to be built"
	echo "  $ yarn build api --prod --skip-nx-build-cache"
	exit -1
fi

if [[ ! -d dist/apps/socket-server ]]; then
	echo "This script expects the socket-server project to be built"
	echo "  $ yarn build socket-server --prod --skip-nx-build-cache"
	exit -1
fi

if [[ ! -d dist/apps/worker ]]; then
	echo "This script expects the socket-server project to be built"
	echo "  $ yarn build worker --prod --skip-nx-build-cache"
	exit -1
fi

# NOTE: setup a aws profile named `wst-default` with your credentials first
# https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html
export AWS_PROFILE='wst-default'
export AWS_DEFAULT_REGION='us-east-2'
AWS_ACCOUNT="680712662822"
REGISTRY="${AWS_ACCOUNT}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"

echo "authenticating: ${REGISTRY}"
aws ecr get-login-password | docker login --username AWS --password-stdin ${REGISTRY}

TAG="$(date +%Y%m%d)-$(git rev-parse --short HEAD)"

API_IMAGE="${REGISTRY}/whosaidtrue/api:${TAG}"
echo "building: ${API_IMAGE}"
docker build . -t ${API_IMAGE} -f docker/api/Dockerfile

SOCKET_IMAGE="${REGISTRY}/whosaidtrue/socket-server:${TAG}"
echo "building: ${SOCKET_IMAGE}"
docker build . -t ${SOCKET_IMAGE} -f docker/socket-server/Dockerfile

WORKER_IMAGE="${REGISTRY}/whosaidtrue/worker:${TAG}"
echo "building: ${WORKER_IMAGE}"
docker build . -t ${WORKER_IMAGE} -f docker/worker/Dockerfile


if [[ -n "$push_flag" ]]; then
	echo "pushing: ${API_IMAGE}"
	docker push "${API_IMAGE}"

	echo "pushing: ${SOCKET_IMAGE}"
	docker push "${SOCKET_IMAGE}"

	echo "pushing: ${WORKER_IMAGE}"
	docker push "${WORKER_IMAGE}"
fi
