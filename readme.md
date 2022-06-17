# Double-Entry Bookkeeping

This is an accounting app to help individuals and busiensses manage their wealth and export financial statements in the most professional style. Say good bye to [mint](mint.com) and [acorns](acorns.com). Life is too short for amateur finance.

## Microservice Design

This is a read-heavy app because each transaction is written o``nly once, but accessed many times when user retrieves a list of transaction or requests a chart or table that aggregates over transactions.

- auth service: handle user account creation, login, logout
- ledger service: handle double-entry bookkeeping record
- networth service: calculate asset, liability on a fixed interval
- balance sheet service: listens to write event and automatically update current/historic balance sheet
- budget service: listens to expense event from ledger service and group expense into category. Support budget planning

## Learning Experience

- Docker & Kubernetes
- Test-driven development
- Continuous integration
