# Broker Database Migration - Deployment Guide

## Overview
This guide will help you migrate from your static `brokers.ts` file to a dynamic database-driven system using Supabase.

## Prerequisites
- ✅ Supabase project set up
- ✅ Environment variables configured (.env file)
- ✅ Database service and migration scripts prepared

## Step 1: Deploy Database Schema

### Option A: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `sdanjzsxwczlwsgspihb`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Execute Migration SQL**
   - Open the file: `api/database/add_broker_tables.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" to execute

4. **Verify Execution**
   - Check for any error messages
   - Should see success messages for table creation

### Option B: Supabase CLI (Alternative)

```bash
# If you have Supabase CLI configured
npx supabase db push
```

## Step 2: Verify Database Schema

Run the validation script to ensure all tables were created:

```bash
npx tsx scripts/validateDatabase.ts
```

Expected output:
```
✅ brokers - EXISTS
✅ broker_regulations - EXISTS
✅ broker_platforms - EXISTS
✅ broker_fees - EXISTS
✅ broker_trading_instruments - EXISTS
✅ broker_customer_support - EXISTS
✅ reviews - EXISTS
✅ users - EXISTS
```

## Step 3: Test Migration

Run a test migration with sample data:

```bash
npx tsx scripts/testMigration.ts
```

This will:
- Migrate the first 3 brokers from your data
- Validate the migrated data
- Provide detailed feedback

## Step 4: Full Migration

If the test is successful, run the full migration:

```bash
npx tsx scripts/migrateBrokerData.ts
```

This will migrate all brokers from `data/brokers.ts` to the database.

## Step 5: Update Frontend

Once migration is complete, update your routing to use the dynamic template.

## Troubleshooting

### Common Issues

1. **"supabaseUrl is required" Error**
   - Check your `.env` file has the correct Supabase credentials
   - Ensure you're using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

2. **"Table does not exist" Error**
   - Ensure Step 1 (schema deployment) completed successfully
   - Run the validation script to check which tables are missing

3. **Foreign Key Constraint Errors**
   - The broker ID might be using UUID instead of VARCHAR
   - Check your existing brokers table structure

4. **Permission Errors**
   - Ensure RLS policies allow read/write access
   - Check Supabase authentication settings

### Cleanup Test Data

If you need to clean up test data:

```bash
npx tsx scripts/testMigration.ts --cleanup
```

## Migration Status Tracking

- [ ] Schema deployed to Supabase
- [ ] Database validation passed
- [ ] Test migration successful
- [ ] Full migration completed
- [ ] Frontend updated
- [ ] Production testing complete

## Next Steps

After successful migration:

1. Test the broker detail pages with database data
2. Update any hard-coded references to the brokers array
3. Set up database backups
4. Monitor performance and optimize queries as needed
5. Consider removing the old `data/brokers.ts` file

## Support

If you encounter issues:
1. Check the error messages carefully
2. Verify your database connection
3. Ensure all environment variables are set correctly
4. Review the Supabase dashboard for any RLS policy issues