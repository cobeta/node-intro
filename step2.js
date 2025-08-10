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

const argument = process.argv[2];

(async () => {
    if (argument.startsWith('http')) {
        console.log(await webCat(argument));
    } else {
        console.log(cat(argument));
    }
})();
