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

ci: install fmt lint test
