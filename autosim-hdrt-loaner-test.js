// AutoSIM Rule: HDRT Loaner — SIN18 (MINIMAL TEST)
// Step 1: Verify condition fires and comment posts

// ═══════════════════════════════════════════════
// CONDITION — paste in "JavaScript Condition" field
// ═══════════════════════════════════════════════

var title = issue.title || '';
var building = (issue.extensions && issue.extensions.tt && issue.extensions.tt.buildingId) || '';
var status = (issue.extensions && issue.extensions.tt && issue.extensions.tt.status) || '';
res = {
  result: title.indexOf('HDRT') !== -1 && building === 'SIN18' && status === 'Assigned',
  userData: {}
};

// ═══════════════════════════════════════════════
// ACTION — paste in "JavaScript Action" field
// ═══════════════════════════════════════════════

await issue.addComment('AutoSIM test — rule fired successfully [' + moment().valueOf() + ']', true);
debug('HDRT test fired for: ' + issue.title);
