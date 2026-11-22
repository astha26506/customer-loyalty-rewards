# Test Plan & Execution Results

## Manual Test Cases

| ID | Scenario | Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| TC-01 | Valid box code claim | Open `index.html`, enter name & contact, enter `BOX-1001`, check confirmation box, submit | Success message shown, 50 points credited, code marked claimed, audit log records `Claimed` | Pass |
| TC-02 | Duplicate code reuse block | Try claiming `BOX-1001` a second time | Claim rejected (`Code Already Used`), 0 points added, blocked attempt count increments | Pass |
| TC-03 | Invalid code format | Submit code `INVALID123` or `box-12` | Claim rejected (`Invalid Code Format`), strike counter increases | Pass |
| TC-04 | Fraud flag after 3 failed attempts | Trigger 3 failed attempts for the same customer actor | Profile flagged after 3rd attempt and subsequent attempts are blocked | Pass |
| TC-05 | Customer balance lookup | Search customer name/email/phone in lookup box | Displays total earned points and list of claimed box codes | Pass |
| TC-06 | Owner code generation & persistence | Switch to `Owner Monitor`, add `BOX-2001` (50 pts), refresh page | `BOX-2001` appears in active unclaimed codes and persists after reload | Pass |