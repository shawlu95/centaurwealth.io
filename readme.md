# Double-Entry Bookkeeping

This is an accounting app to help individuals and busiensses manage their wealth and export financial statements in the most professional style. Say good bye to [mint](mint.com) and [acorns](acorns.com). Life is too short for amateur finance.

## Microservice Design

This is a read-heavy app because each transaction is written o``nly once, but accessed many times when user retrieves a list of transaction or requests a chart or table that aggregates over transactions.

- auth service: handle user account creation, login, logout
- ledger service: handle double-entry bookkeeping record
- networth service: calculate asset, liability on a fixed interval
- balance sheet service: listens to write event and automatically update current/historic balance sheet
- budget service: listens to expense event from ledger service and group expense into category. Support budget planning

## Event Flow

### Account Created

- Published by ledger service
- Subscribed by:
  - balance sheet service: replicate the account

### Account Updated

- Published by ledger service
- Subscribed by:
  - balance sheet service: update name of the account

### Record Created/Updated/Deleted

- Published by ledger service
- Subscribed by:
  - networth service: update asset, liability for all checkpoints after the record
  - balance sheet service: aggregate the new record into the correct balance sheet
  - budget service: save the record if it's an expense

## Learning Experience

- Docker & Kubernetes
- Test-driven development
- Continuous integration
