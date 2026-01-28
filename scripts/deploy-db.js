const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

async function migrate() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Reading migration file...');
  const schemaPath = path.join(__dirname, '../supabase/schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  // Split by statement if needed, or run as whole if rpc supports it.
  // Standard Supabase client doesn't expose raw SQL execution easily without pg.
  // Using postgres-js or pg is better for DDl.
  // But wait, I can use the postgres connection string!
  
  console.log('Using Postgres connection for DDL...');
}

// Switching to 'pg' client
const { Client } = require('pg');

async function runMigration() {
  let connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
      console.error("No POSTGRES_URL found in .env");
      process.exit(1);
  }

  // Supabase connection string often includes ?sslmode=require which conflicts with
  // strict verification. We need to remove it to allow rejectUnauthorized: false to work.
  connectionString = connectionString.replace('sslmode=require', '');

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for Supabase (usually)
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema...');
    await client.query(sql);
    console.log('Schema applied successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigration();
