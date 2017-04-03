# ignite-source-map lookup

Parse source maps to get usable info.  Useful for reading the madness from Hockeyapp or other crash storing logs

## Example

```shell
    ignite source-map lookup ./someFolder/index.ios.map 32:75
```
OR
```shell
    ignite source-map lookup ./someFolder/index.ios.map stackTrace.txt
```
