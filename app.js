import express from "express";
import path from "path";
import {fileURLToPath} from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static Middleware 
app.use(express.static(path.join(__dirname, 'dist')));
 
app.listen(8080, function(error){ 
    if(error) throw error;
    console.log("Server created Successfully");
});