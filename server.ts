import * as express from 'express';
import * as path from 'path';

const port = process.env.PORT || 8080;

let app = express();

app.use(express.static(__dirname));

app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, (err) =>{
    if (err) {
        return console.log(err);
    }

    return console.log(`Server is running on port: ${port}`);
});