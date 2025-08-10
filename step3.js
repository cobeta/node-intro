const fs = require('fs');
const axios = require('axios');

const webCat = async (URL) => {
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (e) {
        return `Error fetching ${URL}:\n  ${e.message}`;
    }
}

const cat = (path) => {
    try {
        return fs.readFileSync(path, 'utf8');
    } catch (e) {
        return `Error reading file ${path}:\n  ${e.message}`;
    }
}

const processArguments = () => {
    const args = process.argv.slice(2);

    if (args.length === 1) {
        const input = args[0];
        if (input.startsWith('http') || fs.existsSync(input)) {
            return { mode: 'single', input };
        } else {
            throw new Error('Argument must be a valid file path or a URL.');
        }
    } else if (args.length === 3) {
        const [flag, outPath, input] = args;
        if (flag !== '--out') {
            throw new Error('Invalid option.');
        }
        if (!outPath || typeof outPath !== 'string') {
            throw new Error('Second argument must be a valid output file path.');
        }
        if (input.startsWith('http') || fs.existsSync(input)) {
            return { mode: 'out', outPath, input };
        } else {
            throw new Error('Third argument must be a valid file path or a URL.');
        }
    } else {
        throw new Error('Invalid number of arguments. Must be 1 or 3.');
    }
};

(async () => {
    let argsInfo;
    try {
        argsInfo = processArguments();
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }

    if (argsInfo.mode === 'single') {
        if (argsInfo.input.startsWith('http')) {
            console.log(await webCat(argsInfo.input));
        } else {
            console.log(cat(argsInfo.input));
        }
    } else if (argsInfo.mode === 'out') {
        let data;
        if (argsInfo.input.startsWith('http')) {
            data = await webCat(argsInfo.input);
        } else {
            data = cat(argsInfo.input);
        }
        fs.writeFileSync(argsInfo.outPath, data, 'utf8');
    }
})();
