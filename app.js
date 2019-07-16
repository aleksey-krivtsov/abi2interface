'use strict';

const fs = require('fs');
const ArgumentParser = require('argparse').ArgumentParser;
const path = require('path');

const parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'ABI2Interface',
    action: 'Action'
});

parser.addArgument(
    [ '-f', '--file' ],
    {
        help: 'json abi file to parse',
        required: true
    }
);
parser.addArgument(
    [ '-o', '--output' ],
    {
        help: 'Solidity output file',
        defaultValue: './Out.sol'
    }
);

const args = parser.parseArgs();

const data = JSON.parse(fs.readFileSync(path.normalize(args.file)));
const output_file = path.normalize(args.output);

fs.writeFileSync(output_file, 'contract Out {\n\n');

const parseArgs = (inputs) => {
    let args = [];
    for(let i = 0; i < inputs.length; i++) {
        args.push(inputs[i].type + ' ' + inputs[i].name);
    }

    return args.join(', ');
};

for(let i = 0; i < data.length; i++) {
    fs.appendFileSync(output_file, `\t${data[i].type} ${data[i].name}(${parseArgs(data[i].inputs)})`);

    if(data[i].outputs && data[i].outputs.length > 0) {
        fs.appendFileSync(output_file, ` returns (${parseArgs(data[i].outputs)})`);
    }

    fs.appendFileSync(output_file, `;\n`);

}

fs.appendFileSync(output_file, '}');
