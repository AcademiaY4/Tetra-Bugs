exports.runCode = async(req, res) => {
    const language = "java"
    const code = req.body.code
    const className = req.body.className

    if (code === undefined) {
        return res.status(400).json({ success: false, error: "Empty code body" })
    }
    /**
     * limit the max characters of code length
     * Below its considered as 1000 chars
     */
    if (code.length > 1000) {
        return res.status(400).json({ success: false, error: "Code too large" });
    }
    
    try {
        const filePath = await generateFile(language, code, className)
        const output = await executeJava(filePath, className)
        return res.status(200).json({
            success: true,
            filePath: filePath,
            output: output
        })
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}

//file path generating for code
const fs = require('fs')
const path = require('path')
const { v4: uuid } = require('uuid')

const dirCode = path.join(__dirname, "codes")

if (!fs.existsSync(dirCode)) {
    fs.mkdirSync(dirCode, { recursive: true })
}

const generateFile = async(format, content, className) => {
    const jobId = uuid()
    const fileName = `${className}.${format}`
    const filePath = path.join(dirCode, fileName)
    await fs.writeFileSync(filePath, content)
    return filePath

}

// Sanitize input function to avoid from malicious command inputs
const sanitizeInput = (input) => {
    return typeof input === 'string' ? input.replace(/[^a-zA-Z0-9_]/g, '') : ''; // Only alphanumeric and underscores allowed.
};

//executing the code
const { exec, execFile } = require('child_process');


const dirOutput = path.join(__dirname, 'outputs');

if (!fs.existsSync(dirOutput)) {
    fs.mkdirSync(dirOutput, { recursive: true });
}

// Modified executeJava function adding execFile for preventing the command injection vulnerability
const executeJava = (filePath, className) => {
    return new Promise((resolve, reject) => {
        const sanitizedClassName = sanitizeInput(className);
        execFile('javac', [filePath, '-d', dirOutput], (error, stdout, stderr) => {
            if (error || stderr) return reject({ error, stderr });
            
            execFile('java', ['-cp', dirOutput, sanitizedClassName], (error, stdout, stderr) => {
                if (error || stderr) return reject({ error, stderr });
                resolve(stdout);
            });
        });
    });
};

// existing code wroteusing exec 
/*const executeJava = (filePath, className) => {
    const jobId = path.basename(filePath, '.java');
    const outPath = path.join(dirOutput, `${jobId}.class`);

    return new Promise((resolve, reject) => {
        exec(`javac ${filePath} -d ${dirOutput} && cd ${dirOutput} && java ${className}`, (
            error, stdout, stderr
        ) => {
            error && reject({ error, stderr })
            stderr && reject(stderr)
            resolve(stdout)
        });
    });
};*/