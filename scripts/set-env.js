const { writeFileSync } = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/environments/environment.prod.ts');

const content = `export const environment = {
    production: true,
    apiUrl: '${process.env.API_URL || 'http://localhost:3000/api'}',
    supabaseUrl: '${process.env.SUPABASE_URL || ''}',
    supabaseAnonKey: '${process.env.SUPABASE_ANON_KEY || ''}'
};
`;

writeFileSync(targetPath, content);
console.log('environment.prod.ts generado correctamente');
