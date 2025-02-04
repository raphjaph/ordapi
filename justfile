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

prepare-changelog revision='master':
  #!/usr/bin/env bash
  set -euxo pipefail
  git checkout {{ revision }}
  git pull origin {{ revision }}
  echo >> CHANGELOG.md
  git log --pretty='format:- %s' >> CHANGELOG.md
  $EDITOR CHANGELOG.md

publish:
  bun publish
