const express = require('express');
const cors = require('cors');
const app = express();

let tempData = {
  name:'',
  voltage: 0,
  current: 0,
};

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  console.log('Get');
  console.log(req.body);
  res.json(tempData);
});
app.post('/', (req, res) => {
  console.log('Post');
  console.log(req.body.data.payload);
  tempData = {
    voltage: req.body.data.payload['/processdatamaster/voltage'],
    current: req.body.data.payload['/processdatamaster/current'],
    name: req.body.data.payload[
      '/iolinkmaster/port[1]/iolinkdevice/productname'
    ],
  };
  res.json('Post');
});

app.listen(8000, '0.0.0.0', () => {
  console.log('Server started on port 8000');
});
