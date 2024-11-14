import { spawn } from 'child_process';
import dotenv from 'dotenv';
import Airtable from 'airtable';

// Load environment variables from .env file
dotenv.config();

// Access the Airtable API key from environment variables
const apiKey = process.env.AIRTABLE_API_KEY;

if (!apiKey) {
    console.error('API key is missing! Please ensure the .env file is properly configured.');
    process.exit(1); // Exit the script if API key is missing
}

const base = new Airtable({ apiKey }).base('appcfPr9gkxX9wbty');

export default function handler(req, res) {
const pythonProcess = spawn('python', ['./view.py']);

    pythonProcess.stdout.on('data', async (data) => {
        try {
            const jsonData = JSON.parse(data.toString());
            console.log('Output from Python:', jsonData);

            for (const viewerName of jsonData) {
                const records = await base('Table 1').select({
                    filterByFormula: `FIND("${viewerName}", {User})`
                }).firstPage();

                if (records.length > 0) {
                    console.log(`Found: ${viewerName}`);
                } else {
                    console.log(`Not Found: ${viewerName}`);
                    await base('Table 1').create([{
                        "fields": {
                            "User": viewerName
                        }
                    }]);
                    console.log(`Added: ${viewerName}`);
                }
            }
            res.status(200).send('Script executed successfully');
        } catch (error) {
            console.error('Error parsing JSON output:', error);
            res.status(500).send('Error parsing JSON output');
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python: ${data.toString()}`);
        res.status(500).send(`Error from Python: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
    });
}
