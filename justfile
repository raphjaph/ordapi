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

publish:
  bun publish
