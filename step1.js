const fs = require('fs');

const cat = () => {

    try {
        const path = process.argv[2];
        const content = fs.readFileSync(path, 'utf8');
        console.log(content);
    } catch (e) {
        console.log(`Error reading file:\n  ${e}`);
    }

}

cat();