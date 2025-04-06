# 🐻‍❄️🐳 docker-manifest-action: Tiny, simple GitHub Action to link Docker manifests easily
# Copyright (c) 2022-2025 Noelware, LLC. <team@noelware.org>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
{
  description = "🐻‍❄️🐳 Tiny, simple GitHub Action to link Docker manifests easily";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
  };

  outputs = { nixpkgs, systems, ... }: let
    eachSystem = nixpkgs.lib.genAttrs (import systems);
    nixpkgsFor = system: import nixpkgs { inherit system; };
  in {
    formatter = eachSystem(system: (nixpkgsFor system).alejandra);
    devShells = eachSystem(system: let pkgs = nixpkgsFor system; in {
      default = import ./nix/devshell.nix {inherit pkgs;};
    });
  };
}
