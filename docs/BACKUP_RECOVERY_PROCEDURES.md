# Backup and Recovery Procedures

## Overview
This document outlines the backup and recovery procedures for the Broker Analysis platform database.

## Backup Schedule
- **Frequency**: Daily automated backups at 2:00 AM UTC
- **Retention**: 30 days
- **Location**: `./backups` directory
- **Format**: JSON files with timestamp

## Manual Backup Commands

### Create Complete Backup
```bash
node scripts/backupAndRecovery.cjs --backup
```

### List Available Backups
```bash
node scripts/backupAndRecovery.cjs --list
```

### Verify Backup Integrity
```bash
node scripts/backupAndRecovery.cjs --verify backup_filename.json
```

### Restore from Backup
```bash
node scripts/backupAndRecovery.cjs --restore backup_filename.json
```

### Cleanup Old Backups
```bash
node scripts/backupAndRecovery.cjs --cleanup
```

## Backup File Structure
```json
{
  "timestamp": "2025-09-29T11:30:00.000Z",
  "version": "1.0",
  "table": "brokers",
  "recordCount": 75,
  "data": [...]
}
```

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
5. Program: `node`
6. Arguments: `scripts/backupAndRecovery.cjs --backup --cleanup`
7. Start in: Project directory

### Linux/Mac Cron Job
```bash
# Add to crontab
0 2 * * * cd /path/to/project && node scripts/backupAndRecovery.cjs --backup --cleanup
```

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
*Last Updated: 2025-09-29T11:32:23.351Z*
*Version: 1.0*
