install:
  bun install

build: install
  bun run build

test: install
  bun run test

fmt: install
  bun run format

lint: install
  bun run lint

docs:
  bun run docs

ci: install lint test

prepare-release revision='master':
  #!/usr/bin/env bash
  set -euxo pipefail
  git checkout {{ revision }}
  git pull origin {{ revision }}
  echo >> CHANGELOG.md
  git log --pretty='format:- %s' >> CHANGELOG.md
  $EDITOR CHANGELOG.md
  $EDITOR package.json
  $EDITOR docs/generateHtml.ts
  version=$(grep -m1 '"version":' package.json | cut -d'"' -f4)
  bun update
  just ci 
  git checkout -b release-$version
  git add -u
  git commit -m "Release $version"
  gh pr create --web

publish-release revision='master':
  #!/usr/bin/env bash
  set -euxo pipefail
  rm -rf tmp/release
  git clone https://github.com/raphjaph/ordapi.git tmp/release
  cd tmp/release
  git checkout {{ revision }}
  bun install
  bun run build
  bun publish
  cd ../..
  rm -rf tmp/release
