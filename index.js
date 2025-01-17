const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3009;

app.get('/data_race/:string', (req, res) => {
  const inputRace = req.params.string;
  const folderPath = './data_races'; 

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).send('Error reading directory');
      return;
    }

    const fileNames = files
      .filter(file => fs.statSync(path.join(folderPath, file)).isFile())
      .map(fileName => fileName); 

    const matchingFile = fileNames.find(fileName => fileName.replace(/\.json$/, '') === inputRace);

    if (!matchingFile) {
      res.json({
        'data_race' : 'No race with this name'
      }) 
      return; 
    }

    fs.readFile(`data_races/${matchingFile}`, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Error reading file');
        return;
      }

      try {
        const jsonData = JSON.parse(data);
        res.json({
          'data_race' : jsonData
        });
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).send('Error parsing JSON');
      }
    });
  });
});

app.get('/all_races', (req, res) => {
  const folderPath = './data_races'; 

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).send('Error reading directory');
      return;
    }

    const folderNames = files
      .filter(file => fs.statSync(path.join(folderPath, file)).isFile())
      .map(fileName => {

        const shortenedFolder = fileName.replace(/\.json$/, ''); 

        return shortenedFolder;
      });

    res.json({
        'data_races': folderNames
    });
  });
});

app.get('/get_race/')

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

