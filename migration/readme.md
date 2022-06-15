## Migration

This module imports a csv file into the Kubernetes cluster. In the csv file, each line is a ledger entry. A transaction includes at least two entries/lines.

```
10,2019-07-29 00:00:01,b'pandas',SFCU Checking,CR,10.37
10,2019-07-29 00:00:01,b'pandas',Expense,DR,10.37
11,2019-07-29 00:00:01,b'shampoo',SFCU Checking,CR,8.77
11,2019-07-29 00:00:01,b'shampoo',Supply,DR,8.77
...
```

To import data, first start Kubernetes cluster, then run the nodejs script.

```bash
# start cluster
skaffold dev

# in another terminal
cd migration
node import_account.js
node import_transaction.js
```
