// DEBUG CONDITION — paste this to see actual field values in debug log
// Replace your current condition with this temporarily

debug('title: ' + issue.title);
debug('status: ' + issue.status);
debug('tt.status: ' + (issue.extensions && issue.extensions.tt && issue.extensions.tt.status));
debug('tt.buildingId: ' + (issue.extensions && issue.extensions.tt && issue.extensions.tt.buildingId));
debug('tt.building: ' + (issue.extensions && issue.extensions.tt && issue.extensions.tt.building));
debug('tt.city: ' + (issue.extensions && issue.extensions.tt && issue.extensions.tt.city));
debug('assignedGroup: ' + (issue.extensions && issue.extensions.tt && issue.extensions.tt.assignedGroup));
debug('keys: ' + JSON.stringify(Object.keys(issue)));
if (issue.extensions && issue.extensions.tt) {
  debug('tt keys: ' + JSON.stringify(Object.keys(issue.extensions.tt)));
}
res = { result: false, userData: {} };
