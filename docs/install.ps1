# The Taotie Windows installer lives at https://taotie.conouch.io/install.ps1
# This shim keeps old `iwr ... github.io ... | iex` one-liners working.
$ErrorActionPreference = 'Stop'
Invoke-Expression (Invoke-RestMethod -UseBasicParsing https://taotie.conouch.io/install.ps1)
