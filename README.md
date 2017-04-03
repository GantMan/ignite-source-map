# ignite-source-map lookup

Parse source maps to get usable info.  Useful for reading the madness from Hockeyapp or other crash storing logs

## Install
First install [Ignite](https://github.com/infinitered/ignite), then it's as simple as:
```shell
    ignite add source-map
```

## Example

```shell
    ignite source-map lookup ./someFolder/index.ios.map 32:75
```
OR
```shell
    ignite source-map lookup ./someFolder/index.ios.map stackTrace.txt
```
