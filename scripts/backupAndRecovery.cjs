/**
 * Backup and Recovery Procedures
 * Comprehensive backup strategy for broker and blog data with 30-day retention
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://sdanjzsxwczlwsgspihb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW5qenN4d2N6bHdzZ3NwaWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDUzNzIsImV4cCI6MjA3NDI4MTM3Mn0.DNQWDqHNW72ck0Jw5k_IwTIyQhcD32kwNdqfTyTUrqY';

class BackupRecoveryService {
    constructor() {
        this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        this.backupDir = path.join(process.cwd(), 'backups');
        this.retentionDays = 30;
        
        // Ensure backup directory exists
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    /**
     * Execute query with timeout
     */
    async executeWithTimeout(queryPromise, timeoutMs = 30000) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Query timeout after ${timeoutMs}ms`)), timeoutMs);
        });

        return Promise.race([queryPromise, timeoutPromise]);
    }

    /**
     * Create a timestamped backup of all broker data
     */
    async backupBrokers() {
        console.log('📦 Creating broker data backup...');
        
        try {
            const { data: brokers, error } = await this.executeWithTimeout(
                this.supabase.from('brokers').select('*').order('id')
            );

            if (error) throw error;

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `brokers_backup_${timestamp}.json`;
            const filepath = path.join(this.backupDir, filename);

            const backup = {
                timestamp: new Date().toISOString(),
                version: '1.0',
                table: 'brokers',
                recordCount: brokers?.length || 0,
                data: brokers || []
            };

            fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
            
            console.log(`✅ Broker backup created: ${filename}`);
            console.log(`📊 Records backed up: ${backup.recordCount}`);
            
            return { success: true, filename, recordCount: backup.recordCount };

        } catch (error) {
            console.error('❌ Broker backup failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create a timestamped backup of all blog data
     */
    async backupBlogs() {
        console.log('📦 Creating blog data backup...');
        
        try {
            const { data: blogs, error } = await this.executeWithTimeout(
                this.supabase.from('blogs').select('*').order('id')
            );

            // Blog table might not exist yet
            if (error && error.code === 'PGRST116') {
                console.log('ℹ️  Blog table does not exist yet, skipping blog backup');
                return { success: true, filename: null, recordCount: 0 };
            }

            if (error) throw error;

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `blogs_backup_${timestamp}.json`;
            const filepath = path.join(this.backupDir, filename);

            const backup = {
                timestamp: new Date().toISOString(),
                version: '1.0',
                table: 'blogs',
                recordCount: blogs?.length || 0,
                data: blogs || []
            };

            fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
            
            console.log(`✅ Blog backup created: ${filename}`);
            console.log(`📊 Records backed up: ${backup.recordCount}`);
            
            return { success: true, filename, recordCount: backup.recordCount };

        } catch (error) {
            console.error('❌ Blog backup failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create complete database backup
     */
    async createCompleteBackup() {
        console.log('🗄️  CREATING COMPLETE DATABASE BACKUP');
        console.log('====================================');
        
        const results = {
            timestamp: new Date().toISOString(),
            brokers: await this.backupBrokers(),
            blogs: await this.backupBlogs()
        };

        // Create summary file
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const summaryFilename = `backup_summary_${timestamp}.json`;
        const summaryPath = path.join(this.backupDir, summaryFilename);
        
        fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
        
        console.log('\n📋 BACKUP SUMMARY');
        console.log('=================');
        console.log(`Broker backup: ${results.brokers.success ? '✅' : '❌'} (${results.brokers.recordCount || 0} records)`);
        console.log(`Blog backup: ${results.blogs.success ? '✅' : '❌'} (${results.blogs.recordCount || 0} records)`);
        console.log(`Summary saved: ${summaryFilename}`);
        
        return results;
    }

    /**
     * Restore brokers from backup file
     */
    async restoreBrokers(backupFilename) {
        console.log(`🔄 Restoring brokers from: ${backupFilename}`);
        
        try {
            const backupPath = path.join(this.backupDir, backupFilename);
            
            if (!fs.existsSync(backupPath)) {
                throw new Error(`Backup file not found: ${backupFilename}`);
            }

            const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
            
            if (!backupData.data || !Array.isArray(backupData.data)) {
                throw new Error('Invalid backup file format');
            }

            console.log(`📊 Backup contains ${backupData.data.length} records`);
            
            // Clear existing data (WARNING: This will delete all current data)
            console.log('⚠️  Clearing existing broker data...');
            const { error: deleteError } = await this.executeWithTimeout(
                this.supabase.from('brokers').delete().neq('id', 0) // Delete all records
            );

            if (deleteError) {
                console.warn('Warning: Could not clear existing data:', deleteError.message);
            }

            // Restore data in batches
            const batchSize = 50;
            let restored = 0;
            
            for (let i = 0; i < backupData.data.length; i += batchSize) {
                const batch = backupData.data.slice(i, i + batchSize);
                
                const { error } = await this.executeWithTimeout(
                    this.supabase.from('brokers').insert(batch)
                );
                
                if (error) {
                    console.warn(`Batch ${Math.floor(i/batchSize) + 1} failed:`, error.message);
                } else {
                    restored += batch.length;
                    console.log(`✅ Restored batch ${Math.floor(i/batchSize) + 1}: ${batch.length} records`);
                }
            }

            console.log(`🎉 Restoration complete: ${restored}/${backupData.data.length} records restored`);
            return { success: true, restored, total: backupData.data.length };

        } catch (error) {
            console.error('❌ Restoration failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * List available backup files
     */
    listBackups() {
        console.log('📋 AVAILABLE BACKUPS');
        console.log('====================');
        
        const files = fs.readdirSync(this.backupDir)
            .filter(file => file.endsWith('.json'))
            .sort()
            .reverse();

        if (files.length === 0) {
            console.log('No backup files found');
            return [];
        }

        files.forEach((file, index) => {
            const filepath = path.join(this.backupDir, file);
            const stats = fs.statSync(filepath);
            const size = (stats.size / 1024).toFixed(1);
            
            console.log(`${index + 1}. ${file} (${size}KB, ${stats.mtime.toLocaleDateString()})`);
        });

        return files;
    }

    /**
     * Clean up old backup files (older than retention period)
     */
    cleanupOldBackups() {
        console.log(`🗑️  Cleaning up backups older than ${this.retentionDays} days...`);
        
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
        
        const files = fs.readdirSync(this.backupDir)
            .filter(file => file.endsWith('.json'));

        let deleted = 0;
        
        files.forEach(file => {
            const filepath = path.join(this.backupDir, file);
            const stats = fs.statSync(filepath);
            
            if (stats.mtime < cutoffDate) {
                fs.unlinkSync(filepath);
                console.log(`🗑️  Deleted old backup: ${file}`);
                deleted++;
            }
        });

        console.log(`✅ Cleanup complete: ${deleted} old backup files removed`);
        return deleted;
    }

    /**
     * Verify backup integrity
     */
    async verifyBackup(backupFilename) {
        console.log(`🔍 Verifying backup: ${backupFilename}`);
        
        try {
            const backupPath = path.join(this.backupDir, backupFilename);
            
            if (!fs.existsSync(backupPath)) {
                throw new Error(`Backup file not found: ${backupFilename}`);
            }

            const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
            
            // Basic structure validation
            if (!backupData.timestamp || !backupData.version || !backupData.table || !backupData.data) {
                throw new Error('Invalid backup file structure');
            }

            // Data validation
            if (!Array.isArray(backupData.data)) {
                throw new Error('Backup data is not an array');
            }

            // Sample record validation
            if (backupData.data.length > 0) {
                const sample = backupData.data[0];
                const requiredFields = ['name', 'slug'];
                
                for (const field of requiredFields) {
                    if (!sample[field]) {
                        throw new Error(`Sample record missing required field: ${field}`);
                    }
                }
            }

            console.log('✅ Backup verification passed');
            console.log(`📊 Records: ${backupData.recordCount}`);
            console.log(`📅 Created: ${new Date(backupData.timestamp).toLocaleString()}`);
            
            return { success: true, recordCount: backupData.recordCount, timestamp: backupData.timestamp };

        } catch (error) {
            console.error('❌ Backup verification failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create backup schedule documentation
     */
    generateBackupDocumentation() {
        const documentation = `# Backup and Recovery Procedures

