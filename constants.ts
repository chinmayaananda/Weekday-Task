
/**
 * TASK 1: DATA SPLITTING SCRIPT
 * 
 * Assumptions:
 * 1. Source table is named "Interviews"
 * 2. Original record has "Interview Rounds" string (e.g. "HR | Tech")
 * 3. Script transforms records that have no "Round Name" yet (Master Records)
 */
export const TASK_1_SCRIPT = `/**
 * WEEKDAY FOUNDER'S OFFICE - TASK 1: DATA SPLITTER
 * Production-ready script to normalize CSV data.
 */

const TABLE_NAME = "Interviews";
const table = base.getTable(TABLE_NAME);

// 1. Fetch records to process (where 'Round Name' is empty)
const query = await table.selectRecordsAsync({
    fields: [
        "Candidate Name", "Email", "Role", "Interview Rounds", 
        "Calendly HR", "Calendly Tech", "Calendly Hiring Manager", 
        "Added On", "Round Name"
    ]
});

const recordsToProcess = query.records.filter(r => !r.getCellValue("Round Name"));

if (recordsToProcess.length === 0) {
    console.log("No new records to split.");
} else {
    let newRecords = [];
    let recordsToDelete = [];

    for (let record of recordsToProcess) {
        const roundsRaw = record.getCellValue("Interview Rounds");
        const email = record.getCellValue("Email");
        
        if (!roundsRaw) continue;

        // Split rounds by | or , and clean whitespace
        const rounds = roundsRaw.split(/[|,]/).map(r => r.trim()).filter(r => r.length > 0);

        for (let roundName of rounds) {
            // Determine dynamic Calendly Link
            let calendlyLink = "";
            const lowerRound = roundName.toLowerCase();
            
            if (lowerRound.includes("hr")) {
                calendlyLink = record.getCellValue("Calendly HR") || "";
            } else if (lowerRound.includes("tech")) {
                calendlyLink = record.getCellValue("Calendly Tech") || "";
            } else if (lowerRound.includes("hiring manager") || lowerRound.includes("hm")) {
                calendlyLink = record.getCellValue("Calendly Hiring Manager") || "";
            }

            // Prepare record object
            newRecords.push({
                fields: {
                    "Candidate Name": record.getCellValue("Candidate Name"),
                    "Email": email,
                    "Role": record.getCellValue("Role"),
                    "Interview Rounds": roundsRaw,
                    "Added On": record.getCellValue("Added On"),
                    "Round Name": roundName,
                    "Calendly Link": calendlyLink,
                    "Calendly HR": record.getCellValue("Calendly HR"),
                    "Calendly Tech": record.getCellValue("Calendly Tech"),
                    "Calendly Hiring Manager": record.getCellValue("Calendly Hiring Manager")
                }
            });
        }
        
        // Track the original row for removal to keep table clean (optional)
        recordsToDelete.push(record.id);
    }

    // Batch creation (Airtable limit is 50 per call)
    while (newRecords.length > 0) {
        await table.createRecordsAsync(newRecords.slice(0, 50));
        newRecords = newRecords.slice(50);
    }

    // Clean up original rows after successful splitting
    if (recordsToDelete.length > 0) {
        while (recordsToDelete.length > 0) {
            await table.deleteRecordsAsync(recordsToDelete.slice(0, 50));
            recordsToDelete = recordsToDelete.slice(50);
        }
    }
    
    console.log("Processing complete.");
}`;

/**
 * TASK 2 & 3: MAILERSEND & TAT SCRIPT
 * 
 * Assumptions:
 * 1. Trigger: Record matches conditions (Round Name != empty AND Mail Sent Time = empty)
 * 2. Input variables provided: candidateName, email, role, roundName, calendlyLink, addedOn, recordId
 */
export const TASK_2_SCRIPT = `/**
 * WEEKDAY FOUNDER'S OFFICE - TASK 2 & 3: MAILERSEND & TAT
 * Triggered Automation Script.
 */

// 1. Get input variables from Automation
const { 
    candidateName, 
    email, 
    role, 
    roundName, 
    calendlyLink, 
    addedOn, 
    recordId 
} = input.config();

// CONFIG - Replace with your actual key in Airtable Secret Storage or hardcode
const MAILERSEND_API_KEY = "mlsn.your_secure_api_key_here";
const FROM_EMAIL = "recruitment@weekday.com";

/**
 * TASK 3 HELPER: TAT CALCULATION
 * Returns difference in hours to 2 decimal places.
 */
function calculateTAT(addedOnDate, sentOnDate) {
    const start = new Date(addedOnDate);
    const end = new Date(sentOnDate);
    const diffInMs = end - start;
    const hours = diffInMs / (1000 * 60 * 60);
    return Math.max(0, parseFloat(hours.toFixed(2)));
}

async function sendInvite() {
    console.log(\`Sending invite to \${candidateName} for \${roundName}...\`);

    const payload = {
        "from": { "email": FROM_EMAIL, "name": "Weekday Recruiting" },
        "to": [{ "email": email, "name": candidateName }],
        "subject": \`Interview Invitation: \${role} - \${roundName}\`,
        "text": \`Hi \${candidateName},\\n\\nYou have been shortlisted for the \${roundName} round for the \${role} role.\\n\\nPlease schedule your interview here: \${calendlyLink}\\n\\nBest,\\nWeekday Team\`,
        "html": \`<p>Hi <b>\${candidateName}</b>,</p><p>You have been shortlisted for the <b>\${roundName}</b> round for the <b>\${role}</b> role.</p><p>Please schedule your interview here: <a href="\${calendlyLink}">\${calendlyLink}</a></p><p>Best,<br>Weekday Team</p>\`
    };

    try {
        const response = await fetch("https://api.mailersend.com/v1/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "Authorization": \`Bearer \${MAILERSEND_API_KEY}\`
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 202 || response.status === 200) {
            console.log("Email sent successfully via MailerSend.");
            
            // 2. Capture Sent Time and Calculate TAT
            const now = new Date();
            const mailSentTime = now.toISOString();
            const tatHours = calculateTAT(addedOn, mailSentTime);

            // 3. Update Airtable Record
            const table = base.getTable("Interviews");
            await table.updateRecordAsync(recordId, {
                "Mail Sent Time": now,
                "TAT (Hours)": tatHours
            });
            
            console.log(\`TAT Calculated: \${tatHours} hours recorded.\`);
        } else {
            const errorText = await response.text();
            throw new Error(\`MailerSend API failed with status \${response.status}: \${errorText}\`);
        }
    } catch (err) {
        console.error("Critical Failure:", err.message);
        throw err; // Re-throw to ensure automation logs the failure
    }
}

// EXECUTE
await sendInvite();`;
