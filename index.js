import express from'express';
import { readFileSync} from 'node:fs';
import {writeFile} from "node:fs/promises";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const canciones_file = readFileSync("canciones.json");
const canciones = JSON.parse(canciones_file);

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/index.html");
})

app
    .route("/canciones")
    
    .post((req, res) => {
        req.body.id = req.body.id + ""; //necesario debido a que de lo contrario se archiva como número, no como string.
        canciones.push(req.body);
        writeFile("canciones.json", JSON.stringify(canciones));
        res.json(canciones);
    
    })
    .get((req, res) => {
        res.json(canciones);
    });

 app
    .route("/canciones/:id")

    .put((req, res) => {
        const id = req.params.id;
        const index = canciones.map(cancion => cancion.id).indexOf(id);
        canciones[index] = req.body;
        writeFile("canciones.json", JSON.stringify(canciones));
        res.json(canciones);
    })

    .delete(async (req, res) => {
        const id = req.params.id;
        const index = canciones.map(cancion => cancion.id).indexOf(id);
        canciones.splice(index, 1);
        writeFile("canciones.json", JSON.stringify(canciones));
        res.json(canciones);
    });

app.listen(5000, console.log("app listening on port 5000"));
