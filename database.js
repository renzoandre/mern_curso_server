const mongoose = require('mongoose');

//const URI = process.env.MONGODB_URI || 'mongodb://localhost/dbtest';
//const URI = process.env.MONGODB_URI || 'mongodb+srv://app_dev:/3oomerr@clusterservigas-4cxll.gcp.mongodb.net/test?retryWrites=true&w=majority';
const URI = 'mongodb://localhost/dbcursomern';

mongoose.set('useFindAndModify', false);

mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const connectionn = mongoose.connection;

connectionn.once('open', () => {
    console.log('BD conectada');
});
