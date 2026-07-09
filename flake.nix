{
  description = "A simple Lua development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      utils,
    }:
    utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };

        luaEnv = pkgs.lua5_4.withPackages (ps: [
          ps.busted
        ]);
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            luaEnv
          ];
        };
      }
    );
}