## Overview
This document outlines the backup and recovery procedures for the Broker Analysis platform database.

## Backup Schedule
- **Frequency**: Daily automated backups at 2:00 AM UTC
- **Retention**: 30 days
- **Location**: \`./backups\` directory
- **Format**: JSON files with timestamp

## Manual Backup Commands

### Create Complete Backup
\`\`\`bash
node scripts/backupAndRecovery.cjs --backup
\`\`\`

### List Available Backups
\`\`\`bash
node scripts/backupAndRecovery.cjs --list
\`\`\`

### Verify Backup Integrity
\`\`\`bash
node scripts/backupAndRecovery.cjs --verify backup_filename.json
\`\`\`

### Restore from Backup
\`\`\`bash
node scripts/backupAndRecovery.cjs --restore backup_filename.json
\`\`\`

### Cleanup Old Backups
\`\`\`bash
node scripts/backupAndRecovery.cjs --cleanup
\`\`\`

## Backup File Structure
\`\`\`json
{
  "timestamp": "2025-09-29T11:30:00.000Z",
  "version": "1.0",
  "table": "brokers",
  "recordCount": 75,
  "data": [...]
}
\`\`\`

## Recovery Procedures

### Emergency Recovery Steps
1. Identify the latest good backup
2. Verify backup integrity
3. Stop application services
4. Run restoration command
5. Verify data integrity
6. Restart application services

### Partial Recovery
For partial data loss, use selective restoration:
1. Export current data
2. Compare with backup
3. Restore only missing/corrupted records

## Automated Backup Setup

### Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger: Daily at 2:00 AM
4. Set action: Start program
5. Program: \`node\`
6. Arguments: \`scripts/backupAndRecovery.cjs --backup --cleanup\`
7. Start in: Project directory

### Linux/Mac Cron Job
\`\`\`bash
# Add to crontab
0 2 * * * cd /path/to/project && node scripts/backupAndRecovery.cjs --backup --cleanup
\`\`\`

## Backup Verification
- Daily automated integrity checks
- Monthly full restoration tests
- Quarterly disaster recovery drills

## Security Considerations
- Backup files contain sensitive data
- Store backups in secure location
- Encrypt backups for external storage
- Limit access to backup files

## Monitoring
- Log all backup operations
- Alert on backup failures
- Monitor backup file sizes
- Track restoration success rates

## Contact Information
For backup/recovery assistance, contact the development team.

---
*Last Updated: ${new Date().toISOString()}*
*Version: 1.0*
`;

        const docPath = path.join(process.cwd(), 'docs', 'BACKUP_RECOVERY_PROCEDURES.md');
        
        // Ensure docs directory exists
        const docsDir = path.dirname(docPath);
        if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
        }
        
        fs.writeFileSync(docPath, documentation);
        console.log(`📄 Documentation created: ${docPath}`);
        
        return docPath;
    }
}

