{
  description = "A Nix-flake-based Node.js development environment for Xyter";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };

  outputs = { self, flake-utils, nixpkgs }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (self: super: rec { nodejs = super.nodejs-19_x; }) ];
        pkgs = import nixpkgs { inherit overlays system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            node2nix
            docker
            nodejs

            # Node Packages
            nodePackages.typescript
            nodePackages.prisma
          ];
          shellHook = with pkgs; ''
            export PRISMA_MIGRATION_ENGINE_BINARY="${prisma-engines}/bin/migration-engine"
            export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine"
            export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node"
            export PRISMA_INTROSPECTION_ENGINE_BINARY="${prisma-engines}/bin/introspection-engine"
            export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt"
          '';
        };
      });
}
