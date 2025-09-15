const jwt = require('jsonwebtoken');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzY2OTBmOGQ2OGFjMTI1ZjA2NWVhMSIsImVtYWlsIjoiYWRtaW5AYWNtZS50ZXN0Iiwicm9sZSI6IkFkbWluIiwidGVuYW50U2x1ZyI6ImFjbWUiLCJpYXQiOjE3NTc4MzM1MzAsImV4cCI6MTc1NzgzNzEzMH0.Bzf4QtUOgBNC_3snt1F6szZNcNA1ttOoF8Ld2T1ZdF7U';

const secret = 'supersecretkey12345';

jwt.verify(token, secret, (err, decoded) => {
  if (err) console.log('Invalid', err);
  else console.log('Valid', decoded);
});
