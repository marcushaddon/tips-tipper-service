const config = require('config');
const express = require('express');
app = express();

// ============================
// STATIC
// ============================
app.use(express.static(__dirname, { dotfiles: 'allow' }));
app.listen(config.get('app').port, () => console.log('Listening for challenges'));