import fetch from 'node-fetch';
import dotenv from 'dotenv';
import Airtable from 'airtable';

dotenv.config();

const apiKey = process.env.AIRTABLE_API_KEY;

if (!apiKey) {
    console.error('API key is missing! Please ensure the .env file is properly configured.');
    process.exit(1);
}

const base = new Airtable({ apiKey }).base('appcfPr9gkxX9wbty');

export default async function handler(req, res) {
    try {
        const response = await fetch('https://ngl-remake-live-test-jiyiow0ia-deepan-alves-projects.vercel.app/api/run-python');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
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
        console.error('Error:', error);
        res.status(500).send('Error executing script');
    }
}