/**
 * Command-line interface
 */
async function main() {
    const service = new BackupRecoveryService();
    const args = process.argv.slice(2);

    if (args.includes('--backup')) {
        console.log('🚀 BACKUP OPERATION');
        console.log('===================');
        const result = await service.createCompleteBackup();
        
        if (args.includes('--cleanup')) {
            console.log('\\n');
            service.cleanupOldBackups();
        }
        
    } else if (args.includes('--list')) {
        service.listBackups();
        
    } else if (args.includes('--verify')) {
        const filename = args[args.indexOf('--verify') + 1];
        if (!filename) {
            console.error('❌ Please specify backup filename to verify');
            process.exit(1);
        }
        await service.verifyBackup(filename);
        
    } else if (args.includes('--restore')) {
        const filename = args[args.indexOf('--restore') + 1];
        if (!filename) {
            console.error('❌ Please specify backup filename to restore');
            process.exit(1);
        }
        
        console.log('⚠️  WARNING: This will replace all existing data!');
        console.log('⚠️  Make sure you have a current backup before proceeding!');
        console.log('⚠️  Press Ctrl+C to cancel, or wait 10 seconds to continue...');
        
        await new Promise(resolve => setTimeout(resolve, 10000));
        await service.restoreBrokers(filename);
        
    } else if (args.includes('--cleanup')) {
        service.cleanupOldBackups();
        
    } else if (args.includes('--docs')) {
        service.generateBackupDocumentation();
        
    } else {
        console.log('🗄️  BACKUP AND RECOVERY SERVICE');
        console.log('===============================');
        console.log('Available commands:');
        console.log('  --backup          Create complete backup');
        console.log('  --list            List available backups');
        console.log('  --verify <file>   Verify backup integrity');
        console.log('  --restore <file>  Restore from backup');
        console.log('  --cleanup         Remove old backups');
        console.log('  --docs            Generate documentation');
        console.log('');
        console.log('Examples:');
        console.log('  node scripts/backupAndRecovery.cjs --backup');
        console.log('  node scripts/backupAndRecovery.cjs --backup --cleanup');
        console.log('  node scripts/backupAndRecovery.cjs --restore brokers_backup_2025-09-29.json');
    }
}

// Run if executed directly
if (require.main === module) {
    main()
        .then(() => {
            console.log('\\n✅ Operation completed');
            process.exit(0);
        })
        .catch(error => {
            console.error('\\n💥 Operation failed:', error.message);
            process.exit(1);
        });
}

module.exports = { BackupRecoveryService };