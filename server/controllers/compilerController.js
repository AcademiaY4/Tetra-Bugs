exports.runCode = async (req, res) => {
    const language = "java";
    const code = req.body.code;
    const className = req.body.className;

    // Validate the code input
    if (code === undefined || typeof code !== 'string' || code.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Empty code body" });
    }

    // Sanitize className: allow only alphanumeric characters and underscores, enforce length limit
    const sanitizedClassName = className.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 50);

    if (!sanitizedClassName) {
        return res.status(400).json({ success: false, error: "Invalid class name" });
    }

    try {
        const filePath = await generateFile(language, code, sanitizedClassName);
        const output = await executeJava(filePath, sanitizedClassName);
        return res.status(200).json({
            success: true,
            filePath: filePath,
            output: output
        });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCode = path.join(__dirname, "codes");

if (!fs.existsSync(dirCode)) {
    fs.mkdirSync(dirCode, { recursive: true });
}

const generateFile = async (format, content, className) => {
    
    const fileName = `${className}.${format}`;
    
    // Prevent path traversal by joining paths
    // Using path.basename to prevent directory traversal
    const filePath = path.join(dirCode, path.basename(fileName)); 

    // Use writeFileSync safely
    await fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    return filePath;
}

const { exec } = require('child_process');

const dirOutput = path.join(__dirname, 'outputs');

if (!fs.existsSync(dirOutput)) {
    fs.mkdirSync(dirOutput, { recursive: true });
}

const executeJava = (filePath, className) => {
    const jobId = path.basename(filePath, '.java');
    const outPath = path.join(dirOutput, `${jobId}.class`);

    return new Promise((resolve, reject) => {
        exec(`javac ${filePath} -d ${dirOutput} && cd ${dirOutput} && java ${className}`, (
            error, stdout, stderr
        ) => {
            if (error) {
                reject({ error, stderr });
            } else if (stderr) {
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
};
