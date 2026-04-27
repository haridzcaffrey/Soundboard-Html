// AutoSIM Rule: HDRT Loaner Laptop — SIN18 Auto-Assign + Comment
// Resolver Group: IT-Support-Onsite-APAC
// Rule Name: HDRT Loaner Automation - SIN

// ═══════════════════════════════════════════════
// CONDITION (JavaScript)
// ═══════════════════════════════════════════════

() => {
    let title = issue.title || '';
    let buildingId = issue.extensions.tt.buildingId || '';
    let status = issue.extensions.tt.status || '';
    return title.indexOf('HDRT') !== -1 && buildingId === 'SIN18' && status === 'Assigned';
}

// ═══════════════════════════════════════════════
// ACTION (JavaScript)
// ═══════════════════════════════════════════════

async () => {
    let engineers = ['mnharidz', 'pabdsofy', 'samsudm', 'mohajaiu', 'dinolee'];

    let ticketId = (issue.aliases && issue.aliases[0] && issue.aliases[0].id) || issue.id || '';
    let desc = issue.description || '';

    // Parse need-by date from description
    let needByMatch = desc.match(/Need by date[->\s:]+(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})/);
    let needByDate = needByMatch ? moment(needByMatch[1], ['YYYY-MM-DD', 'MM/DD/YYYY']) : null;
    let now = moment();
    let daysUntilNeedBy = needByDate && needByDate.isValid() ? needByDate.diff(now, 'days') : null;

    let raw = issue.requesterIdentity || '';
    let requester = (typeof raw === 'object' ? raw.value : raw) || 'there';
    requester = requester.replace(/^kerberos:/, '').replace(/@ANT\.AMAZON\.COM$/i, '');

    if (daysUntilNeedBy !== null && daysUntilNeedBy < 3) {
        // Less than 3 days — auto-resolve
        let rejectComment = 'Hi ' + requester + ',\n\n' +
            'Your HDRT loaner request has a need-by date of **' + needByDate.format('YYYY-MM-DD') + '**, ' +
            'which is less than 3 business days from today. Unfortunately, we require a minimum of **7 business days** lead time to process loaner laptop requests.\n\n' +
            'This ticket will be auto-resolved. If you still require a loaner laptop urgently, please reach out to IT Support directly:\n' +
            '- Open a chat or phone case at https://my.it.a2z.com/\n' +
            '- Visit IT Support in person at SIN18\n\n' +
            'Thank you,\nIT Support Singapore (SIN18)';

        await issue.addComment(rejectComment, true);
        await issue.setStatus('Resolved');
        debug('HDRT auto-resolved (< 3 days): ' + ticketId + ' needBy=' + needByDate.format('YYYY-MM-DD') + ' days=' + daysUntilNeedBy);
    } else {
        // Enough lead time — assign and set WIP
        let hash = 0;
        for (let i = 0; i < ticketId.length; i++) {
            hash = ((hash << 5) - hash) + ticketId.charCodeAt(i);
            hash = hash & hash;
        }
        let assignee = engineers[Math.abs(hash) % engineers.length];

        let comment = 'Hi ' + requester + ',\n\n' +
            'This ticket is cut automatically because you might be traveling to a high-risk country. ' +
            'For any High Device Risk Travel, you are recommended to bring a loaner laptop instead of your assigned work laptop. ' +
            'Please confirm if you need a loaner laptop and if so, please select either an HP laptop (Windows OS) or a Macbook (Mac OS).\n\n' +
            'Thank you,\nIT Support Singapore (SIN18)';

        await issue.addComment(comment, true);
        await issue.setAssigneeIdentity(assignee);
        await issue.edit({path: "/next_step", editAction: "PUT", data: {"owner": "role:resolver", "action": "Implementation", "exceptions": []}});
        debug('HDRT assigned: ' + ticketId + ' -> ' + assignee + ' [WIP] days=' + daysUntilNeedBy);
    }
}
