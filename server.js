const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/item');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const profileRoutes = require('./routes/profile');

const app = express();
app.use(express.json());

app.use('/api',authRoutes);
app.use('/api',itemRoutes);
app.use('/api',cartRoutes);
app.use('/api',orderRoutes);
app.use('/api',profileRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}

//const dbURI = config.get('dbURI');
const port = process.env.PORT || 4000;
mongoose.connect('mongodb+srv://ShubhamSr:shubham1102@drugstoredb.18cnjge.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then(() => app.listen(port, () => console.log(`Server running on http://localhost:${port}`)))
  .catch((err) => console.log(err));
