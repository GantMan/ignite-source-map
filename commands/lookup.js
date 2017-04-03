// @cliDescription  Digests the source map file to display proper feedback
// ----------------------------------------------------------------------------

const SourceMapConsumer = require('source-map').SourceMapConsumer

/*
* Example 1:  To get one specific mapping
* ignite source-map lookup ./someFolder/index.ios.map 32:45
*
* Example 2:  To parse a stack trace string and convert it to usable output
* ignite source-map lookup ./someFolder/index.ios.map stackTrace.txt
*/
module.exports = async function (context) {

  const { print, parameters, filesystem } = context
  const { colors, error, info } = print
  const { options } = parameters

  const example = ` e.g.
    ignite source-map lookup ./someFolder/index.ios.map 32:75
    ignite source-map lookup ./someFolder/index.ios.map stackTrace.txt
  `

  const printSourceResult = (smc, position) => {
    const {source, line, column, name} = smc.originalPositionFor(position)
    const styledName = colors.red(name)
    const styledSource = colors.yellow(source)

    info(`${styledName}: ${styledSource}
    Line: ${line}
    Column: ${column}
    `)
  }

  const handleFile = (smc, stackData) => {
    // parse file for all line:column numbers
    const regexString = /(\d+):(\d+)\)/g
    let matchez = regexString.exec(stackData)

    // Loop through matches and print
    while (matchez) {
      printSourceResult(smc, {
        line: matchez[1],
        column: matchez[2]
      })
      matchez = regexString.exec(stackData)
    }
  }

  console.log(parameters)
  const mapfile = parameters.second
  const location = parameters.third
  let stackfile = null
  let line = null
  let column = null
  if (location && filesystem.exists(location)) {
    stackfile = location
  } else if (/^[\d|:]+$/.test(location)) {
    const locations = location.split(':')
    line = locations[0]
    column = locations[1] || 0
  } else {
    error(`Second parameter must be a location, either line:column or file to read ${example}`)
    process.exit(1)
  }

  // make sure mapfile is passed with line+column || stackfile supplied
  const optionsValid = (mapfile && ((line && column) || stackfile))
  if (!optionsValid) {
    error(`You must pass a mapfile AND either a line:column or a stackfile  ${example}`)
    process.exit(1)
  }

  // consume sourcemap
  const rawSourceMap = filesystem.read(mapfile)
  const smc = new SourceMapConsumer(rawSourceMap)

  if (stackfile) {
    const stackData = filesystem.read(stackfile)
    handleFile(smc, stackData)
  } else {
    printSourceResult(smc, {line, column})
  }
}

