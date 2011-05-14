fs = require('fs');

/* This indents to read and parse /proc/diskstats
 * disks is an array of string that should match 
 * the diskname you wanna monitor in diskstats.
 */
exports.linux_get_diskstats = function linux_get_diskstats(disks)
{
    var raw;
    var lines;
    var diskstats = {};
    try {
        raw = fs.readFileSync('/proc/diskstats', 'ascii');
    } catch (e) {
        console.error("Unable to read /proc/diskstats. Are you running Linux ?");
        return null;
    }
    
    lines = raw.split("\n");
    for (var lineid in lines)
    {
        var line = lines[lineid];
        if (! line)
            break;
        var ar = line.split(/\s+/);
        if (ar.length < 15)
        {
            console.error("Unsupported system returning < 15 rows per line!");
            continue;
        }

        for (var i in disks) 
        {
            /* diskname match */
            if (disks[i] == ar[3])
            {
                diskstats[ar[3]] = {
                    "reads_completed": ar[4],
                    "reads_merged": ar[5],
                    "sectors_read": ar[6],
                    "read_time": ar[7],
                    "writes_completed": ar[8],
                    "writes_merged": ar[9],
                    "write_time": ar[10],
                    "io_current": ar[11],
                    "io_time": ar[12],
                    "io_weighted_time": ar[13]
                };
            }
        }
    }

    return diskstats;
}
